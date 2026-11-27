-- ByteBucks initial schema. Run this migration once in the Supabase SQL editor
-- or apply it with `supabase db push`.

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null default '',
  category text not null,
  questions jsonb not null check (jsonb_typeof(questions) = 'array' and jsonb_array_length(questions) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'parent')),
  coins integer not null default 0 check (coins >= 0),
  recommended_quiz_id uuid references public.quizzes(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  coins_earned integer not null check (coins_earned >= 0),
  time_taken_seconds integer not null default 0 check (time_taken_seconds between 0 and 3600),
  completed_at timestamptz not null default now(),
  unique (user_id, quiz_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  status text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists attempts_user_completed_idx on public.attempts(user_id, completed_at desc);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when new.raw_user_meta_data ->> 'role' = 'parent' then 'parent' else 'student' end
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

alter table public.quizzes enable row level security;
alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.audit_logs enable row level security;

grant select on public.quizzes, public.profiles, public.attempts, public.audit_logs to authenticated;

drop policy if exists "Signed-in users can read quizzes" on public.quizzes;
create policy "Signed-in users can read quizzes" on public.quizzes
  for select to authenticated using (true);

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "Users can read their own attempts" on public.attempts;
create policy "Users can read their own attempts" on public.attempts
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own audit logs" on public.audit_logs;
create policy "Users can read their own audit logs" on public.audit_logs
  for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.complete_quiz(
  quiz_id_input uuid,
  answers_input jsonb,
  time_taken_input integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  quiz_questions jsonb;
  question_item jsonb;
  question_index integer := 0;
  correct_count integer := 0;
  question_count integer;
  answer_value text;
  answer_index integer;
  quiz_score integer;
  awarded_coins integer;
  remedial_id uuid;
begin
  if current_user_id is null then
    raise exception 'You must be signed in to submit a quiz.';
  end if;
  if jsonb_typeof(answers_input) <> 'object' then
    raise exception 'Invalid answers.';
  end if;
  if time_taken_input is null or time_taken_input < 0 or time_taken_input > 3600 then
    raise exception 'Invalid completion time.';
  end if;

  select q.questions into quiz_questions
  from public.quizzes q
  where q.id = quiz_id_input;
  if quiz_questions is null then
    raise exception 'Quiz not found.';
  end if;

  question_count := jsonb_array_length(quiz_questions);
  if (select count(*) from jsonb_object_keys(answers_input)) <> question_count then
    raise exception 'Please answer every question.';
  end if;

  for question_item in select value from jsonb_array_elements(quiz_questions)
  loop
    answer_value := answers_input ->> question_index::text;
    if answer_value is null or answer_value !~ '^[0-9]+$' then
      raise exception 'Invalid answers.';
    end if;
    answer_index := answer_value::integer;
    if answer_index < 0 or answer_index >= jsonb_array_length(question_item -> 'options') then
      raise exception 'Invalid answer option.';
    end if;
    if answer_index = (question_item ->> 'correctIndex')::integer then
      correct_count := correct_count + 1;
    end if;
    question_index := question_index + 1;
  end loop;

  quiz_score := round((correct_count::numeric / question_count) * 100)::integer;
  awarded_coins := case when quiz_score >= 80 then 50 when quiz_score >= 50 then 20 else 5 end;

  if quiz_score < 50 then
    select q.id into remedial_id
    from public.quizzes q
    where q.category = 'saving' and q.id <> quiz_id_input
    order by q.created_at
    limit 1;
  end if;

  insert into public.attempts (user_id, quiz_id, score, coins_earned, time_taken_seconds)
  values (current_user_id, quiz_id_input, quiz_score, awarded_coins, time_taken_input);

  update public.profiles
  set coins = coins + awarded_coins,
      recommended_quiz_id = coalesce(remedial_id, recommended_quiz_id)
  where id = current_user_id;

  insert into public.audit_logs (user_id, action, status, details)
  values (current_user_id, 'quiz_completion', 'success', jsonb_build_object(
    'quizId', quiz_id_input,
    'score', quiz_score,
    'coins', awarded_coins
  ));

  return jsonb_build_object('score', quiz_score, 'coins', awarded_coins);
exception
  when unique_violation then
    raise exception 'You have already completed this quiz.';
end;
$$;

revoke all on function public.complete_quiz(uuid, jsonb, integer) from public;
grant execute on function public.complete_quiz(uuid, jsonb, integer) to authenticated;

insert into public.quizzes (title, description, category, questions)
values
  (
    'Saving Basics',
    'Learn how saving a little at a time can help you reach a goal.',
    'saving',
    '[{"question":"What is saving?","options":["Spending all your money","Keeping some money for later","Borrowing money"],"correctIndex":1},{"question":"Where is a safe place to keep savings?","options":["A trusted bank account","Under a park bench","With a stranger"],"correctIndex":0},{"question":"What is a savings goal?","options":["Something you plan to save for","A shopping list","A kind of coin"],"correctIndex":0}]'::jsonb
  ),
  (
    'Smart Spending',
    'Practice choosing needs, wants, and thoughtful purchases.',
    'spending',
    '[{"question":"Which is usually a need?","options":["A winter coat in cold weather","A new video game","A second dessert"],"correctIndex":0},{"question":"What should you do before a big purchase?","options":["Compare choices and prices","Buy the first thing you see","Spend your savings immediately"],"correctIndex":0},{"question":"A budget helps you…","options":["Plan how to use your money","Get unlimited money","Avoid making choices"],"correctIndex":0}]'::jsonb
  )
on conflict (title) do nothing;

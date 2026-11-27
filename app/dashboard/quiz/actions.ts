'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitQuiz(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const quizId = String(formData.get('quizId') ?? '');
  if (!quizId) redirect('/dashboard');
  const timeTaken = Number(formData.get('timeTaken'));
  if (!Number.isSafeInteger(timeTaken) || timeTaken < 0 || timeTaken > 3600) {
    redirect(`/dashboard/quiz/${encodeURIComponent(quizId)}?error=Invalid%20completion%20time`);
  }

  let answers: unknown;
  try {
    answers = JSON.parse(String(formData.get('answers') ?? ''));
  } catch {
    redirect(`/dashboard/quiz/${encodeURIComponent(quizId)}?error=Invalid%20answers`);
  }

  const { data, error } = await supabase.rpc('complete_quiz', {
    quiz_id_input: quizId,
    answers_input: answers,
    time_taken_input: timeTaken,
  });

  if (error) {
    const message = error.message.includes('already completed')
      ? 'You have already completed this quiz.'
      : 'Could not save your quiz. Please try again.';
    redirect(`/dashboard/quiz/${encodeURIComponent(quizId)}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath('/dashboard');
  redirect(`/dashboard?completed=${encodeURIComponent(String(data.score))}`);
}

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export async function submitQuiz(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const quizId = formData.get('quizId') as string;
  let answers: Record<number, number>;
  try {
    answers = JSON.parse(formData.get('answers') as string) as Record<number, number>;
  } catch {
    redirect(`/dashboard/quiz/${quizId}?error=Invalid answers`);
  }
  const timeTaken = Number(formData.get('timeTaken'));

  // Fetch Quiz
  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
  if (!quiz) redirect('/dashboard');

  // Calculate Score (M04 Business Logic)
  const questions = quiz.questions as QuizQuestion[];
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) correct++;
  });
  const score = Math.round((correct / questions.length) * 100);
  const coins = score >= 80 ? 50 : score >= 50 ? 20 : 5;

  // Check Duplicate (M06 Edge Case)
  const { data: existing } = await supabase.from('attempts').select('id').eq('user_id', user.id).eq('quiz_id', quizId).single();
  if (existing) redirect(`/dashboard/quiz/${quizId}?error=Already completed`);

  // A07: Multi-Step Workflow
  try {
    // Step 1: Save Attempt
    const { error: attemptError } = await supabase.from('attempts').insert({
      user_id: user.id,
      quiz_id: quizId,
      score,
      coins_earned: coins,
      time_taken_seconds: timeTaken,
    });
    if (attemptError) throw attemptError;

    // Step 2: Update Profile Coins
    const { data: profile } = await supabase.from('profiles').select('coins').eq('id', user.id).single();
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ coins: (profile?.coins || 0) + coins })
      .eq('id', user.id);
    if (profileError) throw profileError;

    // Step 3: External Webhook Simulation (20% failure rate for demo)
    const webhookSuccess = Math.random() > 0.2; 
    
    // Step 4: Audit Log (Recovery Logic)
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'quiz_completion',
      status: webhookSuccess ? 'success' : 'failed_webhook',
      details: { quizId, score, coins, webhook: webhookSuccess }
    });

    revalidatePath('/dashboard');
    return;
  } catch {
    redirect(`/dashboard/quiz/${quizId}?error=System error`);
  }
}
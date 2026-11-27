import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import QuizForm from './quiz-form';

interface QuizQuestion {
  question: string;
  options: string[];
}

export const instant = false;

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', id).single();
  if (!quiz) return notFound();

  const questions = quiz.questions as QuizQuestion[];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader><CardTitle>{quiz.title}</CardTitle></CardHeader>
          <CardContent>
            {query.error && <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{query.error}</p>}
            <QuizForm quizId={quiz.id} questions={questions.map(({ question, options }) => ({ question, options }))} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

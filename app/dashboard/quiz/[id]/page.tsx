import { createClient } from '@/lib/supabase/server';
import { submitQuiz } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { notFound } from 'next/navigation';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const instant = false;

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
            <form action={submitQuiz} className="space-y-6">
              <input type="hidden" name="quizId" value={quiz.id} />
              <input type="hidden" name="timeTaken" value="30" />
              <input type="hidden" name="answers" id="answers-input" />

              {questions.map((q: QuizQuestion, i: number) => (
                <div key={i} className="space-y-3 border-b pb-4">
                  <Label className="text-lg font-semibold">{i + 1}. {q.question}</Label>
                  <div className="space-y-2">
                    {q.options.map((opt: string, oi: number) => (
                      <div key={oi} className="flex items-center space-x-2">
                        <input type="radio" id={`q${i}-o${oi}`} name={`q${i}`} value={oi} className="h-4 w-4" required
                          onChange={(e) => {
                            const input = document.getElementById('answers-input') as HTMLInputElement;
                            const ans = input.value ? JSON.parse(input.value) as Record<number, number> : {};
                            ans[i] = parseInt(e.target.value);
                            input.value = JSON.stringify(ans);
                          }}
                        />
                        <Label htmlFor={`q${i}-o${oi}`} className="cursor-pointer">{opt}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button type="submit" className="w-full">Submit Quiz</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
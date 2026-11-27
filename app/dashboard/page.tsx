import { createClient } from '@/lib/supabase/server';
import { logout } from '../(auth)/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const instant = false;

interface QuizSummary {
  id: string;
  title: string;
  description: string;
  category: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ completed?: string }>;
}) {
  const supabase = await createClient();
  const query = await searchParams;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const [{ data: profile }, { data: quizzes }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('quizzes').select('id, title, description, category').order('created_at'),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">ByteBucks Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/dashboard/parent">
              <Button variant="secondary">Parent View</Button>
            </Link>
            <form action={logout}>
              <Button variant="outline" type="submit">Log Out</Button>
            </form>
          </div>
        </div>

        {query.completed && /^\d{1,3}$/.test(query.completed) && (
          <p role="status" className="mb-6 rounded bg-green-100 p-3 text-sm text-green-800">Quiz saved! Your score was {query.completed}%.</p>
        )}

        {/* A02: Intelligent Recommendation Banner */}
        {profile?.recommended_quiz_id && (
          <div className="mb-6 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-yellow-800">💡 Personalized Recommendation</h3>
                <p className="text-sm text-yellow-700">Based on your recent performance, we recommend reviewing the basics.</p>
              </div>
              <Link href={`/dashboard/quiz/${profile.recommended_quiz_id}`}>
                <Button variant="outline" className="bg-white text-yellow-800 border-yellow-500 hover:bg-yellow-100">
                  Start Remedial Quiz
                </Button>
              </Link>
            </div>
          </div>
        )}

        <Card className="mb-8">
          <CardHeader><CardTitle>Welcome, {profile?.full_name}!</CardTitle></CardHeader>
          <CardContent>
            <p>Role: <span className="font-bold capitalize">{profile?.role}</span></p>
            <p className="text-xl mt-2">Coins: <span className="font-bold text-green-600">{profile?.coins} 🪙</span></p>
          </CardContent>
        </Card>

        {profile?.coins === undefined && <p role="alert" className="mb-6 rounded bg-yellow-100 p-3 text-sm text-yellow-900">Your profile is still being prepared. Refresh this page in a moment.</p>}
        {quizzes === null && <p role="alert" className="mb-6 rounded bg-red-100 p-3 text-sm text-red-700">Quizzes could not be loaded. Check that the Supabase database migration has been applied.</p>}

        <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes?.map((quiz: QuizSummary) => (
            <Link key={quiz.id} href={`/dashboard/quiz/${quiz.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader><CardTitle>{quiz.title}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{quiz.description}</p>
                  <p className="mt-2 text-xs font-semibold text-blue-600 uppercase">{quiz.category}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

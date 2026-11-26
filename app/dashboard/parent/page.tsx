import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const instant = false;

export default async function ParentDashboard() {
  const supabase = await createClient();
  
  // Fetch all attempts to simulate a "Class Overview"
  const { data: attempts } = await supabase
    .from('attempts')
    .select('score, coins_earned, completed_at, quizzes(title, category)')
    .order('completed_at', { ascending: false })
    .limit(10);

  const totalCoins = attempts?.reduce((acc, curr) => acc + (curr.coins_earned || 0), 0) || 0;
  const avgScore = attempts?.length 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Parent Analytics Portal</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Student View</Button>
          </Link>
        </div>

        {/* M05: Dynamic Data Processing (Aggregation) */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-gray-500">Total Coins Earned</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-green-600">{totalCoins} 🪙</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-gray-500">Average Quiz Score</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-blue-600">{avgScore}%</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium text-gray-500">Quizzes Completed</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-purple-600">{attempts?.length || 0}</p></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Activity Log</CardTitle></CardHeader>
          <CardContent>
            {attempts && attempts.length > 0 ? (
              <ul className="space-y-4">
                {attempts.map((attempt, idx) => {
                  // FIX: Handle quizzes as an array
                  const quizData = Array.isArray(attempt.quizzes) ? attempt.quizzes[0] : attempt.quizzes;
                  return (
                    <li key={idx} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold">{quizData?.title || 'Unknown Quiz'}</p>
                        <p className="text-xs text-gray-500 capitalize">{quizData?.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">Score: {attempt.score}%</p>
                        <p className="text-xs text-gray-500">+{attempt.coins_earned} coins</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No quiz attempts yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { submitQuiz } from '../actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface QuizQuestion {
  question: string;
  options: string[];
}

export default function QuizForm({ quizId, questions }: { quizId: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setTimeTaken(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <form action={submitQuiz} className="space-y-6">
      <input type="hidden" name="quizId" value={quizId} />
      <input type="hidden" name="answers" value={JSON.stringify(answers)} />
      <input type="hidden" name="timeTaken" value={timeTaken} />
      {questions.map((item, questionIndex) => (
        <fieldset key={questionIndex} className="space-y-3 border-b pb-4">
          <legend className="text-lg font-semibold">{questionIndex + 1}. {item.question}</legend>
          <div className="space-y-2">
            {item.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`q${questionIndex}-o${optionIndex}`}
                  name={`question-${questionIndex}`}
                  value={optionIndex}
                  checked={answers[questionIndex] === optionIndex}
                  onChange={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                  className="h-4 w-4"
                  required
                />
                <Label htmlFor={`q${questionIndex}-o${optionIndex}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </div>
        </fieldset>
      ))}
      <Button type="submit" className="w-full" disabled={Object.keys(answers).length !== questions.length}>
        Submit Quiz
      </Button>
    </form>
  );
}

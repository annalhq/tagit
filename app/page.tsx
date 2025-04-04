import { QuestionForm } from '@/components/question-form';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Ask Your Question
          </h1>
          <p className="text-muted-foreground">
            Get AI-powered suggestions and smart tagging for your technical questions
          </p>
        </div>
        <QuestionForm />
      </div>
    </div>
  );
}
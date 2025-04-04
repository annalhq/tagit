import { QuestionForm } from "@/components/question-form";

export default function Home() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-10">
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gradient">
              Ask Your Question
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get AI-powered suggestions and smart tagging for your technical
              questions
            </p>
          </div>

          <div className="glass-effect subtle-shadow rounded-xl p-1">
            <div className="bg-card rounded-lg p-6 sm:p-8">
              <QuestionForm />
            </div>
          </div>

          <footer className="text-center text-sm text-muted-foreground mt-12">
            <p>
              Powered by advanced AI technology to help you find answers faster
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

"use client"

import TagSuggester from "@/components/tag-suggester";

export default function Home() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 relative isolate">
      <div
        className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-muted opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            animationDuration: "6s",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-10">
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gradient">
              Ask Your Question
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover, share, and learn from a world of questions and answers
              questions
            </p>
          </div>

          <div className="glass-effect subtle-shadow rounded-xl p-1">
            <div className="bg-card rounded-lg p-6 sm:p-8">
              {/* <QuestionForm /> */}
              <TagSuggester
                apiEndpoint="http://127.0.0.1:5000/api/getTag"
                debounceDelay={600}
                minInputLength={15}
              />
            </div>
          </div>

          <footer className="text-center text-sm text-muted-foreground mt-12">
            <p>Project by Annalhq and Aryan</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Loader2, Hash, AlertCircle, PlusCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TagSuggesterProps {
  apiEndpoint?: string;
  debounceDelay?: number;
  minInputLength?: number;
}

const TagSuggester: React.FC<TagSuggesterProps> = ({
  apiEndpoint = "http://127.0.0.1:5000/api/getRecommendedTags",
  debounceDelay = 600,
  minInputLength = 15,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTags = async (inputText: string) => {
    setIsLoading(true);
    setStatus("Analyzing content...");
    setIsError(false);
    setTags([]);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: inputText }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const fetchedTags = await response.json();

      if (fetchedTags && fetchedTags.length > 0) {
        setTags(fetchedTags);
        setStatus("Suggestions updated.");
      } else {
        setStatus("");
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCharCount(question.trim().length);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (question.trim().length === 0) {
      setStatus("");
      setTags([]);
      return;
    }

    if (question.trim().length < minInputLength) {
      setStatus(`Type at least ${minInputLength} characters.`);
      setTags([]);
      return;
    }

    setStatus("Waiting for you to stop typing...");

    debounceTimerRef.current = setTimeout(() => {
      fetchTags(question.trim());
    }, debounceDelay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [question, apiEndpoint, debounceDelay, minInputLength]);

  const progressValue = Math.min(100, (charCount / minInputLength) * 100);

  return (
    <Card className="max-w-2xl mx-auto shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Ask a Question</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              id="questionText"
              className="min-h-[180px] resize-none p-4 transition-colors focus-visible:ring-1 text-base"
              placeholder="Enter your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              aria-label="Question text"
            />

            {question.trim().length > 0 && charCount < minInputLength && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">
                    Progress
                  </span>
                  <span className="text-muted-foreground">
                    {charCount}/{minInputLength} characters
                  </span>
                </div>
                <Progress value={progressValue} className="h-1" />
              </div>
            )}

            {isLoading && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2 py-1 rounded-md bg-primary/5 backdrop-blur-sm text-xs text-primary/80 animate-in fade-in duration-300">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>

          {status && !isLoading && (
            <div
              className={`flex items-center gap-1.5 py-1 text-sm transition-colors
              ${
                isError
                  ? "text-destructive animate-in fade-in slide-in-from-top-1"
                  : "text-muted-foreground"
              }`}
            >
              {isError ? <AlertCircle className="h-3.5 w-3.5" /> : null}
              <span>{status}</span>
            </div>
          )}
        </div>

        <Separator className="my-1" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Suggested Tags</h3>
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-primary/70">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Finding relevant tags</span>
              </div>
            )}
          </div>

          <div className="min-h-[60px] p-3 bg-muted/30 rounded-md border border-muted transition-colors">
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary-foreground transition-all animate-in fade-in duration-300 delay-75 slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Hash className="h-3 w-3 opacity-70" />
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center h-full py-2 ${
                  isLoading ? "hidden" : ""
                }`}
              >
                {question.trim().length >= minInputLength ? (
                  <p className="text-muted-foreground text-sm text-center">
                    No tags suggested for this input yet.
                  </p>
                ) : question.trim().length > 0 ? (
                  <p className="text-muted-foreground text-sm text-center">
                    Continue typing to get tag suggestions.
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm text-center">
                    Tags will appear here when you start typing.
                  </p>
                )}
              </div>
            )}

            {/* Show skeleton badges when loading */}
            {isLoading && tags.length === 0 && (
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-24 bg-muted/80 rounded-full animate-pulse" />
                <div
                  className="h-6 w-16 bg-muted/70 rounded-full animate-pulse"
                  style={{ animationDelay: "100ms" }}
                />
                <div
                  className="h-6 w-20 bg-muted/60 rounded-full animate-pulse"
                  style={{ animationDelay: "200ms" }}
                />
                <div
                  className="h-6 w-18 bg-muted/50 rounded-full animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-help transition-colors hover:text-muted-foreground/80">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>AI-powered tag suggestions</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">
                The system analyzes your input and suggests relevant tags to
                improve discoverability and categorization.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default TagSuggester;

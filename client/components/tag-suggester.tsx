import React, { useState, useEffect, useRef } from "react";
import { Loader2, Hash, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Card className="max-w-2xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6 my-5">
      <div className="space-y-3">
        <div>
          <label
            htmlFor="questionText"
            className="block text-sm font-medium mb-2"
          >
            Question:
          </label>
          <div className="relative">
            <Textarea
              id="questionText"
              className="min-h-[150px] md:min-h-[200px] resize-none"
              placeholder="Enter your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {isLoading && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Analyzing content...</span>
              </div>
            )}
          </div>
          {status && (
            <div
              className={`flex items-center gap-1.5 mt-1 text-sm 
              ${
                isError
                  ? "text-destructive animate-in fade-in slide-in-from-top-1"
                  : "text-muted-foreground"
              }`}
            >
              {isError ? (
                <AlertCircle className="h-3.5 w-3.5" />
              ) : isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : null}
              <span>{status}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-background rounded-md border p-3 focus-within:ring-1 focus-within:ring-ring">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Suggested Tags</p>
          {isLoading && (
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Processing...
              </span>
            </div>
          )}
        </div>

        <div className="min-h-[50px]">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2 py-1 text-xs flex items-center gap-1.5 animate-in fade-in-0 slide-in-from-left-3"
                >
                  <Hash className="h-3 w-3 opacity-70" />
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p
              className={`text-muted-foreground text-sm italic ${
                isLoading ? "hidden" : ""
              }`}
            >
              {question.trim().length >= minInputLength
                ? "No tags suggested for this input."
                : ""}
            </p>
          )}

          {/* Show skeleton badges when loading */}
          {isLoading && tags.length === 0 && (
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-24 bg-muted rounded-full animate-pulse opacity-70" />
              <div className="h-6 w-16 bg-muted rounded-full animate-pulse opacity-60" />
              <div className="h-6 w-20 bg-muted rounded-full animate-pulse opacity-50" />
            </div>
          )}
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 cursor-help">
              <AlertCircle className="h-3 w-3" />
              <span>AI suggested tags</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">
              The system analyzes your input and suggests relevant tags.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Card>
  );
};

export default TagSuggester;

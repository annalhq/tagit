"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Loader2, Hash, X, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Tag {
  name: string;
  confidence: number;
}

const fetchTagSuggestions = async (
  query: string,
  content: string
): Promise<Tag[]> => {
  return new Promise((resolve) => {

    setTimeout(() => {
      const allTags = [
        { name: "machine-learning", confidence: 0.95 },
        { name: "neural-networks", confidence: 0.87 },
        { name: "deep-learning", confidence: 0.82 },
        { name: "tensorflow", confidence: 0.76 },
        { name: "computer-vision", confidence: 0.71 },
        { name: "python", confidence: 0.68 },
        { name: "data-science", confidence: 0.65 },
        { name: "nlp", confidence: 0.62 },
        { name: "ai", confidence: 0.95 },
        { name: "react", confidence: 0.58 },
        { name: "javascript", confidence: 0.56 },
        { name: "algorithms", confidence: 0.52 },
        { name: "frontend", confidence: 0.48 },
      ];


      if (content && !query) {

        const contentWords = content.toLowerCase().split(/\s+/);
        const contentBasedTags = allTags.map((tag) => {

          const tagWords = tag.name.toLowerCase().split("-");
          const matches = tagWords.filter((word) =>
            contentWords.includes(word)
          );
          return {
            ...tag,
            confidence:
              matches.length > 0
                ? Math.min(0.95, tag.confidence + 0.1 * matches.length)
                : tag.confidence * 0.9,
          };
        });

        resolve(
          contentBasedTags
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 5)
        );
      } else {

        const filtered = allTags
          .filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()))
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 5);

        resolve(filtered);
      }
    }, 300);
  });
};

export function QuestionForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContentAnalyzing, setIsContentAnalyzing] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<Tag[]>([]);

  const [debouncedInput] = useDebounce(tagInput, 200);

  const [debouncedContent] = useDebounce(content, 500);
  const [formErrors, setFormErrors] = useState({ title: "", content: "" });

  const tagInputRef = useRef<HTMLInputElement>(null);

  const characterLimit = 150;
  const maxTags = 5;


  useEffect(() => {
    if (debouncedInput.length > 1) {
      setIsLoading(true);
      fetchTagSuggestions(debouncedInput, content).then((results) => {
        setSuggestions(results);
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedInput, content]);


  useEffect(() => {
    if (content.length > 10) {
      setIsContentAnalyzing(true);
      fetchTagSuggestions("", content).then((results) => {
        setAISuggestions(results.slice(0, 5));
        setIsContentAnalyzing(false);
        if (results.length > 0) {
          setShowAISuggestions(true);
        }
      });
    }
  }, [debouncedContent]);

  const addTag = (tag: string) => {
    if (tags.length < maxTags && !tags.includes(tag) && tag.trim() !== "") {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
      setSuggestions([]);

      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      addTag(tagInput.trim());
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const validateForm = () => {
    const errors = { title: "", content: "" };

    if (title.trim().length < 10) {
      errors.title = "Title should be at least 10 characters";
    }

    if (content.trim().length < 30) {
      errors.content = "Please provide more details (min 30 characters)";
    }

    setFormErrors(errors);
    return !errors.title && !errors.content;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log({ title, content, tags });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (newContent.length > 10 && !isContentAnalyzing) {
      setIsContentAnalyzing(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="space-y-4">
            <div className="relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base md:text-lg py-5 md:py-6 px-4 floating-input"
              placeholder=" "
              maxLength={characterLimit}
              aria-invalid={!!formErrors.title}
            />
            <span className="floating-label absolute left-4 top-6 pointer-events-none text-muted-foreground transition-all">
              What&apos;s your question?
            </span>
            <span className="absolute right-3 top-2 md:right-4 md:top-3 text-xs text-muted-foreground">
              {title.length}/{characterLimit}
            </span>
            {formErrors.title && (
              <p className="text-destructive text-sm mt-1 animate-in fade-in slide-in-from-top-1">
              {formErrors.title}
              </p>
            )}
            </div>

          <div className="relative">
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Provide more details about your question..."
              className="min-h-[150px] md:min-h-[200px] resize-none"
              aria-invalid={!!formErrors.content}
            />
            {formErrors.content && (
              <p className="text-destructive text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                {formErrors.content}
              </p>
            )}
            {isContentAnalyzing && content.length > 10 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Analyzing content...</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Tags</p>
            <p className="text-xs text-muted-foreground">
              {tags.length}/{maxTags}
            </p>
          </div>

          <div className="bg-background rounded-md border p-2 md:p-3 focus-within:ring-1 focus-within:ring-ring">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-2 py-1 text-xs flex items-center gap-1.5 animate-in fade-in-0 slide-in-from-left-3 group"
                >
                  <Hash className="h-3 w-3 opacity-70" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="opacity-60 group-hover:opacity-100 hover:text-destructive transition-colors"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {/* Skeleton tags when loading */}
              {isLoading && tags.length < maxTags && (
                <>
                  <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-muted rounded-full animate-pulse opacity-70" />
                </>
              )}

              {/* Input field that grows with the tags */}
              {tags.length < maxTags && (
                <div className="relative inline-flex items-center min-w-[120px] flex-1">
                  <Hash className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    ref={tagInputRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={
                      tags.length ? "Add another tag..." : "Add tags..."
                    }
                    className="h-6 pl-7 pr-2 py-1 text-sm border-none shadow-none focus-visible:ring-0"
                  />
                </div>
              )}
            </div>

            {/* Tag suggestions */}
            {(suggestions.length > 0 || isLoading) && (
              <ScrollArea className="h-auto max-h-[120px] mt-2 overflow-hidden">
                <div className="space-y-1 p-1">
                  {isLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-7 bg-muted animate-pulse rounded-md opacity-70"
                        />
                      ))}
                    </>
                  ) : (
                    suggestions.map((tag) => (
                      <button
                        type="button"
                        key={tag.name}
                        onClick={() => addTag(tag.name)}
                        className="w-full text-left px-2 py-1.5 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center justify-between tag-suggestion text-sm"
                      >
                        <span className="flex items-center gap-1.5">
                          <Hash className="h-3 w-3 opacity-70" />
                          {tag.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(tag.confidence * 100)}% match
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* AI Tag Suggestions */}
          {(showAISuggestions || isContentAnalyzing) && content.length > 10 && (
            <div className="mt-3 animate-in fade-in slide-in-from-bottom-3">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-medium text-muted-foreground">
                  AI Suggested Tags
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        These tags are suggested based on your question content
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isContentAnalyzing && (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Updating...
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {isContentAnalyzing && aiSuggestions.length === 0 ? (

<>
                    <div className="h-6 w-24 bg-muted rounded-full animate-pulse opacity-70 border border-dashed border-muted-foreground/30" />
                    <div className="h-6 w-16 bg-muted rounded-full animate-pulse opacity-60 border border-dashed border-muted-foreground/30" />
                    <div className="h-6 w-20 bg-muted rounded-full animate-pulse opacity-50 border border-dashed border-muted-foreground/30" />
                  </>
                ) : (
                  aiSuggestions.map((tag) => (
                    <button
                      type="button"
                      key={tag.name}
                      onClick={() => addTag(tag.name)}
                      disabled={
                        tags.includes(tag.name) || tags.length >= maxTags
                      }
                      className={`px-2 py-1 text-xs flex items-center gap-1.5 rounded-full border border-dashed
                        ${
                          tags.includes(tag.name)
                            ? "bg-primary/10 text-primary border-primary/20 cursor-not-allowed opacity-50"
                            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        }`}
                    >
                      <Hash className="h-2.5 w-2.5 opacity-70" />
                      {tag.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end mt-4 pt-2">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-primary hover:opacity-90 transition-opacity order-1 sm:order-2 animate-in fade-in slide-in-from-right-3"
          >
            Post Question
          </Button>
        </div>
      </Card>
    </form>
  );
}

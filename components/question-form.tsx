'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Loader2, Hash, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Tag {
  name: string;
  confidence: number;
}

const aiSuggestedTags: Tag[] = [
  { name: 'machine-learning', confidence: 0.95 },
  { name: 'neural-networks', confidence: 0.87 },
  { name: 'deep-learning', confidence: 0.82 },
  { name: 'tensorflow', confidence: 0.76 },
  { name: 'computer-vision', confidence: 0.71 },
  { name: 'python', confidence: 0.68 },
  { name: 'data-science', confidence: 0.65 },
];

export function QuestionForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedInput] = useDebounce(tagInput, 300);

  const characterLimit = 150;
  const maxTags = 5;

  useEffect(() => {
    if (debouncedInput.length > 1) {
      setIsLoading(true);
      // Simulate AI tag suggestion delay
      setTimeout(() => {
        const filtered = aiSuggestedTags
          .filter(tag => tag.name.toLowerCase().includes(debouncedInput.toLowerCase()))
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 5);
        setSuggestions(filtered);
        setIsLoading(false);
      }, 800);
    } else {
      setSuggestions([]);
    }
  }, [debouncedInput]);

  const addTag = (tag: string) => {
    if (tags.length < maxTags && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
      setSuggestions([]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card className="p-6 space-y-6 glow-effect">
      <div className="space-y-4">
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg py-6 px-4 floating-input"
            placeholder=" "
            maxLength={characterLimit}
          />
          <span className="floating-label absolute left-4 top-6 pointer-events-none text-muted-foreground">
            What's your question?
          </span>
          <span className="absolute right-4 top-6 text-sm text-muted-foreground">
            {title.length}/{characterLimit}
          </span>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Provide more details about your question..."
          className="min-h-[200px] resize-none"
        />
      </div>

      <div className="space-y-4">
        <div className="tag-input-container">
          <div className="bg-background p-4 rounded-[calc(var(--radius)-1px)]">
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1.5 flex items-center gap-2 animate-in fade-in-0 slide-in-from-left-3"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="relative">
              <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add up to 5 tags..."
                className="pl-9"
                disabled={tags.length >= maxTags}
              />
            </div>

            <div className="mt-2 min-h-[100px]">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 bg-muted animate-pulse rounded-md"
                    />
                  ))}
                </div>
              ) : suggestions.length > 0 ? (
                <ScrollArea className="h-[100px]">
                  <div className="space-y-1">
                    {suggestions.map((tag, index) => (
                      <button
                        key={tag.name}
                        onClick={() => addTag(tag.name)}
                        className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center justify-between tag-suggestion"
                      >
                        <span className="flex items-center gap-2">
                          <Hash className="h-3 w-3" />
                          {tag.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(tag.confidence * 100)}% match
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button className="bg-primary hover:opacity-90 transition-opacity">
            Post Question
          </Button>
        </div>
      </div>
    </Card>
  );
}
'use client';

import { TrendingUp, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const trendingTopics = [
  { name: 'GPT-4 Applications', count: 342 },
  { name: 'Stable Diffusion', count: 275 },
  { name: 'LangChain', count: 198 },
  { name: 'Vector Databases', count: 156 },
  { name: 'Prompt Engineering', count: 134 },
];

const popularTags = [
  { name: 'artificial-intelligence', count: 1245 },
  { name: 'machine-learning', count: 987 },
  { name: 'deep-learning', count: 654 },
  { name: 'neural-networks', count: 432 },
  { name: 'computer-vision', count: 321 },
];

export function TrendingSidebar() {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Trending Topics</h2>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {trendingTopics.map((topic) => (
              <div
                key={topic.name}
                className="flex items-center justify-between hover:bg-secondary/50 p-2 rounded-md transition-colors"
              >
                <span>{topic.name}</span>
                <span className="text-sm text-muted-foreground">{topic.count}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Hash className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Popular Tags</h2>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {popularTags.map((tag) => (
              <div
                key={tag.name}
                className="flex items-center justify-between hover:bg-secondary/50 p-2 rounded-md transition-colors"
              >
                <span className="text-sm">{tag.name}</span>
                <span className="text-xs text-muted-foreground">×{tag.count}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { HistoryItem } from "@/lib/types"
import { formatDistanceToNow } from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"
import { FileClock } from "lucide-react"

type HistoryPanelProps = {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  isAnalyzing: boolean;
  isLoading: boolean;
};

export function HistoryPanel({ history, onSelect, isAnalyzing, isLoading }: HistoryPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <FileClock className="text-primary"/>
            Recent Analyses
        </CardTitle>
        <CardDescription>View your past review analysis results.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px]">
          <div className="space-y-4 pr-4">
            {(isAnalyzing || isLoading) && Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 animate-pulse">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
            {!isLoading && !isAnalyzing && history.length === 0 && (
                 <div className="text-center text-muted-foreground py-10">
                    No analyses yet. Submit a review to get started.
                </div>
            )}
            {!isLoading && history.length > 0 && history.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex justify-between items-start">
                    <div className="flex-1 truncate pr-4">
                        <p className="font-semibold truncate">{item.productOrService}</p>
                        <p className="text-sm text-muted-foreground">{item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <Badge variant={item.predictedLabel === 'genuine' ? 'default' : 'destructive'} className={cn(
                            "mb-1",
                            item.predictedLabel === 'genuine' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30'
                        )}>
                            {item.predictedLabel === 'genuine' ? 'Genuine' : 'Fake'}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </p>
                    </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

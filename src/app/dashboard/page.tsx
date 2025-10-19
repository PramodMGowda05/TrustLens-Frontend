"use client";

import React, { useState, useEffect } from 'react';
import { ReviewForm } from '@/components/dashboard/review-form';
import { ResultDisplay } from '@/components/dashboard/result-display';
import { HistoryPanel } from '@/components/dashboard/history-panel';
import type { HistoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // No longer loading from a DB
  const { toast } = useToast();


  const handleAnalysisComplete = (result: HistoryItem) => {
    if (result) {
      setAnalysisResult(result);
      // Prepend the new result to the history
      setHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10
      toast({
        title: 'Analysis Complete',
        description: `Review classified as ${result.predictedLabel}.`,
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <ReviewForm 
          onAnalysisComplete={handleAnalysisComplete}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
        />
        {isAnalyzing ? (
            <Card className="mt-6">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-10 w-1/3" />
                         <Skeleton className="h-10 w-full" />
                    </div>
                </div>
              </CardContent>
            </Card>
        ) : analysisResult && (
          <div className="mt-6">
            <ResultDisplay result={analysisResult} />
          </div>
        )}
      </div>
      <div className="md:col-span-1">
        <HistoryPanel 
          history={history} 
          onSelect={(item) => setAnalysisResult(item)} 
          isAnalyzing={isAnalyzing}
          isLoading={isLoadingHistory}
        />
      </div>
    </div>
  );
}

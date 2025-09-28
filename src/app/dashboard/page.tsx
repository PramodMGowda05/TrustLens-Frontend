"use client";

import React, { useState } from 'react';
import { ReviewForm } from '@/components/dashboard/review-form';
import { ResultDisplay } from '@/components/dashboard/result-display';
import { HistoryPanel } from '@/components/dashboard/history-panel';
import type { HistoryItem } from '@/lib/types';
import { mockHistory } from '@/lib/mock-data';
import { analyzeReview } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { GenerateRealTimeTrustScoreInput } from '@/ai/flows/generate-real-time-trust-score';


export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalysisComplete = (result: HistoryItem) => {
    if (result) {
      setAnalysisResult(result);
      // Prepend the new result to the history
      setHistory(prev => [result, ...prev]);
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
        {analysisResult && (
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
        />
      </div>
    </div>
  );
}

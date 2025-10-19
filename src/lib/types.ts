export type AnalysisResult = {
  trustScore: number;
  predictedLabel: 'genuine' | 'fake';
  explanation: string;
};

export type HistoryItem = AnalysisResult & {
  id: string; 
  timestamp: string;
  productOrService: string;
  platform: string;
  reviewText: string;
};

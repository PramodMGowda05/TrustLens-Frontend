export type AnalysisResult = {
  trustScore: number;
  predictedLabel: 'genuine' | 'fake';
  explanation: string;
};

export type HistoryItem = AnalysisResult & {
  id: string; // This will be the database ID
  timestamp: string; // This will be the database timestamp
  productOrService: string;
  platform: string;
  reviewText: string;
};

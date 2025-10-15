import type { HistoryItem } from '@/lib/types';

// This data is now for reference and will not be used in the dashboard.
export const mockHistory: HistoryItem[] = [
  {
    id: '1',
    trustScore: 0.92,
    predictedLabel: 'genuine',
    explanation: 'The review exhibits a balanced tone, specific details about product usage, and a credible user history, indicating a high likelihood of being genuine.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    productOrService: 'AstroBook Pro',
    platform: 'Amazon',
    reviewText: "I've been using the AstroBook Pro for a month now and it's been a fantastic experience. The screen is gorgeous and the keyboard is a joy to type on. Battery life has been stellar, easily getting me through a full day of work."
  },
  {
    id: '2',
    trustScore: 0.15,
    predictedLabel: 'fake',
    explanation: 'This review contains overly generic positive language, lacks specific details, and the user account has no prior activity, which are common red flags for fake reviews.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    productOrService: 'GalaxyWatch 5',
    platform: 'BestBuy',
    reviewText: "Wow! This is the best watch ever made. I love it so much. Everyone should buy this watch right now. Absolutely amazing product. Five stars!"
  },
  {
    id: '3',
    trustScore: 0.78,
    predictedLabel: 'genuine',
    explanation: 'The review provides constructive criticism alongside positive feedback, a sign of a thoughtful and authentic user experience.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    productOrService: 'PixelPhone 8',
    platform: 'Google Store',
    reviewText: "The camera is incredible, especially in low light. The only downside is that the battery life is just okay, not great. I often have to top it up in the evening."
  },
];

export const mockModerationQueue = [
  {
    id: 'rev-001',
    reviewer: 'user123',
    credibility: 85,
    review: 'This product is an absolute game-changer! I cannot recommend it enough. Changed my life!',
    product: 'Quantum-Flux Capacitor',
    flaggedReason: 'Overly positive, generic language',
    date: '2023-10-26',
  },
  {
    id: 'rev-002',
    reviewer: 'bot-killer99',
    credibility: 12,
    review: 'BUY NOW!!! BEST EVER!!!',
    product: 'SonicScrewdriver 3000',
    flaggedReason: 'Spam-like, non-descriptive',
    date: '2023-10-25',
  },
  {
    id: 'rev-003',
    reviewer: 'jane.doe',
    credibility: 92,
    review: 'While the build quality is excellent, I found the software to be a bit buggy. The main feature works as advertised, but the companion app often crashes.',
    product: 'Chrono-Shift Watch',
    flaggedReason: 'Manual report by another user',
    date: '2023-10-24',
  },
  {
    id: 'rev-004',
    reviewer: 'competitor_spy',
    credibility: 25,
    review: 'This is the worst thing I have ever bought. It broke after one use. Do not buy, go for the other brand instead.',
    product: 'AstroBook Pro',
    flaggedReason: 'Potentially malicious, mentions competitor',
    date: '2023-10-23',
  },
];

export const mockClassificationData = [
  { month: 'Jan', genuine: 186, fake: 80 },
  { month: 'Feb', genuine: 305, fake: 200 },
  { month: 'Mar', genuine: 237, fake: 120 },
  { month: 'Apr', genuine: 73, fake: 190 },
  { month: 'May', genuine: 209, fake: 130 },
  { month: 'Jun', genuine: 214, fake: 140 },
];

export const mockUsageData = [
    { date: '2023-01-01', 'API Calls': 2000, 'Users': 2400 },
    { date: '2023-02-01', 'API Calls': 1800, 'Users': 2210 },
    { date: '2023-03-01', 'API Calls': 2200, 'Users': 2290 },
    { date: '2023-04-01', 'API Calls': 2500, 'Users': 2780 },
    { date: '2023-05-01', 'API Calls': 2100, 'Users': 2181 },
    { date: '2023-06-01', 'API Calls': 3200, 'Users': 2500 },
    { date: '2023-07-01', 'API Calls': 2800, 'Users': 2600 },
];

export const mockCredibilityData = [
  { bucket: 'High (80-100)', value: 45, fill: 'hsl(var(--chart-2))' },
  { bucket: 'Medium (50-79)', value: 30, fill: 'hsl(var(--chart-4))' },
  { bucket: 'Low (20-49)', value: 15, fill: 'hsl(var(--chart-1))' },
  { bucket: 'Very Low (0-19)', value: 10, fill: 'hsl(var(--destructive))' },
];

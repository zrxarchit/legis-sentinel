import { cn } from '@/lib/utils';

interface SentimentBadgeProps {
  sentiment: string;
  className?: string;
}

export const SentimentBadge = ({ sentiment, className }: SentimentBadgeProps) => {
  const getSentimentStyle = (sentiment: string) => {
    const normalizedSentiment = sentiment.toLowerCase();
    
    if (normalizedSentiment.includes('positive')) {
      return 'status-positive';
    } else if (normalizedSentiment.includes('negative')) {
      return 'status-negative';
    } else {
      return 'status-neutral';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    const normalizedSentiment = sentiment.toLowerCase();
    
    if (normalizedSentiment.includes('positive')) {
      return '😊';
    } else if (normalizedSentiment.includes('negative')) {
      return '😟';
    } else {
      return '😐';
    }
  };

  return (
    <span className={cn(getSentimentStyle(sentiment), className)}>
      <span className="mr-1">{getSentimentIcon(sentiment)}</span>
      {sentiment}
    </span>
  );
};
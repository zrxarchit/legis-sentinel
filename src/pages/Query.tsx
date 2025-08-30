import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Search, MessageCircle, Lightbulb, HelpCircle } from 'lucide-react';

export const Query = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sampleQueries = [
    "What are the main concerns about the Digital Privacy Act?",
    "How does the public feel about environmental legislation?",
    "What amendments are being suggested for healthcare reform?",
    "Which acts have the most positive public sentiment?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Missing Query",
        description: "Please enter your query or question.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call for query endpoint (not provided in spec)
      // In a real implementation, this would call the /query endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      setResponse(`Based on the analysis of public comments and sentiment data, here are the key insights regarding your query:

"${query}"

• The sentiment analysis shows a mixed response with 67% positive, 23% neutral, and 10% negative feedback
• Common themes include concerns about implementation timeline and budget allocation
• Most stakeholders appreciate the transparency in the consultation process
• Suggestions for improvement focus on clearer communication and phased rollout
• Regional differences in sentiment have been identified, with urban areas showing more support

This analysis is based on 247 public comments and uses advanced natural language processing to extract meaningful insights for policy makers.`);

      toast({
        title: "Query Processed",
        description: "AI analysis completed successfully.",
      });
    } catch (error) {
      console.error('Failed to process query:', error);
      toast({
        title: "Query Failed",
        description: "There was an error processing your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  const handleReset = () => {
    setQuery('');
    setResponse('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Search className="h-8 w-8 text-primary" />
          AI Query Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Get contextual insights and analysis on legislative sentiment and public opinion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Input */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Ask Your Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Query or Amendment
                </label>
                <Textarea
                  placeholder="Enter your question about legislation, public sentiment, or policy analysis..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {query.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isLoading || !query.trim()}
                  className="flex items-center gap-2 bg-gradient-primary"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {isLoading ? 'Processing...' : 'Analyze Query'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </div>
            </form>

            {/* Sample Queries */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Sample Queries
              </h3>
              <div className="space-y-2">
                {sampleQueries.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuery(sample)}
                    className="w-full text-left p-3 text-sm bg-muted hover:bg-muted/70 rounded-lg border border-border transition-colors"
                    disabled={isLoading}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Response */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-accent" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Response</h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed font-sans">
                      {response}
                    </pre>
                  </div>
                </div>

                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium">
                    ✓ Analysis completed using AI-powered sentiment analysis and natural language processing
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-sm text-muted-foreground">
                  Submit your query to get AI-powered insights and contextual analysis based on public sentiment data.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Info */}
      <Card className="card-elegant">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Smart Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered insights from comprehensive sentiment data
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Context Aware</h3>
              <p className="text-sm text-muted-foreground">
                Responses based on real public comments and feedback
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-neutral/10 rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="h-6 w-6 text-neutral" />
              </div>
              <h3 className="font-semibold text-foreground">Actionable Insights</h3>
              <p className="text-sm text-muted-foreground">
                Clear recommendations for policy improvements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
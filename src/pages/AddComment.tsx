import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SentimentBadge } from '@/components/SentimentBadge';
import { useToast } from '@/hooks/use-toast';
import { MessageSquarePlus, Send, CheckCircle } from 'lucide-react';
import { apiService, type Comment, type CommentResponse } from '@/lib/api';

export const AddComment = () => {
  const [acts, setActs] = useState<string[]>([]);
  const [formData, setFormData] = useState<Comment>({
    comment: '',
    act: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isActsLoading, setIsActsLoading] = useState(true);
  const [response, setResponse] = useState<CommentResponse | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchActs();
  }, []);

  const fetchActs = async () => {
    try {
      const data = await apiService.getActs();
      setActs(data);
    } catch (error) {
      console.error('Failed to fetch acts:', error);
      toast({
        title: "Error",
        description: "Failed to load acts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.comment.trim() || !formData.act) {
      toast({
        title: "Missing Information",
        description: "Please select an act and enter your comment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.addComment(formData);
      if (result && result.length > 0) {
        setResponse(result[0]);
        setFormData({ comment: '', act: '' });
        toast({
          title: "Success!",
          description: "Your comment has been analyzed and submitted.",
        });
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ comment: '', act: '' });
    setResponse(null);
  };

  if (isActsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <MessageSquarePlus className="h-8 w-8 text-primary" />
          Submit Your Comment
        </h1>
        <p className="text-muted-foreground mt-2">
          Share your thoughts on legislative acts and get instant sentiment analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comment Form */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Add Your Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select Act/Legislation
                </label>
                <Select 
                  value={formData.act} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, act: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an act to comment on" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border max-h-60">
                    {acts.map((act) => (
                      <SelectItem 
                        key={act} 
                        value={act}
                        className="text-popover-foreground hover:bg-muted"
                      >
                        {act}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Your Comment
                </label>
                <Textarea
                  placeholder="Share your thoughts, concerns, or suggestions about this legislation..."
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  className="min-h-[150px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.comment.length}/1000 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.comment.trim() || !formData.act}
                  className="flex items-center gap-2 bg-gradient-primary"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isLoading ? 'Analyzing...' : 'Submit Comment'}
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
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-2">Detected Sentiment</h3>
                  <SentimentBadge sentiment={response.sentiment} />
                </div>

                <div className="p-4 bg-muted rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-2">Your Comment</h3>
                  <p className="text-sm text-muted-foreground italic">
                    "{response.comment}"
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-2">Related Act</h3>
                  <p className="text-sm text-foreground font-medium">
                    {response.act}
                  </p>
                </div>

                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium">
                    ✓ Your comment has been recorded and will contribute to the overall sentiment analysis for this legislation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MessageSquarePlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-sm text-muted-foreground">
                  Submit your comment to see instant sentiment analysis and contribute to legislative feedback.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="card-elegant">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MessageSquarePlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Share Your Voice</h3>
              <p className="text-sm text-muted-foreground">
                Contribute to public discourse on important legislation
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Instant Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get immediate AI-powered sentiment classification
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-neutral/10 rounded-full flex items-center justify-center mx-auto">
                <Send className="h-6 w-6 text-neutral" />
              </div>
              <h3 className="font-semibold text-foreground">Impact Policy</h3>
              <p className="text-sm text-muted-foreground">
                Help policymakers understand public opinion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
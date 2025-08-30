import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SentimentBadge } from '@/components/SentimentBadge';
import { useToast } from '@/hooks/use-toast';
import { Search, FileText, Users, MessageSquare, Eye } from 'lucide-react';
import { apiService, type ActDetailsResponse } from '@/lib/api';

export const Acts = () => {
  const [acts, setActs] = useState<string[]>([]);
  const [filteredActs, setFilteredActs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAct, setSelectedAct] = useState<ActDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActDetailsLoading, setIsActDetailsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchActs();
  }, []);

  useEffect(() => {
    const filtered = acts.filter(act => 
      act.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActs(filtered);
  }, [acts, searchTerm]);

  const fetchActs = async () => {
    try {
      const data = await apiService.getActs();
      setActs(data);
      setFilteredActs(data);
    } catch (error) {
      console.error('Failed to fetch acts:', error);
      toast({
        title: "Error",
        description: "Failed to load acts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActDetails = async (actName: string) => {
    setIsActDetailsLoading(true);
    try {
      const details = await apiService.getActDetails(actName);
      setSelectedAct(details);
    } catch (error) {
      console.error('Failed to fetch act details:', error);
      toast({
        title: "Error",
        description: "Failed to load act details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActDetailsLoading(false);
    }
  };

  const handleActClick = (actName: string) => {
    fetchActDetails(actName);
  };

  const handleBackToList = () => {
    setSelectedAct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Legislative Acts
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse and analyze sentiment on current and proposed legislation
        </p>
      </div>

      {selectedAct ? (
        /* Act Details View */
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              ← Back to Acts
            </Button>
          </div>

          {isActDetailsLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Act Overview */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="card-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedAct.act}</span>
                      <SentimentBadge sentiment={selectedAct.overall_sentiment} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Summary</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {selectedAct.summary || "No summary available for this act."}
                        </p>
                      </div>
                      
                      {selectedAct.word_list && selectedAct.word_list.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Key Topics</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedAct.word_list.slice(0, 10).map((word, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium border border-border"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Section */}
                <Card className="card-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Public Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAct.comments && Object.keys(selectedAct.comments).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(selectedAct.comments).map(([comment, sentiment], index) => (
                          <div key={index} className="p-4 bg-muted rounded-lg border border-border">
                            <div className="flex justify-between items-start gap-4">
                              <p className="text-sm text-foreground flex-1 italic">
                                "{comment}"
                              </p>
                              <SentimentBadge sentiment={sentiment} className="flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No comments available for this act.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                <Card className="card-elegant">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg border border-border">
                      <div className="text-2xl font-bold text-foreground">
                        {Object.keys(selectedAct.comments || {}).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Comments</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted rounded-lg border border-border">
                      <div className="text-lg font-bold text-foreground">
                        <SentimentBadge sentiment={selectedAct.overall_sentiment} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Overall Sentiment</p>
                    </div>

                    <div className="text-center p-4 bg-muted rounded-lg border border-border">
                      <div className="text-2xl font-bold text-foreground">
                        {selectedAct.word_list?.length || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Key Terms</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Acts List View */
        <div className="space-y-6">
          {/* Search */}
          <Card className="card-elegant">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search acts by name or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Acts Grid */}
          {filteredActs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActs.map((act, index) => (
                <Card 
                  key={act} 
                  className="card-elegant cursor-pointer group"
                  onClick={() => handleActClick(act)}
                >
                  <CardHeader>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {act}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Public Comments</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="group-hover:bg-primary/10 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-elegant">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No acts found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search terms.' : 'No legislative acts are currently available.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
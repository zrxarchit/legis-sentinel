import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, X, ChevronDown } from 'lucide-react';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [acts, setActs] = useState<string[]>([]);
  const [selectedAct, setSelectedAct] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && acts.length === 0) {
      fetchActs();
    }
  }, [isOpen]);

  const fetchActs = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getActs();
      setActs(data);
    } catch (error) {
      console.error('Failed to fetch acts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className={cn(
          "mb-4 w-80 p-4 shadow-elegant animate-slide-up",
          "bg-card border border-border"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse-gentle"></div>
              <h3 className="font-semibold text-foreground">Legislative Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select an act to get AI-powered insights and analysis.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Choose an Act:
              </label>
              <Select value={selectedAct} onValueChange={setSelectedAct}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoading ? "Loading acts..." : "Select an act"} />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border max-h-40">
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

            {selectedAct && (
              <div className="p-3 bg-muted rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Selected:</strong> {selectedAct}
                </p>
                <div className="text-sm text-accent font-medium">
                  🚧 Feature in Progress
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  AI chat functionality will be available soon. For now, visit the Acts page to view detailed analysis.
                </p>
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={!selectedAct}
              variant={selectedAct ? "default" : "secondary"}
            >
              Start Analysis
            </Button>
          </div>
        </Card>
      )}

      {/* Chat Toggle Button */}
      <Button
        onClick={toggleChat}
        size="lg"
        className={cn(
          "rounded-full w-14 h-14 shadow-elegant bg-gradient-primary",
          "hover:shadow-glow transition-all duration-300",
          isOpen && "rotate-180"
        )}
      >
        {isOpen ? (
          <ChevronDown className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </Button>
    </div>
  );
};
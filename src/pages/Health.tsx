import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Activity, CheckCircle, XCircle, RefreshCw, Server, Database } from 'lucide-react';
import { apiService, type HealthResponse } from '@/lib/api';

export const Health = () => {
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const status = await apiService.getHealth();
      setHealthStatus(status);
      setLastChecked(new Date());
      
      const isHealthy = status.api === 'up' && status.database === 'healthy';
      if (isHealthy) {
        toast({
          title: "System Healthy",
          description: "All services are operating normally.",
        });
      } else {
        toast({
          title: "System Issues Detected",
          description: "Some services may not be functioning properly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to check health:', error);
      setHealthStatus(null);
      toast({
        title: "Health Check Failed",
        description: "Unable to connect to the health monitoring service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string, expectedStatus: string) => {
    return status === expectedStatus ? 'text-accent' : 'text-destructive';
  };

  const getStatusIcon = (status: string, expectedStatus: string) => {
    return status === expectedStatus ? CheckCircle : XCircle;
  };

  const formatLastChecked = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            System Health Monitor
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor the status of backend services and database connectivity
          </p>
        </div>
        <Button 
          onClick={checkHealth}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-primary"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isLoading ? 'Checking...' : 'Refresh Status'}
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Status */}
        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">API Service</CardTitle>
            <Server className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {healthStatus ? (
                <>
                  {(() => {
                    const StatusIcon = getStatusIcon(healthStatus.api, 'up');
                    return (
                      <StatusIcon className={`h-8 w-8 ${getStatusColor(healthStatus.api, 'up')}`} />
                    );
                  })()}
                  <div>
                    <div className={`text-2xl font-bold ${getStatusColor(healthStatus.api, 'up')}`}>
                      {healthStatus.api.toUpperCase()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {healthStatus.api === 'up' ? 'Service is operational' : 'Service unavailable'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <XCircle className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">UNKNOWN</div>
                    <p className="text-sm text-muted-foreground">Status unavailable</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Database</CardTitle>
            <Database className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {healthStatus ? (
                <>
                  {(() => {
                    const StatusIcon = getStatusIcon(healthStatus.database, 'healthy');
                    return (
                      <StatusIcon className={`h-8 w-8 ${getStatusColor(healthStatus.database, 'healthy')}`} />
                    );
                  })()}
                  <div>
                    <div className={`text-2xl font-bold ${getStatusColor(healthStatus.database, 'healthy')}`}>
                      {healthStatus.database.toUpperCase()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {healthStatus.database === 'healthy' ? 'Database is responsive' : 'Database connection issues'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <XCircle className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">UNKNOWN</div>
                    <p className="text-sm text-muted-foreground">Status unavailable</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Service Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">API Endpoint</span>
                  <span className="text-sm text-muted-foreground">0xarc.ogserver.eu.org</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">Last Health Check</span>
                  <span className="text-sm text-muted-foreground">{formatLastChecked(lastChecked)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">Response Time</span>
                  <span className="text-sm text-muted-foreground">{isLoading ? 'Checking...' : '< 200ms'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Available Endpoints</h3>
              <div className="space-y-2">
                {[
                  { endpoint: '/add', description: 'Submit new comments' },
                  { endpoint: '/acts', description: 'Get all available acts' },
                  { endpoint: '/fetch', description: 'Get act details and sentiment' },
                  { endpoint: '/health', description: 'System health check' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-muted rounded border border-border">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-foreground">{item.endpoint}</code>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators Legend */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>Status Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <CheckCircle className="h-6 w-6 text-accent" />
              <div>
                <div className="font-semibold text-accent">Healthy</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <XCircle className="h-6 w-6 text-destructive" />
              <div>
                <div className="font-semibold text-destructive">Unhealthy</div>
                <p className="text-xs text-muted-foreground">Service issues detected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-neutral/10 rounded-lg border border-neutral/20">
              <XCircle className="h-6 w-6 text-neutral" />
              <div>
                <div className="font-semibold text-neutral">Unknown</div>
                <p className="text-xs text-muted-foreground">Status unavailable</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
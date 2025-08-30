import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart3, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { apiService } from '@/lib/api';

interface DashboardStats {
  totalComments: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  totalActs: number;
}

const chartConfig = {
  positive: {
    label: "Positive",
    color: "hsl(var(--accent))",
  },
  negative: {
    label: "Negative", 
    color: "hsl(var(--destructive))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--neutral))",
  },
};

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalComments: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
    totalActs: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get acts count
      const acts = await apiService.getActs();
      
      // For demo purposes, we'll simulate some statistics
      // In a real app, you'd have a dedicated dashboard endpoint
      setStats({
        totalComments: 247,
        positiveCount: 156,
        negativeCount: 45,
        neutralCount: 46,
        totalActs: acts.length
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set some fallback demo data
      setStats({
        totalComments: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        totalActs: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sentimentData = [
    { name: 'Positive', value: stats.positiveCount, fill: 'hsl(var(--accent))' },
    { name: 'Negative', value: stats.negativeCount, fill: 'hsl(var(--destructive))' },
    { name: 'Neutral', value: stats.neutralCount, fill: 'hsl(var(--neutral))' }
  ];

  const trendData = [
    { month: 'Jan', positive: 45, negative: 12, neutral: 8 },
    { month: 'Feb', positive: 52, negative: 15, neutral: 10 },
    { month: 'Mar', positive: 59, negative: 18, neutral: 12 },
    { month: 'Apr', positive: 156, negative: 45, neutral: 46 }
  ];

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
        <h1 className="text-3xl font-bold text-foreground">
          Sentiment Analysis Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor public sentiment on legislative acts and government proposals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Comments
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalComments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Positive Sentiment
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {stats.positiveCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalComments > 0 ? Math.round((stats.positiveCount / stats.totalComments) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Negative Sentiment
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.negativeCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalComments > 0 ? Math.round((stats.negativeCount / stats.totalComments) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Acts Monitored
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalActs}
            </div>
            <p className="text-xs text-muted-foreground">
              Active legislation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution Pie Chart */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sentiment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Sentiment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="positive" fill="hsl(var(--accent))" />
                  <Bar dataKey="negative" fill="hsl(var(--destructive))" />
                  <Bar dataKey="neutral" fill="hsl(var(--neutral))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  New positive comment on "Digital Privacy Act 2024"
                </p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Critical feedback received on "Environmental Protection Bill"
                </p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-neutral rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Neutral comment added to "Healthcare Reform Initiative"
                </p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardPage() {
  const {
    ticketsByStatus,
    ticketsResolvedByDate,
    timePeriod,
    isLoading,
    error,
    fetchDashboardData,
    setTimePeriod,
    getTicketTrends
  } = useDashboardStore();

  // Get analytics data
  const { openRate, resolveRate, averageResolutionTime } = getTicketTrends();

  // State for refresh animation
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setIsRefreshing(false), 1000); // Animation for at least 1 second
  };

  // Handle time period change
  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value as 'day' | 'week' | 'month' | 'year');
  };

  // Load dashboard data on component mount and set default time period to 'year'
  useEffect(() => {
    // Set default time period to year
    if (timePeriod !== 'year') {
      setTimePeriod('year');
    } else {
      fetchDashboardData();
    }
  }, [fetchDashboardData, setTimePeriod, timePeriod]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          Error loading dashboard data: {error}
        </div>
      )}

      {/* Ticket Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <CardDescription>Total tickets currently open</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ticketsByStatus.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
            <CardDescription>Total tickets in pending status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ticketsByStatus.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
            <CardDescription>Total tickets resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ticketsByStatus.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <CardDescription>Average tickets opened per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openRate.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CardDescription>Average tickets resolved per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{resolveRate.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <CardDescription>Average time to resolve a ticket (hours)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageResolutionTime.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Resolved Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets Resolved Over Time</CardTitle>
          <CardDescription>
            Number of tickets resolved per day over the selected time period
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketsResolvedByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }} 
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value: string) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#10B981" name="Tickets Resolved" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useSalesData } from '../../hooks/useDashboardData';
import { LoadingSpinner } from '../ui/loading-spinner';

export const SalesHistoryWidget: React.FC = () => {
  const { data: salesData, isLoading } = useSalesData();

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const currentYearTotal = salesData?.reduce((sum, data) => sum + data.currentYear, 0) || 0;
  const lastYearTotal = salesData?.reduce((sum, data) => sum + data.lastYear, 0) || 0;
  const growthPercentage = lastYearTotal > 0 ? ((currentYearTotal - lastYearTotal) / lastYearTotal * 100) : 0;

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">Sales History</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">YoY Growth</p>
            <p className={`text-lg font-bold ${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">2024 Total</p>
                <p className="text-xl font-bold text-blue-700">
                  ${currentYearTotal.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">2023 Total</p>
                <p className="text-xl font-bold text-gray-700">
                  ${lastYearTotal.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="currentYear" 
                    fill="#3B82F6" 
                    name="2024"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="lastYear" 
                    fill="#94A3B8" 
                    name="2023"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
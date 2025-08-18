import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { useBPSalesData, useBPAgedAnalysis } from '../../hooks/useBusinessPartnerData';
import { LoadingSpinner } from '../ui/loading-spinner';

interface BPTrendsTabProps {
  businessPartnerId: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const BPTrendsTab: React.FC<BPTrendsTabProps> = ({
  businessPartnerId,
}) => {
  const { data: salesData, isLoading: salesLoading } = useBPSalesData(businessPartnerId);
  const { data: agedAnalysis, isLoading: agedLoading } = useBPAgedAnalysis(businessPartnerId);

  const formatTooltipValue = (value: number) => {
    return `₵${value.toLocaleString()}`;
  };

  const agedData = agedAnalysis ? [
    { name: 'Current', value: agedAnalysis.current },
    { name: '1-30 Days', value: agedAnalysis.days30 },
    { name: '31-60 Days', value: agedAnalysis.days60 },
    { name: '61-90 Days', value: agedAnalysis.days90 },
    { name: '90+ Days', value: agedAnalysis.over90 },
  ].filter(item => item.value > 0) : [];

  const totalSales = salesData?.reduce((sum, data) => sum + data.sales, 0) || 0;
  const totalInvoices = salesData?.reduce((sum, data) => sum + data.invoices, 0) || 0;
  const totalAged = agedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Sales (YTD)</p>
              <p className="text-2xl font-bold text-blue-600">₵{totalSales.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-green-600">{totalInvoices}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Outstanding Amount</p>
              <p className="text-2xl font-bold text-orange-600">₵{totalAged.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales History Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Sales History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₵${value / 1000}k`} />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar 
                      dataKey="sales" 
                      fill="#3B82F6"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aged Analysis Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Aged Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agedLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : agedData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agedData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {agedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatTooltipValue} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No outstanding amounts
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
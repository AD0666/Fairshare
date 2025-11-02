import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService, StatsData } from '../services/dashboardService';
import { formatCurrency } from '../utils/format';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#16a34a', '#2563eb', '#dc2626', '#ea580c', '#7c3aed', '#0891b2', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6'];

export default function ReportsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No data available</h3>
        <p className="mt-2 text-sm text-gray-500">Start adding expenses to see your reports</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total Spent</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {formatCurrency(stats.totals.totalSpent)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Total Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {formatCurrency(stats.totals.totalPaid)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Difference</p>
          <p className={`text-3xl font-bold mt-2 ${
            stats.totals.difference >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(Math.abs(stats.totals.difference))}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown</h2>
          {stats.categoryBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <p>No category data available</p>
            </div>
          ) : (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={stats.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => {
                      const percentage = ((entry.total / stats.totals.totalSpent) * 100).toFixed(1);
                      // Only show label if percentage is greater than 5% to avoid clutter
                      if (parseFloat(percentage) > 5) {
                        return `${percentage}%`;
                      }
                      return '';
                    }}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="total"
                    animationDuration={800}
                  >
                    {stats.categoryBreakdown.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="#fff"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => {
                      const percentage = ((value / stats.totals.totalSpent) * 100).toFixed(1);
                      return [`${formatCurrency(value)} (${percentage}%)`, 'Amount'];
                    }}
                    contentStyle={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom Legend below chart */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {stats.categoryBreakdown.map((category, index) => {
                  const percentage = ((category.total / stats.totals.totalSpent) * 100).toFixed(1);
                  return (
                    <div key={category.category} className="flex items-center space-x-2">
                      <div 
                        className="h-4 w-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {category.category}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(category.total)} • {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Spending</h2>
          {stats.monthlyBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <p>No monthly data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats.monthlyBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                  cursor={{ fill: '#f0fdf4', opacity: 0.3 }}
                />
                <Bar 
                  dataKey="total" 
                  fill="#16a34a"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                >
                  {stats.monthlyBreakdown.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="#16a34a"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      {/* Category Details Table */}
      {stats.categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.categoryBreakdown.map((category, index) => {
                  const percentage = ((category.total / stats.totals.totalSpent) * 100).toFixed(1);
                  const average = category.count > 0 ? (category.total / category.count).toFixed(2) : '0.00';
                  return (
                    <tr key={category.category} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="h-4 w-4 rounded-full mr-3"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm font-medium text-gray-900">{category.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(category.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.count} {category.count === 1 ? 'expense' : 'expenses'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(parseFloat(average))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


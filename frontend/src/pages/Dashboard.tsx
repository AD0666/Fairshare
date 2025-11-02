import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { dashboardService, BalanceData } from '../services/dashboardService';
import { expenseService, Expense } from '../services/expenseService';
import { formatCurrency, formatDate } from '../utils/format';
import { Plus, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import Button from '../components/Button';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [balanceData, expensesData] = await Promise.all([
        dashboardService.getBalance(),
        expenseService.getExpenses({ limit: 5 }),
      ]);
      setBalance(balanceData);
      setRecentExpenses(expensesData);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={loadDashboardData}>
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => navigate('/expenses/new')}>
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total You Owe</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {formatCurrency(balance.summary.totalOwed)}
                </p>
              </div>
              <ArrowDownRight className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Owed to You</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(balance.summary.totalReceiving)}
                </p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-3xl font-bold mt-2 ${
                balance.summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(Math.abs(balance.summary.netAmount))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Balances */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Balances</h2>
        </div>
        <div className="p-6">
          {balance && balance.balances.length > 0 ? (
            <div className="space-y-4">
              {balance.balances.map((entry) => (
                <div key={entry.userId} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    {entry.userProfilePicture ? (
                      <img
                        src={entry.userProfilePicture}
                        alt={entry.userName}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {entry.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{entry.userName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      entry.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.netAmount >= 0 ? 'You are owed ' : 'You owe '}
                      {formatCurrency(Math.abs(entry.netAmount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No balances to display</p>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
        </div>
        <div className="p-6">
          {recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(expense.amount)}</p>
                    <p className="text-sm text-gray-500">{expense.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No expenses yet</p>
          )}
        </div>
      </div>
    </div>
  );
}


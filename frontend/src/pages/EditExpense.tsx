import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { expenseService, Expense } from '../services/expenseService';
import { userService } from '../services/userService';
import { User } from '../services/authService';
import Input from '../components/Input';
import Button from '../components/Button';
import { EXPENSE_CATEGORIES } from '../constants';
import { formatCurrency } from '../utils/format';

export default function EditExpensePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  
  const [formData, setFormData] = useState({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    payerId: '',
    splits: [] as Array<{ userId: string; amount: number }>,
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) {
      toast.error('Invalid expense ID');
      navigate('/expenses');
      return;
    }

    try {
      const [expenseData, friendsData] = await Promise.all([
        expenseService.getExpenseById(id),
        userService.getFriends(),
      ]);
      
      setExpense(expenseData);
      setFriends(friendsData);
      
      // Set form data from expense
      setFormData({
        amount: expenseData.amount,
        description: expenseData.description,
        date: expenseData.date.split('T')[0],
        category: expenseData.category,
        payerId: expenseData.payerId,
        splits: expenseData.splits.map(s => ({ userId: s.userId, amount: s.amountOwed })),
      });
    } catch (error: any) {
      toast.error('Failed to load expense data');
      console.error('Load error:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Check if current user is the creator
  const isCreator = expense?.creator.id === user?.id;

  const updateSplits = () => {
    if (formData.amount <= 0) {
      setFormData(prev => ({ ...prev, splits: [] }));
      return;
    }

    if (formData.splits.length > 0) {
      setFormData(prev => ({
        ...prev,
        splits: prev.splits.map(split => ({
          ...split,
          amount: prev.amount / prev.splits.length,
        })),
      }));
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, amount: numValue }));
    
    if (numValue > 0 && formData.splits.length > 0) {
      updateSplits();
    }
  };

  const handleParticipantToggle = (userId: string, isAdd: boolean) => {
    setFormData(prev => {
      if (isAdd) {
        const newSplits = [...prev.splits, { userId, amount: 0 }];
        return {
          ...prev,
          splits: newSplits.map(split => ({
            ...split,
            amount: prev.amount / newSplits.length,
          })),
        };
      } else {
        const newSplits = prev.splits.filter(s => s.userId !== userId);
        return {
          ...prev,
          splits: newSplits.map(split => ({
            ...split,
            amount: prev.amount / newSplits.length,
          })),
        };
      }
    });
  };

  const handleSplitAmountChange = (userId: string, amount: number) => {
    setFormData(prev => ({
      ...prev,
      splits: prev.splits.map(split =>
        split.userId === userId ? { ...split, amount } : split
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description) {
      toast.error('Please enter a description');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (isCreator && formData.splits.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    setIsLoading(true);
    try {
      await expenseService.updateExpense(id!, {
        amount: formData.amount,
        description: formData.description,
        date: formData.date,
        category: formData.category,
        payerId: formData.payerId,
        splits: isCreator ? formData.splits : undefined,
      });
      toast.success('Expense updated successfully!');
      navigate('/expenses');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update expense');
    } finally {
      setIsLoading(false);
    }
  };

  const allParticipants = friends;
  const selectedParticipantIds = formData.splits.map(s => s.userId);
  const unselectedParticipants = allParticipants.filter(
    p => !selectedParticipantIds.includes(p.id) && p.id !== formData.payerId
  );

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-4 text-lg font-medium text-gray-900">Expense not found</h3>
        <Button onClick={() => navigate('/expenses')} className="mt-4">
          Back to Expenses
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Edit Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Dinner at restaurant"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount.toString()}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
        </div>

        {isCreator ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid by
              </label>
              <select
                value={formData.payerId}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, payerId: e.target.value }));
                  updateSplits();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value={user?.id}>{user?.name} (You)</option>
                {friends.map((friend) => (
                  <option key={friend.id} value={friend.id}>
                    {friend.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants *
              </label>
              <div className="space-y-2">
                {formData.splits.map((split) => {
                  const participant = friends.find((p) => p.id === split.userId);
                  if (!participant) return null;
                  
                  return (
                    <div key={split.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{participant.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={split.amount?.toString() || '0'}
                            onChange={(e) => handleSplitAmountChange(split.userId, parseFloat(e.target.value) || 0)}
                            placeholder="Amount"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleParticipantToggle(split.userId, false)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {unselectedParticipants.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Participants
                </label>
                <div className="space-y-2">
                  {unselectedParticipants.map((friend) => (
                    <button
                      key={friend.id}
                      type="button"
                      onClick={() => handleParticipantToggle(friend.id, true)}
                      className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-medium">
                        {friend.name.charAt(0)}
                      </div>
                      <p className="font-medium text-gray-900">{friend.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(formData.amount)}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Split total: {formatCurrency(formData.splits.reduce((sum, s) => sum + s.amount, 0))}
              </div>
              {Math.abs(formData.splits.reduce((sum, s) => sum + s.amount, 0) - formData.amount) > 0.01 && (
                <div className="mt-2 text-sm text-red-600">
                  ⚠️ Split amounts must equal total amount
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Current Split Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Paid by</p>
                <p className="font-medium text-gray-900">{expense.payer.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Split among</p>
                <p className="font-medium text-gray-900">{expense.splits.length} people</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Participants:</p>
              <div className="flex flex-wrap gap-2">
                {expense.splits.map((split) => (
                  <div key={split.userId} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-medium">
                      {split.user.name.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-700">{split.user.name}</span>
                    <span className="text-xs text-gray-500">({formatCurrency(split.amountOwed)})</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 italic">
              Note: Only the expense creator can modify split details.
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/expenses')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Expense'}
          </Button>
        </div>
      </form>
    </div>
  );
}

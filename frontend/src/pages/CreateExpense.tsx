import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { expenseService, CreateExpenseData } from '../services/expenseService';
import { groupService } from '../services/groupService';
import { userService } from '../services/userService';
import { User } from '../services/authService';
import { Group } from '../services/groupService';
import Input from '../components/Input';
import Button from '../components/Button';
import { EXPENSE_CATEGORIES } from '../constants';
import { formatCurrency } from '../utils/format';

export default function CreateExpensePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  
  const [formData, setFormData] = useState<CreateExpenseData>({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    payerId: user?.id || '',
    splitType: 'equal',
    splits: [],
  });
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  useEffect(() => {
    loadGroupsAndFriends();
  }, []);

  const loadGroupsAndFriends = async () => {
    try {
      const [groupsData, friendsData] = await Promise.all([
        groupService.getGroups(),
        userService.getFriends(),
      ]);
      setGroups(groupsData);
      setFriends(friendsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    if (groupId) {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        const memberIds = group.members.map(m => m.userId);
        setSelectedParticipants(memberIds);
        updateSplits(memberIds);
      }
    } else {
      setSelectedParticipants([]);
      updateSplits([]);
    }
  };

  const toggleParticipant = (userId: string) => {
    let newParticipants;
    if (selectedParticipants.includes(userId)) {
      newParticipants = selectedParticipants.filter(id => id !== userId);
    } else {
      newParticipants = [...selectedParticipants, userId];
    }
    setSelectedParticipants(newParticipants);
    updateSplits(newParticipants);
  };

  const updateSplits = (participantIds: string[]) => {
    const allParticipants = [user?.id, ...participantIds].filter(Boolean) as string[];
    
    setFormData(prevData => {
      if (prevData.splitType === 'equal' && allParticipants.length > 0) {
        return {
          ...prevData,
          splits: allParticipants.map(userId => ({ userId })),
        };
      } else {
        return {
          ...prevData,
          splits: allParticipants.map(userId => ({ userId, amount: prevData.amount / allParticipants.length })),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || formData.amount <= 0) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.splits.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        ...formData,
        groupId: selectedGroup || undefined,
      };
      await expenseService.createExpense(data);
      toast.success('Expense created successfully!');
      navigate('/expenses');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create expense');
    } finally {
      setIsLoading(false);
    }
  };

  const availableParticipants = friends.filter(f => !selectedGroup);
  const allParticipants = selectedGroup 
    ? groups.find(g => g.id === selectedGroup)?.members.map(m => m.user) || []
    : [user!, ...friends].filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Expense</h1>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <Input
            label="Description *"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Dinner at restaurant"
            required
          />

          {/* Amount */}
          <Input
            label="Amount *"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount || ''}
            onChange={(e) => {
              const newAmount = parseFloat(e.target.value) || 0;
              setFormData({ ...formData, amount: newAmount });
              if (newAmount > 0 && formData.splits.length === 0) {
                updateSplits(selectedParticipants);
              }
            }}
            placeholder="0.00"
            required
          />

          {/* Date */}
          <Input
            label="Date *"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Payer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paid By *
            </label>
            <select
              value={formData.payerId}
              onChange={(e) => setFormData({ ...formData, payerId: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              {allParticipants.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group (Optional)
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">No Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          {/* Participants (if no group) */}
          {!selectedGroup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split With *
              </label>
              <div className="space-y-2 border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                {[user!, ...availableParticipants].filter(Boolean).map((p) => (
                  <label key={p.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(p.id) || p.id === user?.id}
                      onChange={() => p.id !== user?.id && toggleParticipant(p.id)}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-900">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Split Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Split Type *
            </label>
            <select
              value={formData.splitType}
              onChange={(e) => {
                const splitType = e.target.value as any;
                setFormData({ ...formData, splitType });
                updateSplits(selectedParticipants);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="equal">Equally</option>
              <option value="unequal">Unequal amounts</option>
              <option value="percentage">Percentage</option>
              <option value="shares">Shares</option>
            </select>
          </div>

          {/* Split Summary */}
          {formData.splits.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Split Summary:</p>
              <div className="space-y-1 text-sm">
                {formData.splits.map((split) => {
                  const participant = allParticipants.find(p => p.id === split.userId);
                  const amount = formData.splitType === 'equal' 
                    ? formData.amount / formData.splits.length 
                    : split.amount || 0;
                  return (
                    <div key={split.userId} className="flex justify-between">
                      <span className="text-gray-600">{participant?.name}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-1 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(formData.amount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-4">
            <Button type="button" variant="secondary" onClick={() => navigate('/expenses')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


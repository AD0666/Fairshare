import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { groupService, CreateGroupData } from '../services/groupService';
import { userService } from '../services/userService';
import { User } from '../services/authService';
import Input from '../components/Input';
import Button from '../components/Button';

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);
  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    memberIds: [],
  });

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const data = await userService.getFriends();
      setFriends(data);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please enter a group name');
      return;
    }

    setIsLoading(true);
    try {
      await groupService.createGroup(formData);
      toast.success('Group created successfully!');
      navigate('/groups');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFriend = (friendId: string) => {
    const currentMemberIds = formData.memberIds || [];
    if (currentMemberIds.includes(friendId)) {
      setFormData({
        ...formData,
        memberIds: currentMemberIds.filter(id => id !== friendId),
      });
    } else {
      setFormData({
        ...formData,
        memberIds: [...currentMemberIds, friendId],
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Group</h1>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <Input
            label="Group Name *"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Weekend Trip"
            required
          />

          {/* Members Selection */}
          {friends.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Members
              </label>
              <div className="space-y-2 border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {friends.map((friend) => (
                  <label key={friend.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.memberIds?.includes(friend.id)}
                      onChange={() => toggleFriend(friend.id)}
                      className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex items-center space-x-2">
                      {friend.profilePicture ? (
                        <img
                          src={friend.profilePicture}
                          alt={friend.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {friend.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-900">{friend.name}</span>
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Selected: {(formData.memberIds?.length || 0)} member(s)
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                You don't have any friends yet. Add friends first to create a group!
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-4">
            <Button type="button" variant="secondary" onClick={() => navigate('/groups')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { User } from '../services/authService';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { UserPlus, Trash2 } from 'lucide-react';

export default function FriendsPage() {
  const [friends, setFriends] = useState<User[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const data = await userService.getFriends();
      setFriends(data);
    } catch (error: any) {
      toast.error('Failed to load friends');
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email');
      return;
    }

    setIsSearching(true);
    try {
      const results = await userService.searchUsers(searchEmail);
      setSearchResults(results);
    } catch (error: any) {
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      await userService.addFriend(friendId);
      toast.success('Friend added successfully');
      setSearchEmail('');
      setSearchResults([]);
      loadFriends();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add friend');
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;

    try {
      await userService.removeFriend(friendId);
      toast.success('Friend removed successfully');
      loadFriends();
    } catch (error: any) {
      toast.error('Failed to remove friend');
    }
  };

  const isAlreadyFriend = (userId: string) => {
    return friends.some(f => f.id === userId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Friends</h1>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Friends</h2>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <Button onClick={handleSearch} isLoading={isSearching}>
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {isAlreadyFriend(user.id) ? (
                    <span className="text-sm text-gray-500">Already friends</span>
                  ) : (
                    <Button size="sm" onClick={() => handleAddFriend(user.id)}>
                      Add
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Friends List */}
        {friends.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No friends yet"
            description="Search and add friends to split expenses with"
          />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Friends</h2>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      {friend.profilePicture ? (
                        <img
                          src={friend.profilePicture}
                          alt={friend.name}
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {friend.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{friend.name}</p>
                        <p className="text-sm text-gray-500">{friend.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


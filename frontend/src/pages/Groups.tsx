import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { groupService, Group } from '../services/groupService';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { Plus, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (error: any) {
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
      await groupService.deleteGroup(id);
      toast.success('Group deleted');
      loadGroups();
    } catch (error: any) {
      toast.error('Failed to delete group');
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
        <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
        <Button onClick={() => navigate('/groups/new')}>
          <Plus className="h-5 w-5 mr-2" />
          Create Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No groups yet"
          description="Create your first group to start splitting expenses"
          action={{
            label: 'Create Group',
            onClick: () => navigate('/groups/new'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow overflow-hidden">
              {group.image && (
                <img src={group.image} alt={group.name} className="h-48 w-full object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {group.members.length} members • {group._count?.expenses || 0} expenses
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.members.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center">
                      {member.user.profilePicture ? (
                        <img
                          src={member.user.profilePicture}
                          alt={member.user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {member.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {group.members.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        +{group.members.length - 5}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setExpandedGroupId(expandedGroupId === group.id ? null : group.id)}
                    className="flex-1"
                  >
                    {expandedGroupId === group.id ? 'Close' : 'View'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(group.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              {expandedGroupId === group.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Group Details</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Members ({group.members.length})</p>
                      <div className="space-y-2">
                        {group.members.map((member) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            {member.user.profilePicture ? (
                              <img
                                src={member.user.profilePicture}
                                alt={member.user.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                  {member.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                              <p className="text-xs text-gray-500">{member.user.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


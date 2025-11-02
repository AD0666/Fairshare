import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { LogOut, Home, Receipt, Users, UserPlus, BarChart3 } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Friends', href: '/friends', icon: UserPlus },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center h-16 bg-green-600 w-full hover:bg-green-700 transition-colors cursor-pointer"
          >
            <span className="text-white text-2xl font-bold">FairShare</span>
          </button>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {user?.profilePicture ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.profilePicture}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg
                    ${isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        <div className="py-6 px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


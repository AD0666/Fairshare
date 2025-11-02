import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import ExpensesPage from './pages/Expenses';
import CreateExpensePage from './pages/CreateExpense';
import EditExpensePage from './pages/EditExpense';
import GroupsPage from './pages/Groups';
import CreateGroupPage from './pages/CreateGroup';
import FriendsPage from './pages/Friends';
import ReportsPage from './pages/Reports';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="expenses/new" element={<CreateExpensePage />} />
          <Route path="expenses/:id" element={<EditExpensePage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/new" element={<CreateGroupPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


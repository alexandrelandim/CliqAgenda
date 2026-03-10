import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({ children, requireOnboarding = true }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarding && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

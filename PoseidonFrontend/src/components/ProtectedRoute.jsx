import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // Get user role from auth metadata first
        const userRole = session.user.user_metadata?.role;
        
        if (userRole === requiredRole) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        // Fallback to UserInfo table if metadata doesn't have the role
        const { data: profile, error: profileError } = await supabase
          .from('UserInfo')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        setIsAuthorized(profile.role === requiredRole);
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthorized(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400">Checking authorization...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('UserInfo')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'Student') navigate(`/student/${user.id}/dashboard/home`);
        else if (profile?.role === 'Teacher') navigate(`/teacher/${user.id}/dashboard/home`);
        else navigate('/'); // Fallback
      } else {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
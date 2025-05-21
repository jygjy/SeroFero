import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (!user) {
        setAuthorized(false);
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [router]);

  return authorized ? children : null;
};

export default ProtectedRoute;
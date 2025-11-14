import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem('authToken');

    if (token) {

      setLoading(false);
    } else {

      console.log("No token found, redirecting to login...");
      router.push('/auth/login');
    }

  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

export default AuthGuard;
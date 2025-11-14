import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole'); 

    if (token && role === 'Admin') {
      setLoading(false);
    } else if (token) {
      console.log("User is not an Admin. Redirecting to customer dashboard...");
      router.push('/customer');
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

export default AdminGuard;
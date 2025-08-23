import React, { useEffect, useState } from 'react';
import apiService from '@/services/apiService';

const Profile: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resp = await apiService.getProfile();
        setData(resp || null);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!data) return <div className="p-6">No profile data</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div>Email: {data.email}</div>
      <div>Username: {data.username}</div>
      <div>Role: <b>{data.role}</b></div>
      {data.role === 'free' && (
        <div>
          <button className="px-4 py-2 bg-black text-white rounded">Upgrade to Paid</button>
        </div>
      )}
      {data.role === 'admin' && (
        <div>
          <a className="text-blue-600 underline" href="/admin" target="_blank" rel="noreferrer">Open Admin</a>
        </div>
      )}
    </div>
  );
};

export default Profile;



// client/src/components/Profile.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Layout from './Layout';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  console.log("User Token:", user.token); //changed


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/auth/user', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUserProfile(response.data);
        console.log("User Token:", user.token);//changed

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };
    fetchProfile();
  }, [user.token]);

  console.log("User Token:", user.token);//changed


  if (error) {
    return <Layout><div className="p-4 text-red-500">{error}</div></Layout>;
  }

  if (!userProfile) {
    return <Layout><div className="p-4">Loading profile...</div></Layout>;
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      <div className="border p-4 rounded">
        <p><strong>Full Name:</strong> {userProfile.fullname}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
        {/* Add more profile details as needed */}
      </div>
    </Layout>
  );
};

export default Profile;

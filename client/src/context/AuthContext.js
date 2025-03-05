// // client/src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';  //changed
// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const storedUser = localStorage.getItem('user');
//   //   if (storedUser) {
//   //     setUser(JSON.parse(storedUser));
//   //   }
//   //   setLoading(false);
//   // }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//     axios
//         .get('http://localhost:5000/api/auth/user', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((response) => {
//           console.log('AuthContext Response:', response); // Log the entire response
//           setUser(response.data);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error('AuthContext Error:', error);
//           setUser(null);
//           setLoading(false);
//           localStorage.removeItem('token');
//         });
//     } else {
//       setUser(null);
//       setLoading(false);
//     }
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// client/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading is true

  useEffect(() => {
    console.log("AuthContext useEffect RUNNING");

    const token = localStorage.getItem('token');
    if (token) {
      console.log("AuthContext: Token found in localStorage, fetching user...");
      axios
        .get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log('AuthContext Response (Success):', response);
          setUser({ ...response.data, token }); // 🔥 Ensure token is stored
          setLoading(false);
        })
        .catch((error) => {
          console.error('AuthContext Error:', error);
          setUser(null);
          setLoading(false);
          localStorage.removeItem('token');
        });
    } else {
      console.log("AuthContext: No token in localStorage.");
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser({ ...userData, token: userData.token }); // 🔥 Ensure token is stored
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

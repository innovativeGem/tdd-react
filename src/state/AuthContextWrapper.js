// Redundant component. Just use it as reference

import { useState, createContext } from 'react';

export const AuthContext = createContext();

const AuthContextWrapper = (props) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: '',
  });
  return (
    <AuthContext.Provider value={{ ...auth, onLoginSuccess: setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextWrapper;

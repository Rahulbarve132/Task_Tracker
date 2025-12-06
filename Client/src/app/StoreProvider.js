'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { setUser } from '@/lib/features/auth/authSlice';

export default function StoreProvider({ children }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Load user from localStorage
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        store.dispatch(setUser({ token, user: JSON.parse(user) }));
      }
      
      initialized.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

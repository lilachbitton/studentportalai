// Debug component להוספה זמנית לדף הפרופיל
import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';

export const FirebaseDebug = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log('Auth state changed:', currentUser);
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const testStorageAccess = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('אין משתמש מחובר');
        return;
      }

      console.log('Current user:', user.uid);
      console.log('User email:', user.email);
      
      // Test storage reference creation
      const { storage } = await import('../services/firebase');
      const testRef = storage.ref(`profile-pictures/${user.uid}/test.txt`);
      console.log('Storage ref created successfully:', testRef.fullPath);
      
      setError('בדיקת Storage הצליחה - ראה קונסול');
    } catch (error) {
      console.error('Storage test failed:', error);
      setError(`שגיאה: ${error.message}`);
    }
  };

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded border max-w-sm">
      <h3 className="font-bold mb-2">Firebase Debug</h3>
      <p>משתמש: {user ? user.email : 'לא מחובר'}</p>
      <p>UID: {user?.uid || 'N/A'}</p>
      <button 
        onClick={testStorageAccess}
        className="bg-blue-600 px-2 py-1 rounded mt-2 text-sm"
      >
        בדוק Storage
      </button>
      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
    </div>
  );
};

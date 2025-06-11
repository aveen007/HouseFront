import { createContext, useContext, useState } from 'react';

// 1. Create the context
const NotificationsContext = createContext();

// 2. Create the provider component
export function NotificationsProvider({ children }) {
  const [pendingBets, setPendingBets] = useState([]);

  // Add a new bet to pending notifications
  const addPendingBet = (bet) => {
    setPendingBets(prev => [...prev, bet]);
  };

  // Clear all pending notifications
  const clearPendingBets = () => {
    setPendingBets([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        pendingBets,
        addPendingBet,
        clearPendingBets
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// 3. Create a custom hook for easy access
export function useNotifications() {
  return useContext(NotificationsContext);
}
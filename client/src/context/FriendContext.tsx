import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Friend {
  id: string;
  email: string;
}

interface FriendContextType {
  friends: Friend[];
}

export const FriendContext = createContext<FriendContextType | undefined>(undefined);

interface FriendProviderProps {
  children: ReactNode;
}

export const FriendProvider: React.FC<FriendProviderProps> = ({ children }) => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('/api/friends');
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends', error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <FriendContext.Provider value={{ friends }}>
      {children}
    </FriendContext.Provider>
  );
};

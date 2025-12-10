

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserTier, UserRole } from '../types';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  id: string;
  avatar?: string;
}

interface UserContextType {
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;
  pointsBalance: number;
  setPointsBalance: (points: number | ((prev: number) => number)) => void;
  dailyClonesUsed: number;
  setDailyClonesUsed: (count: number) => void;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  weChatBound: boolean;
  setWeChatBound: (bound: boolean) => void;
  
  // Role Management
  roles: UserRole[];
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userTier, setUserTier] = useState<UserTier>(UserTier.GOLD);
  const [pointsBalance, setPointsBalance] = useState(1250);
  const [dailyClonesUsed, setDailyClonesUsed] = useState(2);
  const [weChatBound, setWeChatBound] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Admin User',
    email: 'admin@quantai.com',
    phone: '+86 138 0000 8888',
    id: '882109'
  });

  // Default to having both roles for testing
  const [roles, setRoles] = useState<UserRole[]>(['USER', 'ADMIN']);
  const [currentRole, setCurrentRole] = useState<UserRole>('USER');

  const switchRole = (role: UserRole) => {
    if (roles.includes(role)) {
      setCurrentRole(role);
    }
  };

  return (
    <UserContext.Provider value={{
      userTier,
      setUserTier,
      pointsBalance,
      setPointsBalance,
      dailyClonesUsed,
      setDailyClonesUsed,
      userInfo,
      setUserInfo,
      weChatBound,
      setWeChatBound,
      roles,
      currentRole,
      switchRole
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

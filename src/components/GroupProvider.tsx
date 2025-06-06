"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useSWR from 'swr';

interface StoredGroup {
  id: string;
  name: string;
  passphrase: string;
}

interface GroupsContextType {
  storedGroups: StoredGroup[];
  groupsData: any[];
  isLoadingGroups: boolean;
  hasError: boolean;
  saveGroup: (id: string, name: string, passphrase: string) => void;
  removeGroup: (id: string) => void;
  refreshGroups: () => void;
}

const GroupsContext = createContext<GroupsContextType>({
  storedGroups: [],
  groupsData: [],
  isLoadingGroups: false,
  hasError: false,
  saveGroup: () => {},
  removeGroup: () => {},
  refreshGroups: () => {},
});

const LOCAL_STORAGE_KEY = "eloAppUserGroups";

const groupFetcher = async (url: string, passphrase: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passphrase }),
  });
  
  if (!res.ok) throw new Error('Failed to fetch group data');
  return res.json();
};

export function GroupsProvider({ children }: { children: ReactNode }) {
  const [storedGroups, setStoredGroups] = useState<StoredGroup[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load groups from localStorage on mount
  useEffect(() => {
    try {
      const rawStoredGroups = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (rawStoredGroups) {
        const parsedGroups = JSON.parse(rawStoredGroups);
        setStoredGroups(parsedGroups);
      }
    } catch (e) {
      console.error("Failed to parse stored groups:", e);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedGroups));
    }
  }, [storedGroups, isInitialized]);

  const { data: groupsData, error, mutate: refreshGroups } = useSWR(
    storedGroups.length && isInitialized ? "/groups" : null,
    async () => {
      const results = await Promise.all(
        storedGroups.map(async (group) => {
          const data = await groupFetcher(`/api/groups/${group.id}`, group.passphrase);
          return { ...data, id: group.id };
        })
      );
      return results;
    },
    { 
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000
    }
  );

  // Add or update a group
  const saveGroup = (id: string, name: string, passphrase: string) => {
    setStoredGroups(prevGroups => {
      const existingIndex = prevGroups.findIndex(g => g.id === id);
      if (existingIndex > -1) {
        const updatedGroups = [...prevGroups];
        updatedGroups[existingIndex] = { id, name, passphrase };
        return updatedGroups;
      } else {
        return [...prevGroups, { id, name, passphrase }];
      }
    });
  };

  const removeGroup = (id: string) => {
    setStoredGroups(prevGroups => prevGroups.filter(g => g.id !== id));
  };

  return (
    <GroupsContext.Provider value={{
      storedGroups,
      groupsData: groupsData || [],
      isLoadingGroups: !isInitialized || (!error && !groupsData && storedGroups.length > 0),
      hasError: !!error,
      saveGroup,
      removeGroup,
      refreshGroups
    }}>
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
}
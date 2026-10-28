import { useCallback, useEffect, useState } from 'react';

const KEY = 'saved_stays';
const EVENT = 'saved-stays-change';

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

// Saved (wishlisted) property ids, kept in this browser and synced across components and tabs.
export default function useSaved() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((id) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable: keep in-memory state only */
    }
    setIds(next);
    window.dispatchEvent(new Event(EVENT));
    return next.includes(id);
  }, []);

  return { ids, isSaved: (id) => ids.includes(id), toggle };
}

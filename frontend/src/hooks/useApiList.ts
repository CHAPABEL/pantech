import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useApiList<T>(path: string, fallback: T[]): T[] {
  const [items, setItems] = useState<T[]>(fallback);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get<T[]>(path);
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn(`fetch ${path} failed`, err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [path]);

  return items;
}

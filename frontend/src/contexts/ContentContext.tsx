import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";
import type { ContentMap } from "../services/types";

type ContentState = {
  content: ContentMap;
  loading: boolean;
  ready: boolean;
  t: (key: string, fallback?: string) => string;
  json: <T>(key: string, fallback: T) => T;
  reload: () => Promise<void>;
};

const ContentContext = createContext<ContentState | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<ContentMap>("/content");
      setContent(data ?? {});
      setReady(true);
    } catch (err) {
      console.warn("content load failed", err);
      setContent({});
      setReady(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const t = useCallback(
    (key: string, fallback = "") => {
      const entry = content[key];
      if (!entry) return fallback;
      return entry.value || fallback;
    },
    [content],
  );

  const json = useCallback(
    <T,>(key: string, fallback: T): T => {
      const entry = content[key];
      if (!entry || entry.type !== "json") return fallback;
      try {
        return JSON.parse(entry.value) as T;
      } catch {
        return fallback;
      }
    },
    [content],
  );

  const value = useMemo(
    () => ({ content, loading, ready, t, json, reload }),
    [content, loading, ready, t, json, reload],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent(): ContentState {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

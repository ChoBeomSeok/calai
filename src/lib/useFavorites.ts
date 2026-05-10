"use client";

import { useEffect, useState, useCallback } from "react";

const FAV_KEY = "calai-favorites";
const RECENT_KEY = "calai-recent";
const RECENT_MAX = 8;

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(FAV_KEY);
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch {}
    }
    setHydrated(true);
  }, []);

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFav = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  return { favorites, toggle, isFav, hydrated };
}

export function useRecent() {
  const [recent, setRecent] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) {
      try { setRecent(JSON.parse(saved)); } catch {}
    }
    setHydrated(true);
  }, []);

  const track = useCallback((slug: string) => {
    setRecent((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, RECENT_MAX);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recent, track, hydrated };
}

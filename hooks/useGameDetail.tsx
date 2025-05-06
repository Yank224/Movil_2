import { useEffect, useState, useCallback } from 'react';

export interface GameDetail {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  developer: string;
  publisher: string;
  release_date: string;
  platform: string;
  game_url: string;
  screenshots: { id: number; image: string }[];
}

export default function useGameDetail(id: string | undefined) {
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isActive = true;
    async function fetchGame() {
      try {
        const res = await fetch(
          `https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/game?id=${id}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GameDetail = await res.json();
        if (isActive) setGame(data);
      } catch (e: any) {
        if (isActive) setError(e.message);
      } finally {
        if (isActive) setLoading(false);
      }
    }
    fetchGame();
    return () => {
      isActive = false;
    };
  }, [id]);

  return { game, loading, error };
}
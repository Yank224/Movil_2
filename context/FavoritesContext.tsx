import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getFavorites,
  addFavorite as addFav,
  removeFavorite as removeFav,
  Favorite,
} from '../service/favoritesService';

interface FavoritesContextType {
  favorites: Favorite[];
  isFavorite: (id: number | string) => boolean;
  addFavorite: (
    id: number,
    data: {
      title: string;
      thumbnail: string;
      genre: string;
      platform: string;
    }
  ) => Promise<void>;
  removeFavorite: (id: number | string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const refreshFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  useEffect(() => {
    refreshFavorites();
  }, []);

  const isFavorite = (id: number | string) => {
    return favorites.some((f) => f.id === id.toString());
  };

  const addFavorite = async (
    id: number,
    data: {
      title: string;
      thumbnail: string;
      genre: string;
      platform: string;
    }
  ) => {
    await addFav(id, data);
    await refreshFavorites();
  };

  const removeFavorite = async (id: number | string) => {
    await removeFav(Number(id));
    await refreshFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, addFavorite, removeFavorite, refreshFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};

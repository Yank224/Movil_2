// app/(tabs)/busqueda.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

import SearchBar from '../_game_components/SearchBar';
import GameCard from '../_game_components/GameCard';
import FilterModal from '../_game_components/FilterModal';

import { addFavorite, removeFavorite, getFavorites } from '../../service/favoritesService';

interface Game {
  id: number;
  title: string;
  thumbnail: string;
  genre: string;
  platform: string;
}

export default function BusquedaScreen() {
  const router = useRouter();

  // Estados principales
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Estados de filtros
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [topN, setTopN] = useState(0);

  // Control del modal
  const [showFilters, setShowFilters] = useState(false);

  // Carga inicial
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/games?sort-by=popularity'
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Game[] = await res.json();
        setGames(data);

        const favs = await getFavorites();
        setFavorites(new Set(favs.map(f => +f.id)));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Alternar favorito
  const toggleFav = useCallback(
    async (g: Game) => {
      if (favorites.has(g.id)) {
        await removeFavorite(g.id);
        setFavorites(prev => {
          const s = new Set(prev);
          s.delete(g.id);
          return s;
        });
      } else {
        await addFavorite(g.id, { title: g.title, thumbnail: g.thumbnail });
        setFavorites(prev => new Set(prev).add(g.id));
      }
    },
    [favorites]
  );

  // Dinámico: géneros y plataformas
  const availableGenres = useMemo(() => {
    const s = new Set<string>();
    games.forEach(g => s.add(g.genre));
    return ['(todos)', ...Array.from(s)];
  }, [games]);

  const availablePlatforms = useMemo(() => {
    const s = new Set<string>();
    games.forEach(g => s.add(g.platform));
    return ['(todos)', ...Array.from(s)];
  }, [games]);

  // Filtrado compuesto: búsqueda → género → plataforma → Top N
  const filtered = useMemo(() => {
    let arr = [...games];
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(g => g.title.toLowerCase().includes(q));
    }
    if (genre && genre !== '(todos)') {
      arr = arr.filter(g => g.genre.toLowerCase() === genre.toLowerCase());
    }
    if (platform && platform !== '(todos)') {
      arr = arr.filter(g => g.platform.toLowerCase() === platform.toLowerCase());
    }
    if (topN > 0) {
      arr = arr.slice(0, topN);
    }
    return arr;
  }, [games, query, genre, platform, topN]);

  // Loader / Error
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Callbacks filtros
  const onOpenFilters = () => setShowFilters(true);
  const onSetGenre    = (g: string | null) => setGenre(g);
  const onSetPlatform = (p: string | null) => setPlatform(p);
  const onSetTopN     = (n: number) => setTopN(n);

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de búsqueda */}
      <SearchBar
        query={query}
        onChange={setQuery}
        onOpenFilters={onOpenFilters}
      />

      {/* Lista de juegos */}
      <FlatList
        data={filtered}
        keyExtractor={g => g.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            isFavorite={favorites.has(item.id)}
            onPress={() =>
              router.push({
                pathname: '/game/[id]',
                params: { id: item.id.toString() },
              })
            }
            onToggleFav={() => toggleFav(item)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text style={styles.noResults}>Sin resultados</Text>
          </View>
        )}
      />

      {/* Modal de filtros */}
      <FilterModal
        visible={showFilters}
        genres={availableGenres}
        platforms={availablePlatforms}
        selectedGenre={genre}
        selectedPlatform={platform}
        topN={topN}
        onSetGenre={onSetGenre}
        onSetPlatform={onSetPlatform}
        onSetTopN={onSetTopN}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: { color: 'red' },
  list: { paddingVertical: 8 },
  noResults: { color: '#888', fontSize: 14 },
});

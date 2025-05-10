// app/(tabs)/busqueda.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

import SearchBar from '../_game_components/SearchBar';
import GameCard from '../_game_components/GameCard';
import FilterModal from '../_game_components/FilterModal';
import SettingsMenu from '../components/SettingsMenu';
import { addFavorite, removeFavorite, getFavorites } from '../../service/favoritesService';
import { useTheme } from '../../context/ThemeContext';

interface Game {
  id: number;
  title: string;
  thumbnail: string;
  genre: string;
  platform: string;
}

export default function BusquedaScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [topN, setTopN] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

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
        await addFavorite(g.id, {
          title: g.title,
          thumbnail: g.thumbnail,
          genre: g.genre,
          platform: g.platform
        });
        setFavorites(prev => new Set(prev).add(g.id));
      }
    },
    [favorites]
  );

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

  if (loading) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: isDark ? '#000' : '#fff' },
        ]}
      >
        <ActivityIndicator size="large" color="#00c2ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: isDark ? '#000' : '#fff' },
        ]}
      >
        <Text
          style={[styles.errorText, { color: isDark ? '#fff' : '#000' }]}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
    >
      {/* Espacio superior para no tapar SearchBar */}
      <View style={styles.headerSpacer} />

      {/* Menú de configuración en esquina */}
      <View style={styles.settings}>
        <SettingsMenu />
      </View>

      {/* Barra de búsqueda */}
      <SearchBar
        query={query}
        onChange={setQuery}
        onOpenFilters={() => setShowFilters(true)}
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
            <Text
              style={[styles.noResults, { color: isDark ? '#888' : '#666' }]}
            >
              Sin resultados
            </Text>
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
        onSetGenre={setGenre}
        onSetPlatform={setPlatform}
        onSetTopN={setTopN}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSpacer: {
    height: Platform.OS === 'ios' ? 70 : 50, // el espacio original que dejó tu header nativo
  },
  settings: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 16,
    zIndex: 10,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16 },
  list: { paddingVertical: 8 },
  noResults: { fontSize: 14 },
});

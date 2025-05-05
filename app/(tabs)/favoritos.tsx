import React, { useState, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, removeFavorite, Favorite } from '../../service/favoritesService';

import SearchBar from '../_game_components/SearchBar';
import FilterModal from '../_game_components/FilterModal';
import { useRouter } from 'expo-router';


export default function FavoritosScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [topN, setTopN] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Cargar favoritos al enfocar
  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
      };
      fetchFavorites();
    }, [])
  );

  // Quitar favorito
  const handleRemoveFavorite = async (id: string) => {
    await removeFavorite(Number(id));
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  // Géneros y plataformas disponibles
  const availableGenres = useMemo(() => {
    const s = new Set<string>();
    favorites.forEach(f => s.add(f.genre));
    return ['(todos)', ...Array.from(s)];
  }, [favorites]);

  const availablePlatforms = useMemo(() => {
    const s = new Set<string>();
    favorites.forEach(f => s.add(f.platform));
    return ['(todos)', ...Array.from(s)];
  }, [favorites]);

  // Filtro compuesto
  const filtered = useMemo(() => {
    let arr = [...favorites];
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(f => f.title.toLowerCase().includes(q));
    }
    if (genre && genre !== '(todos)') {
      arr = arr.filter(f => f.genre.toLowerCase() === genre.toLowerCase());
    }
    if (platform && platform !== '(todos)') {
      arr = arr.filter(f => f.platform.toLowerCase() === platform.toLowerCase());
    }
    if (topN > 0) {
      arr = arr.slice(0, topN);
    }
    return arr;
  }, [favorites, query, genre, platform, topN]);

  const renderItem = ({ item }: { item: Favorite }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/game/[id]',
          params: { id: item.id },
        })
      }
    >
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation(); // evita que al presionar "Quitar" se abra el detalle
            handleRemoveFavorite(item.id);
          }}
        >
          <Text style={styles.removeButtonText}>Quitar de favoritos</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingTop: 10 }}>
        <SearchBar
          query={query}
          onChange={setQuery}
          onOpenFilters={() => setShowFilters(true)}
        />
      </View>
  
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Sin resultados</Text>
          </View>
        )}
      />
  
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
  container: { flex: 1, backgroundColor: '#000' },
  listContainer: { padding: 10 },
  itemContainer: {
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
  },
  thumbnail: { width: 150, height: 150, borderRadius: 8 },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#900',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  noResultsText: {
    color: '#888',
    fontSize: 14,
  },
});

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  Pressable,
  Image,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { addFavorite, removeFavorite, getFavorites } from '../../service/favoritesService';
import { Ionicons } from '@expo/vector-icons';

interface Game {
  id: number;
  title: string;
  thumbnail: string;
}

export default function HomeScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => router.push('/favoritos')}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="star" size={24} color="white" />
        </Pressable>
      ),
    });
  }, [navigation, router]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          'https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/games'
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data: Game[] = await response.json();
        setGames(data);

        const favs = await getFavorites();
        const favIds = new Set(favs.map((fav) => parseInt(fav.id)));
        setFavorites(favIds);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'Unknown Error');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchFavoritesOnFocus = async () => {
        const favs = await getFavorites();
        const favIds = new Set(favs.map((fav) => parseInt(fav.id)));
        setFavorites(favIds);
      };
  
      fetchFavoritesOnFocus();
    }, [])
  );

  const toggleFavorite = async (game: Game) => {
    if (favorites.has(game.id)) {
      await removeFavorite(game.id);
      setFavorites(prev => {
        const updated = new Set(prev);
        updated.delete(game.id);
        return updated;
      });
    } else {
      await addFavorite(game.id, { title: game.title, thumbnail: game.thumbnail });
      setFavorites(prev => new Set(prev).add(game.id));
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Game }) => (
    <View style={styles.itemContainer}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/game/[id]',
            params: { id: item.id.toString() },
          })
        }
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.title}>{item.title}</Text>
      </Pressable>

      <Pressable
        style={[styles.favoriteButton, favorites.has(item.id) && styles.favoriteActive]}
        onPress={() => toggleFavorite(item)}
      >
        <Text style={styles.favoriteText}>
          {favorites.has(item.id) ? '★' : '☆'}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  listContainer: { padding: 10 },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  itemContainer: {
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    position: 'relative',
  },
  thumbnail: { width: 150, height: 150, borderRadius: 8 },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 50,
    backgroundColor: '#555',
  },
  favoriteActive: {
    backgroundColor: '#FFD700',
  },
  favoriteText: {
    fontSize: 18,
    color: '#fff',
  },
  errorText: { color: 'red', fontSize: 16 },
});

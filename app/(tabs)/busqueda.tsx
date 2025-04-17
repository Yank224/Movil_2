import React, { useEffect, useState } from 'react';
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

interface Game {
  id: number;
  title: string;
  thumbnail: string;
}

export default function HomeScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Para modo web se utiliza un proxy de CORS.
        const response = await fetch(
          'https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/games'
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data: Game[] = await response.json();
        setGames(data);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'Unknown Error');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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
    <Pressable
      style={styles.itemContainer}
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
  },
  thumbnail: { width: 150, height: 150, borderRadius: 8 },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  errorText: { color: 'red', fontSize: 16 },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface GameDetail {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  developer: string;
  publisher: string;
  release_date: string;
  platform: string;
}

export default function GameDetailScreen() {
  // Se lee el segmento dinámico [id] usando useLocalSearchParams
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        // Se utiliza el proxy de CORS para modo web.
        const response = await fetch(
          `https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/game?id=${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data: GameDetail = await response.json();
        setGame(data);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'Unknown Error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGameDetails();
  }, [id]);

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
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!game) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: game.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{game.title}</Text>
      <Text style={styles.detail}>Fecha de lanzamiento: {game.release_date}</Text>
      <Text style={styles.detail}>Plataforma: {game.platform}</Text>
      <Text style={styles.detail}>Desarrollador: {game.developer}</Text>
      <Text style={styles.detail}>Publisher: {game.publisher}</Text>
      <Text style={styles.description}>{game.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#fff',
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: '#fff',
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

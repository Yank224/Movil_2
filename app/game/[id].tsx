import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;


interface GameDetail {
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


export default function GameDetailScreen() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(
          `https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/game?id=${id}`
        );
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
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
        <ActivityIndicator size="large" color="#00c2ff" />
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
      <Image source={{ uri: game.thumbnail }} style={styles.bannerImage} />

      <Text style={styles.title}>{game.title}</Text>

      {game.screenshots?.length > 0 && (
        <View style={styles.galleryContainer}>
          <Text style={styles.sectionTitle}>Galería</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {game.screenshots.map((screenshot) => (
              <Image
                key={screenshot.id}
                source={{ uri: screenshot.image }}
                style={styles.galleryImage}
              />
            ))}
          </ScrollView>
        </View>
      )}


      <View style={styles.divider} />

      <View style={styles.infoBox}>
        <InfoItem icon="calendar" label="Lanzamiento" value={game.release_date} />
        <InfoItem icon="logo-game-controller-b" label="Plataforma" value={game.platform} />
        <InfoItem icon="hammer" label="Desarrollador" value={game.developer} />
        <InfoItem icon="people" label="Publisher" value={game.publisher} />
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.descriptionText}>{game.description}</Text>
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => Linking.openURL(game.game_url)}
      >
        <Text style={styles.downloadText}>Jugar ahora</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color="#00c2ff" style={{ marginRight: 8 }} />
      <Text style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}:</Text> {value}
      </Text>
    </View>
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
    paddingBottom: 40,
    backgroundColor: '#000',
  },
  bannerImage: {
    width: '90%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: 20,
    marginBottom: 16,
    opacity: 0.5,
  },
  infoBox: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#aaa',
  },
  infoText: {
    color: '#eee',
    fontSize: 14,
  },
  descriptionBox: {
    backgroundColor: '#111',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    color: '#00c2ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  galleryContainer: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  galleryImage: {
    width: 250,
    height: 140,
    marginRight: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  descriptionText: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'justify',
  },
  downloadButton: {
    backgroundColor: '#00c2ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    alignSelf: 'center',
  },
  downloadText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

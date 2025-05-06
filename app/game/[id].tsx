import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Image,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Gallery from './components/Gallery';
import InfoItem from './components/InfoItem';
import CommentsSection from './components/CommentsSection';

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await fetch(
          `https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/game?id=${id}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GameDetail = await res.json();
        setGame(data);
        setMainImage(data.thumbnail);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchGame();
  }, [id]);

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#00c2ff"/></View>;
  if (error || !game) return <View style={styles.centered}><Text style={styles.errorText}>{error||'No data'}</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: mainImage }} style={styles.bannerImage} />
      <Text style={styles.title}>{game.title}</Text>

      <Gallery
        thumbnail={game.thumbnail}
        screenshots={game.screenshots}
        onSelect={setMainImage}
      />

      <View style={styles.divider} />
      <View style={styles.infoBox}>
        <InfoItem icon="calendar" label="Lanzamiento" value={game.release_date} />
        <InfoItem icon="game-controller" label="Plataforma" value={game.platform} />
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

      <CommentsSection gameId={game.id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  errorText: { color: 'red', fontSize: 16 },
  container: { paddingBottom: 40, backgroundColor: '#000' },
  bannerImage: { width: '50%', aspectRatio: 16/9, borderRadius: 12, marginTop: 20, alignSelf: 'center', resizeMode: 'cover' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginVertical: 16, paddingHorizontal: 12 },
  divider: { height: 1, backgroundColor: '#333', marginHorizontal: 20, marginBottom: 16, opacity: 0.5 },
  infoBox: { paddingHorizontal: 20, marginBottom: 20 },
  descriptionBox: { backgroundColor: '#111', padding: 16, marginHorizontal: 16, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 4 },
  sectionTitle: { color: '#00c2ff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  descriptionText: { color: '#ccc', fontSize: 15, lineHeight: 22, textAlign: 'justify' },
  downloadButton: { backgroundColor: '#00c2ff', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 24, alignSelf: 'center' },
  downloadText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Gallery from './components/Gallery';
import CommentSection from './components/CommentsSection';
import InfoItem from './components/InfoItem';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../translations/Translations';
import * as WebBrowser from 'expo-web-browser';

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
  trailer_url?: string;
}

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [mainImage, setMainImage] = useState('');
  const [trailer, setTrailer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === 'dark';

  const {
    descriptionLabel,
    trailerLabel,
    playButton,
    trailerLinkText,
    releaseDate,
    developer,
    publisher,
    platform,
    galleryLabel,
    errorMsg,
    commentSectionTitle,
    commentPlaceholderName,
    commentPlaceholderText,
    commentScoreLabel,
    commentSubmitBtn,
  } = translations[language];

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(
          `https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/game?id=${id}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GameDetail = await res.json();
        setGame(data);
        setMainImage(data.thumbnail);
        if (data.trailer_url) {
          setTrailer(data.trailer_url);
        } else {
          setTrailer(
            `https://www.youtube.com/results?search_query=${encodeURIComponent(
              data.title
            )}+trailer`
          );
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDetails();
  }, [id]);

  if (loading)
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <ActivityIndicator size="large" color="#00c2ff" />
      </View>
    );

  if (error)
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>
          {errorMsg}: {error}
        </Text>
      </View>
    );

  if (!game) return null;

  const openTrailer = () => trailer && WebBrowser.openBrowserAsync(trailer);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
    >
      <Image source={{ uri: mainImage }} style={styles.banner} />
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        {game.title}
      </Text>

      <Text style={[styles.sectionTitle, { color: '#00c2ff' }]}>
        {galleryLabel}
      </Text>
      <Gallery
        screenshots={game.screenshots}
        mainImage={mainImage}
        setMainImage={setMainImage}
      />


      <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#ccc' }]} />

      <View style={styles.infoBox}>
        <InfoItem icon="calendar" label={releaseDate} value={game.release_date} />
        <InfoItem icon="game-controller" label={platform} value={game.platform} />
        <InfoItem icon="hammer" label={developer} value={game.developer} />
        <InfoItem icon="people" label={publisher} value={game.publisher} />
      </View>

      <View
        style={[
          styles.descriptionBox,
          { backgroundColor: isDark ? '#111' : '#f5f5f5' },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: '#00c2ff' }]}>
          {descriptionLabel}
        </Text>
        <Text style={[styles.descriptionText, { color: isDark ? '#ccc' : '#000' }]}>
          {game.description}
        </Text>
      </View>

      {trailer && (
        <View style={styles.trailerBox}>
          <Text style={[styles.sectionTitle, { color: '#00c2ff' }]}>
            {trailerLabel}
          </Text>
          <TouchableOpacity onPress={openTrailer}>
            <Text style={[styles.trailerText, { color: '#00c2ff' }]}>
              {trailerLinkText}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: '#00c2ff' }]}
        onPress={() => Linking.openURL(game.game_url)}
      >
        <Text style={styles.playText}>{playButton}</Text>
      </TouchableOpacity>

      <CommentSection
        gameId={game.id}
        sectionTitle={commentSectionTitle}
        placeholderName={commentPlaceholderName}
        placeholderText={commentPlaceholderText}
        scoreLabel={commentScoreLabel}
        submitLabel={commentSubmitBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingBottom: 40,
  },
  banner: {
    width: '74%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  infoBox: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  descriptionBox: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'justify',
  },
  trailerBox: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  trailerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  playButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    alignSelf: 'center',
  },
  playText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// app/(tabs)/_game_components/GameCard.tsx
import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Game {
  id: number;
  title: string;
  thumbnail: string;
  genre: string;
  platform: string;
}

interface Props {
  game: Game;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFav: () => void;
}

export default function GameCard({ game, isFavorite, onPress, onToggleFav }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.rowCard,
        { backgroundColor: isDark ? '#222' : '#f5f5f5' },
      ]}
    >
      <Image source={{ uri: game.thumbnail }} style={styles.thumbLarge} />

      <View style={styles.rowInfo}>
        <Text
          numberOfLines={1}
          style={[
            styles.titleLarge,
            { color: isDark ? '#fff' : '#000' },
          ]}
        >
          {game.title}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.metaLarge,
            { color: isDark ? '#ccc' : '#555' },
          ]}
        >
          {game.genre}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.metaLarge,
            { color: isDark ? '#ccc' : '#555' },
          ]}
        >
          {game.platform}
        </Text>
      </View>

      <Pressable onPress={onToggleFav} style={styles.favBtn}>
        <Text
          style={[
            styles.favText,
            { color: isFavorite ? '#ffd700' : isDark ? '#888' : '#aaa' },
          ]}
        >
          {isFavorite ? '★' : '☆'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    paddingVertical: 10,
  },
  thumbLarge: {
    width: 180,
    aspectRatio: 16 / 9,
    resizeMode: 'cover',
  },
  rowInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  titleLarge: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaLarge: {
    fontSize: 16,
    marginTop: 4,
  },
  favBtn: {
    paddingHorizontal: 16,
  },
  favText: {
    fontSize: 20,
  },
});

// app/(tabs)/game_components/GameCard.tsx
import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';

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
  return (
    <Pressable onPress={onPress} style={styles.rowCard}>
      <Image source={{ uri: game.thumbnail }} style={styles.thumbLarge} />

      <View style={styles.rowInfo}>
        <Text numberOfLines={1} style={styles.titleLarge}>
          {game.title}
        </Text>
        <Text numberOfLines={1} style={styles.metaLarge}>
          {game.genre}
        </Text>
        <Text numberOfLines={1} style={styles.metaLarge}>
          {game.platform}
        </Text>
      </View>

      <Pressable onPress={onToggleFav} style={styles.favBtn}>
        <Text style={styles.favText}>{isFavorite ? '★' : '☆'}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaLarge: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 4,
  },
  favBtn: {
    paddingHorizontal: 16,
  },
  favText: {
    color: '#fff',
    fontSize: 20,
  },
});

import React, { useState } from 'react';
import { SafeAreaView, FlatList, Image, Text, StyleSheet, View } from 'react-native';
import { getFavorites, Favorite } from '../../service/favoritesService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function FavoritosScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
      };

      fetchFavorites();
    }, [])
  );

  const renderItem = ({ item }: { item: Favorite }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
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
});

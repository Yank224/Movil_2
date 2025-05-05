import React from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  thumbnail: string;
  screenshots: { id: number; image: string }[];
  onSelect: (uri: string) => void;
}

export default function Gallery({ thumbnail, screenshots, onSelect }: Props) {
  return (
    <View style={styles.galleryContainer}>
      <Text style={styles.sectionTitle}>Galería</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Pressable onPress={() => onSelect(thumbnail)} style={[styles.thumbnailWrapper, styles.resetWrapper]}>
          <Ionicons name="refresh" size={28} color="#fff" />
        </Pressable>
        {screenshots.map((shot) => (
          <Pressable key={shot.id} onPress={() => onSelect(shot.image)} style={styles.thumbnailWrapper}>
            <Image source={{ uri: shot.image }} style={styles.galleryImage} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryContainer: { marginTop: 10, marginBottom: 20, paddingHorizontal: 16 },
  sectionTitle: { color: '#00c2ff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  thumbnailWrapper: { borderRadius: 10, overflow: 'hidden', marginRight: 10 },
  resetWrapper: { width: 60, height: 60, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  galleryImage: { width: 250, height: 140, resizeMode: 'cover' },
});

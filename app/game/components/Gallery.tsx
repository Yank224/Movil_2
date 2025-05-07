import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';

interface GalleryProps {
  screenshots: { id: number; image: string }[];
  mainImage: string;
  setMainImage: React.Dispatch<React.SetStateAction<string>>;
}

const Gallery: React.FC<GalleryProps> = ({ screenshots, mainImage, setMainImage }) => {
  return (
    <View style={styles.galleryContainer}>
      <Text style={styles.sectionTitle}>Galería</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {screenshots.map((shot) => (
          <Pressable
            key={shot.id}
            onPress={() => setMainImage(shot.image)}
            style={styles.thumbnailWrapper}
          >
            <Image source={{ uri: shot.image }} style={styles.galleryImage} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#00c2ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  thumbnailWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  galleryImage: {
    width: 250,
    height: 140,
    resizeMode: 'cover',
  },
});

export default Gallery;

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext'; // Importar el hook useLanguage
import translations from '../../translations/Translations';   // Importar las traducciones

interface Props {
  visible: boolean;
  genres: string[];
  platforms: string[];
  selectedGenre: string | null;
  selectedPlatform: string | null;
  topN: number;
  onSetGenre: (g: string | null) => void;
  onSetPlatform: (p: string | null) => void;
  onSetTopN: (n: number) => void;
  onClose: () => void;
}

export default function FilterModal({
  visible,
  genres,
  platforms,
  selectedGenre,
  selectedPlatform,
  topN,
  onSetGenre,
  onSetPlatform,
  onSetTopN,
  onClose,
}: Props) {
  const { language } = useLanguage();  // Obtener el idioma actual
  const { filtersTitle, genreLabel, platformLabel, topNLabel, applyBtn } = translations[language];  // Traducir las etiquetas
  
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.bg}>
        <View style={styles.modal}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.title}>{filtersTitle}</Text>

          <Text style={styles.label}>{genreLabel}:</Text>
          <FlatList
            data={genres}
            horizontal
            keyExtractor={g => g}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSetGenre(item === '(todos)' ? null : item)}
                style={[styles.tag, selectedGenre === item && styles.tagActive]}
              >
                <Text
                  style={[styles.tagText, selectedGenre === item && styles.tagTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />

          <Text style={styles.label}>{platformLabel}:</Text>
          <FlatList
            data={platforms}
            horizontal
            keyExtractor={p => p}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSetPlatform(item === '(todos)' ? null : item)}
                style={[styles.tag, selectedPlatform === item && styles.tagActive]}
              >
                <Text
                  style={[styles.tagText, selectedPlatform === item && styles.tagTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />

          <Text style={styles.label}>{topNLabel}:</Text>
          <View style={styles.topNWrapper}>
            <TextInput
              style={styles.topNInput}
              placeholder="0"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={topN.toString()}
              onChangeText={t =>
                onSetTopN(parseInt(t.replace(/\D/g, ''), 10) || 0)
              }
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <Text style={styles.topNDisplay}>
              {topN > 0 ? `Top ${topN}` : 'Sin Top'}
            </Text>
          </View>

          <Pressable style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>{applyBtn}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  label: { color: '#fff', marginTop: 8, fontWeight: 'bold' },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#222',
    borderRadius: 6,
    marginRight: 8,
  },
  tagActive: { backgroundColor: '#3b82f6' },
  tagText: { color: '#fff' },
  tagTextActive: { color: '#fff', fontWeight: 'bold' },
  topNWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  topNInput: {
    width: 60,
    height: 40,
    backgroundColor: '#222',
    borderRadius: 6,
    color: '#fff',
    textAlign: 'center',
    marginRight: 12,
  },
  topNDisplay: { color: '#fff', fontSize: 16 },
  applyBtn: {
    marginTop: 16,
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: { color: '#fff', fontWeight: 'bold' },
});

// app/_game_components/FilterModal.tsx
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
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../translations/Translations';
import { useTheme } from '../../context/ThemeContext';

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
  const { language } = useLanguage();

const allLabel = translations[language].all;
const genresWithAll = [allLabel, ...genres.filter(g => g !== "(todos)" && g !== "(all)")];
const platformsWithAll = [allLabel, ...platforms.filter(g => g !== "(todos)" && g !== "(all)")];

  const {
    filtersTitle,
    genreLabel,
    platformLabel,
    topNLabel,
    applyBtn,
    all,
    noTop,
  } = translations[language];

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.bg}>
        <View
          style={[
            styles.modal,
            { backgroundColor: isDark ? '#111' : '#f5f5f5' },
          ]}
        >
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? '#fff' : '#000'}
            />
          </Pressable>

          <Text
            style={[
              styles.title,
              { color: isDark ? '#fff' : '#000' },
            ]}
          >
            {filtersTitle}
          </Text>

          <Text
            style={[
              styles.label,
              { color: isDark ? '#ccc' : '#333' },
            ]}
          >
            {genreLabel}:
          </Text>
          <FlatList
            data={genresWithAll}
            horizontal
            keyExtractor={(g) => g}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => {
              const active = (item === all && selectedGenre === null) || selectedGenre === item;
              return (
                <Pressable
                  onPress={() =>
                    onSetGenre(item === all ? null : item)
                  }
                  style={[
                    styles.tag,
                    {
                      backgroundColor: active
                        ? isDark
                          ? '#3b82f6'
                          : '#60a5fa'
                        : isDark
                        ? '#222'
                        : '#e1e1e1',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: active
                          ? '#fff'
                          : isDark
                          ? '#ccc'
                          : '#333',
                        fontWeight: active ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />

          <Text
            style={[
              styles.label,
              { color: isDark ? '#ccc' : '#333' },
            ]}
          >
            {platformLabel}:
          </Text>
          <FlatList
            data={platformsWithAll}
            horizontal
            keyExtractor={(p) => p}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => {
              const active = (item === all && selectedPlatform === null) || selectedPlatform === item;
              return (
                <Pressable
                  onPress={() =>
                    onSetPlatform(item === all ? null : item)
                  }
                  style={[
                    styles.tag,
                    {
                      backgroundColor: active
                        ? isDark
                          ? '#3b82f6'
                          : '#60a5fa'
                        : isDark
                        ? '#222'
                        : '#e1e1e1',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: active
                          ? '#fff'
                          : isDark
                          ? '#ccc'
                          : '#333',
                        fontWeight: active ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />

          <Text
            style={[
              styles.label,
              { color: isDark ? '#ccc' : '#333' },
            ]}
          >
            {topNLabel}:
          </Text>
          <View style={styles.topNWrapper}>
            <TextInput
              style={[
                styles.topNInput,
                {
                  backgroundColor: isDark ? '#222' : '#e1e1e1',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
              placeholder="0"
              placeholderTextColor={isDark ? '#888' : '#666'}
              keyboardType="numeric"
              value={topN.toString()}
              onChangeText={(t) =>
                onSetTopN(parseInt(t.replace(/\D/g, ''), 10) || 0)
              }
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <Text
              style={[
                styles.topNDisplay,
                { color: isDark ? '#ccc' : '#333' },
              ]}
            >
              {topN > 0 ? `Top ${topN}` : noTop}
            </Text>
          </View>

          <Pressable
            style={[
              styles.applyBtn,
              { backgroundColor: isDark ? '#3b82f6' : '#2563eb' },
            ]}
            onPress={onClose}
          >
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
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
  },
  topNWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  topNInput: {
    width: 60,
    height: 40,
    borderRadius: 6,
    textAlign: 'center',
    marginRight: 12,
  },
  topNDisplay: {
    fontSize: 16,
  },
  applyBtn: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

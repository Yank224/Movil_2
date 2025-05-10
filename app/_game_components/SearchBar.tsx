// app/_game_components/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../translations/Translations';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  query: string;
  onChange: (text: string) => void;
  onOpenFilters: () => void;
}

export default function SearchBar({ query, onChange, onOpenFilters }: Props) {
  const { language } = useLanguage();
  const placeholderText = translations[language].searchPlaceholder;

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#333' : '#eee' },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={isDark ? '#ccc' : '#666'}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        placeholder={placeholderText}
        placeholderTextColor={isDark ? '#888' : '#888'}
        value={query}
        onChangeText={onChange}
        returnKeyType="search"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      <Ionicons
        name="filter"
        size={24}
        color={isDark ? '#fff' : '#000'}
        style={styles.icon}
        onPress={onOpenFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    height: 40,
    alignItems: 'center',
    margin: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginHorizontal: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});

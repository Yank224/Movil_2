import React from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';  // Importar el hook useLanguage
import translations from '../../translations/Translations';   // Importar el archivo de traducciones

interface Props {
  query: string;
  onChange: (text: string) => void;
  onOpenFilters: () => void;
}

export default function SearchBar({ query, onChange, onOpenFilters }: Props) {
  const { language } = useLanguage();  // Obtener el idioma actual
  const placeholderText = translations[language].searchPlaceholder;  // Obtener el texto traducido del placeholder

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholderText}  // Usar el texto traducido
        placeholderTextColor="#888"
        value={query}
        onChangeText={onChange}
        returnKeyType="search"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      <Ionicons
        name="filter"
        size={24}
        color="#fff"
        style={styles.icon}
        onPress={onOpenFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#222',
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
    color: '#fff',
    fontSize: 14,
  },
});

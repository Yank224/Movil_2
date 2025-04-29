import React from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  query: string;
  onChange: (text: string) => void;
  onOpenFilters: () => void;
}

export default function SearchBar({ query, onChange, onOpenFilters }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Busca un juego..."
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

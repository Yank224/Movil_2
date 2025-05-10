// app/game/components/InfoItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
}

export default function InfoItem({ icon, label, value }: InfoItemProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const iconColor = '#00c2ff';

  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={20} color={iconColor} style={styles.icon} />
      <Text style={[styles.label, { color: textColor }]}>{label}:</Text>
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  value: {},
});

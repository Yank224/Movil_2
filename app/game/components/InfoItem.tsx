// app/game/components/InfoItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

interface InfoItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={styles.row}>
      <Ionicons
        name={icon}
        size={18}
        color={isDark ? '#00c2ff' : '#0077cc'}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.text, { color: isDark ? '#eee' : '#333' }]}>
        <Text style={[styles.label, { color: isDark ? '#aaa' : '#555' }]}>
          {label}:
        </Text>{' '}
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  label: { fontWeight: 'bold' },
  text: { fontSize: 14 },
});

export default InfoItem;

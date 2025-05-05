import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}

export default function InfoItem({ icon, label, value }: Props) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color="#00c2ff" style={styles.icon} />
      <Text style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}:</Text> {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  icon: { marginRight: 8 },
  infoLabel: { fontWeight: 'bold', color: '#aaa' },
  infoText: { color: '#eee', fontSize: 14 },
});

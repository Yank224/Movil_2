// app/components/SettingsMenu.tsx
import React, { useState } from 'react';
import {
  View,
  Modal,
  Pressable,
  Switch,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const { language, toggleLanguage } = useLanguage();

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ⚙️ Botón para abrir menú */}
      <Pressable onPress={() => setOpen(true)} style={styles.trigger}>
        <Ionicons
          name="settings"
          size={24}
          color={isDark ? '#fff' : '#000'}
        />
      </Pressable>

      {/* Menú modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.menu,
              { backgroundColor: isDark ? '#333' : '#fff' },
            ]}
          >
            {/* Toggle de tema con ícono */}
            <View style={styles.row}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={20}
                color={isDark ? '#fff' : '#000'}
                style={styles.icon}
              />
              <Switch
                value={isDark}
                onValueChange={() => setTheme(isDark ? 'light' : 'dark')}
                thumbColor={isDark ? '#4ade80' : '#facc15'}
                trackColor={{ false: '#888', true: '#444' }}
              />
            </View>

            {/* Toggle de idioma mostrando ES/EN */}
            <View style={styles.row}>
              <Text
                style={[
                  styles.langLabel,
                  { color: isDark ? '#fff' : '#000' },
                ]}
              >
                {language === 'en' ? 'EN' : 'ES'}
              </Text>
              <Switch
                value={language === 'en'}
                onValueChange={toggleLanguage}
                thumbColor={language === 'en' ? '#4ade80' : '#facc15'}
                trackColor={{ false: '#888', true: '#444' }}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menu: {
    marginTop: Platform.OS === 'ios' ? 60 : 50,
    marginRight: 16,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  icon: {
    marginRight: 8,
  },
  langLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

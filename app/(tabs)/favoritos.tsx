// app/(tabs)/favoritos.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, removeFavorite, Favorite } from '../../service/favoritesService';
import { useRouter } from 'expo-router';

// 🔥 Import correcto de auth/signOut
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { useLanguage } from '../../context/LanguageContext';
import translations from '../../translations/Translations';
import SearchBar from '../_game_components/SearchBar';
import FilterModal from '../_game_components/FilterModal';
import { useTheme } from '../../context/ThemeContext';
import SettingsMenu from '../components/SettingsMenu';

export default function FavoritosScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [topN, setTopN] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Menú usuario
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Observador de auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  // Cargar favoritos al enfocar
  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  // Eliminar favorito
  const handleRemoveFavorite = async (id: string) => {
    await removeFavorite(Number(id));
    setFavorites(favs => favs.filter(f => f.id.toString() !== id));
  };

  // Opciones de filtro
  const availableGenres = useMemo(() => {
    const s = new Set(favorites.map(f => f.genre));
    return ['(todos)', ...Array.from(s)];
  }, [favorites]);
  const availablePlatforms = useMemo(() => {
    const s = new Set(favorites.map(f => f.platform));
    return ['(todos)', ...Array.from(s)];
  }, [favorites]);
  const filtered = useMemo(() => {
    return favorites
      .filter(f => !query || f.title.toLowerCase().includes(query.toLowerCase()))
      .filter(f => !genre || genre === '(todos)' || f.genre === genre)
      .filter(f => !platform || platform === '(todos)' || f.platform === platform)
      .slice(0, topN > 0 ? topN : undefined);
  }, [favorites, query, genre, platform, topN]);

  // Cerrar sesión
  const onLogout = async () => {
    await signOut(auth);
    router.replace('/'); // ajusta tu ruta de login
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {/* ⚙️ Menú general */}
      <View style={styles.settings}>
        <SettingsMenu />
      </View>

      {/* Avatar / Usuario */}
      {user && (
        <>
          <Pressable
            onPress={() => setShowUserMenu(true)}
            style={[styles.userInfo, { backgroundColor: isDark ? '#333' : '#eee' }]}
          >
            <Image source={{ uri: user.photoURL }} style={styles.userImage} />
            <Text style={[styles.userName, { color: isDark ? '#fff' : '#000' }]}>
              {user.displayName}
            </Text>
          </Pressable>

          {/* Modal menú usuario */}
          <Modal
            visible={showUserMenu}
            transparent
            animationType="fade"
            onRequestClose={() => setShowUserMenu(false)}
          >
            <Pressable style={styles.backdrop} onPress={() => setShowUserMenu(false)}>
              <View style={[styles.userMenu, { backgroundColor: isDark ? '#333' : '#fff' }]}>
                <Pressable onPress={onLogout} style={styles.userMenuItem}>
                  <Text style={[styles.userMenuText, { color: isDark ? '#fff' : '#000' }]}>
                    {t.logout}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Modal>
        </>
      )}

      {/* Bienvenida + Buscador */}
      <View style={styles.topSection}>
        <Text style={[styles.welcome, { color: isDark ? '#fff' : '#000' }]}>
          {t.welcome}
        </Text>
        <SearchBar
          query={query}
          onChange={setQuery}
          onOpenFilters={() => setShowFilters(true)}
        />
      </View>

      {/* Lista de favoritos */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
              {t.noPlayers}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}>
            <TouchableOpacity
              onPress={() => router.push(`/game/${item.id}`)}
              style={styles.cardTouchable}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
              <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRemoveFavorite(item.id.toString())}
              style={[styles.removeBtn, { backgroundColor: isDark ? '#900' : '#c00' }]}
            >
              <Text style={styles.removeTxt}>{t.removeFavorite}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal Filtros */}
      <FilterModal
        visible={showFilters}
        genres={availableGenres}
        platforms={availablePlatforms}
        selectedGenre={genre}
        selectedPlatform={platform}
        topN={topN}
        onSetGenre={setGenre}
        onSetPlatform={setPlatform}
        onSetTopN={setTopN}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  settings: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  userInfo: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 20,
  },
  userImage: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  userName: { fontSize: 14, fontWeight: '600' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  userMenu: {
    marginTop: 60,
    marginLeft: 16,
    borderRadius: 8,
    paddingVertical: 6,
    width: 140,
    elevation: 5,
  },
  userMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  userMenuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  topSection: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
  },
  cardTouchable: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  thumb: { width: 64, height: 64, borderRadius: 6, marginRight: 12 },
  title: { flexShrink: 1, fontSize: 16, fontWeight: '600' },
  removeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  removeTxt: { color: '#fff', fontSize: 14, fontWeight: '500' },
});

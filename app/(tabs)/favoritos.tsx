import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SafeAreaView, FlatList, Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, removeFavorite, Favorite } from '../../service/favoritesService';
import { useRouter } from 'expo-router';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../translations/Translations';
import SearchBar from '../_game_components/SearchBar';
import FilterModal from '../_game_components/FilterModal';
import GameCard from '../_game_components/GameCard';

export default function FavoritosScreen() {
  const { language, toggleLanguage } = useLanguage(); // Accede al idioma actual y a la función de cambio
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [topN, setTopN] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  // Obtener los datos del usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Cargar favoritos al enfocar
  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
      };
      fetchFavorites();
    }, [])
  );

  // Quitar favorito
  const handleRemoveFavorite = async (id: string) => {
    await removeFavorite(Number(id));
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  // Géneros y plataformas disponibles
  const availableGenres = useMemo(() => {
    const s = new Set<string>();
    favorites.forEach(f => s.add(f.genre));
    return ['(todos)', ...Array.from(s)];
  }, [favorites]);

  const availablePlatforms = useMemo(() => {
    const s = new Set<string>();
    favorites.forEach(f => s.add(f.platform));
    return ['(todos)', ...Array.from(s)];
  }, [favorites]);

  // Filtro compuesto
  const filtered = useMemo(() => {
    let arr = [...favorites];
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(f => f.title.toLowerCase().includes(q));
    }
    if (genre && genre !== '(todos)') {
      arr = arr.filter(f => f.genre.toLowerCase() === genre.toLowerCase());
    }
    if (platform && platform !== '(todos)') {
      arr = arr.filter(f => f.platform.toLowerCase() === platform.toLowerCase());
    }
    if (topN > 0) {
      arr = arr.slice(0, topN);
    }
    return arr;
  }, [favorites, query, genre, platform, topN]);

  // Usamos las traducciones basadas en el idioma actual
  const { noPlayers, welcome, changeLang } = translations[language];

  return (
    <SafeAreaView style={styles.container}>
      {/* Mostrar nombre y foto del usuario si está autenticado */}
      {user && (
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: user.photoURL }} style={styles.userImage} />
          <Text style={styles.userName}>{user.displayName}</Text>
        </View>
      )}

      {/* Botón para cambiar idioma */}
      <TouchableOpacity style={styles.changeLanguageButton} onPress={toggleLanguage}>
        <Text style={styles.changeLanguageText}>{changeLang}</Text>
      </TouchableOpacity>

      <View style={{ paddingTop: 10, paddingHorizontal: 16 }}>
        <Text style={styles.welcomeText}>{welcome}</Text>
        <SearchBar
          query={query}
          onChange={setQuery}
          onOpenFilters={() => setShowFilters(true)}
        />
      </View>
  
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => router.push(`/game/${item.id}`)}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
            {/* Botón para quitar de favoritos */}
            <TouchableOpacity onPress={() => handleRemoveFavorite(item.id.toString())} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>{translations[language].removeFavorite}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>{noPlayers}</Text>
          </View>
        )}
      />

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
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    paddingTop: 40,  // Da algo de espacio en la parte superior para no estar pegado a la barra de estado
  },
  userInfoContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 20,
    padding: 5,
    zIndex: 1,
    flexWrap: 'wrap', // Esto permite que los elementos se ajusten si es necesario
    width: 'auto',    // Permite que se ajuste dependiendo del contenido
    justifyContent: 'flex-start',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    flexShrink: 1,  // Permite que el texto se ajuste si es largo
  },

  changeLanguageButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
    width: 'auto', // Permite que el botón se ajuste
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeLanguageText: {
    color: '#fff',
    fontSize: 14,
  },

  welcomeText: {
    fontSize: 20, // Tamaño de fuente más pequeño en pantallas pequeñas
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 16, // Para agregar algo de margen en los lados
  },

  // Para la búsqueda y los elementos de la lista
  listContainer: { 
    padding: 10 
  },

  itemContainer: {
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',  // Para distribuir el contenido en pantallas pequeñas
  },
  thumbnail: { 
    width: 100,  // Tamaño reducido para pantallas pequeñas
    height: 100, 
    borderRadius: 8,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    flexShrink: 1,  // Asegura que el texto no se desborde
    marginHorizontal: 10, // Para espacio en pantallas pequeñas
  },

  removeButton: {
    marginTop: 10,
    backgroundColor: '#900',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },

  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },

  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  noResultsText: {
    color: '#888',
    fontSize: 14,
  },

  // Para pantallas muy pequeñas, ajustamos el tamaño del texto
  userInfoContainerMobile: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 20,
    padding: 5,
    zIndex: 1,
    maxWidth: '80%', // Evita que el contenido se desborde
    width: 'auto',
  },

  userNameMobile: {
    fontSize: 12,
    marginLeft: 5,
    color: '#fff',
  },
});

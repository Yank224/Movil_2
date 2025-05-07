// app/game/[id].tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTheme } from '../../context/ThemeContext'
import Gallery from './components/Gallery'
import InfoItem from './components/InfoItem'
import CommentSection from './components/CommentsSection'

interface GameDetail {
  id: number
  title: string
  thumbnail: string
  description: string
  developer: string
  publisher: string
  release_date: string
  platform: string
  game_url: string
  screenshots: { id: number; image: string }[]
  trailer_url?: string
}

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [game, setGame] = useState<GameDetail | null>(null)
  const [mainImage, setMainImage] = useState<string>('')
  const [trailerLink, setTrailerLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const resp = await fetch(
          `https://thingproxy.freeboard.io/fetch/https://www.freetogame.com/api/game?id=${id}`
        )
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data: GameDetail = await resp.json()
        setGame(data)
        setMainImage(data.thumbnail)
        if (data.trailer_url) {
          setTrailerLink(data.trailer_url)
        } else {
          // Busca en YouTube el primer resultado
          const q = encodeURIComponent(data.title + ' trailer')
          setTrailerLink(`https://www.youtube.com/results?search_query=${q}`)
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  if (loading)
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <ActivityIndicator size="large" color="#00c2ff" />
      </View>
    )
  if (error)
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    )
  if (!game) return null

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {/* Imagen principal al 47% */}
      <Image source={{ uri: mainImage }} style={styles.banner} />

      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{game.title}</Text>

      {/* Galería */}
      <Gallery screenshots={game.screenshots} mainImage={mainImage} setMainImage={setMainImage} />

      <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#ccc' }]} />

      {/* Info */}
      <View style={styles.infoBox}>
        <InfoItem icon="calendar" label="Lanzamiento" value={game.release_date} />
        <InfoItem icon="game-controller" label="Plataforma" value={game.platform} />
        <InfoItem icon="hammer" label="Desarrollador" value={game.developer} />
        <InfoItem icon="people" label="Publisher" value={game.publisher} />
      </View>

      {/* Descripción */}
      <View style={[styles.descBox, { backgroundColor: isDark ? '#111' : '#f5f5f5' }]}>
        <Text style={[styles.sectionTitle, { color: '#00c2ff' }]}>Descripción</Text>
        <Text style={[styles.descText, { color: isDark ? '#ccc' : '#000' }]}>{game.description}</Text>
      </View>

      {/* Trailer */}
      {trailerLink && (
        <View style={styles.trailerBox}>
          <Text style={[styles.sectionTitle, { color: '#00c2ff' }]}>Trailer</Text>
          <TouchableOpacity onPress={() => Linking.openURL(trailerLink)}>
            <Text style={[styles.trailerText, { color: '#00c2ff' }]}>Ver trailer en YouTube</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Jugar ahora */}
      <TouchableOpacity
        style={[styles.playBtn, { backgroundColor: '#00c2ff' }]}
        onPress={() => Linking.openURL(game.game_url)}
      >
        <Text style={styles.playText}>Jugar ahora</Text>
      </TouchableOpacity>

      {/* Comentarios */}
      <CommentSection gameId={game.id} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { paddingBottom: 40 },
  banner: {
    width: '47%',           // 50% - 3
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  divider: { height: 1, marginHorizontal: 20, marginBottom: 16, opacity: 0.5 },
  infoBox: { paddingHorizontal: 20, marginBottom: 20 },
  descBox: { padding: 16, marginHorizontal: 16, borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  descText: { fontSize: 15, lineHeight: 22, textAlign: 'justify' },
  trailerBox: { marginVertical: 20, paddingHorizontal: 16 },
  trailerText: { fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' },
  playBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 24, alignSelf: 'center' },
  playText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
})

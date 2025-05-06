import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Comment {
  id: string;
  author: string;
  text: string;
  rating?: number;
  date: string;
}

interface Props {
  gameId: number;
}

export default function CommentsSection({ gameId }: Props) {
  const [apiComments, setApiComments] = useState<Comment[]>([]);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    async function loadComments() {
      // fetch example comments
      const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${gameId}`);
      if (res.ok) {
        const data = await res.json();
        const mapped: Comment[] = data.map((c: any) => ({
          id: c.id.toString(),
          author: c.name,
          text: c.body,
          date: new Date().toLocaleDateString(),
        }));
        setApiComments(mapped);
      }
      // load local
      const stored = await AsyncStorage.getItem(`comments_${gameId}`);
      if (stored) setLocalComments(JSON.parse(stored));
    }
    loadComments();
  }, [gameId]);

  const allComments = [...apiComments, ...localComments];

  const addComment = async () => {
    if (!author.trim() || !text.trim()) return;
    const newC: Comment = {
      id: Date.now().toString(),
      author: author.trim(),
      text: text.trim(),
      rating,
      date: new Date().toLocaleDateString(),
    };
    const updated = [newC, ...localComments];
    setLocalComments(updated);
    await AsyncStorage.setItem(`comments_${gameId}`, JSON.stringify(updated));
    setAuthor('');
    setText('');
    setRating(5);
  };

  return (
    <View style={styles.commentsSection}>
      <Text style={styles.sectionTitle}>Comentarios de usuarios</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu nombre"
        placeholderTextColor="#888"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Tu comentario"
        placeholderTextColor="#888"
        multiline
        value={text}
        onChangeText={setText}
      />
      <View style={styles.ratingRow}>
        <Text style={styles.label}>Puntuación:</Text>
        {[1,2,3,4,5].map(n => (
          <Pressable key={n} onPress={() => setRating(n)}>
            <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={20} color="#FFD700" style={styles.star} />
          </Pressable>
        ))}
      </View>
      <TouchableOpacity style={styles.applyBtn} onPress={addComment}>
        <Text style={styles.applyText}>Enviar comentario</Text>
      </TouchableOpacity>
      {allComments.map(c => (
        <View key={c.id} style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{c.author}</Text>
            <Text style={styles.commentDate}>{c.date}</Text>
          </View>
          {c.rating != null && (
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(n => (
                <Ionicons key={n} name={n <= c.rating! ? 'star' : 'star-outline'} size={16} color="#FFD700" style={styles.starSmall} />
              ))}
            </View>
          )}
          <Text style={styles.commentText}>{c.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  commentsSection: { paddingHorizontal: 16, marginTop: 32 },
  sectionTitle: { color: '#00c2ff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#222', color: '#fff', borderRadius: 6, padding: 8, marginBottom: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { color: '#fff', marginRight: 8 },
  star: { marginHorizontal: 2 },
  starSmall: { marginRight: 1 },
  applyBtn: { backgroundColor: '#00c2ff', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginBottom: 20 },
  applyText: { color: '#000', fontWeight: 'bold' },
  commentCard: { backgroundColor: '#111', padding: 12, borderRadius: 6, marginBottom: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  commentAuthor: { color: '#fff', fontWeight: 'bold' },
  commentDate: { color: '#888' },
  commentText: { color: '#ccc', marginTop: 6 },
});
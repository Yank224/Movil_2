import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';

interface Comment {
  id: string;
  author: string;
  text: string;
  rating?: number;
  date: string;
}

interface Props {
  gameId: number;
  sectionTitle: string;
  placeholderName: string;
  placeholderText: string;
  scoreLabel: string;
  submitLabel: string;
}

export default function CommentsSection({
  gameId,
  sectionTitle,
  placeholderName,
  placeholderText,
  scoreLabel,
  submitLabel,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [apiComments, setApiComments] = useState<Comment[]>([]);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${gameId}`
      );
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((c: any) => ({
          id: c.id.toString(),
          author: c.name,
          text: c.body,
          date: new Date().toLocaleDateString(),
        }));
        setApiComments(mapped);
      }
      const stored = await AsyncStorage.getItem(`comments_${gameId}`);
      if (stored) setLocalComments(JSON.parse(stored));
    }
    load();
  }, [gameId]);

  const all = [...apiComments, ...localComments];

  const add = async () => {
    if (!author.trim() || !text.trim()) return;
    const n: Comment = {
      id: Date.now().toString(),
      author: author.trim(),
      text: text.trim(),
      rating,
      date: new Date().toLocaleDateString(),
    };
    const upd = [n, ...localComments];
    setLocalComments(upd);
    await AsyncStorage.setItem(`comments_${gameId}`, JSON.stringify(upd));
    setAuthor('');
    setText('');
    setRating(5);
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: isDark ? '#00c2ff' : '#0077cc' }]}>
        {sectionTitle}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? '#222' : '#f5f5f5',
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#444' : '#ccc',
          },
        ]}
        placeholder={placeholderName}
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={[
          styles.input,
          {
            height: 80,
            backgroundColor: isDark ? '#222' : '#f5f5f5',
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#444' : '#ccc',
          },
        ]}
        placeholder={placeholderText}
        placeholderTextColor={isDark ? '#888' : '#666'}
        multiline
        value={text}
        onChangeText={setText}
      />
      <View style={styles.ratingRow}>
        <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
          {scoreLabel}
        </Text>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setRating(n)}>
            <Ionicons
              name={n <= rating ? 'star' : 'star-outline'}
              size={20}
              color="#FFD700"
              style={styles.star}
            />
          </Pressable>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? '#00c2ff' : '#00a8e8' },
        ]}
        onPress={add}
      >
        <Text style={styles.buttonText}>{submitLabel}</Text>
      </TouchableOpacity>

      <ScrollView>
        {all.map((c) => (
          <View
            key={c.id}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#111' : '#f5f5f5',
                borderColor: isDark ? '#333' : '#ddd',
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.author, { color: isDark ? '#fff' : '#000' }]}>
                {c.author}
              </Text>
              <Text style={[styles.date, { color: isDark ? '#888' : '#555' }]}>
                {c.date}
              </Text>
            </View>
            {c.rating != null && (
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Ionicons
                    key={n}
                    name={n <= c.rating! ? 'star' : 'star-outline'}
                    size={16}
                    color="#FFD700"
                    style={styles.starSmall}
                  />
                ))}
              </View>
            )}
            <Text style={[styles.text, { color: isDark ? '#ccc' : '#333' }]}>
              {c.text}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, marginTop: 32 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { marginRight: 8 },
  star: { marginHorizontal: 2 },
  starSmall: { marginRight: 1 },
  button: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#000', fontWeight: 'bold' },
  card: { padding: 12, borderRadius: 6, marginBottom: 12, borderWidth: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  author: { fontWeight: 'bold' },
  date: {},
  text: { marginTop: 6 },
});

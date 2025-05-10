// app/(auth)/login.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../firebase';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../translations/Translations';
import SettingsMenu from '../components/SettingsMenu';
import { useTheme } from '../../context/ThemeContext';

WebBrowser.maybeCompleteAuthSession();
const redirectUri = makeRedirectUri();

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const lang = language as 'es' | 'en';
  const t = translations[lang];

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Platform.select({
      ios: 'TU_CLIENT_ID_IOS',
      android:
        '15937693597-npucda833jno205bn2hl1slj1uavs6b8.apps.googleusercontent.com',
      default:
        '15937693597-ik25kafmsvr7v5s5v7i48m4pq2fgon71.apps.googleusercontent.com',
    }),
    scopes: ['profile', 'email', 'openid'],
    responseType: 'id_token',
    extraParams: { nonce: 'nonce' },
    redirectUri,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace('/(tabs)/favoritos');
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.params?.id_token;
      if (idToken) {
        const cred = GoogleAuthProvider.credential(idToken);
        signInWithCredential(auth, cred)
          .then(() => router.replace('/(tabs)/favoritos'))
          .catch((e) => Alert.alert('Error', e.message));
      }
    }
  }, [response]);

  const notAvailableAlert = () => {
    Alert.alert('No disponible', 'Facebook login no está disponible aún.');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#1e3a8a' }]}>
      {/* ⚙️ Menú de configuración */}
      <View style={styles.settings}>
        <SettingsMenu />
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#333' : '#fff' }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#111827' }]}>
          {t.login}
        </Text>

        <TouchableOpacity
          disabled={!request}
          style={[styles.button, styles.google]}
          onPress={() => promptAsync()}
        >
          <Text style={styles.buttonText}>{t.loginGoogle}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.facebook]}
          onPress={notAvailableAlert}
        >
          <Text style={styles.buttonText}>{t.loginFacebook}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  settings: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 16,
    zIndex: 10,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  google: { backgroundColor: '#3b82f6' },
  facebook: { backgroundColor: '#1e40af' },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

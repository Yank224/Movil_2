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
const redirectUri = makeRedirectUri(); 

import {
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';

import { auth } from '../../firebase';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/translations/Translations';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const lang = language as 'es' | 'en'; // ✅ Soluciona el error TS7053

  // Configura el login con Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Platform.select({
      ios: 'TU_CLIENT_ID_IOS',
      android: '15937693597-npucda833jno205bn2hl1slj1uavs6b8.apps.googleusercontent.com',
      default: '15937693597-ik25kafmsvr7v5s5v7i48m4pq2fgon71.apps.googleusercontent.com',
    }),
    scopes: ['profile', 'email', 'openid'], 
    responseType: 'id_token', 
    extraParams: {
      nonce: 'nonce', 
    },    
  });
  

  // Redirige si ya hay sesión iniciada
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 onAuthStateChanged se ejecutó');
      if (user) {
        console.log('✅ Sesión activa detectada:', user.email);
        router.replace('/(tabs)/busqueda');
      } else {
        console.log('🚫 No hay sesión activa');
      }
    });
    return unsubscribe;
  }, []);
  

  // Procesa la respuesta del login de Google
  useEffect(() => {
    console.log('👀 response:', response);
  
    if (response?.type === 'success') {
      const idToken = response.params?.id_token;

      console.log("LLego hasta el token", idToken);
      
      if (idToken) {
        console.log('✅ Sesión iniciada con Google');
        const credential = GoogleAuthProvider.credential(idToken);
        signInWithCredential(auth, credential)
          .then(() => router.replace('/(tabs)/busqueda'))
          .catch((error) =>
            Alert.alert('Error', error.message || 'No se pudo iniciar sesión')
          );
      }
    } else if (response?.type === 'error') {
      console.log('❌ Error en respuesta de Google:', response);
    }
  }, [response]);
  

  const notAvailableAlert = () => {
    Alert.alert(
      'No disponible',
      'El inicio de sesión con Facebook no está disponible en móvil por ahora.'
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
        <Text style={styles.languageText}>{translations[lang].changeLang}</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>{translations[lang].login}</Text>

        <TouchableOpacity
          disabled={!request}
          style={[styles.button, styles.google]}
          onPress={() => promptAsync()}
        >
          <Text style={styles.buttonText}>{translations[lang].loginGoogle}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.facebook]}
          onPress={notAvailableAlert}
        >
          <Text style={styles.buttonText}>{translations[lang].loginFacebook}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  languageButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  languageText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
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
    color: '#111827',
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
  google: {
    backgroundColor: '#3b82f6',
  },
  facebook: {
    backgroundColor: '#1e40af',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

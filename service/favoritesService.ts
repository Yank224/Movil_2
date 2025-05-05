import { getFirestore, doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

// Tipo de dato para un favorito
export interface Favorite {
  id: string;
  title: string;
  thumbnail: string;
  genre: string;
  platform: string;
}

// Agregar un favorito
export const addFavorite = async (gameId: number, gameData: {
  title: string;
  thumbnail: string;
  genre: string;
  platform: string;
}) => {
  const user = getAuth().currentUser;
  if (!user) return;

  await setDoc(doc(db, "users", user.uid, "favorites", gameId.toString()), {
    title: gameData.title,
    thumbnail: gameData.thumbnail,
    genre: gameData.genre,
    platform: gameData.platform,
  });
};

// Eliminar un favorito
export const removeFavorite = async (gameId: number) => {
  const user = getAuth().currentUser;
  if (!user) return;

  await deleteDoc(doc(db, "users", user.uid, "favorites", gameId.toString()));
};

// Obtener favoritos
export const getFavorites = async (): Promise<Favorite[]> => {
  const user = getAuth().currentUser;
  if (!user) return [];

  const snapshot = await getDocs(collection(db, "users", user.uid, "favorites"));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      thumbnail: data.thumbnail,
      genre: data.genre,
      platform: data.platform,
    };
  });
};

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// TODO: Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDgCKtflv4isQ4DUbpgBOaWdT_NLsmouJE",
  authDomain: "gnplantcareapp.firebaseapp.com",
  projectId: "gnplantcareapp",
  storageBucket: "gnplantcareapp.appspot.com",
  messagingSenderId: "551363699144",
  appId: "1:551363699144:web:9710b56d88de1d506920fd",
  measurementId: "G-S7SNS8981V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const FirebaseService = {
  auth,
  db,
  // Email/password registration
  async register(email: string, password: string, userData: any) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Registering user with UID:', userCredential.user.uid);
    try {
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      console.log('User document written to Firestore:', userCredential.user.uid, userData);
    } catch (err) {
      console.error('Error writing user document to Firestore:', err);
      throw err;
    }
    return userCredential.user;
  },
  // Email/password login
  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },
  async logout() {
    await signOut(auth);
  },
  // Firestore CRUD examples
  async addPlant(plant: any) {
    return await addDoc(collection(db, 'plants'), plant);
  },
  async getPlants(userId: string) {
    const q = query(collection(db, 'plants'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  // Add more CRUD methods for diseases, treatments, schedules, diagnoses as needed
};
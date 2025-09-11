import { User } from '@/types/Plant';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseService } from './FirebaseService';

export class AuthService {
  private static currentUser: User | null = null;

  static async register(userData: {
    name: string;
    email: string;
    phone: string;
    nurseryName: string;
    password: string;
  }): Promise<User> {
    // Register with Firebase Auth and store user in Firestore
    const user = await FirebaseService.register(userData.email, userData.password, {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      nurseryName: userData.nurseryName,
      registrationDate: new Date().toISOString(),
    });
    this.currentUser = {
      id: user.uid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      nurseryName: userData.nurseryName,
      registrationDate: new Date(),
    };
    return this.currentUser;
  }

  static async login(email: string, password: string): Promise<User> {
    // Login with Firebase Auth and fetch user from Firestore
    const user = await FirebaseService.login(email, password);
    // Fetch user data from Firestore
    const userDocRef = doc(FirebaseService.db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    this.currentUser = {
      id: user.uid,
      name: userData?.name || '',
      email: user.email ?? '',
      phone: userData?.phone || '',
      nurseryName: userData?.nurseryName || '',
      registrationDate: userData?.registrationDate ? new Date(userData.registrationDate) : new Date(),
    };
    console.log('AuthService login: currentUser', this.currentUser);
    return this.currentUser;
  }

  static async loginWithGoogle(): Promise<User> {
    // Google login with Firebase Auth
    const user = await FirebaseService.loginWithGoogle();
    // Fetch user data from Firestore
    const userDocRef = doc(FirebaseService.db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    this.currentUser = {
      id: user.uid,
      name: userData?.name || '',
      email: user.email ?? '',
      phone: userData?.phone || '',
      nurseryName: userData?.nurseryName || '',
      registrationDate: userData?.registrationDate ? new Date(userData.registrationDate) : new Date(),
    };
    return this.currentUser;
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static async logout(): Promise<void> {
    await FirebaseService.logout();
    this.currentUser = null;
  }

  static isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}
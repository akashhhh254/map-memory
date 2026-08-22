import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthUser } from '../types';

export class AuthService {
  private static formatUser(user: User | null): AuthUser | null {
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Explorer',
      photoURL:
        user.photoURL ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      isAnonymous: user.isAnonymous,
    };
  }

  static async signUpWithEmail(
    email: string,
    pass: string,
    displayName?: string
  ): Promise<AuthUser> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName && cred.user) {
      await updateProfile(cred.user, { displayName });
    }
    return this.formatUser(cred.user)!;
  }

  static async signInWithEmail(email: string, pass: string): Promise<AuthUser> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return this.formatUser(cred.user)!;
  }

  static async signInWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return this.formatUser(cred.user)!;
  }

  static async signInAnonymously(): Promise<AuthUser> {
    const cred = await signInAnonymously(auth);
    return this.formatUser(cred.user)!;
  }

  static async signOutUser(): Promise<void> {
    await signOut(auth);
  }

  static subscribeToAuth(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(this.formatUser(user));
    });
  }

  static getCurrentUser(): AuthUser | null {
    return this.formatUser(auth.currentUser);
  }
}

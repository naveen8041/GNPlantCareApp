import { User } from '@/types/Plant';

export class AuthService {
  private static currentUser: User | null = null;

  static async register(userData: {
    name: string;
    email: string;
    phone: string;
    nurseryName: string;
    password: string;
  }): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      nurseryName: userData.nurseryName,
      registrationDate: new Date(),
    };
    
    this.currentUser = user;
    return user;
  }

  static async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user for demo
    const user: User = {
      id: '1',
      name: 'Gandhi Nursery Owner',
      email: email,
      phone: '+91 9876543210',
      nurseryName: 'Gandhi Nursery',
      registrationDate: new Date('2024-01-01'),
    };
    
    this.currentUser = user;
    return user;
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static logout(): void {
    this.currentUser = null;
  }

  static isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}
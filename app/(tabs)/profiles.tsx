import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/AuthService';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [user] = useState(AuthService.getCurrentUser());

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            AuthService.logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  const menuItems = [
    {
      id: '1',
      title: 'Plant Care Guide',
      icon: 'book-outline',
      subtitle: 'Learn about plant care',
      onPress: () => {},
    },
    {
      id: '2',
      title: 'Notifications',
      icon: 'notifications-outline',
      subtitle: 'Manage your reminders',
      onPress: () => {},
    },
    {
      id: '3',
      title: 'Settings',
      icon: 'settings-outline',
      subtitle: 'App preferences',
      onPress: () => {},
    },
    {
      id: '4',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      subtitle: 'Get help and support',
      onPress: () => {},
    },
    {
      id: '5',
      title: 'About',
      icon: 'information-circle-outline',
      subtitle: 'App information',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.nurseryName}>{user.nurseryName}</Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>27</Text>
          <Text style={styles.statLabel}>Plants</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>142</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>95%</Text>
          <Text style={styles.statLabel}>Health Rate</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Gandhi Nursery Plant Care v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2025 Gandhi Nursery. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  nurseryName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 16,
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.gray,
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/AuthService';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    if (!user) {
      // Show login screen if not authenticated
      router.push('/auth/login');
    }
  }, [user]);

  const features = [
    {
      id: '1',
      title: 'Identify Plants',
      description: 'Use AI to identify plants from photos',
      icon: 'camera',
      route: '/identify',
      color: Colors.primary,
    },
    {
      id: '2',
      title: 'Health Diagnosis',
      description: 'Diagnose plant health issues',
      icon: 'medical',
      route: '/diagnose',
      color: Colors.error,
    },
    {
      id: '3',
      title: 'My Plants',
      description: 'Manage your plant collection',
      icon: 'leaf',
      route: '/plants',
      color: Colors.success,
    },
    {
      id: '4',
      title: 'Care Schedule',
      description: 'Track watering and treatments',
      icon: 'calendar',
      route: '/schedule',
      color: Colors.accent,
    },
  ];

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.nurseryName}>{user.nurseryName}</Text>
        </View>
  <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profiles')}>
          <Ionicons name="person-circle" size={40} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg' }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Gandhi Nursery</Text>
          <Text style={styles.heroSubtitle}>Plant Care Made Smart</Text>
        </View>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Ionicons name="leaf" size={24} color={Colors.success} />
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Healthy Plants</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="warning" size={24} color={Colors.warning} />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Need Attention</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="water" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Due for Watering</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { borderLeftColor: feature.color }]}
              onPress={() => router.push(feature.route as any)}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Ionicons name={feature.icon as any} size={24} color="white" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        <View style={styles.taskCard}>
          <View style={styles.taskIcon}>
            <Ionicons name="water" size={20} color={Colors.primary} />
          </View>
          <View style={styles.taskContent}>
            <Text style={styles.taskTitle}>Water 5 plants</Text>
            <Text style={styles.taskTime}>Due in 2 hours</Text>
          </View>
          <TouchableOpacity style={styles.taskButton}>
            <Text style={styles.taskButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskCard}>
          <View style={[styles.taskIcon, { backgroundColor: Colors.organic }]}>
            <Ionicons name="medical" size={20} color="white" />
          </View>
          <View style={styles.taskContent}>
            <Text style={styles.taskTitle}>Apply neem oil treatment</Text>
            <Text style={styles.taskTime}>Monstera, Peace Lily</Text>
          </View>
          <TouchableOpacity style={styles.taskButton}>
            <Text style={styles.taskButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  nurseryName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  profileButton: {
    padding: 8,
  },
  heroSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 150,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  quickStats: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  featuresGrid: {
    paddingHorizontal: 20,
  },
  featureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  taskCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  taskTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  taskButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  taskButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
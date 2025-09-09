import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Plant, ScheduleItem } from '@/types/Plant';

// Mock data for demonstration - in real app, this would come from database
const mockPlant: Plant = {
  id: '1',
  name: 'Monstera Deliciosa',
  scientificName: 'Monstera deliciosa',
  image: 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg',
  healthStatus: 'warning',
  lastWatered: new Date('2025-01-14'),
  nextWatering: new Date('2025-01-16'),
  diseases: [
    {
      id: 'spider_mites',
      name: 'Spider Mites',
      severity: 'moderate',
      symptoms: ['Fine webbing on leaves', 'Yellowing spots'],
      description: 'Small arachnids affecting plant health',
      organicTreatment: {
        medicine: 'Insecticidal Soap',
        dosage: '30ml per liter',
        frequency: 'Every 3 days',
        duration: '2-3 weeks',
        instructions: 'Spray thoroughly on both sides of leaves'
      },
      chemicalTreatment: {
        medicine: 'Miticide (Abamectin)',
        dosage: '0.5ml per liter',
        frequency: 'Weekly',
        duration: '2 weeks',
        instructions: 'Apply during evening hours'
      }
    }
  ],
  careSchedule: {
    watering: [
      {
        id: '1',
        type: 'watering',
        name: 'Regular Watering',
        nextDue: new Date('2025-01-16'),
        frequency: 'Every 2-3 days',
        notes: 'Check soil moisture before watering',
        completed: false
      }
    ],
    medicine: [
      {
        id: '2',
        type: 'medicine',
        name: 'Insecticidal Soap Treatment',
        nextDue: new Date('2025-01-17'),
        frequency: 'Every 3 days',
        notes: 'For spider mite treatment',
        completed: false
      }
    ],
    pesticide: [
      {
        id: '3',
        type: 'pesticide',
        name: 'Preventive Neem Oil',
        nextDue: new Date('2025-01-21'),
        frequency: 'Weekly',
        notes: 'General pest prevention',
        completed: false
      }
    ]
  },
  addedDate: new Date('2025-01-01'),
};

export default function PlantDetailScreen() {
  const params = useLocalSearchParams();
  const { plantId } = params;
  
  const [plant] = useState<Plant>(mockPlant); // In real app, fetch by plantId
  const [activeTab, setActiveTab] = useState<'schedule' | 'health'>('schedule');

  const getHealthColor = () => {
    switch (plant.healthStatus) {
      case 'healthy':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'critical':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  const getHealthIcon = () => {
    switch (plant.healthStatus) {
      case 'healthy':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case 'watering':
        return 'water';
      case 'medicine':
        return 'medical';
      case 'pesticide':
        return 'shield';
      default:
        return 'time';
    }
  };

  const getScheduleColor = (type: string) => {
    switch (type) {
      case 'watering':
        return Colors.primary;
      case 'medicine':
        return Colors.organic;
      case 'pesticide':
        return Colors.warning;
      default:
        return Colors.gray;
    }
  };

  const markTaskComplete = (taskId: string) => {
    Alert.alert(
      'Mark Complete',
      'Mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            Alert.alert('Success', 'Task marked as completed!');
            // In real app, update the task status
          },
        },
      ]
    );
  };

  const addNewTask = () => {
    Alert.alert(
      'Add New Task',
      'What type of task would you like to add?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Watering', onPress: () => Alert.alert('Success', 'Watering task added!') },
        { text: 'Medicine', onPress: () => Alert.alert('Success', 'Medicine task added!') },
        { text: 'Pesticide', onPress: () => Alert.alert('Success', 'Pesticide task added!') },
      ]
    );
  };

  const allScheduleItems = [
    ...plant.careSchedule.watering,
    ...plant.careSchedule.medicine,
    ...plant.careSchedule.pesticide,
  ].sort((a, b) => a.nextDue.getTime() - b.nextDue.getTime());

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.plantHeader}>
        <Image source={{ uri: plant.image }} style={styles.plantImage} />
        <View style={styles.plantOverlay}>
          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={styles.scientificName}>{plant.scientificName}</Text>
          </View>
          <View style={[styles.healthBadge, { backgroundColor: getHealthColor() }]}>
            <Ionicons name={getHealthIcon()} size={20} color="white" />
            <Text style={styles.healthText}>{plant.healthStatus.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>{Math.floor((new Date().getTime() - plant.addedDate.getTime()) / (1000 * 60 * 60 * 24))}</Text>
          <Text style={styles.statLabel}>Days in care</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="water" size={24} color={Colors.success} />
          <Text style={styles.statNumber}>{formatDate(plant.nextWatering)}</Text>
          <Text style={styles.statLabel}>Next watering</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="medical" size={24} color={plant.diseases && plant.diseases.length > 0 ? Colors.error : Colors.success} />
          <Text style={styles.statNumber}>{plant.diseases ? plant.diseases.length : 0}</Text>
          <Text style={styles.statLabel}>Health issues</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
          onPress={() => setActiveTab('schedule')}
        >
          <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>
            Care Schedule
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'health' && styles.activeTab]}
          onPress={() => setActiveTab('health')}
        >
          <Text style={[styles.tabText, activeTab === 'health' && styles.activeTabText]}>
            Health Status
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'schedule' ? (
        <View style={styles.scheduleSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            <TouchableOpacity style={styles.addButton} onPress={addNewTask}>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {allScheduleItems.map((item) => (
            <View key={item.id} style={styles.taskCard}>
              <View style={[styles.taskIcon, { backgroundColor: getScheduleColor(item.type) }]}>
                <Ionicons name={getScheduleIcon(item.type)} size={20} color="white" />
              </View>
              <View style={styles.taskContent}>
                <Text style={styles.taskName}>{item.name}</Text>
                <Text style={styles.taskFrequency}>{item.frequency}</Text>
                <Text style={styles.taskDue}>Due: {formatDate(item.nextDue)}</Text>
                {item.notes && (
                  <Text style={styles.taskNotes}>{item.notes}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => markTaskComplete(item.id)}
              >
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          ))}

          {allScheduleItems.length === 0 && (
            <View style={styles.emptySchedule}>
              <Ionicons name="calendar-outline" size={60} color={Colors.gray} />
              <Text style={styles.emptyTitle}>No scheduled tasks</Text>
              <Text style={styles.emptyText}>Add care tasks to keep your plant healthy</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.healthSection}>
          {plant.diseases && plant.diseases.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Health Issues ({plant.diseases.length})</Text>
              {plant.diseases.map((disease) => (
                <View key={disease.id} style={styles.diseaseCard}>
                  <View style={styles.diseaseHeader}>
                    <Text style={styles.diseaseName}>{disease.name}</Text>
                    <View style={[styles.severityBadge, { 
                      backgroundColor: disease.severity === 'mild' ? Colors.success : 
                                     disease.severity === 'moderate' ? Colors.warning : Colors.error 
                    }]}>
                      <Text style={styles.severityText}>{disease.severity.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.diseaseDescription}>{disease.description}</Text>
                  
                  <TouchableOpacity
                    style={styles.treatmentButton}
                    onPress={() => router.push({
                      pathname: '/diagnose',
                      params: { 
                        imageUri: plant.image, 
                        plantName: plant.name,
                        scientificName: plant.scientificName 
                      }
                    })}
                  >
                    <Ionicons name="medical" size={16} color="white" />
                    <Text style={styles.treatmentButtonText}>View Treatments</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.healthyStatus}>
              <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
              <Text style={styles.healthyTitle}>Plant is Healthy!</Text>
              <Text style={styles.healthyText}>No health issues detected. Continue with regular care.</Text>
              
              <TouchableOpacity
                style={styles.checkHealthButton}
                onPress={() => router.push({
                  pathname: '/diagnose',
                  params: { 
                    imageUri: plant.image, 
                    plantName: plant.name,
                    scientificName: plant.scientificName 
                  }
                })}
              >
                <Ionicons name="camera" size={16} color="white" />
                <Text style={styles.checkHealthButtonText}>Check Health Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  plantHeader: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  plantImage: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.lightGray,
  },
  plantOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  healthText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: 'white',
  },
  scheduleSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  taskFrequency: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  taskDue: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
  },
  taskNotes: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  completeButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptySchedule: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  healthSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  diseaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  diseaseDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  treatmentButton: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  treatmentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  healthyStatus: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  healthyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  healthyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  checkHealthButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  checkHealthButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
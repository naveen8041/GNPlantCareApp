import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Plant } from '@/types/Plant';
import PlantCard from '@/components/PlantCard';
import { router } from 'expo-router';

// Mock data for demonstration
const mockPlants: Plant[] = [
  {
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
      watering: [],
      medicine: [],
      pesticide: []
    },
    addedDate: new Date('2025-01-01'),
  },
  {
    id: '2',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    image: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg',
    healthStatus: 'healthy',
    lastWatered: new Date('2025-01-10'),
    nextWatering: new Date('2025-01-17'),
    careSchedule: {
      watering: [],
      medicine: [],
      pesticide: []
    },
    addedDate: new Date('2025-01-02'),
  },
  {
    id: '3',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    image: 'https://images.pexels.com/photos/4503267/pexels-photo-4503267.jpeg',
    healthStatus: 'critical',
    lastWatered: new Date('2025-01-13'),
    nextWatering: new Date('2025-01-15'),
    diseases: [
      {
        id: 'root_rot',
        name: 'Root Rot',
        severity: 'severe',
        symptoms: ['Yellowing leaves', 'Soft roots', 'Foul odor'],
        description: 'Serious fungal infection affecting roots',
        organicTreatment: {
          medicine: 'Neem Oil Solution',
          dosage: '2 tablespoons per liter',
          frequency: 'Weekly',
          duration: '4-6 weeks',
          instructions: 'Remove affected roots, repot in fresh soil'
        },
        chemicalTreatment: {
          medicine: 'Fungicide (Carbendazim)',
          dosage: '1g per liter',
          frequency: 'Bi-weekly',
          duration: '3-4 weeks',
          instructions: 'Drench soil completely'
        }
      }
    ],
    careSchedule: {
      watering: [],
      medicine: [],
      pesticide: []
    },
    addedDate: new Date('2025-01-03'),
  },
];

export default function PlantsScreen() {
  const [plants] = useState<Plant[]>(mockPlants);
  const [filter, setFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');

  const filteredPlants = plants.filter(plant => 
    filter === 'all' || plant.healthStatus === filter
  );

  const getFilterColor = (filterType: string) => {
    switch (filterType) {
      case 'healthy':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'critical':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const handlePlantPress = (plant: Plant) => {
    router.push({
      pathname: '/plant-detail',
      params: { plantId: plant.id }
    });
  };

  const filters = [
    { key: 'all', label: 'All Plants', count: plants.length },
    { key: 'healthy', label: 'Healthy', count: plants.filter(p => p.healthStatus === 'healthy').length },
    { key: 'warning', label: 'Warning', count: plants.filter(p => p.healthStatus === 'warning').length },
    { key: 'critical', label: 'Critical', count: plants.filter(p => p.healthStatus === 'critical').length },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Plants</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/identify')}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === item.key && {
                  backgroundColor: getFilterColor(item.key),
                  borderColor: getFilterColor(item.key),
                }
              ]}
              onPress={() => setFilter(item.key as any)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item.key && styles.filterTextActive
                ]}
              >
                {item.label} ({item.count})
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {filteredPlants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={80} color={Colors.gray} />
          <Text style={styles.emptyTitle}>No plants found</Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'all' 
              ? 'Add your first plant to get started'
              : `No plants with ${filter} status`
            }
          </Text>
          {filter === 'all' && (
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/identify')}
            >
              <Text style={styles.emptyButtonText}>Identify Plant</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.plantsList}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              onPress={() => handlePlantPress(item)}
            />
          )}
        />
      )}
    </View>
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
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.surface,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  plantsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
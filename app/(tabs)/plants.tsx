import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Plant } from '@/types/Plant';
import PlantCard from '@/components/PlantCard';
import { router } from 'expo-router';
import { PlantService } from '@/services/PlantService';
import { AuthService } from '@/services/AuthService';

// ...existing code...

export default function PlantsScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filter, setFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [loading, setLoading] = useState(true);
  const user = AuthService.getCurrentUser();
  // Use user.id if uid is not available
  const userId = user?.id;

  useEffect(() => {
    const fetchPlants = async () => {
  if (!userId) return;
      setLoading(true);
      try {
        const data = await PlantService.getPlants(userId);
        setPlants(data);
      } catch (error) {
        // Handle error (show alert, etc.)
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [user]);

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

      {loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="leaf-outline" size={80} color={Colors.gray} />
          <Text style={styles.emptyTitle}>Loading plants...</Text>
        </View>
      ) : filteredPlants.length === 0 ? (
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
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Plant } from '@/types/Plant';

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
}

export default function PlantCard({ plant, onPress }: PlantCardProps) {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: plant.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{plant.name}</Text>
          <View style={[styles.healthBadge, { backgroundColor: getHealthColor() }]}>
            <Ionicons name={getHealthIcon()} size={16} color="white" />
          </View>
        </View>
        <Text style={styles.scientificName}>{plant.scientificName}</Text>
        <View style={styles.scheduleInfo}>
          <Ionicons name="water" size={16} color={Colors.primary} />
          <Text style={styles.scheduleText}>
            Next watering: {plant.nextWatering.toLocaleDateString()}
          </Text>
        </View>
        {plant.diseases && plant.diseases.length > 0 && (
          <View style={styles.diseaseInfo}>
            <Ionicons name="medical" size={16} color={Colors.error} />
            <Text style={styles.diseaseText}>
              {plant.diseases.length} issue{plant.diseases.length > 1 ? 's' : ''} detected
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.lightGray,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  healthBadge: {
    padding: 4,
    borderRadius: 12,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  diseaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diseaseText: {
    fontSize: 14,
    color: Colors.error,
    marginLeft: 8,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Treatment } from '@/types/Plant';

interface TreatmentCardProps {
  treatment: Treatment;
  type: 'organic' | 'chemical';
  onSelect: () => void;
}

export default function TreatmentCard({ treatment, type, onSelect }: TreatmentCardProps) {
  const isOrganic = type === 'organic';
  
  return (
    <TouchableOpacity style={styles.card} onPress={onSelect}>
      <View style={styles.header}>
        <View style={[styles.typeBadge, { backgroundColor: isOrganic ? Colors.organic : Colors.chemical }]}>
          <Ionicons 
            name={isOrganic ? "leaf" : "flask"} 
            size={16} 
            color="white" 
          />
          <Text style={styles.typeText}>
            {isOrganic ? 'Organic' : 'Chemical'}
          </Text>
        </View>
        {treatment.price && (
          <Text style={styles.price}>{treatment.price}</Text>
        )}
      </View>
      
      <Text style={styles.medicine}>{treatment.medicine}</Text>
      
      <View style={styles.detailRow}>
        <Ionicons name="eyedrop" size={16} color={Colors.textSecondary} />
        <Text style={styles.detail}>Dosage: {treatment.dosage}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Ionicons name="time" size={16} color={Colors.textSecondary} />
        <Text style={styles.detail}>Frequency: {treatment.frequency}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Ionicons name="calendar" size={16} color={Colors.textSecondary} />
        <Text style={styles.detail}>Duration: {treatment.duration}</Text>
      </View>
      
      <Text style={styles.instructions}>{treatment.instructions}</Text>
      
      <View style={styles.selectButton}>
        <Text style={styles.selectText}>Select Treatment</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
  },
  medicine: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  instructions: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 20,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  selectText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
});
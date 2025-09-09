import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Disease } from '@/types/Plant';
import { PlantService } from '@/services/PlantService';
import TreatmentCard from '@/components/TreatmentCard';

export default function DiagnoseScreen() {
  const params = useLocalSearchParams();
  const { imageUri, plantName, scientificName } = params;
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  useEffect(() => {
    if (imageUri && !diseases.length) {
      analyzePlantHealth();
    }
  }, [imageUri]);

  const analyzePlantHealth = async () => {
    setIsAnalyzing(true);
    try {
      const detectedDiseases = await PlantService.diagnosePlantHealth(imageUri as string, plantName as string);
      setDiseases(detectedDiseases);
      if (detectedDiseases.length > 0) {
        setSelectedDisease(detectedDiseases[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze plant health. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return Colors.success;
      case 'moderate':
        return Colors.warning;
      case 'severe':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'checkmark-circle';
      case 'moderate':
        return 'warning';
      case 'severe':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const handleTreatmentSelect = (treatment: any, type: 'organic' | 'chemical') => {
    Alert.alert(
      'Treatment Selected',
      `You have selected ${type} treatment: ${treatment.medicine}\n\nWould you like to add this to your plant's care schedule?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Schedule', 
          onPress: () => {
            Alert.alert('Success', 'Treatment added to care schedule!');
            router.back();
          }
        },
      ]
    );
  };

  if (isAnalyzing) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Ionicons name="medical" size={80} color={Colors.primary} />
          <Text style={styles.loadingTitle}>Analyzing Plant Health</Text>
          <Text style={styles.loadingText}>Our AI is examining your plant for any health issues...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Health Diagnosis</Text>
      </View>

      {imageUri && (
        <View style={styles.imageSection}>
          <Image source={{ uri: imageUri as string }} style={styles.plantImage} />
          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>{plantName}</Text>
            {scientificName && (
              <Text style={styles.scientificName}>{scientificName}</Text>
            )}
          </View>
        </View>
      )}

      {diseases.length === 0 ? (
        <View style={styles.healthyContainer}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
          <Text style={styles.healthyTitle}>Plant Looks Healthy!</Text>
          <Text style={styles.healthyText}>
            No major health issues detected. Continue with regular care routine.
          </Text>
          <TouchableOpacity 
            style={styles.preventiveButton}
            onPress={() => {
              Alert.alert('Preventive Care', 'Would you like to set up preventive care reminders?');
            }}
          >
            <Text style={styles.preventiveButtonText}>Set Preventive Care</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.diagnosisSection}>
            <Text style={styles.sectionTitle}>Detected Issues ({diseases.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diseaseList}>
              {diseases.map((disease, index) => (
                <TouchableOpacity
                  key={disease.id}
                  style={[
                    styles.diseaseTab,
                    selectedDisease?.id === disease.id && styles.diseaseTabActive
                  ]}
                  onPress={() => setSelectedDisease(disease)}
                >
                  <View style={[styles.severityIcon, { backgroundColor: getSeverityColor(disease.severity) }]}>
                    <Ionicons 
                      name={getSeverityIcon(disease.severity)} 
                      size={16} 
                      color="white" 
                    />
                  </View>
                  <Text 
                    style={[
                      styles.diseaseTabText,
                      selectedDisease?.id === disease.id && styles.diseaseTabTextActive
                    ]}
                  >
                    {disease.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {selectedDisease && (
            <View style={styles.diseaseDetails}>
              <View style={styles.diseaseHeader}>
                <Text style={styles.diseaseName}>{selectedDisease.name}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(selectedDisease.severity) }]}>
                  <Text style={styles.severityText}>{selectedDisease.severity.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.diseaseDescription}>{selectedDisease.description}</Text>

              <View style={styles.symptomsSection}>
                <Text style={styles.subsectionTitle}>Symptoms</Text>
                {selectedDisease.symptoms.map((symptom, index) => (
                  <View key={index} style={styles.symptomItem}>
                    <Ionicons name="ellipse" size={8} color={Colors.textSecondary} />
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.treatmentsSection}>
                <Text style={styles.subsectionTitle}>Treatment Options</Text>
                
                <TreatmentCard
                  treatment={selectedDisease.organicTreatment}
                  type="organic"
                  onSelect={() => handleTreatmentSelect(selectedDisease.organicTreatment, 'organic')}
                />

                <TreatmentCard
                  treatment={selectedDisease.chemicalTreatment}
                  type="chemical"
                  onSelect={() => handleTreatmentSelect(selectedDisease.chemicalTreatment, 'chemical')}
                />
              </View>
            </View>
          )}
        </>
      )}
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
    paddingHorizontal: 40,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  imageSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  plantImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    marginBottom: 12,
  },
  plantInfo: {
    alignItems: 'center',
  },
  plantName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  healthyContainer: {
    alignItems: 'center',
    padding: 40,
    margin: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    lineHeight: 22,
    marginBottom: 24,
  },
  preventiveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  preventiveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  diagnosisSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  diseaseList: {
    paddingHorizontal: 20,
  },
  diseaseTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  diseaseTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  diseaseTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  diseaseTabTextActive: {
    color: 'white',
  },
  severityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diseaseDetails: {
    backgroundColor: Colors.surface,
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: '700',
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
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  symptomsSection: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  treatmentsSection: {
    // No specific styles needed as TreatmentCard handles its own styling
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import { PlantService } from '@/services/PlantService';
import { router } from 'expo-router';

export default function IdentifyScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your camera to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const identification = await PlantService.identifyPlant(selectedImage);
      setResult(identification);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const diagnoseHealth = () => {
    if (selectedImage && result) {
      router.push({
        pathname: '/plants', // Use a valid route, or update to your diagnose route if available
        params: { 
          imageUri: selectedImage, 
          plantName: result.name,
          scientificName: result.scientificName 
        }
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Plant Identifier</Text>
        <Text style={styles.subtitle}>Take a photo or select from gallery to identify plants</Text>
      </View>

      <View style={styles.imageSection}>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={32} color={Colors.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="camera-outline" size={80} color={Colors.gray} />
            <Text style={styles.placeholderText}>Select an image to identify the plant</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.imageButton, styles.galleryButton]} onPress={pickImage}>
          <Ionicons name="images" size={24} color="white" />
          <Text style={styles.buttonText}>From Gallery</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && !result && (
        <TouchableOpacity 
          style={styles.analyzeButton} 
          onPress={analyzeImage}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Analyzing image...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="search" size={24} color="white" />
              <Text style={styles.buttonText}>Identify Plant</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>Plant Identified!</Text>
              <Text style={styles.confidenceText}>Confidence: {result.confidence}%</Text>
            </View>
          </View>

          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>{result.name}</Text>
            <Text style={styles.scientificName}>{result.scientificName}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={diagnoseHealth}>
              <Ionicons name="medical" size={20} color="white" />
              <Text style={styles.actionButtonText}>Check Health</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.addButton]}
              onPress={() => {
                // Add to my plants logic would go here
                Alert.alert('Success', 'Plant added to your collection!');
              }}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.actionButtonText}>Add to Plants</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Tips for better identification:</Text>
        <View style={styles.tip}>
          <Ionicons name="checkmark" size={16} color={Colors.success} />
          <Text style={styles.tipText}>Take clear, well-lit photos</Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="checkmark" size={16} color={Colors.success} />
          <Text style={styles.tipText}>Include leaves, flowers, or distinctive features</Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="checkmark" size={16} color={Colors.success} />
          <Text style={styles.tipText}>Avoid blurry or distant shots</Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="checkmark" size={16} color={Colors.success} />
          <Text style={styles.tipText}>Clean the camera lens for best results</Text>
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
  header: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  imageSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.lightGray,
  },
  changeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  placeholderContainer: {
    height: 300,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  galleryButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: Colors.accent,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultInfo: {
    marginLeft: 12,
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  confidenceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  plantInfo: {
    marginBottom: 20,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.error,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addButton: {
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
});
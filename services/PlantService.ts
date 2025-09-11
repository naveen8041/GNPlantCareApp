import { Plant, Disease, Treatment } from '@/types/Plant';
import { FirebaseService } from './FirebaseService';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';


export class PlantService {
  // Add a plant to Firestore
  static async addPlant(plant: Plant) {
    return await FirebaseService.addPlant(plant);
  }

  // Get all plants for a user from Firestore
  static async getPlants(userId: string): Promise<Plant[]> {
    const plants = await FirebaseService.getPlants(userId);
    // Ensure returned objects match Plant type
    return plants.map((p: any) => ({
      id: p.id,
      name: p.name,
      scientificName: p.scientificName,
      image: p.image,
      healthStatus: p.healthStatus,
      lastWatered: p.lastWatered,
      nextWatering: p.nextWatering,
      diseases: p.diseases || [],
      careSchedule: p.careSchedule || [],
      addedDate: p.addedDate ? new Date(p.addedDate) : new Date(),
    }));
  }

  // Update a plant in Firestore
  static async updatePlant(plantId: string, data: Partial<Plant>) {
    const plantRef = doc(FirebaseService.db, 'plants', plantId);
    await updateDoc(plantRef, data);
  }

  // Delete a plant from Firestore
  static async deletePlant(plantId: string) {
    const plantRef = doc(FirebaseService.db, 'plants', plantId);
    await deleteDoc(plantRef);
  }

  // Add more Firestore CRUD methods for diseases, treatments, schedules, diagnoses as needed
  // Example: getDiseases, addDiagnosis, etc.
}
import { Plant, Disease, Treatment } from '@/types/Plant';

// Mock plant database
const plantDatabase = [
  {
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    commonDiseases: ['root_rot', 'spider_mites', 'fungal_infection']
  },
  {
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    commonDiseases: ['overwatering', 'root_rot', 'mealybugs']
  },
  {
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    commonDiseases: ['brown_tips', 'root_rot', 'aphids']
  },
  {
    name: 'Rubber Tree',
    scientificName: 'Ficus elastica',
    commonDiseases: ['scale_insects', 'leaf_drop', 'spider_mites']
  },
  {
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    commonDiseases: ['root_rot', 'bacterial_infection', 'spider_mites']
  }
];

const diseaseDatabase: { [key: string]: Disease } = {
  root_rot: {
    id: 'root_rot',
    name: 'Root Rot',
    severity: 'severe',
    symptoms: ['Yellowing leaves', 'Soft, mushy roots', 'Foul odor', 'Wilting despite moist soil'],
    description: 'A serious fungal infection that affects the root system, often caused by overwatering.',
    organicTreatment: {
      medicine: 'Neem Oil Solution',
      dosage: '2 tablespoons per liter of water',
      frequency: 'Weekly application',
      duration: '4-6 weeks',
      instructions: 'Remove affected roots, repot in fresh soil, apply neem oil to roots and soil surface',
      price: '₹250'
    },
    chemicalTreatment: {
      medicine: 'Fungicide (Carbendazim)',
      dosage: '1g per liter of water',
      frequency: 'Bi-weekly application',
      duration: '3-4 weeks',
      instructions: 'Drench soil completely, ensure good drainage after treatment',
      price: '₹180'
    }
  },
  spider_mites: {
    id: 'spider_mites',
    name: 'Spider Mites',
    severity: 'moderate',
    symptoms: ['Fine webbing on leaves', 'Yellowing spots', 'Leaves falling off', 'Tiny moving dots'],
    description: 'Small arachnids that feed on plant sap, causing significant damage if left untreated.',
    organicTreatment: {
      medicine: 'Insecticidal Soap',
      dosage: '30ml per liter of water',
      frequency: 'Every 3 days',
      duration: '2-3 weeks',
      instructions: 'Spray thoroughly on both sides of leaves, focus on undersides',
      price: '₹320'
    },
    chemicalTreatment: {
      medicine: 'Miticide (Abamectin)',
      dosage: '0.5ml per liter of water',
      frequency: 'Weekly application',
      duration: '2 weeks',
      instructions: 'Spray during evening hours, avoid direct sunlight',
      price: '₹450'
    }
  },
  fungal_infection: {
    id: 'fungal_infection',
    name: 'Fungal Leaf Spot',
    severity: 'mild',
    symptoms: ['Dark spots on leaves', 'Yellowing around spots', 'Leaf distortion', 'Premature leaf drop'],
    description: 'Fungal infection causing spotted leaves, usually due to high humidity and poor air circulation.',
    organicTreatment: {
      medicine: 'Baking Soda Solution',
      dosage: '5g per liter of water',
      frequency: 'Twice weekly',
      duration: '3 weeks',
      instructions: 'Spray on affected areas, improve air circulation around plant',
      price: '₹150'
    },
    chemicalTreatment: {
      medicine: 'Copper Fungicide',
      dosage: '2g per liter of water',
      frequency: 'Weekly application',
      duration: '2-3 weeks',
      instructions: 'Apply during cooler hours, ensure complete coverage of affected areas',
      price: '₹280'
    }
  }
};

export class PlantService {
  static async identifyPlant(imageUri: string): Promise<{ name: string; scientificName: string; confidence: number }> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI plant identification
    const randomPlant = plantDatabase[Math.floor(Math.random() * plantDatabase.length)];
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-100% confidence
    
    return {
      name: randomPlant.name,
      scientificName: randomPlant.scientificName,
      confidence
    };
  }

  static async diagnosePlantHealth(imageUri: string, plantName?: string): Promise<Disease[]> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock health analysis
    const possibleDiseases = Object.keys(diseaseDatabase);
    const numberOfDiseases = Math.floor(Math.random() * 2) + 1; // 1-2 diseases
    
    const detectedDiseases: Disease[] = [];
    
    for (let i = 0; i < numberOfDiseases; i++) {
      const randomDisease = possibleDiseases[Math.floor(Math.random() * possibleDiseases.length)];
      if (!detectedDiseases.find(d => d.id === randomDisease)) {
        detectedDiseases.push(diseaseDatabase[randomDisease]);
      }
    }
    
    return detectedDiseases;
  }

  static generateCareSchedule(plantName: string): any {
    const now = new Date();
    
    return {
      watering: [
        {
          id: '1',
          type: 'watering',
          name: 'Regular Watering',
          nextDue: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          frequency: 'Every 2-3 days',
          notes: 'Check soil moisture before watering',
          completed: false
        }
      ],
      medicine: [
        {
          id: '2',
          type: 'medicine',
          name: 'Neem Oil Treatment',
          nextDue: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          frequency: 'Weekly',
          notes: 'Preventive treatment for pests',
          completed: false
        }
      ],
      pesticide: [
        {
          id: '3',
          type: 'pesticide',
          name: 'General Insecticide',
          nextDue: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
          frequency: 'Bi-weekly',
          notes: 'Apply during evening hours',
          completed: false
        }
      ]
    };
  }
}
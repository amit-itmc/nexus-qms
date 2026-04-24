import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Deviation, ChangeControl, CAPA, Risk } from '../types';

export const qmsService = {
  // Deviations
  subscribeToDeviations: (callback: (data: Deviation[]) => void) => {
    const q = query(collection(db, 'deviations'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deviation));
      callback(data);
    });
  },
  createDeviation: async (data: Partial<Deviation>) => {
    return await addDoc(collection(db, 'deviations'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },
  updateDeviation: async (id: string, data: Partial<Deviation>) => {
    const docRef = doc(db, 'deviations', id);
    return await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },

  // Change Controls
  subscribeToChangeControls: (callback: (data: ChangeControl[]) => void) => {
    const q = query(collection(db, 'changeControls'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChangeControl));
      callback(data);
    });
  },
  createChangeControl: async (data: Partial<ChangeControl>) => {
    return await addDoc(collection(db, 'changeControls'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  // CAPA
  subscribeToCAPAs: (callback: (data: CAPA[]) => void) => {
    const q = query(collection(db, 'capas'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CAPA));
      callback(data);
    });
  },
  createCAPA: async (data: Partial<CAPA>) => {
    return await addDoc(collection(db, 'capas'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  // Risks
  subscribeToRisks: (callback: (data: Risk[]) => void) => {
    const q = query(collection(db, 'risks'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Risk));
      callback(data);
    });
  },
  createRisk: async (data: Partial<Risk>) => {
    return await addDoc(collection(db, 'risks'), {
      ...data,
      createdAt: serverTimestamp()
    });
  },

  // Seed Dummy Data
  seedData: async (userId: string) => {
    const thirtyDaysOut = new Date();
    thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 30);

    // Seed Deviations
    const deviationsToSeed = [
      {
        title: 'Temperature Excursion in Warehouse 4',
        description: 'Zone B sensors triggered at 8.2°C (Limit: 2-8°C) for 45 minutes.',
        category: 'Major',
        status: 'Open',
        createdBy: userId,
        attachments: [],
        slaDeadline: Timestamp.fromDate(thirtyDaysOut),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Incorrect Labeling on Batch #7743',
        description: 'Human error during primary packaging led to mix-up with batch #7744 expiration dates.',
        category: 'Critical',
        status: 'Investigation',
        createdBy: userId,
        attachments: [],
        slaDeadline: Timestamp.fromDate(thirtyDaysOut),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: 'Filter Integrity Test Failure',
        description: 'Post-production integrity test for 0.2 micron filter failed initial pressure hold.',
        category: 'Minor',
        status: 'Closed',
        createdBy: userId,
        attachments: [],
        slaDeadline: Timestamp.fromDate(thirtyDaysOut),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    for (const d of deviationsToSeed) {
      await addDoc(collection(db, 'deviations'), d);
    }

    // Seed CAPAs
    const capasToSeed = [
      {
        title: 'Upgrade HVAC monitoring system',
        description: 'Install redundant sensors in Warehouse 4 to prevent excursion lag.',
        sourceType: 'Deviation',
        sourceId: 'N/A',
        status: 'Open',
        priority: 'High',
        assignedTo: userId,
        dueDate: Timestamp.fromDate(thirtyDaysOut),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    for (const c of capasToSeed) {
      await addDoc(collection(db, 'capas'), c);
    }

    return true;
  }
};

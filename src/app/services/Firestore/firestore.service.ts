import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  // This method returns a Promise
  async getCollection(Patients: string): Promise<any[]> {
    // Get the snapshot
    const snapshot = await this.firestore.collection(Patients).get().toPromise();

    // Check if snapshot exists and is defined
    if (!snapshot) {
      throw new Error('No data found');
    }

    // Map through docs, ensuring data() returns an object
    return snapshot.docs.map(doc => {
      const data = doc.data();
      if (data && typeof data === 'object') {
        return { id: doc.id, ...data };
      }
      return { id: doc.id }; // Fallback in case data is not an object
    });
  }
}

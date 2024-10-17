import { Component } from '@angular/core';
import { FirestoreService } from '../../services/Firestore/firestore.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  Patients: any[] = [];
  
  // Color mapping based on priority
  priorityColors = {
    high: '#F95454',  // Red
    mid: '#FFEB55',   // Yellow
    low: '#118DF0'    // Blue
  };

  constructor(private firestoreService: FirestoreService) {
    this.firestoreService.getCollection('Patients').subscribe(data => {
      this.Patients = data.map(patient => {
        patient.highPriorityScore = this.calculatePriorityScore(patient.vitals);
        patient.priorityColor = this.getPriorityColor(patient.highPriorityScore); // Assign color
        return patient;
      });
      console.log('Patients with Scores and Colors:', this.Patients);
    });
  }

  calculatePriorityScore(vitals: any): number {
    let score = 0;
    
    // Pulse
    if (vitals.pulse < 60 || vitals.pulse > 100) {
      score += 2;
    }

    // Blood Pressure
    const systolic = vitals.bloodPressure.systolic;
    const diastolic = vitals.bloodPressure.diastolic;
    if (systolic < 90 || systolic > 140 || diastolic < 60 || diastolic > 90) {
      score += 3;
    }

    // SpO2
    if (vitals.sp02 < 90) {
      score += 3;
    } else if (vitals.sp02 >= 90 && vitals.sp02 <= 94) {
      score += 1;
    }

    // FiO2
    if (vitals.fiO2 > 40) {
      score += 2;
    }

    // PEEPO
    if (vitals.peepo < 5 || vitals.peepo > 8) {
      score += 2;
    }

    // Peak Pressure
    if (vitals.peakPressure > 15) {
      score += 2;
    }

    // Minute Volume
    if (vitals.minuteVolume < 5 || vitals.minuteVolume > 8) {
      score += 2;
    }

    // Tidal Volume
    if (vitals.tidalVolume < 6 || vitals.tidalVolume > 8) {
      score += 2;
    }

    // Respiratory Rate
    if (vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20) {
      score += 2;
    }

    return score;
  }

  // Determine the color based on the priority score
  getPriorityColor(score: number): string {
    if (score >= 6) {
      return this.priorityColors.high; // High priority (Red)
    } else if (score >= 3) {
      return this.priorityColors.mid; // Mid priority (Yellow)
    } else {
      return this.priorityColors.low; // Low priority (Blue)
    }
  }
}

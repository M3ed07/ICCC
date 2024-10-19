import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/Firestore/firestore.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  Patients: any[] = [];
  private intervalId: any;
  showSecondTemplate: boolean = false;

  // Color mapping based on priority
  priorityColors = {
    high: '#F95454',  // Red
    mid: '#FFEB55',   // Yellow
    low: '#118DF0'    // Blue
  };

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.firestoreService.getCollection('Patients');
      this.Patients = data.map(patient => {
        patient.highPriorityScore = this.calculatePriorityScore(patient.vitals);
        patient.priorityColor = this.getPriorityColor(patient.highPriorityScore);
        return patient;
      });
  
      // Start the interval to switch templates
      this.startTemplateSwitching();
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  
    this.intervalId = setInterval(() => {
      this.updateVitals();
    }, 1000);
  }
  
  startTemplateSwitching(): void {
    setInterval(() => {
      const hasHighPriorityPatient = this.Patients.some(patient => {
        const score = this.calculatePriorityScore(patient.vitals);
        return score > 4; // Mid or High priority
      });
  
      if (hasHighPriorityPatient) {
        this.showSecondTemplate = true;
        setTimeout(() => {
          this.showSecondTemplate = false;
        }, 2000); // Show for 2 seconds
      }
    }, 5000); // Check every 10 seconds
  }
  
  

  ngOnDestroy(): void {
    if (this.intervalId) { clearInterval(this.intervalId); }
  }

  updateVitals(): void {
    this.Patients.forEach(patient => {
      this.changeVitals(patient.vitals);
      patient.highPriorityScore = this.calculatePriorityScore(patient.vitals);
      patient.priorityColor = this.getPriorityColor(patient.highPriorityScore);
    });
  }

  changeVitals(vitals: any): void {
    vitals.pulse += this.getRandomInt(-2, 2);
    vitals.bloodPressure.systolic += this.getRandomInt(-3, 3);
    vitals.bloodPressure.diastolic += this.getRandomInt(-2, 2);
    vitals.sp02 += this.getRandomInt(-1, 1);
    vitals.fiO2 += this.getRandomInt(-2, 2);
    vitals.peepo += this.getRandomInt(-1, 1);
    vitals.peakPressure += this.getRandomInt(-1, 1);
    vitals.minuteVolume += this.getRandomInt(-1, 1);
    vitals.tidalVolume += this.getRandomInt(-1, 1);
    vitals.respiratoryRate += this.getRandomInt(-1, 1);
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
  
  getPriorityColor(score: number): string {
    if (score >= 8) {
      return this.priorityColors.high;
    } else if (score > 4) {
      return this.priorityColors.mid;
    } else {
      return this.priorityColors.low;
    }
  }
}
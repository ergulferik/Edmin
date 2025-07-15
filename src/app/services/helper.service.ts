import { Injectable } from '@angular/core';
import { CourseStatistics } from '../models/exam.model';

/**
 * Helper service for managing helper functions
 */
@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor() {}

  generateRandomId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  // Exam calculation utilities
  calculateNetScore(correctCount: number, wrongCount: number): number {
    return correctCount - wrongCount / 4;
  }

  calculateWeightedScore(netScore: number, weight: number): number {
    return netScore * weight;
  }

  calculateTotalScore(statistics: CourseStatistics[]): number {
    return statistics.reduce((total, stat) => total + stat.weightedScore, 0);
  }

  calculateTotalNet(statistics: CourseStatistics[]): number {
    return statistics.reduce((total, stat) => total + stat.netScore, 0);
  }

  // Answer validation utilities
  validateAnswer(answer: string): boolean {
    const validAnswers = ['A', 'B', 'C', 'D', 'E'];
    return validAnswers.includes(answer.toUpperCase());
  }

  compareAnswers(studentAnswer: string, correctAnswer: string): boolean {
    return studentAnswer.toUpperCase() === correctAnswer.toUpperCase();
  }

  // File utilities
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  // Date utilities
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  // String utilities
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  generateExamCode(prefix: string, date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${year}${month}${randomSuffix}`;
  }

  // Validation utilities
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateStudentNumber(studentNumber: string): boolean {
    const studentNumberRegex = /^\d{7}$/;
    return studentNumberRegex.test(studentNumber);
  }

  // Array utilities
  groupBy<T>(
    array: T[],
    key: keyof T
  ): {
    [key: string]: T[];
  } {
    return array.reduce(
      (groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
      },
      {} as {
        [key: string]: T[];
      }
    );
  }

  sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Statistics utilities
  calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((total, num) => total + num, 0);
    return Math.round((sum / numbers.length) * 100) / 100;
  }

  calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }

  calculateStandardDeviation(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = this.calculateAverage(numbers);
    const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
    const variance = this.calculateAverage(squaredDifferences);
    return Math.sqrt(variance);
  }
}

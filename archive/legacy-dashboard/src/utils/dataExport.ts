import type { FireInputs } from './calculations';
import type { ExpenseBreakdown, FireCourse, MbtiType, SavedJob } from '../types';

export interface ExportData {
  version: string;
  exportDate: string;
  inputs: FireInputs;
  fireCourse: FireCourse | null;
  mbti: MbtiType | null;
  expenseBreakdown: ExpenseBreakdown | null;
  savedJobs: SavedJob[];
  completedLearningIds: string[];
}

export const exportData = (data: ExportData): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `fire-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.version || !data.inputs) {
          throw new Error('Invalid data format');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
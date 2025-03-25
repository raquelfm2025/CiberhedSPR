import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
// Merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('EUR', '€');
}

// Count words in a string
export function countWords(text: string): number {
  if (!text || text.trim() === '') return 0;
  return text.trim().split(/\s+/).length;
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-EU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
}

// Validate if budget is within limit
export function validateBudget(totalYear1: number, totalYear2: number): {
  isValid: boolean;
  message?: string;
} {
  const grandTotal = totalYear1 + totalYear2;
  
  if (grandTotal > 50000) {
    return {
      isValid: false,
      message: "The total budget exceeds €50,000. Please adjust your budget to meet the funding limit."
    };
  }
  
  return { isValid: true };
}

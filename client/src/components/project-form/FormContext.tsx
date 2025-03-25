import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  FormProposal, 
  ProjectCoordinator, 
  ResearchTeam, 
  Budget, 
  FileItem, 
  Signature,
  BudgetItemType
} from '@shared/schema';

// Initial project coordinator
const initialProjectCoordinator: ProjectCoordinator = {
  name: '',
  hiredByCiberehd: null,
  thesisYear: null,
  birthYear: null,
  annexExtension: null,
  email: '',
  phone: '',
  institution: '',
  collaborators: [],
};

// Initial research team
const initialResearchTeam: ResearchTeam = {
  ciberehdGroups: [],
  ciberGroups: [],
  externalGroups: [],
};

// Initial budget
const initialBudget: Budget = {
  items: [],
  totalYear1: 0,
  totalYear2: 0,
  grandTotal: 0,
};

// Initial signatures
const initialSignatures: Signature = {
  piCoordinator: '',
  piCiber: '',
  coPi: '',
  piCiber2: '',
};

// Initial form data
const initialFormData: FormProposal = {
  title: '',
  acronym: '',
  summary: '',
  objectives: '',
  stateOfArt: '',
  workplan: '',
  innovation: '',
  coordination: '',
  futurePlan: '',
  ipr: '',
  ethicalApproval: false,
  appendix: '',
  projectCoordinator: initialProjectCoordinator,
  researchTeam: initialResearchTeam,
  budget: initialBudget,
  signatures: initialSignatures,
  files: [],
};

// Context type
interface FormContextType {
  formData: FormProposal;
  currentStep: number;
  setFormData: (data: FormProposal) => void;
  setCurrentStep: (step: number) => void;
  updateFormField: <K extends keyof FormProposal>(field: K, value: FormProposal[K]) => void;
  updateProjectCoordinator: <K extends keyof ProjectCoordinator>(field: K, value: ProjectCoordinator[K]) => void;
  updateResearchTeam: <K extends keyof ResearchTeam>(field: K, value: ResearchTeam[K]) => void;
  updateBudget: <K extends keyof Budget>(field: K, value: Budget[K]) => void;
  updateSignatures: <K extends keyof Signature>(field: K, value: Signature[K]) => void;
  addBudgetItem: (item: BudgetItemType) => void;
  removeBudgetItem: (index: number) => void;
  addFile: (file: FileItem) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  referenceNumber: string;
  setReferenceNumber: (referenceNumber: string) => void;
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider props
interface FormProviderProps {
  children: ReactNode;
}

// Provider component
export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormProposal>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Update a form field
  const updateFormField = <K extends keyof FormProposal>(field: K, value: FormProposal[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update project coordinator
  const updateProjectCoordinator = <K extends keyof ProjectCoordinator>(field: K, value: ProjectCoordinator[K]) => {
    setFormData(prev => ({
      ...prev,
      projectCoordinator: {
        ...prev.projectCoordinator,
        [field]: value,
      },
    }));
  };

  // Update research team
  const updateResearchTeam = <K extends keyof ResearchTeam>(field: K, value: ResearchTeam[K]) => {
    setFormData(prev => ({
      ...prev,
      researchTeam: {
        ...prev.researchTeam,
        [field]: value,
      },
    }));
  };

  // Update budget
  const updateBudget = <K extends keyof Budget>(field: K, value: Budget[K]) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [field]: value,
      },
    }));
  };

  // Update signatures
  const updateSignatures = <K extends keyof Signature>(field: K, value: Signature[K]) => {
    setFormData(prev => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [field]: value,
      },
    }));
  };

  // Add budget item
  const addBudgetItem = (item: BudgetItemType) => {
    setFormData(prev => {
      const newItems = [...prev.budget.items, item];
      
      // Calculate new totals
      const totalYear1 = newItems.reduce((sum, item) => sum + item.year1Amount, 0);
      const totalYear2 = newItems.reduce((sum, item) => sum + item.year2Amount, 0);
      const grandTotal = totalYear1 + totalYear2;
      
      return {
        ...prev,
        budget: {
          ...prev.budget,
          items: newItems,
          totalYear1,
          totalYear2,
          grandTotal,
        },
      };
    });
  };

  // Remove budget item
  const removeBudgetItem = (index: number) => {
    setFormData(prev => {
      const newItems = prev.budget.items.filter((_, i) => i !== index);
      
      // Calculate new totals
      const totalYear1 = newItems.reduce((sum, item) => sum + item.year1Amount, 0);
      const totalYear2 = newItems.reduce((sum, item) => sum + item.year2Amount, 0);
      const grandTotal = totalYear1 + totalYear2;
      
      return {
        ...prev,
        budget: {
          ...prev.budget,
          items: newItems,
          totalYear1,
          totalYear2,
          grandTotal,
        },
      };
    });
  };

  // Add file
  const addFile = (file: FileItem) => {
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, file],
    }));
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        setFormData,
        setCurrentStep,
        updateFormField,
        updateProjectCoordinator,
        updateResearchTeam,
        updateBudget,
        updateSignatures,
        addBudgetItem,
        removeBudgetItem,
        addFile,
        isSubmitting,
        setIsSubmitting,
        referenceNumber,
        setReferenceNumber,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormProvider, useFormContext } from './FormContext';
import { FormStepper } from './FormStepper';
import { NavigationButtons } from './FormSections';
import { apiRequest } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

import { 
  Section1ProjectInformation,
  Section2ResearchTeam,
  Section3ProjectDetails,
  Section4Budget,
  Section5FinalDetails
} from './FormSections';

function SuccessDialog() {
  const { referenceNumber } = useFormContext();
  const [open, setOpen] = useState(true);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center">Submission Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Your project proposal has been successfully submitted.
            <p className="font-medium mt-2">Reference number: <span className="text-primary-600">{referenceNumber}</span></p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={() => window.location.href = '/'}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProjectFormContent() {
  const { toast } = useToast();
  const { 
    formData, 
    currentStep,
    isSubmitting,
    setIsSubmitting,
    setReferenceNumber
  } = useFormContext();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.title || !formData.acronym) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields in Project Information section.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.projectCoordinator.name || !formData.projectCoordinator.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for Project Coordinator.",
        variant: "destructive",
      });
      return;
    }
    
    // Budget validation
    if (formData.budget.grandTotal > 50000) {
      toast({
        title: "Budget Error",
        description: "Total budget cannot exceed €50,000. Please adjust your budget.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.budget.items.length === 0) {
      toast({
        title: "Budget Error",
        description: "Please add at least one budget item.",
        variant: "destructive",
      });
      return;
    }
    
    // Signatures validation
    if (!formData.signatures.piCoordinator || !formData.signatures.piCiber) {
      toast({
        title: "Validation Error",
        description: "Please fill in required signature fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest('POST', '/api/proposals', formData);
      const data = await response.json();
      setReferenceNumber(data.proposal.referenceNumber);
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your proposal. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
      {currentStep === 0 && <Section1ProjectInformation />}
      {currentStep === 1 && <Section2ResearchTeam />}
      {currentStep === 2 && <Section3ProjectDetails />}
      {currentStep === 3 && <Section4Budget />}
      {currentStep === 4 && <Section5FinalDetails />}
      
      <NavigationButtons />
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-center mt-4">Submitting proposal...</p>
          </div>
        </div>
      )}
      
      {formData.referenceNumber && <SuccessDialog />}
    </form>
  );
}

export function ProjectForm() {
  return (
    <FormProvider>
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <FormStepper />
        <ProjectFormContent />
      </div>
    </FormProvider>
  );
}

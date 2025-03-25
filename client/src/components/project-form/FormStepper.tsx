import React from 'react';
import { useFormContext } from './FormContext';
import { cn } from '@/lib/utils';

export function FormStepper() {
  const { currentStep, setCurrentStep } = useFormContext();

  const steps = [
    { id: 0, name: 'Información del Proyecto' },
    { id: 1, name: 'Equipo Investigador' },
    { id: 2, name: 'Detalles del Proyecto' },
    { id: 3, name: 'Presupuesto' },
    { id: 4, name: 'Detalles Finales' },
  ];

  return (
    <div className="px-4 sm:px-0 mb-8">
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center">
          {steps.map((step, index) => {
            return (
              <div key={step.id} className="flex items-center">
                {/* Step circle */}
                <div className="relative flex flex-col items-center">
                  <div 
                    className={cn(
                      "rounded-full h-8 w-8 flex items-center justify-center z-10 relative border-2",
                      currentStep === step.id ? "step-active" : 
                      currentStep > step.id ? "step-completed" : ""
                    )}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    {currentStep > step.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      step.id + 1
                    )}
                  </div>
                  <div className="text-xs mt-1">{step.name}</div>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 bg-gray-200">
                    <div 
                      className="h-1 bg-primary-600" 
                      style={{ 
                        width: 
                          currentStep > index + 1 ? '100%' : 
                          currentStep === index + 1 ? '50%' : 
                          currentStep === index ? '50%' : '0%'
                      }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

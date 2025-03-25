import * as React from "react";
import { cn } from "@/lib/utils";

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number;
  steps: { id: number; name: string }[];
  onStepClick?: (stepId: number) => void;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, currentStep, steps, onStepClick, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="flex items-center justify-between">
          <div className="w-full flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      "rounded-full h-8 w-8 flex items-center justify-center z-10 relative border-2 transition-colors",
                      currentStep === step.id
                        ? "border-primary-600 bg-primary-600 text-white"
                        : currentStep > step.id
                        ? "border-primary-600 text-primary-600"
                        : "border-gray-300 text-gray-500",
                      onStepClick && "cursor-pointer hover:border-primary-500"
                    )}
                    onClick={() => onStepClick && onStepClick(step.id)}
                  >
                    {currentStep > step.id ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      step.id + 1
                    )}
                  </div>
                  <div className="text-xs mt-1">{step.name}</div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 bg-gray-200">
                    <div
                      className="h-1 bg-primary-600 transition-all duration-300"
                      style={{
                        width:
                          currentStep > index + 1
                            ? "100%"
                            : currentStep === index + 1
                            ? "50%"
                            : currentStep === index
                            ? "50%"
                            : "0%",
                      }}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Stepper.displayName = "Stepper";

export { Stepper };

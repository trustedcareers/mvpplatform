import { usePathname } from 'next/navigation';

const FLOW_STEPS = [
  { title: 'Profile', href: '/intake' },
  { title: 'Upload', href: '/upload' },
  { title: 'Review', href: '/review-summary' },
];

export function useProgress() {
  const pathname = usePathname();
  
  const currentStepIndex = FLOW_STEPS.findIndex(step => step.href === pathname);
  
  const steps = FLOW_STEPS.map((step, index) => ({
    ...step,
    status: index < currentStepIndex ? 'complete' :
            index === currentStepIndex ? 'current' :
            'upcoming'
  }));

  return {
    steps,
    currentStep: currentStepIndex >= 0 ? FLOW_STEPS[currentStepIndex] : null,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === FLOW_STEPS.length - 1,
    nextStep: currentStepIndex < FLOW_STEPS.length - 1 ? FLOW_STEPS[currentStepIndex + 1] : null,
    prevStep: currentStepIndex > 0 ? FLOW_STEPS[currentStepIndex - 1] : null,
  };
} 
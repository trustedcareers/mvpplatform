import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface ProgressStepsProps {
  steps: Step[];
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''} relative`}
          >
            {stepIdx !== steps.length - 1 && (
              <div className={`h-0.5 w-full ${step.status === 'complete' ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
            <div
              className={`relative flex items-center justify-center`}
              aria-current={step.status === 'current' ? 'step' : undefined}
            >
              {step.status === 'complete' ? (
                <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </span>
              ) : step.status === 'current' ? (
                <span className="h-8 w-8 rounded-full border-2 border-primary flex items-center justify-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
              ) : (
                <span className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                </span>
              )}
              <span
                className={`absolute mt-16 text-center text-sm font-medium ${
                  step.status === 'complete'
                    ? 'text-gray-900'
                    : step.status === 'current'
                    ? 'text-primary'
                    : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
} 
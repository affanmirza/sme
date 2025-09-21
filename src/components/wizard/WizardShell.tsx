'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface WizardShellProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

export function WizardShell({ currentStep, totalSteps, children }: WizardShellProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-2xl">
        {/* Progress Header */}
        <Card className="mb-6 p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">SME Quick Screen</h1>
            <p className="text-gray-600">Langkah {currentStep} dari {totalSteps}</p>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

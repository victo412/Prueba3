import React, { useState } from 'react';
import { WelcomeStep } from './steps/WelcomeStep';
import { ScheduleStep } from './steps/ScheduleStep';
import { GoalsStep } from './steps/GoalsStep';
import { HabitsStep } from './steps/HabitsStep';
import { ProductivityStyleStep } from './steps/ProductivityStyleStep';
import { SetupCompleteStep } from './steps/SetupCompleteStep';
import { OnboardingProgress } from './OnboardingProgress';
import { LefiAssistant } from './LefiAssistant';

export interface OnboardingData {
  // Schedule preferences
  wakeUpTime: string;
  sleepTime: string;
  energyPeak: 'morning' | 'afternoon' | 'evening' | 'night';
  
  // Goals
  goals: string[];
  
  // Habits
  habits: Array<{
    name: string;
    frequency: 'daily' | 'weekly';
    category: 'health' | 'learning' | 'work' | 'personal';
  }>;
  
  // Productivity style
  workStyle: 'focused-blocks' | 'flexible' | 'mixed';
  breakPreference: number; // minutes
  currentSystem: 'calendar' | 'lists' | 'none' | 'other';
  improvementGoal: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    goals: [],
    habits: [],
  });

  const steps = [
    'welcome',
    'schedule',
    'goals',
    'habits',
    'productivity',
    'complete'
  ];

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete(data as OnboardingData);
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'welcome':
        return <WelcomeStep onNext={nextStep} />;
      case 'schedule':
        return (
          <ScheduleStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'goals':
        return (
          <GoalsStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'habits':
        return (
          <HabitsStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'productivity':
        return (
          <ProductivityStyleStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'complete':
        return (
          <SetupCompleteStep
            data={data as OnboardingData}
            onComplete={handleComplete}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      {/* Progress Bar */}
      <OnboardingProgress 
        currentStep={currentStep} 
        totalSteps={steps.length} 
        stepName={steps[currentStep]}
      />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {renderStep()}
        </div>
      </div>

      {/* Lefi Assistant */}
      <LefiAssistant 
        currentStep={steps[currentStep]} 
        stepNumber={currentStep + 1}
        totalSteps={steps.length}
      />
    </div>
  );
}
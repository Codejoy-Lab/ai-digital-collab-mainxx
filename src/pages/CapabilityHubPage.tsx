import { useState } from 'react';
import { CapabilityEntryLayer } from '@/components/capability/CapabilityEntryLayer';
import { CapabilityMatrixLayer } from '@/components/capability/CapabilityMatrixLayer';
import { CapabilityResultDisplay } from '@/components/capability/CapabilityResultDisplay';
import { CapabilityResultCollection } from '@/components/capability/CapabilityResultCollection';

export type CapabilityStep =
  | 'entry'
  | 'matrix'
  | 'results'
  | 'collection';

export interface SelectedScenario {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  requiredModules: string[];
  workflow: WorkflowStep[];
  decisionHistory?: Array<{
    stepId: string;
    optionId: string;
    optionLabel: string;
  }>;
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  agentName: string;
  agentNameEn?: string;
  action: string;
  actionEn: string;
  duration: number;
  details: string[];
  detailsEn?: string[];
}

const CapabilityHubPage = () => {
  const [currentStep, setCurrentStep] = useState<CapabilityStep>('entry');
  const [selectedScenario, setSelectedScenario] = useState<SelectedScenario | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToStep = (step: CapabilityStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 300);
  };

  const resetDemo = () => {
    setSelectedScenario(null);
    goToStep('entry');
  };

  const renderCurrentLayer = () => {
    switch (currentStep) {
      case 'entry':
        return <CapabilityEntryLayer onStart={() => goToStep('matrix')} />;
      case 'matrix':
        return (
          <CapabilityMatrixLayer
            onScenarioSelect={(scenario) => {
              setSelectedScenario(scenario);
            }}
            onBack={() => goToStep('entry')}
            onScenarioComplete={() => goToStep('results')}
          />
        );
      case 'results':
        return (
          <CapabilityResultDisplay
            scenario={selectedScenario}
            onContinue={() => goToStep('collection')}
          />
        );
      case 'collection':
        return (
          <CapabilityResultCollection
            scenario={selectedScenario}
            onRestart={resetDemo}
          />
        );
      default:
        return <CapabilityEntryLayer onStart={() => goToStep('matrix')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-tech-blue/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(210_100%_50%/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(125_60%_45%/0.05),transparent_50%)]" />

      {/* Content */}
      <div
        className={`relative z-10 transition-all duration-300 ${
          isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {renderCurrentLayer()}
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {['entry', 'matrix', 'results', 'collection'].map((step, index) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'bg-primary scale-125 shadow-[0_0_10px_hsl(210_100%_50%)]'
                  : index < ['entry', 'matrix', 'results', 'collection'].indexOf(currentStep)
                  ? 'bg-accent'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CapabilityHubPage;

import { useState, useEffect } from 'react';
import { EntryLayer } from '@/components/demo/EntryLayer';
import { AgentMatrixLayer } from '@/components/demo/AgentMatrixLayer';
import { ResultDisplay } from '@/components/demo/ResultDisplay';
import { ResultCollection } from '@/components/demo/ResultCollection';

export type DemoStep =
  | 'entry'
  | 'matrix'
  | 'results'
  | 'collection';

export interface SelectedTask {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  requiredAgents: string[];
  workflow: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  actionEn: string;
  duration: number;
  details: string[];
}

const AIDemoPage = () => {
  const [currentStep, setCurrentStep] = useState<DemoStep>('entry');
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToStep = (step: DemoStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 300);
  };

  const resetDemo = () => {
    setSelectedTask(null);
    goToStep('entry');
  };

  const renderCurrentLayer = () => {
    switch (currentStep) {
      case 'entry':
        return <EntryLayer onStart={() => goToStep('matrix')} />;
      case 'matrix':
        return (
          <AgentMatrixLayer
            onTaskSelect={(task) => {
              setSelectedTask(task);
            }}
            onBack={() => goToStep('entry')}
            onTaskComplete={() => goToStep('results')}
          />
        );
      case 'results':
        return (
          <ResultDisplay
            task={selectedTask}
            onContinue={() => goToStep('collection')}
          />
        );
      case 'collection':
        return (
          <ResultCollection
            task={selectedTask}
            onRestart={resetDemo}
          />
        );
      default:
        return <EntryLayer onStart={() => goToStep('matrix')} />;
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

export default AIDemoPage;
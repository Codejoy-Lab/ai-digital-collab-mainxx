import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Users, Zap } from 'lucide-react';
import { SelectedTask } from '@/pages/AIDemoPage';

interface TaskDispatchLayerProps {
  task: SelectedTask | null;
  onComplete: () => void;
  onBack: () => void;
}

interface Agent {
  id: string;
  name: string;
  nameEn: string;
  department: 'tech' | 'product' | 'marketing' | 'legal' | 'hr' | 'finance';
  role: string;
}

const TaskDispatchLayer = ({ task, onComplete, onBack }: TaskDispatchLayerProps) => {
  const [activatedAgents, setActivatedAgents] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Handle null task gracefully
  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            No Task Selected
          </h1>
          <p className="text-muted-foreground mb-4">
            Please select a task to dispatch agents.
          </p>
          <Button onClick={onBack}>Return to Matrix</Button>
        </div>
      </div>
    );
  }

  // All agents data (subset for demo)
  const allAgents: Agent[] = [
    { id: 'hr-01', name: '招聘专员', nameEn: 'Recruiter', department: 'hr', role: 'Recruitment' },
    { id: 'hr-02', name: '人才发展专家', nameEn: 'Talent Development', department: 'hr', role: 'Development' },
    { id: 'hr-08', name: '人力资源分析师', nameEn: 'HR Analyst', department: 'hr', role: 'Analytics' },
    { id: 'tech-01', name: '算法工程师', nameEn: 'Algorithm Engineer', department: 'tech', role: 'AI/ML' },
    { id: 'tech-02', name: '后端工程师', nameEn: 'Backend Developer', department: 'tech', role: 'Development' },
    { id: 'tech-03', name: '前端工程师', nameEn: 'Frontend Developer', department: 'tech', role: 'Development' },
    { id: 'tech-04', name: '测试工程师', nameEn: 'QA Engineer', department: 'tech', role: 'Testing' },
    { id: 'tech-05', name: '运维工程师', nameEn: 'DevOps Engineer', department: 'tech', role: 'Operations' },
    { id: 'tech-08', name: '架构师', nameEn: 'System Architect', department: 'tech', role: 'Architecture' },
    { id: 'tech-20', name: '技术项目经理', nameEn: 'Tech Project Manager', department: 'tech', role: 'Management' },
    { id: 'product-01', name: '产品经理', nameEn: 'Product Manager', department: 'product', role: 'Strategy' },
    { id: 'product-02', name: '用户研究员', nameEn: 'UX Researcher', department: 'product', role: 'Research' },
    { id: 'product-03', name: '产品分析师', nameEn: 'Product Analyst', department: 'product', role: 'Analytics' },
    { id: 'product-12', name: '商业分析师', nameEn: 'Business Analyst', department: 'product', role: 'Business' },
    { id: 'marketing-01', name: '数字营销专家', nameEn: 'Digital Marketing Specialist', department: 'marketing', role: 'Digital' },
    { id: 'marketing-04', name: 'SEM专员', nameEn: 'SEM Specialist', department: 'marketing', role: 'SEM' },
    { id: 'marketing-07', name: '营销数据分析师', nameEn: 'Marketing Analyst', department: 'marketing', role: 'Analytics' },
    { id: 'marketing-13', name: '视觉设计师', nameEn: 'Visual Designer', department: 'marketing', role: 'Design' },
    { id: 'legal-01', name: '法务顾问', nameEn: 'Legal Counsel', department: 'legal', role: 'General' },
    { id: 'legal-02', name: '合同专员', nameEn: 'Contract Specialist', department: 'legal', role: 'Contracts' },
    { id: 'legal-04', name: '合规专员', nameEn: 'Compliance Officer', department: 'legal', role: 'Compliance' },
    { id: 'legal-09', name: '风险评估员', nameEn: 'Risk Assessor', department: 'legal', role: 'Risk' },
    { id: 'finance-01', name: '财务分析师', nameEn: 'Financial Analyst', department: 'finance', role: 'Analysis' },
    { id: 'finance-02', name: '会计专员', nameEn: 'Accountant', department: 'finance', role: 'Accounting' },
    { id: 'finance-04', name: '审计专员', nameEn: 'Auditor', department: 'finance', role: 'Audit' },
    { id: 'finance-08', name: '财务报告专员', nameEn: 'Financial Reporter', department: 'finance', role: 'Reporting' }
  ];

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'tech': return 'bg-blue-500/20 border-blue-400/50 text-blue-300';
      case 'product': return 'bg-purple-500/20 border-purple-400/50 text-purple-300';
      case 'marketing': return 'bg-green-500/20 border-green-400/50 text-green-300';
      case 'legal': return 'bg-red-500/20 border-red-400/50 text-red-300';
      case 'hr': return 'bg-yellow-500/20 border-yellow-400/50 text-yellow-300';
      case 'finance': return 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300';
      default: return 'bg-gray-500/20 border-gray-400/50 text-gray-300';
    }
  };

  const getDepartmentGlow = (department: string) => {
    switch (department) {
      case 'tech': return 'shadow-[0_0_20px_hsl(210_100%_50%/0.3)]';
      case 'product': return 'shadow-[0_0_20px_hsl(280_100%_50%/0.3)]';
      case 'marketing': return 'shadow-[0_0_20px_hsl(120_60%_45%/0.3)]';
      case 'legal': return 'shadow-[0_0_20px_hsl(0_70%_50%/0.3)]';
      case 'hr': return 'shadow-[0_0_20px_hsl(45_100%_50%/0.3)]';
      case 'finance': return 'shadow-[0_0_20px_hsl(180_100%_50%/0.3)]';
      default: return 'shadow-[0_0_20px_hsl(0_0%_50%/0.3)]';
    }
  };

  // Animate agent activation
  useEffect(() => {
    const activateAgents = async () => {
      for (let i = 0; i < task.requiredAgents.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setActivatedAgents(prev => [...prev, task.requiredAgents[i]]);
      }
      
      // Show workflow steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(1);
      
      // Auto advance to execution after 3 seconds
      setTimeout(() => {
        onComplete();
      }, 3000);
    };

    activateAgents();
  }, [task.requiredAgents, onComplete]);

  const requiredAgents = allAgents.filter(agent => task.requiredAgents.includes(agent.id));

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回 / Back</span>
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                任务调度中心 / Task Dispatch Center
              </h1>
              <p className="text-muted-foreground">
                智能调度 · 跨部门协作 / Intelligent Dispatch · Cross-Department Collaboration
              </p>
            </div>
            
            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Task Info */}
      <div className="relative z-10 px-6 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="card-gradient border border-border/50 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold mb-2">{task.title}</h2>
            <p className="text-accent mb-2">{task.titleEn}</p>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
        </div>
      </div>

      {/* Agent Activation */}
      <div className="flex-1 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold mb-2">
              系统已调度 {activatedAgents.length}/{task.requiredAgents.length} 个数字员工
            </h3>
            <p className="text-muted-foreground">
              System dispatched {activatedAgents.length}/{task.requiredAgents.length} AI agents
            </p>
          </div>

          {/* Activated Agents Grid */}
          <div className="grid grid-cols-5 gap-6 mb-12">
            {requiredAgents.map((agent, index) => {
              const isActivated = activatedAgents.includes(agent.id);
              
              return (
                <div
                  key={agent.id}
                  className={`
                    relative rounded-xl border p-6 text-center transition-all duration-1000
                    ${isActivated 
                      ? `${getDepartmentColor(agent.department)} ${getDepartmentGlow(agent.department)} scale-110 animate-pulse-glow` 
                      : 'bg-muted/10 border-muted-foreground/20 text-muted-foreground scale-95 opacity-50'
                    }
                  `}
                  style={{ 
                    animationDelay: `${index * 0.5}s`,
                    transitionDelay: isActivated ? `${index * 0.5}s` : '0s'
                  }}
                >
                  {/* Agent Icon */}
                  <div className={`
                    w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center
                    ${isActivated ? 'bg-primary/20' : 'bg-muted/20'}
                  `}>
                    <Users className={`w-6 h-6 ${isActivated ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  
                  {/* Agent Info */}
                  <div>
                    <h4 className="font-medium text-sm mb-1">{agent.name}</h4>
                    <p className="text-xs opacity-80 mb-2">{agent.nameEn}</p>
                    <div className={`
                      text-xs px-2 py-1 rounded-full inline-block
                      ${isActivated ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted-foreground'}
                    `}>
                      {agent.role}
                    </div>
                  </div>

                  {/* Activation Effect */}
                  {isActivated && (
                    <div className="absolute inset-0 rounded-xl bg-primary/10 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Workflow Preview */}
          {currentStep >= 1 && (
            <div className="card-gradient border border-border/50 rounded-2xl p-6 animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">任务流程预览 / Workflow Preview</h3>
                </div>
                <p className="text-muted-foreground">
                  系统已为您规划最优执行路径 / Optimized execution path planned
                </p>
              </div>

              {/* Workflow Steps */}
              <div className="flex items-center justify-between space-x-4 overflow-x-auto pb-4">
                {task.workflow.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4 flex-shrink-0">
                    <div className="text-center min-w-[120px]">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                        <span className="text-primary font-medium">{index + 1}</span>
                      </div>
                      <div className="text-xs font-medium mb-1">{step.agentName}</div>
                      <div className="text-xs text-muted-foreground">{step.action}</div>
                    </div>
                    
                    {index < task.workflow.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <div className="text-sm text-muted-foreground mb-2">
                  预计执行时间: {Math.round(task.workflow.reduce((sum, step) => sum + step.duration, 0) / 1000)}秒
                </div>
                <div className="text-xs text-accent">
                  Estimated execution time: {Math.round(task.workflow.reduce((sum, step) => sum + step.duration, 0) / 1000)}s
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto Progress Indicator */}
      <div className="relative z-10 p-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              即将开始执行... / Starting execution...
            </p>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-3000 animate-progress-glow"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { TaskDispatchLayer };
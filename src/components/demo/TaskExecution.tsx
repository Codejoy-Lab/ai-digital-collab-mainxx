import { useState, useEffect, useRef } from 'react';
import { SelectedTask } from '@/pages/AIDemoPage';
import { Users, Activity, CheckCircle2, Clock, Upload, Maximize2 } from 'lucide-react';
import { buildApiUrl, WS_BASE_URL } from '@/config/api.config';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TaskExecutionProps {
  task: SelectedTask | null;
}

interface WebSocketMessage {
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  message: string;
  status: 'running' | 'completed' | 'error';
  output?: string;
  details?: any;
  type?: string;
  results?: any;
}

interface AgentPosition {
  id: string;
  x: number;
  y: number;
  name: string;
  nameEn: string;
}

const TaskExecution = ({ task }: TaskExecutionProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [agentPositions, setAgentPositions] = useState<AgentPosition[]>([]);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [isRealExecution, setIsRealExecution] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const [wsConnected, setWsConnected] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [executionStarted, setExecutionStarted] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if this is a real execution task
  useEffect(() => {
    if (task) {
      setIsRealExecution(!!(task as any).isRealExecution);
    }
  }, [task]);

  // Auto-open dialog when execution starts
  useEffect(() => {
    if (currentStep >= 0 && executionSteps.length > 0) {
      setShowLogDialog(true);
    }
  }, [currentStep, executionSteps.length]);

  // Handle null task gracefully
  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            No Task to Execute
          </h1>
          <p className="text-muted-foreground">
            Please select a task first.
          </p>
        </div>
      </div>
    );
  }

  const executionSteps = task.workflow;

  // Generate circular positions for selected agents
  useEffect(() => {
    const positions: AgentPosition[] = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 35;
    
    executionSteps.forEach((step, index) => {
      const angle = (index * 2 * Math.PI) / executionSteps.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      positions.push({
        id: step.agentId,
        x,
        y,
        name: step.agentName,
        nameEn: step.actionEn
      });
    });
    
    setAgentPositions(positions);
  }, [executionSteps]);

  // WebSocket connection for real execution
  useEffect(() => {
    if (isRealExecution) {
      const wsUrl = `${WS_BASE_URL}/ws/${sessionId}`;
      console.log('🔗 Connecting to WebSocket:', wsUrl);

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setWsConnected(true);
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] 🔗 已连接到实时AI服务`, ...prev]);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 Received WebSocket message:', message);

          // Handle different message types
          if (message.type === 'execution-complete') {
            setCurrentAction('🎉 所有AI任务执行完成');
            setLogs(prev => [
              `[${new Date().toLocaleTimeString()}] ✅ ${message.message}`,
              `[${new Date().toLocaleTimeString()}] 📊 效率提升: ${message.results?.efficiency || 'N/A'}`,
              `[${new Date().toLocaleTimeString()}] 🎯 准确度: ${message.results?.accuracy || 'N/A'}`,
              `[${new Date().toLocaleTimeString()}] ⏱️ 节省时间: ${message.results?.timeSaved || 'N/A'}`,
              ...prev
            ]);
            // Mark all steps as completed
            setCompletedSteps(executionSteps.map(step => step.id));
            return;
          }

          // Handle regular step messages
          if (message.agentId && message.action) {
            setCurrentAction(`${message.agentName} 正在 ${message.action}`);

            // Add log entry
            const logEntry = `[${new Date().toLocaleTimeString()}] [${message.agentName}] ${message.message}`;
            setLogs(prev => [logEntry, ...prev.slice(0, 25)]);

            // If step is completed, mark it
            if (message.status === 'completed') {
              const stepIndex = executionSteps.findIndex(step => step.agentId === message.agentId);
              if (stepIndex >= 0) {
                setCompletedSteps(prev => [...prev, executionSteps[stepIndex].id]);
                setCurrentStep(stepIndex + 1);
              }
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ WebSocket连接错误`, ...prev]);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, [isRealExecution, sessionId, executionSteps]);

  // Enhanced execution logic (for demo mode)
  useEffect(() => {
    if (!isRealExecution && currentStep < executionSteps.length) {
      const currentStepData = executionSteps[currentStep];

      setCurrentAction(`${currentStepData.agentName}正在${currentStepData.action}`);

      const progressInterval = setInterval(() => {
        // Add detailed logs with specific details
        if (Math.random() < 0.3 && currentStepData.details) {
          const randomDetail = currentStepData.details[Math.floor(Math.random() * currentStepData.details.length)];
          const wordCount = Math.floor(Math.random() * 500) + 100;

          const detailedLog = `${randomDetail} (已完成${wordCount}字内容)`;
          setLogs(prevLogs => [
            `[${new Date().toLocaleTimeString()}] [${currentStepData.agentName}] ${detailedLog}`,
            ...prevLogs.slice(0, 25)
          ]);
        }
      }, 1500); // 增加到1500ms，方便讲解

      // Move to next step when current completes
      const stepTimer = setTimeout(() => {
        // Mark current step as completed
        setCompletedSteps(prev => [...prev, currentStepData.id]);

        if (currentStep < executionSteps.length - 1) {
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 1000);
        }
      }, currentStepData.duration * 8); // 增加到8倍时长，便于讲解

      return () => {
        clearInterval(progressInterval);
        clearTimeout(stepTimer);
      };
    }
  }, [currentStep, executionSteps, isRealExecution]);

  // File upload handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setContractFile(file);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] 📄 正在上传文件: ${file.name}`, ...prev]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      const response = await fetch(buildApiUrl('/demo-real/process-document'), {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setIsFileUploaded(true);
        setLogs(prev => [
          `[${new Date().toLocaleTimeString()}] ✅ 文件上传成功，已解析 ${result.processedContent?.length || 0} 字符`,
          ...prev
        ]);
      } else {
        throw new Error(result.error || '文件上传失败');
      }
    } catch (error) {
      console.error('File upload error:', error);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ 文件上传失败: ${error}`, ...prev]);
    }
  };

  // Start real execution
  const startRealExecution = async () => {
    if (!isRealExecution || !wsConnected) return;

    setExecutionStarted(true);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] 🚀 开始启动真实AI执行流程`, ...prev]);

    try {
      // First initialize the orchestration
      const isContractAnalysis = (task as any).id === 'task-06';
      const scenarioId = isContractAnalysis ? 'orch_contract_analysis' : 'orch_product_requirements';

      const initResponse = await fetch(buildApiUrl('/demo-real/initialize'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      });

      const initResult = await initResponse.json();
      if (!initResult.success) {
        throw new Error(initResult.message || '初始化失败');
      }

      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚙️ 已初始化${initResult.orchestration.agents.length}个AI Agent`, ...prev]);

      // Then start execution
      const execResponse = await fetch(buildApiUrl('/demo-real/execute'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orchestrationId: initResult.orchestration.id,
          sessionId: sessionId,
          specialTask: isContractAnalysis ? 'contract_analysis' : 'product_requirements'
        })
      });

      const execResult = await execResponse.json();
      if (execResult.success) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ✨ 真实AI执行已启动，请等待结果...`, ...prev]);
      } else {
        throw new Error(execResult.error || '执行启动失败');
      }

    } catch (error) {
      console.error('Real execution error:', error);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ 真实AI执行失败: ${error}`, ...prev]);
      setExecutionStarted(false);
    }
  };

  // Auto-start execution for non-file-upload tasks
  useEffect(() => {
    if (isRealExecution && wsConnected && !executionStarted && !(task as any).isFileUpload) {
      // Small delay to let UI settle
      setTimeout(() => {
        startRealExecution();
      }, 1000);
    }
  }, [isRealExecution, wsConnected, executionStarted, task]);

  return (
    <div className="h-screen flex flex-col p-4 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 text-center mb-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isRealExecution ? '真实AI执行中' : '任务执行中'} / {isRealExecution ? 'Real AI Execution' : 'Task Execution in Progress'}
        </h1>
        <p className="text-sm text-muted-foreground mb-1">{task.title}</p>
        <p className="text-sm text-accent">{task.titleEn}</p>
        {isRealExecution && (
          <div className="flex items-center justify-center mt-2 gap-2">
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {wsConnected ? '实时AI连接正常' : 'AI连接中...'}
            </span>
          </div>
        )}
      </div>

      {/* File Upload for Contract Analysis */}
      {isRealExecution && (task as any).isFileUpload && !isFileUploaded && (
        <div className="relative z-20 flex justify-center mb-4">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">上传合同文件</h3>
              <p className="text-sm text-muted-foreground">请上传需要分析的合同文件（PDF, DOC, DOCX, TXT）</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="outline"
            >
              选择文件
            </Button>
          </div>
        </div>
      )}

      {/* Start Execution Button for File Upload Tasks */}
      {isRealExecution && (task as any).isFileUpload && isFileUploaded && !executionStarted && (
        <div className="relative z-20 flex justify-center mb-4">
          <Button
            onClick={startRealExecution}
            className="px-8 py-3 text-lg"
            disabled={!wsConnected}
          >
            🚀 开始真实AI分析
          </Button>
        </div>
      )}

      {/* Current Action Display */}
      {((!isRealExecution) || ((task as any).isFileUpload ? isFileUploaded : true)) && (
        <div className="relative z-20 flex justify-center mb-4">
          <div className="flex items-center px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
            <Activity className="w-5 h-5 text-primary mr-3 animate-pulse" />
            <div className="text-center">
              <div className="text-sm text-primary font-medium">{currentAction || '初始化中...'}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {isRealExecution ? 'Real AI Task Execution' : 'Current Task Execution'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 grid grid-cols-12 gap-6 relative">
        {/* Left Activity Panel */}
        <div className="col-span-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">
              {isRealExecution ? '实时AI活动日志' : '实时活动详情'} / {isRealExecution ? 'Real AI Activity Logs' : 'Real-time Activity Details'}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowLogDialog(true)}
            >
              <Maximize2 className="w-4 h-4" />
              放大查看
            </Button>
          </div>

          {/* Log Dialog */}
          <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl">实时活动日志 / Real-time Activity Logs</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-3 pr-4">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-lg text-foreground bg-muted/30 rounded-lg p-4 border border-border/40"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-mono text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 leading-relaxed">
                        {log}
                      </div>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">等待活动日志...</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="text-sm text-muted-foreground bg-muted/10 rounded-lg p-3 animate-fade-in-up border border-border/20"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Center Circle Area */}
        <div className="col-span-4 relative flex items-center justify-center">
          {/* Central Circle Background */}
          <div className="relative">
            <div className="w-96 h-96 rounded-full border-3 border-dashed border-primary/30 bg-primary/5 relative" />
          </div>
          
          {/* Agent Nodes in Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-96 h-96">
              {agentPositions.map((agent, index) => {
                const isActive = executionSteps[currentStep]?.agentId === agent.id;
                const isCompleted = completedSteps.some(stepId => 
                  executionSteps.find(step => step.id === stepId)?.agentId === agent.id
                );
                
                return (
                  <div
                    key={agent.id}
                    className={`
                      absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000
                      ${isActive ? 'scale-125 z-30' : isCompleted ? 'scale-110 z-20' : 'scale-100 z-10'}
                    `}
                    style={{
                      left: `${agent.x}%`,
                      top: `${agent.y}%`
                    }}
                  >
                    {/* Agent Card */}
                    <div className={`
                      w-24 h-24 rounded-xl border-3 flex flex-col items-center justify-center text-center p-2
                      transition-all duration-500 relative
                      ${isActive 
                        ? 'bg-primary/20 border-primary shadow-[0_0_40px_hsl(var(--primary)/0.6)]' 
                        : isCompleted 
                        ? 'bg-green-500/20 border-green-500 shadow-[0_0_30px_hsl(120,60%,50%,0.4)]' 
                        : 'bg-muted/20 border-muted-foreground/30'
                      }
                    `}>
                      <Users className={`
                        w-6 h-6 mb-1
                        ${isActive ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-muted-foreground'}
                      `} />
                      <div className="text-xs font-medium leading-tight">
                        {agent.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {agent.nameEn}
                      </div>
                      
                      {/* Completion Check */}
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      {/* Activity Label */}
                      {isActive && (
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-primary/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg text-center">
                            <div>正在处理...</div>
                            <div className="text-[10px] opacity-80">Processing...</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Statistics Panel */}
        <div className="col-span-4 space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            执行统计 / Execution Statistics
          </h3>
          <div className="space-y-4">
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary">{completedSteps.length}</div>
              <div className="text-sm text-muted-foreground">已完成步骤</div>
              <div className="text-xs text-muted-foreground/70 mt-1">Completed Steps</div>
            </div>
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-accent">
                {executionSteps.length - currentStep - 1}
              </div>
              <div className="text-sm text-muted-foreground">剩余步骤</div>
              <div className="text-xs text-muted-foreground/70 mt-1">Remaining Steps</div>
            </div>
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-tech-green">
                {Math.round(((Date.now() % 100000) / 1000) * 10) / 10}s
              </div>
              <div className="text-sm text-muted-foreground">执行时间</div>
              <div className="text-xs text-muted-foreground/70 mt-1">Execution Time</div>
            </div>
            
            {/* Agent Status Overview */}
            <div className="bg-muted/10 border border-border/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Agent状态 / Agent Status
              </h4>
              <div className="space-y-2">
                {executionSteps.map((step, index) => {
                  const isActive = currentStep === index;
                  const isCompleted = completedSteps.some(stepId => stepId === step.id);
                  
                  return (
                    <div key={step.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{step.agentName}</span>
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <div className="flex items-center text-green-500">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            <span>完成</span>
                          </div>
                        ) : isActive ? (
                          <div className="flex items-center text-primary">
                            <Clock className="w-3 h-3 mr-1 animate-pulse" />
                            <span>执行中</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>等待</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TaskExecution };
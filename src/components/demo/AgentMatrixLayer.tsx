import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Users, Zap, Target, Briefcase, Code, Megaphone, FileText, Network, CheckCircle2, Loader2, Crown, ChevronUp, Activity, Clock, X, Check, GitBranch } from 'lucide-react';
import { SelectedTask, WorkflowStep } from '@/pages/AIDemoPage';
import { buildApiUrl, WS_BASE_URL } from '@/config/api.config';
import ReactMarkdown from 'react-markdown';

interface AgentMatrixLayerProps {
  onTaskSelect: (task: SelectedTask) => void;
  onBack: () => void;
  onTaskComplete: () => void;
}

interface AIAgent {
  id: string;
  name: string;
  nameEn: string;
  department: 'tech' | 'product' | 'marketing' | 'legal' | 'hr' | 'finance';
  role: string;
}

interface TaskCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  requiredAgents: string[];
  workflow: WorkflowStep[];
  isFileUpload?: boolean;
  isRealExecution?: boolean;
}

interface AgentPosition {
  style: { left: string; top: string; transform?: string };
  coords: { x: number; y: number };
}

interface AgentOutput {
  agentId: string;
  content: string;
  timestamp: string;
}

const AgentMatrixLayer = ({ onTaskSelect, onBack, onTaskComplete }: AgentMatrixLayerProps) => {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskCard | null>(null);
  const [highlightedAgents, setHighlightedAgents] = useState<string[]>([]);
  const [isTaskPoolVisible, setIsTaskPoolVisible] = useState(false);
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentExecutingAgent, setCurrentExecutingAgent] = useState<string | null>(null);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [taskProgress, setTaskProgress] = useState(0);
  const [agentOutputs, setAgentOutputs] = useState<AgentOutput[]>([]);
  const [selectedAgentOutput, setSelectedAgentOutput] = useState<AgentOutput | null>(null);
  const [showOutputDialog, setShowOutputDialog] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [executionStarted, setExecutionStarted] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(`session_${Date.now()}`);
  const wsRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1); // 默认80%显示全部
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 50 AI Agents organized by departments
  const agents: AIAgent[] = [
    // Tech Department (12 agents)
    { id: 'tech-01', name: '算法工程师', nameEn: 'Algorithm Engineer', department: 'tech', role: 'AI/ML' },
    { id: 'tech-02', name: '后端工程师', nameEn: 'Backend Developer', department: 'tech', role: 'Development' },
    { id: 'tech-03', name: '前端工程师', nameEn: 'Frontend Developer', department: 'tech', role: 'Development' },
    { id: 'tech-04', name: '测试工程师', nameEn: 'QA Engineer', department: 'tech', role: 'Testing' },
    { id: 'tech-05', name: '运维工程师', nameEn: 'DevOps Engineer', department: 'tech', role: 'Operations' },
    { id: 'tech-06', name: '安全专家', nameEn: 'Security Expert', department: 'tech', role: 'Security' },
    { id: 'tech-07', name: '数据工程师', nameEn: 'Data Engineer', department: 'tech', role: 'Data' },
    { id: 'tech-08', name: '架构师', nameEn: 'System Architect', department: 'tech', role: 'Architecture' },
    { id: 'tech-09', name: 'UI/UX设计师', nameEn: 'UI/UX Designer', department: 'tech', role: 'Design' },
    { id: 'tech-10', name: '移动开发工程师', nameEn: 'Mobile Developer', department: 'tech', role: 'Mobile' },
    { id: 'tech-11', name: '云架构专家', nameEn: 'Cloud Specialist', department: 'tech', role: 'Cloud' },
    { id: 'tech-12', name: '数据科学家', nameEn: 'Data Scientist', department: 'tech', role: 'Analytics' },

    // Product Department (8 agents)
    { id: 'product-01', name: '产品经理', nameEn: 'Product Manager', department: 'product', role: 'Strategy' },
    { id: 'product-02', name: '用户研究员', nameEn: 'UX Researcher', department: 'product', role: 'Research' },
    { id: 'product-03', name: '产品分析师', nameEn: 'Product Analyst', department: 'product', role: 'Analytics' },
    { id: 'product-04', name: '原型设计师', nameEn: 'Prototyper', department: 'product', role: 'Design' },
    { id: 'product-05', name: '需求分析师', nameEn: 'Requirements Analyst', department: 'product', role: 'Analysis' },
    { id: 'product-06', name: '用户体验设计师', nameEn: 'UX Designer', department: 'product', role: 'UX' },
    { id: 'product-07', name: '产品运营', nameEn: 'Product Operations', department: 'product', role: 'Operations' },
    { id: 'product-12', name: '商业分析师', nameEn: 'Business Analyst', department: 'product', role: 'Business' },

    // Marketing Department (10 agents)
    { id: 'marketing-01', name: '市场调研专家', nameEn: 'Market Researcher', department: 'marketing', role: 'Research' },
    { id: 'marketing-02', name: '品牌策划师', nameEn: 'Brand Strategist', department: 'marketing', role: 'Brand' },
    { id: 'marketing-03', name: '内容营销专家', nameEn: 'Content Marketer', department: 'marketing', role: 'Content' },
    { id: 'marketing-04', name: '数据分析师', nameEn: 'Data Analyst', department: 'marketing', role: 'Analytics' },
    { id: 'marketing-05', name: '社交媒体经理', nameEn: 'Social Media Manager', department: 'marketing', role: 'Social' },
    { id: 'marketing-06', name: '数字营销专家', nameEn: 'Digital Marketing Specialist', department: 'marketing', role: 'Digital' },
    { id: 'marketing-07', name: 'SEM专员', nameEn: 'SEM Specialist', department: 'marketing', role: 'SEM' },
    { id: 'marketing-08', name: '广告投放专家', nameEn: 'Ad Campaign Specialist', department: 'marketing', role: 'Advertising' },
    { id: 'marketing-10', name: '公关专家', nameEn: 'PR Specialist', department: 'marketing', role: 'PR' },
    { id: 'marketing-13', name: '视觉设计师', nameEn: 'Visual Designer', department: 'marketing', role: 'Design' },

    // Legal Department (6 agents)
    { id: 'legal-01', name: '法务顾问', nameEn: 'Legal Counsel', department: 'legal', role: 'General' },
    { id: 'legal-02', name: '合同专家', nameEn: 'Contract Specialist', department: 'legal', role: 'Contracts' },
    { id: 'legal-03', name: '知识产权律师', nameEn: 'IP Attorney', department: 'legal', role: 'IP' },
    { id: 'legal-04', name: '合规专家', nameEn: 'Compliance Officer', department: 'legal', role: 'Compliance' },
    { id: 'legal-05', name: '数据隐私专家', nameEn: 'Privacy Expert', department: 'legal', role: 'Privacy' },
    { id: 'legal-09', name: '风险控制专家', nameEn: 'Risk Control', department: 'legal', role: 'Risk' },

    // HR Department (8 agents)
    { id: 'hr-01', name: '人力资源经理', nameEn: 'HR Manager', department: 'hr', role: 'Management' },
    { id: 'hr-02', name: '招聘专家', nameEn: 'Recruiter', department: 'hr', role: 'Recruiting' },
    { id: 'hr-03', name: '培训专家', nameEn: 'Training Specialist', department: 'hr', role: 'Training' },
    { id: 'hr-04', name: '薪酬福利专家', nameEn: 'Compensation Specialist', department: 'hr', role: 'Compensation' },
    { id: 'hr-05', name: '绩效管理专家', nameEn: 'Performance Management', department: 'hr', role: 'Performance' },
    { id: 'hr-06', name: '员工关系专家', nameEn: 'Employee Relations', department: 'hr', role: 'Relations' },
    { id: 'hr-07', name: '人才发展专家', nameEn: 'Talent Development', department: 'hr', role: 'Development' },
    { id: 'hr-08', name: '人力资源分析师', nameEn: 'HR Analyst', department: 'hr', role: 'Analytics' },

    // Finance Department (6 agents)
    { id: 'finance-01', name: '财务经理', nameEn: 'Finance Manager', department: 'finance', role: 'Management' },
    { id: 'finance-02', name: '会计师', nameEn: 'Accountant', department: 'finance', role: 'Accounting' },
    { id: 'finance-03', name: '预算分析师', nameEn: 'Budget Analyst', department: 'finance', role: 'Budgeting' },
    { id: 'finance-04', name: '投资顾问', nameEn: 'Investment Advisor', department: 'finance', role: 'Investment' },
    { id: 'finance-05', name: '财务分析师', nameEn: 'Financial Analyst', department: 'finance', role: 'Analysis' },
    { id: 'finance-06', name: '审计专家', nameEn: 'Auditor', department: 'finance', role: 'Audit' },
  ];

  // Task cards with workflow definitions
  const taskCards: TaskCard[] = [
    {
      id: 'task-01',
      title: '招聘算法工程师',
      titleEn: 'AI Engineer Recruitment',
      description: '职位发布 → 简历筛选 → 技术面试 → 综合评估',
      icon: 'Users',
      requiredAgents: ['hr-02', 'tech-01', 'tech-08', 'hr-01', 'hr-04'],
      workflow: [
        { id: 'w1', agentId: 'hr-02', agentName: '招聘专家', action: '职位发布', actionEn: 'Job Posting', duration: 3000, details: ['分析岗位需求', '撰写JD', '发布到招聘平台'] },
        { id: 'w2', agentId: 'tech-01', agentName: '算法工程师', action: '简历筛选', actionEn: 'Resume Screening', duration: 4000, details: ['技能匹配度分析', '项目经验评估', '学历背景审核'] },
        { id: 'w3', agentId: 'tech-08', agentName: '架构师', action: '技术面试', actionEn: 'Technical Interview', duration: 5000, details: ['算法能力测试', '系统设计考核', '代码质量评估'] },
        { id: 'w4', agentId: 'hr-01', agentName: '人力资源经理', action: '综合评估', actionEn: 'Final Assessment', duration: 3000, details: ['面试结果汇总', '薪资方案制定', '入职流程安排'] },
        { id: 'w5', agentId: 'hr-04', agentName: '薪酬福利专家', action: 'Offer制作', actionEn: 'Offer Creation', duration: 2000, details: ['薪资结构设计', '福利包装配', 'Offer邮件发送'] }
      ]
    },
    {
      id: 'task-02',
      title: '撰写产品需求文档',
      titleEn: 'Product Requirements Doc',
      description: '用户调研 → 竞品分析 → 需求整理 → 技术评估',
      icon: 'Target',
      requiredAgents: ['product-02', 'product-12', 'product-01', 'tech-08', 'product-03'],
      workflow: [
        { id: 'w1', agentId: 'product-02', agentName: '用户研究员', action: '用户需求调研', actionEn: 'User Research', duration: 4000, details: ['用户访谈', '需求收集', '痛点分析'] },
        { id: 'w2', agentId: 'product-12', agentName: '商业分析师', action: '市场竞品分析', actionEn: 'Competitive Analysis', duration: 4500, details: ['竞品功能对比', '市场定位分析', '差异化优势'] },
        { id: 'w3', agentId: 'product-01', agentName: '产品经理', action: '需求整理优先级', actionEn: 'Requirements Prioritization', duration: 3500, details: ['需求分类整理', 'MoSCoW优先级', '用户故事编写'] },
        { id: 'w4', agentId: 'tech-08', agentName: '架构师', action: '技术可行性评估', actionEn: 'Technical Feasibility', duration: 4000, details: ['技术架构设计', '开发成本评估', '风险识别'] },
        { id: 'w5', agentId: 'product-03', agentName: '产品分析师', action: 'PRD文档撰写', actionEn: 'PRD Documentation', duration: 5000, details: ['需求文档编写', '原型设计', '验收标准定义'] }
      ]
    },
    {
      id: 'task-03',
      title: 'Google广告投放',
      titleEn: 'Google Ads Campaign',
      description: '关键词调研 → 创意设计 → 系统部署 → 投放执行',
      icon: 'Megaphone',
      requiredAgents: ['marketing-04', 'marketing-13', 'tech-03', 'marketing-08', 'marketing-06'],
      workflow: [
        { id: 'w1', agentId: 'marketing-04', agentName: '数据分析师', action: '关键词调研', actionEn: 'Keyword Research', duration: 3500, details: ['关键词挖掘', '竞争度分析', '出价策略制定'] },
        { id: 'w2', agentId: 'marketing-13', agentName: '视觉设计师', action: '广告创意设计', actionEn: 'Creative Design', duration: 4000, details: ['广告文案撰写', '视觉素材设计', 'A/B测试方案'] },
        { id: 'w3', agentId: 'tech-03', agentName: '前端工程师', action: '落地页优化', actionEn: 'Landing Page', duration: 3000, details: ['页面性能优化', '转化路径设计', '移动端适配'] },
        { id: 'w4', agentId: 'marketing-08', agentName: '广告投放专家', action: '广告投放', actionEn: 'Campaign Launch', duration: 2500, details: ['账户结构搭建', '投放策略执行', '实时监控调整'] },
        { id: 'w5', agentId: 'marketing-06', agentName: '数字营销专家', action: '效果跟踪', actionEn: 'Performance Tracking', duration: 2000, details: ['数据监控', '转化分析', '优化建议'] }
      ]
    },
    {
      id: 'task-04',
      title: 'Bug修复与版本迭代',
      titleEn: 'Bug Fix & Version Release',
      description: 'Bug分析 → 代码修复 → 测试验证 → 版本发布',
      icon: 'Code',
      requiredAgents: ['tech-02', 'tech-04', 'tech-05', 'tech-08', 'product-01'],
      workflow: [
        { id: 'w1', agentId: 'tech-02', agentName: '后端工程师', action: 'Bug定位分析', actionEn: 'Bug Analysis', duration: 3000, details: ['日志分析', '问题复现', '根因定位'] },
        { id: 'w2', agentId: 'tech-02', agentName: '后端工程师', action: '代码修复', actionEn: 'Code Fix', duration: 4500, details: ['编写修复代码', '代码Review', '单元测试'] },
        { id: 'w3', agentId: 'tech-04', agentName: '测试工程师', action: '回归测试', actionEn: 'Regression Testing', duration: 3500, details: ['功能测试', '性能测试', '兼容性测试'] },
        { id: 'w4', agentId: 'tech-05', agentName: '运维工程师', action: '发布部署', actionEn: 'Deployment', duration: 2500, details: ['环境部署', '版本发布', '监控告警'] },
        { id: 'w5', agentId: 'product-01', agentName: '产品经理', action: '版本验收', actionEn: 'Version Acceptance', duration: 2000, details: ['功能验收', '用户反馈收集', '版本总结'] }
      ]
    },
    {
      id: 'task-05',
      title: '商务合同起草',
      titleEn: 'Business Contract Draft',
      description: '合同起草 → 法律审查 → 风险评估 → 终稿定型',
      icon: 'Briefcase',
      requiredAgents: ['legal-02', 'legal-01', 'legal-09', 'finance-01', 'legal-04'],
      workflow: [
        { id: 'w1', agentId: 'legal-02', agentName: '合同专家', action: '合同框架起草', actionEn: 'Contract Drafting', duration: 4000, details: ['合同模板选择', '条款内容填充', '格式规范检查'] },
        { id: 'w2', agentId: 'legal-01', agentName: '法务顾问', action: '法律条款审查', actionEn: 'Legal Review', duration: 4500, details: ['法律风险识别', '条款合规性检查', '争议解决条款'] },
        { id: 'w3', agentId: 'legal-09', agentName: '风险控制专家', action: '风险评估', actionEn: 'Risk Assessment', duration: 3500, details: ['商业风险分析', '履约能力评估', '风险控制措施'] },
        { id: 'w4', agentId: 'finance-01', agentName: '财务经理', action: '财务条款审核', actionEn: 'Financial Review', duration: 3000, details: ['付款条件审核', '财务影响评估', '现金流分析'] },
        { id: 'w5', agentId: 'legal-04', agentName: '合规专家', action: '最终合规确认', actionEn: 'Final Compliance', duration: 2500, details: ['合规最终检查', '签署流程确认', '合同归档'] }
      ]
    },
    {
      id: 'task-06',
      title: '合同审查分析',
      titleEn: 'Contract Analysis',
      description: '上传合同 → 法律审查 → 风险评估 → 审查报告',
      icon: 'FileText',
      requiredAgents: ['legal-01', 'legal-02', 'legal-03', 'finance-01', 'legal-04'],
      workflow: [
        { id: 'w1', agentId: 'legal-01', agentName: '合同法务', action: '法律风险识别', actionEn: 'Legal Risk Assessment', duration: 4000, details: ['条款风险分析', '法律效力评估', '争议解决审查'] },
        { id: 'w2', agentId: 'legal-02', agentName: '合规专员', action: '合规性评估', actionEn: 'Compliance Review', duration: 4500, details: ['监管要求检查', '合规风险识别', '改进建议提供'] },
        { id: 'w3', agentId: 'legal-03', agentName: '风险控制专员', action: '风险控制分析', actionEn: 'Risk Control Analysis', duration: 4000, details: ['风险影响评估', '控制措施建议', '监控机制设计'] },
        { id: 'w4', agentId: 'finance-01', agentName: '财务分析师', action: '财务影响评估', actionEn: 'Financial Impact Assessment', duration: 3500, details: ['财务条款分析', '现金流影响', '成本效益评估'] },
        { id: 'w5', agentId: 'legal-04', agentName: '合同分析师', action: '综合分析报告', actionEn: 'Comprehensive Analysis', duration: 4500, details: ['整合各方意见', '最终决策建议', '执行方案制定'] }
      ]
    }
  ];

  // Central dispatcher position
  const centralDispatcher = {
    x: 50, // Center X coordinate (%)
    y: 45, // Center Y coordinate (%)
    width: 8, // Exclusion zone width (%)
    height: 8  // Exclusion zone height (%)
  };

  // Department areas for Agent positioning - avoiding center
  const departmentAreas = {
    tech: { x: 5, y: 8, width: 20, height: 25 },          // 左上
    product: { x: 75, y: 8, width: 20, height: 25 },      // 右上
    marketing: { x: 5, y: 65, width: 20, height: 25 },    // 左下
    legal: { x: 75, y: 65, width: 20, height: 25 },       // 右下
    finance: { x: 30, y: 8, width: 20, height: 15 },      // 中上
    hr: { x: 30, y: 75, width: 20, height: 15 },          // 中下
  };

  // Department labels
  const departmentLabels = [
    { id: 'tech' as const, label: '🔧 技术部', subtitle: 'Technology', x: 15, y: 8 },
    { id: 'product' as const, label: '📊 产品部', subtitle: 'Product', x: 85, y: 8 },
    { id: 'marketing' as const, label: '📈 市场部', subtitle: 'Marketing', x: 15, y: 65 },
    { id: 'legal' as const, label: '⚖️ 法务部', subtitle: 'Legal', x: 85, y: 65 },
    { id: 'finance' as const, label: '💰 财务部', subtitle: 'Finance', x: 40, y: 8 },
    { id: 'hr' as const, label: '👥 人力部', subtitle: 'HR', x: 40, y: 75 },
  ];

  const handleTaskHover = (task: TaskCard | null) => {
    if (!executionStarted && task) {
      setHighlightedAgents(task.requiredAgents);
    } else if (!executionStarted) {
      setHighlightedAgents([]);
    }
  };

  const handleTaskClick = (task: TaskCard) => {
    setSelectedTask(task);
    setHighlightedAgents(task.requiredAgents);
    setExecutionState('running');
    setExecutionStarted(true);
    setCurrentStepIndex(0);
    setCompletedAgents([]);
    setAgentOutputs([]);

    // Pass task to parent for data persistence
    onTaskSelect(task);

    setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] 🚀 开始执行任务: ${task.title}`, ...prev]);

    // Always use simulation for demo
    startTaskExecution(task);
  };

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        console.log('尝试连接WebSocket:', WS_BASE_URL);
        const ws = new WebSocket(`${WS_BASE_URL}?sessionId=${sessionId}`);

        ws.onopen = () => {
          console.log('✅ WebSocket连接成功!');
          setWsConnected(true);
          setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] 📡 已连接到后端服务`, ...prev]);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket连接错误:', error);
          setWsConnected(false);
          setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ 后端连接失败`, ...prev]);
        };

        ws.onclose = () => {
          console.log('⚠️ WebSocket连接已关闭');
          setWsConnected(false);
          setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚠️ 后端连接已断开`, ...prev]);
          // 重连
          setTimeout(() => {
            console.log('正在尝试重新连接...');
            connectWebSocket();
          }, 3000);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('❌ 创建WebSocket失败:', error);
        setWsConnected(false);
        setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ 无法创建WebSocket连接`, ...prev]);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId]);

  const handleWebSocketMessage = (data: any) => {
    console.log('💬 WebSocket消息收到:', data);

    switch (data.type) {
      case 'agent-start':
        setCurrentExecutingAgent(data.agentId);
        setExecutionLogs(prev => [
          `[${new Date().toLocaleTimeString()}] 📋 ${data.agentName || data.agentId} 开始执行`,
          ...prev.slice(0, 20)
        ]);
        break;

      case 'agent-complete':
        setCompletedAgents(prev => [...prev, data.agentId]);
        setCurrentExecutingAgent(null);

        // 更新进度
        if (selectedTask) {
          const stepIndex = selectedTask.workflow.findIndex(w => w.agentId === data.agentId);
          if (stepIndex >= 0) {
            setCurrentStepIndex(stepIndex);
            setTaskProgress(((stepIndex + 1) / selectedTask.workflow.length) * 100);
          }
        }

        const output: AgentOutput = {
          agentId: data.agentId,
          content: data.output || data.message || `## ${data.agentName || data.agentId} 执行完成\n\n任务已成功完成`,
          timestamp: new Date().toISOString()
        };
        setAgentOutputs(prev => [...prev, output]);

        setExecutionLogs(prev => [
          `[${new Date().toLocaleTimeString()}] ✅ ${data.agentName || data.agentId} 已完成`,
          ...prev.slice(0, 20)
        ]);
        break;

      case 'workflow-complete':
        setExecutionState('completed');
        setTaskProgress(100);
        setExecutionLogs(prev => [
          `[${new Date().toLocaleTimeString()}] 🎉 任务执行完成!`,
          ...prev.slice(0, 20)
        ]);

        setTimeout(() => {
          onTaskComplete();
        }, 2000);
        break;

      case 'workflow-progress':
      case 'task-progress':
        // 处理进度更新
        if (data.progress) {
          setTaskProgress(data.progress);
        }
        if (data.message) {
          setExecutionLogs(prev => [
            `[${new Date().toLocaleTimeString()}] ${data.message}`,
            ...prev.slice(0, 20)
          ]);
        }
        break;
    }
  };

  const startRealExecution = async (task: TaskCard) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      startTaskExecution(task); // Fallback to simulation
      return;
    }

    try {
      // Send task execution request via WebSocket for manual workflow
      const message = {
        type: 'manual-workflow',
        workflowId: task.id,
        sessionId,
        taskTitle: task.title,
        taskId: task.id,
        workflow: task.workflow,
        requiredAgents: task.requiredAgents
      };

      console.log('Sending WebSocket message:', message);
      wsRef.current.send(JSON.stringify(message));

      setExecutionLogs(prev => [
        `[${new Date().toLocaleTimeString()}] 📡 已发送到后端执行`,
        ...prev.slice(0, 20)
      ]);
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      startTaskExecution(task); // Fallback to simulation
    }
  };

  const startTaskExecution = (task: TaskCard) => {
    let stepIndex = 0;
    const executeStep = () => {
      if (stepIndex < task.workflow.length) {
        const step = task.workflow[stepIndex];
        setCurrentStepIndex(stepIndex);
        setCurrentExecutingAgent(step.agentId);

        setExecutionLogs(prev => [
          `[${new Date().toLocaleTimeString()}] 📋 ${step.agentName} 正在执行: ${step.action}`,
          ...prev.slice(0, 20)
        ]);

        // Simulate step execution
        setTimeout(() => {
          // Mark as completed and add output
          setCompletedAgents(prev => [...prev, step.agentId]);
          setCurrentExecutingAgent(null);

          // Simulate agent output (in real implementation this would come from backend)
          const output: AgentOutput = {
            agentId: step.agentId,
            content: `## ${step.action} 执行报告\n\n### 任务概述\n${step.agentName} 已完成 ${step.action}\n\n### 详细结果\n- ${step.details?.join('\n- ')}\n\n### 状态\n✅ 任务成功完成`,
            timestamp: new Date().toISOString()
          };
          setAgentOutputs(prev => [...prev, output]);

          setExecutionLogs(prev => [
            `[${new Date().toLocaleTimeString()}] ✅ ${step.agentName} 已完成 ${step.action}`,
            ...prev.slice(0, 20)
          ]);

          // Update progress
          setTaskProgress(((stepIndex + 1) / task.workflow.length) * 100);

          stepIndex++;
          if (stepIndex < task.workflow.length) {
            executeStep();
          } else {
            // Task completed
            setExecutionState('completed');
            setExecutionLogs(prev => [
              `[${new Date().toLocaleTimeString()}] 🎉 任务执行完成!`,
              ...prev.slice(0, 20)
            ]);

            // Auto-navigate after a delay
            setTimeout(() => {
              onTaskComplete();
            }, 2000);
          }
        }, step.duration);
      }
    };

    executeStep();
  };

  const handleAgentClick = (agentId: string) => {
    const output = agentOutputs.find(o => o.agentId === agentId);
    if (output) {
      setSelectedAgentOutput(output);
      setShowOutputDialog(true);
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'tech': return 'bg-blue-500/20 border-blue-400/30 text-blue-300';
      case 'product': return 'bg-purple-500/20 border-purple-400/30 text-purple-300';
      case 'marketing': return 'bg-green-500/20 border-green-400/30 text-green-300';
      case 'legal': return 'bg-orange-500/20 border-orange-400/30 text-orange-300';
      case 'hr': return 'bg-pink-500/20 border-pink-400/30 text-pink-300';
      case 'finance': return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300';
      default: return 'bg-gray-500/20 border-gray-400/30 text-gray-300';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'Target': return Target;
      case 'Megaphone': return Megaphone;
      case 'Code': return Code;
      case 'Briefcase': return Briefcase;
      case 'FileText': return FileText;
      case 'Zap': return Zap;
      default: return Target;
    }
  };

  // Generate stable random seed from agent ID
  const getStableRandom = (agentId: string, index: number) => {
    let hash = 0;
    for (let i = 0; i < agentId.length; i++) {
      hash = ((hash << 5) - hash) + agentId.charCodeAt(i);
      hash = hash & hash;
    }
    return ((Math.abs(hash) + index) % 1000) / 1000;
  };

  // Rectangular Agent positioning avoiding center dispatcher
  const agentPositions = useMemo(() => {
    const positions: { [key: string]: AgentPosition } = {};

    agents.forEach((agent, globalIndex) => {
      const area = departmentAreas[agent.department];
      if (!area) {
        positions[agent.id] = { style: { left: '50%', top: '50%' }, coords: { x: 50, y: 50 } };
        return;
      }

      const departmentAgents = agents.filter(a => a.department === agent.department);
      const agentIndex = departmentAgents.indexOf(agent);
      const totalAgents = departmentAgents.length;

      // Regular grid distribution within department area
      const cols = Math.ceil(Math.sqrt(totalAgents));
      const rows = Math.ceil(totalAgents / cols);
      const row = Math.floor(agentIndex / cols);
      const col = agentIndex % cols;

      // Calculate actual columns in this row (for better edge distribution)
      const actualColsInRow = (row === rows - 1) ? (totalAgents % cols || cols) : cols;

      // Calculate position with proper spacing
      const cellWidth = area.width / cols;
      const cellHeight = area.height / rows;

      // Get small random offset for visual variety
      const rand1 = getStableRandom(agent.id, 1);
      const rand2 = getStableRandom(agent.id, 2);
      const offsetX = (rand1 - 0.5) * cellWidth * 0.08;
      const offsetY = (rand2 - 0.5) * cellHeight * 0.08;

      // Adjust x position for better column distribution (center the last row)
      let x;
      if (row === rows - 1 && actualColsInRow < cols) {
        // Center the last row if it has fewer columns
        const startOffset = (cols - actualColsInRow) * cellWidth * 0.5;
        x = area.x + startOffset + cellWidth * (col + 0.5) + offsetX;
      } else {
        x = area.x + cellWidth * (col + 0.5) + offsetX;
      }

      // Calculate y position with proper row spacing
      const baseRowHeight = area.height / rows;
      const verticalSpacing = baseRowHeight * 0.6;
      let y = area.y + 5 + baseRowHeight * row + verticalSpacing * row + baseRowHeight * 0.4 + offsetY;

      // Ensure within bounds and avoid center dispatcher
      const finalX = Math.max(5, Math.min(95, x));
      const finalY = Math.max(10, Math.min(90, y));

      positions[agent.id] = {
        style: { left: `${finalX}%`, top: `${finalY}%` },
        coords: { x: finalX, y: finalY }
      };
    });

    return positions;
  }, [agents]);

  const getAgentPosition = (agent: AIAgent, index: number): AgentPosition => {
    return agentPositions[agent.id] || { style: { left: '50%', top: '50%' }, coords: { x: 50, y: 50 } };
  };

  const renderAgent = (agent: AIAgent, index: number) => {
    const isHovered = hoveredAgent === agent.id;
    const isHighlighted = highlightedAgents.includes(agent.id);
    const isSelected = selectedTask && selectedTask.requiredAgents.includes(agent.id);
    const isExecuting = currentExecutingAgent === agent.id;
    const isCompleted = completedAgents.includes(agent.id);
    const hasOutput = agentOutputs.some(o => o.agentId === agent.id);

    const position = getAgentPosition(agent, index);

    return (
      <div
        key={agent.id}
        data-agent-id={agent.id}
        className={`
          absolute rounded-xl border-2 transition-all duration-700 transform flex flex-col items-center justify-center text-center
          ${hasOutput ? 'cursor-pointer' : 'cursor-default'}
          w-16 h-16
          ${getDepartmentColor(agent.department)}
          ${isHighlighted || isSelected ? 'scale-125 border-primary border-3 shadow-[0_0_30px_hsl(var(--primary)/0.7)] z-30' : 'scale-100'}
          ${executionStarted && !isSelected ? 'opacity-30 scale-90' : 'opacity-100'}
          ${isHovered ? 'scale-110 z-40' : ''}
          ${isExecuting ? 'animate-pulse shadow-[0_0_40px_hsl(var(--primary)/0.9)]' : ''}
          ${isCompleted ? 'bg-green-500/30 border-green-400 shadow-[0_0_25px_hsl(120,60%,50%,0.6)]' : ''}
          ${!isHighlighted && !isSelected && !isHovered && !isExecuting && !isCompleted && !executionStarted ? 'animate-[breathe_4s_ease-in-out_infinite]' : ''}
        `}
        style={position.style}
        onMouseEnter={() => setHoveredAgent(agent.id)}
        onMouseLeave={() => setHoveredAgent(null)}
        onClick={() => hasOutput && handleAgentClick(agent.id)}
      >
        <div className="relative z-10">
          <Users className="w-8 h-8 opacity-90" />
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
          {isExecuting && (
            <Loader2 className="w-3 h-3 text-primary absolute -top-1 -right-1 animate-spin" />
          )}
        </div>

        <div className="absolute left-1/2 top-[130%] -translate-x-1/2 whitespace-nowrap text-xs font-bold text-foreground pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/40 rounded px-1.5 py-0.5">
          {agent.name}
        </div>

        {isHovered && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 z-50 whitespace-nowrap">
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl">
              <div className="text-sm font-medium">{agent.name}</div>
              <div className="text-xs text-muted-foreground">{agent.nameEn}</div>
              <div className="text-xs text-accent">{agent.role}</div>
              {hasOutput && <div className="text-xs text-blue-400 mt-1">点击查看输出</div>}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex relative overflow-hidden bg-background">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="relative z-10 pt-4 pb-2 px-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2 text-base px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                AI数字员工协作平台
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                100+ 专业数字员工 · 智能协作演示
              </p>
            </div>

            <div className="w-24" />
          </div>
        </div>

        {/* Agent Matrix Canvas with Zoom */}
        <div
          ref={canvasRef}
          className="flex-1 relative px-6 overflow-hidden"
          onWheel={(e) => {
            // 直接滚轮缩放
            e.preventDefault();
            e.stopPropagation();
            const delta = e.deltaY > 0 ? 0.95 : 1.05; // 更平滑的缩放
            const newScale = Math.max(0.3, Math.min(2, canvasScale * delta));
            setCanvasScale(newScale);
          }}
          onMouseDown={(e) => {
            if (e.button === 0 && e.shiftKey) {
              setIsDragging(true);
              setDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
            }
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              setCanvasPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
              });
            }
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          style={{ cursor: isDragging ? 'grabbing' : 'default' }}
        >
          <div
            className="relative h-full w-full transition-transform duration-100"
            style={{
              transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasScale})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Department Labels (no borders) */}
            {departmentLabels.map(dept => (
              <div
                key={dept.id}
                className="absolute pointer-events-none"
                style={{ left: `${dept.x}%`, top: `${dept.y}%` }}
              >
                <div className="text-lg font-bold text-foreground/70">{dept.label}</div>
                <div className="text-sm text-muted-foreground/60 uppercase tracking-wide">{dept.subtitle}</div>
              </div>
            ))}

            {/* Connection Lines between Agents */}
            {selectedTask && executionStarted && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  {/* Gradient for active connections */}
                  <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="hsl(var(--tech-blue))" stopOpacity="1" />
                    <stop offset="100%" stopColor="hsl(var(--tech-green))" stopOpacity="0.8" />
                  </linearGradient>

                  {/* Animated gradient for data flow */}
                  <linearGradient id="dataFlowGradient">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="30%" stopColor="hsl(var(--tech-blue))" stopOpacity="0.8">
                      <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="1">
                      <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.3s" />
                    </stop>
                    <stop offset="100%" stopColor="transparent" />
                    <animateTransform attributeName="gradientTransform" type="translate" values="-100 0;100 0;-100 0" dur="2s" repeatCount="indefinite" />
                  </linearGradient>

                  {/* Drop shadow filter */}
                  <filter id="connectionShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="hsl(var(--primary))" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {selectedTask.workflow.map((step, index) => {
                  if (index === 0) return null;

                  const prevStep = selectedTask.workflow[index - 1];
                  const prevAgent = agents.find(a => a.id === prevStep.agentId);
                  const currAgent = agents.find(a => a.id === step.agentId);

                  if (!prevAgent || !currAgent) return null;

                  const prevPos = getAgentPosition(prevAgent, agents.indexOf(prevAgent));
                  const currPos = getAgentPosition(currAgent, agents.indexOf(currAgent));

                  // Calculate connection points at agent edges instead of centers
                  const dx = currPos.coords.x - prevPos.coords.x;
                  const dy = currPos.coords.y - prevPos.coords.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance === 0) return null; // Avoid division by zero

                  const unitX = dx / distance;
                  const unitY = dy / distance;

                  // Agent visual radius in percentage units (agents are w-16 h-16, approximately 4% of container)
                  const agentRadius = 3;
                  const startX = prevPos.coords.x + unitX * agentRadius;
                  const startY = prevPos.coords.y + unitY * agentRadius;
                  const endX = currPos.coords.x - unitX * agentRadius;
                  const endY = currPos.coords.y - unitY * agentRadius;

                  // Create curved path for better visual appeal
                  const midX = (startX + endX) / 2;
                  const midY = (startY + endY) / 2;
                  const controlOffset = Math.min(8, distance / 4); // Adaptive curve based on distance
                  const perpX = -unitY * controlOffset;
                  const perpY = unitX * controlOffset;

                  const isActive = currentStepIndex >= index;
                  const isCurrentlyTransmitting = currentStepIndex === index;
                  const isCompleted = completedAgents.includes(prevStep.agentId);

                  return (
                    <g key={`${prevStep.agentId}-${step.agentId}`}>
                      {/* Background path for glow effect */}
                      <path
                        d={`M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`}
                        stroke="hsl(var(--primary))"
                        strokeWidth="6"
                        fill="none"
                        opacity={isActive ? "0.2" : "0.1"}
                        filter={isActive ? "url(#connectionShadow)" : "none"}
                      />

                      {/* Main connection path */}
                      <path
                        d={`M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`}
                        stroke={isActive ? "url(#activeGradient)" : "hsl(var(--muted-foreground))"}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={isActive ? "0" : "8,4"}
                        opacity={isActive ? "0.9" : "0.4"}
                        className={isActive ? "animate-pulse" : ""}
                        style={{
                          filter: isActive ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'none'
                        }}
                      />

                      {/* Data flow animation for currently transmitting connections */}
                      {isCurrentlyTransmitting && (
                        <>
                          <path
                            d={`M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`}
                            stroke="url(#dataFlowGradient)"
                            strokeWidth="4"
                            fill="none"
                            opacity="0.8"
                          />

                          {/* Data packet animation */}
                          <circle r="3" fill="hsl(var(--tech-green))" opacity="0.9">
                            <animateMotion dur="2s" repeatCount="indefinite">
                              <mpath href={`#path-${prevStep.agentId}-${step.agentId}`} />
                            </animateMotion>
                            <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
                          </circle>

                          {/* Hidden path for animation reference */}
                          <path
                            id={`path-${prevStep.agentId}-${step.agentId}`}
                            d={`M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`}
                            opacity="0"
                          />
                        </>
                      )}

                      {/* Connection endpoint indicators */}
                      {isActive && (
                        <>
                          <circle
                            cx={startX}
                            cy={startY}
                            r="2"
                            fill="hsl(var(--tech-green))"
                            opacity="0.8"
                            className="animate-pulse"
                          />
                          <circle
                            cx={endX}
                            cy={endY}
                            r="2"
                            fill={isCompleted ? "hsl(var(--tech-green))" : "hsl(var(--primary))"}
                            opacity="0.8"
                            className={isCompleted ? "" : "animate-pulse"}
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Central Dispatcher Agent */}
            <div
              className="absolute rounded-2xl border-4 border-primary bg-primary/20 p-4 transition-all duration-700 transform flex flex-col items-center justify-center text-center hover:scale-110 hover:shadow-[0_0_60px_hsl(var(--primary)/0.8)] w-20 h-20 z-50 animate-pulse-glow"
              style={{
                left: `${centralDispatcher.x}%`,
                top: `${centralDispatcher.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Network className="w-10 h-10 text-primary" />
              <div className="absolute left-1/2 top-[125%] -translate-x-1/2 whitespace-nowrap text-sm font-bold text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/40 rounded-lg px-2.5 py-1">
                🌟 中央调度
              </div>
            </div>

            {/* Agents */}
            {agents.map((agent, index) => renderAgent(agent, index))}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2 bg-background/90 backdrop-blur-sm p-3 rounded-lg border border-border">
            <button
              onClick={() => setCanvasScale(Math.min(3, canvasScale + 0.2))}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded text-sm font-semibold transition-colors"
            >
              放大 +
            </button>
            <div className="text-center text-sm text-foreground font-medium">{Math.round(canvasScale * 100)}%</div>
            <button
              onClick={() => setCanvasScale(Math.max(0.5, canvasScale - 0.2))}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded text-sm font-semibold transition-colors"
            >
              缩小 -
            </button>
            <button
              onClick={() => { setCanvasScale(1); setCanvasPosition({ x: 0, y: 0 }); }}
              className="px-4 py-2 bg-accent/20 hover:bg-accent/30 rounded text-sm font-semibold transition-colors"
            >
              重置
            </button>
            <div className="text-xs text-muted-foreground text-center mt-2">
              滚轮缩放画布
            </div>
          </div>
        </div>

        {/* Hidden Task Pool - Sci-Fi Style */}
        <div
          className={`fixed bottom-0 left-0 right-96 bg-gradient-to-t from-black/95 via-tech-blue/10 to-transparent backdrop-blur-xl border-t-2 border-tech-blue/50 transition-transform duration-300 z-30 ${
            isTaskPoolVisible ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'
          }`}
          onMouseEnter={() => setIsTaskPoolVisible(true)}
          onMouseLeave={() => setIsTaskPoolVisible(false)}
        >
          {/* Task Pool Header - Sci-Fi Style */}
          <div className="px-6 py-2 border-b border-tech-blue/30 flex items-center justify-between bg-gradient-to-r from-black/80 via-tech-blue/5 to-black/80">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-tech-blue animate-pulse" />
              <h3 className="text-lg font-bold bg-gradient-to-r from-tech-blue to-primary bg-clip-text text-transparent">
                🚀 智能任务池
              </h3>
              <span className="text-sm text-tech-blue/80 font-mono">[{taskCards.length} TASKS]</span>
            </div>
            <ChevronUp className={`w-5 h-5 text-tech-blue transition-transform duration-300 ${isTaskPoolVisible ? 'rotate-0' : 'rotate-180'}`} />
          </div>

          {/* Task Cards */}
          <div className="p-6 max-h-80 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {taskCards.map((task, idx) => {
                const IconComponent = getIcon(task.icon);
                const isRealExecution = task.isRealExecution;

                return (
                  <div
                    key={task.id}
                    className="group cursor-pointer"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onMouseEnter={() => handleTaskHover(task)}
                    onMouseLeave={() => handleTaskHover(null)}
                    onClick={() => !executionStarted && handleTaskClick(task)}
                  >
                    <div className={`border-2 border-tech-blue/30 rounded-lg p-4 transition-all duration-300 bg-gradient-to-br from-black/80 to-tech-blue/5 backdrop-blur-sm shadow-lg ${!executionStarted ? 'hover:scale-105 hover:border-tech-blue/60 hover:shadow-[0_0_30px_rgba(0,200,255,0.3)] group-hover:shadow-xl' : 'opacity-50 cursor-not-allowed'}`}>
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-tech-blue/20 flex items-center justify-center group-hover:bg-tech-blue/30 transition-all duration-300 flex-shrink-0 border border-tech-blue/50 shadow-[0_0_10px_rgba(0,200,255,0.2)]">
                          <IconComponent className="w-7 h-7 text-tech-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-base group-hover:text-primary transition-colors">{task.title}</h4>
                          </div>
                          <p className="text-xs text-accent mb-2 font-medium">{task.titleEn}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                          <div className="flex items-center justify-between mt-3 p-2 bg-black/60 rounded border border-tech-blue/20">
                            <div className="text-lg font-bold text-tech-green font-mono">{task.requiredAgents.length.toString().padStart(2, '0')}</div>
                            <div className="text-xs text-tech-blue/80 font-mono">AGENTS</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Execution Panel - Sci-Fi Style */}
      <div className="w-96 bg-gradient-to-b from-black/95 via-tech-blue/5 to-black/95 backdrop-blur-xl border-l-2 border-tech-blue/50 flex flex-col relative overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-blue to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-green/30 to-transparent opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Panel Header */}
        <div className="p-5 border-b border-tech-blue/30 bg-gradient-to-r from-black/80 via-tech-blue/10 to-black/80 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-tech-blue to-primary bg-clip-text text-transparent">
              📡 执行监控中心
            </h3>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${executionState === 'running' ? 'bg-green-400 animate-pulse' : executionState === 'completed' ? 'bg-tech-blue' : 'bg-gray-600'}`} />
              <div className={`w-2 h-2 rounded-full ${executionState === 'running' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} style={{ animationDelay: '0.3s' }} />
              <div className={`w-2 h-2 rounded-full ${executionState === 'running' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} style={{ animationDelay: '0.6s' }} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className={`w-5 h-5 ${executionState === 'running' ? 'text-green-400 animate-pulse' : 'text-tech-blue'}`} />
            <span className={`text-base font-mono ${executionState === 'running' ? 'text-green-400' : 'text-tech-blue/80'}`}>
              {executionState === 'idle' ? '[STANDBY]' :
               executionState === 'running' ? '[EXECUTING]' : '[COMPLETE]'}
            </span>
          </div>
        </div>

        {/* Task Progress - Task List Style */}
        {selectedTask && (
          <div className="p-5 border-b border-tech-blue/30 bg-black/60 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold text-tech-blue font-mono">[{selectedTask.title}]</span>
              <span className="text-sm font-mono text-green-400">{Math.round(taskProgress).toString().padStart(3, '0')}%</span>
            </div>

            {/* Task Steps List */}
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
              {selectedTask.workflow.map((step, idx) => {
                const isComplete = completedAgents.includes(step.agentId);
                const isCurrent = idx === currentStepIndex;
                const isPending = idx > currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-2 rounded border transition-all duration-300 ${
                      isCurrent ? 'bg-tech-blue/20 border-tech-blue/50 animate-pulse' :
                      isComplete ? 'bg-green-500/10 border-green-500/30' :
                      'bg-black/40 border-tech-blue/20 opacity-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      isComplete ? 'bg-green-400' :
                      isCurrent ? 'bg-tech-blue animate-pulse' :
                      'bg-gray-600'
                    }`} />
                    <div className="flex-1">
                      <div className="text-xs font-mono text-tech-blue/90">
                        {step.agentName}
                      </div>
                      <div className="text-xs font-mono text-tech-green/70">
                        ▶ {step.action}
                      </div>
                    </div>
                    <div className="text-xs font-mono">
                      {isComplete ? '✓' : isCurrent ? '▶' : '-'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-xs font-mono mt-3 pt-2 border-t border-tech-blue/20">
              <span className="text-tech-green">▶ COMPLETED: {completedAgents.length}/{selectedTask.requiredAgents.length}</span>
              <span className="text-accent">▶ PROGRESS: {currentStepIndex + 1}/{selectedTask.workflow.length}</span>
            </div>
          </div>
        )}

        {/* Current Execution - Sci-Fi Style */}
        {currentExecutingAgent && selectedTask && (
          <div className="p-5 border-b border-tech-blue/30 bg-gradient-to-r from-black/80 via-tech-green/5 to-black/80 relative z-10">
            <div className="text-base font-bold text-tech-green mb-2 font-mono flex items-center">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              [ACTIVE PROCESS]
            </div>
            <div className="text-sm font-mono bg-black/60 border border-tech-green/30 rounded p-2">
              <div className="text-tech-blue mb-1">▶ AGENT: {selectedTask.workflow[currentStepIndex]?.agentName}</div>
              <div className="text-accent">▶ ACTION: {selectedTask.workflow[currentStepIndex]?.action}</div>
            </div>
          </div>
        )}

        {/* Execution Logs - Sci-Fi Terminal Style */}
        <div className="flex-1 p-5 overflow-hidden bg-black/70 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-tech-green animate-pulse" />
              <span className="text-base font-bold text-tech-green font-mono">[SYSTEM LOG]</span>
            </div>
            <span className="text-xs font-mono text-tech-blue/60">LIVE</span>
          </div>
          <div className="bg-black/90 border border-tech-blue/30 rounded-sm p-3 font-mono text-xs">
            <div className="space-y-1 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
              {executionLogs.length === 0 ? (
                <div className="text-tech-blue/60 animate-pulse">▶ AWAITING TASK INITIALIZATION...</div>
              ) : (
                executionLogs.map((log, index) => (
                  <div
                    key={index}
                    className="text-green-400/90 hover:text-green-400 transition-colors cursor-default"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    ▶ {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Output Dialog */}
      <Dialog open={showOutputDialog} onOpenChange={setShowOutputDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Agent 输出详情</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOutputDialog(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {selectedAgentOutput && (
              <ReactMarkdown>{selectedAgentOutput.content}</ReactMarkdown>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AgentMatrixLayer };
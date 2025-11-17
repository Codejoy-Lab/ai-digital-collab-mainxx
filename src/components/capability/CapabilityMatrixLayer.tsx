import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Users, Zap, Target, Briefcase, Code, Megaphone, FileText, Network, CheckCircle2, Loader2, Crown, ChevronUp, Activity, Clock, X, Check, GitBranch, Maximize2 } from 'lucide-react';
import { SelectedScenario, WorkflowStep } from '@/pages/CapabilityHubPage';
import { buildApiUrl, WS_BASE_URL } from '@/config/api.config';
import ReactMarkdown from 'react-markdown';
import { CheckpointDialog } from '@/components/merck/CheckpointDialog';

interface CapabilityMatrixLayerProps {
  onScenarioSelect: (scenario: SelectedScenario) => void;
  onBack: () => void;
  onScenarioComplete: (checkpointDecisions?: Record<string, any>) => void;
}

interface SmartModule {
  id: string;
  name: string;
  nameEn: string;
  department: 'tech' | 'product' | 'marketing' | 'legal' | 'hr' | 'finance';
  role: string;
}

interface ScenarioCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  requiredModules: string[];
  workflow: WorkflowStep[];
  isFileUpload?: boolean;
  isRealExecution?: boolean;
}

interface ModulePosition {
  style: { left: string; top: string; transform?: string };
  coords: { x: number; y: number };
}

interface ModuleOutput {
  moduleId: string;
  content: string;
  timestamp: string;
}

export const CapabilityMatrixLayer = ({ onScenarioSelect, onBack, onScenarioComplete }: CapabilityMatrixLayerProps) => {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<ScenarioCard | null>(null);
  const [highlightedAgents, setHighlightedAgents] = useState<string[]>([]);
  const [isTaskPoolVisible, setIsTaskPoolVisible] = useState(false);
  const [executionState, setExecutionState] = useState<'idle' | 'dispatching' | 'running' | 'completed'>('idle');
  const [currentExecutingAgent, setCurrentExecutingAgent] = useState<string | null>(null);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [taskProgress, setTaskProgress] = useState(0);
  const [agentOutputs, setAgentOutputs] = useState<ModuleOutput[]>([]);
  const [selectedAgentOutput, setSelectedAgentOutput] = useState<ModuleOutput | null>(null);
  const [showOutputDialog, setShowOutputDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [executionStarted, setExecutionStarted] = useState(false);
  const [isDispatcherActive, setIsDispatcherActive] = useState(false);
  const [dispatchingAgents, setDispatchingAgents] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(`session_${Date.now()}`);
  const wsRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1); // 默认80%显示全部
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 50 Smart Modules organized by departments
  const agents: SmartModule[] = [
    // Tech & Data Department (12 modules)
    { id: 'tech-01', name: '数据采集系统', nameEn: 'Data Collection', department: 'tech', role: 'Collection' },
    { id: 'tech-02', name: '异常检测引擎', nameEn: 'Anomaly Detection', department: 'tech', role: 'Detection' },
    { id: 'tech-03', name: '质量检测系统', nameEn: 'Quality Inspection', department: 'tech', role: 'Quality' },
    { id: 'tech-04', name: '设备监控系统', nameEn: 'Equipment Monitoring', department: 'tech', role: 'Monitoring' },
    { id: 'tech-05', name: '工艺优化引擎', nameEn: 'Process Optimization', department: 'tech', role: 'Optimization' },
    { id: 'tech-06', name: '安全防护系统', nameEn: 'Security Protection', department: 'tech', role: 'Security' },
    { id: 'tech-07', name: '数据存储管理', nameEn: 'Data Storage', department: 'tech', role: 'Storage' },
    { id: 'tech-08', name: '系统集成引擎', nameEn: 'System Integration', department: 'tech', role: 'Integration' },
    { id: 'tech-09', name: '智能分析引擎', nameEn: 'Intelligent Analysis', department: 'tech', role: 'Analysis' },
    { id: 'tech-10', name: '预测模型系统', nameEn: 'Prediction Model', department: 'tech', role: 'Prediction' },
    { id: 'tech-11', name: '知识图谱构建', nameEn: 'Knowledge Graph', department: 'tech', role: 'Knowledge' },
    { id: 'tech-12', name: '自动化控制', nameEn: 'Automation Control', department: 'tech', role: 'Control' },

    // Product & Business Department (8 modules)
    { id: 'product-01', name: '需求分析引擎', nameEn: 'Requirement Analysis', department: 'product', role: 'Analysis' },
    { id: 'product-02', name: '用户洞察系统', nameEn: 'User Insights', department: 'product', role: 'Insights' },
    { id: 'product-03', name: '产品数据分析', nameEn: 'Product Analytics', department: 'product', role: 'Analytics' },
    { id: 'product-04', name: '方案设计系统', nameEn: 'Solution Design', department: 'product', role: 'Design' },
    { id: 'product-05', name: '业务智能分析', nameEn: 'Business Intelligence', department: 'product', role: 'BI' },
    { id: 'product-06', name: '体验优化引擎', nameEn: 'Experience Optimization', department: 'product', role: 'UX' },
    { id: 'product-07', name: '运营数据分析', nameEn: 'Operations Analytics', department: 'product', role: 'Operations' },
    { id: 'product-12', name: '策略规划引擎', nameEn: 'Strategic Planning', department: 'product', role: 'Strategy' },

    // Marketing & Customer Department (10 modules)
    { id: 'marketing-01', name: '市场数据分析', nameEn: 'Market Analytics', department: 'marketing', role: 'Research' },
    { id: 'marketing-02', name: '品牌监测系统', nameEn: 'Brand Monitoring', department: 'marketing', role: 'Brand' },
    { id: 'marketing-03', name: '内容生成引擎', nameEn: 'Content Generation', department: 'marketing', role: 'Content' },
    { id: 'marketing-04', name: '客户洞察分析', nameEn: 'Customer Insights', department: 'marketing', role: 'Insights' },
    { id: 'marketing-05', name: '社交媒体监测', nameEn: 'Social Monitoring', department: 'marketing', role: 'Social' },
    { id: 'marketing-06', name: '营销智能分析', nameEn: 'Marketing Intelligence', department: 'marketing', role: 'Intelligence' },
    { id: 'marketing-07', name: '客户关系管理', nameEn: 'CRM System', department: 'marketing', role: 'CRM' },
    { id: 'marketing-08', name: '广告投放优化', nameEn: 'Ad Optimization', department: 'marketing', role: 'Advertising' },
    { id: 'marketing-10', name: '舆情监测系统', nameEn: 'Sentiment Analysis', department: 'marketing', role: 'Sentiment' },
    { id: 'marketing-13', name: '创意设计生成', nameEn: 'Creative Design', department: 'marketing', role: 'Design' },

    // Legal & Compliance Department (6 modules)
    { id: 'legal-01', name: '法律文本分析', nameEn: 'Legal Text Analysis', department: 'legal', role: 'Analysis' },
    { id: 'legal-02', name: '合同智能审查', nameEn: 'Smart Contract Review', department: 'legal', role: 'Review' },
    { id: 'legal-03', name: '知识产权检索', nameEn: 'IP Search', department: 'legal', role: 'IP' },
    { id: 'legal-04', name: '合规性检查', nameEn: 'Compliance Check', department: 'legal', role: 'Compliance' },
    { id: 'legal-05', name: '隐私保护检测', nameEn: 'Privacy Protection', department: 'legal', role: 'Privacy' },
    { id: 'legal-09', name: '风险评估引擎', nameEn: 'Risk Assessment', department: 'legal', role: 'Risk' },

    // HR & Talent Department (8 modules)
    { id: 'hr-01', name: '人才数据管理', nameEn: 'Talent Data Management', department: 'hr', role: 'Management' },
    { id: 'hr-02', name: '人才匹配系统', nameEn: 'Talent Matching', department: 'hr', role: 'Matching' },
    { id: 'hr-03', name: '培训推荐引擎', nameEn: 'Training Recommendation', department: 'hr', role: 'Training' },
    { id: 'hr-04', name: '薪酬计算引擎', nameEn: 'Compensation Calculator', department: 'hr', role: 'Compensation' },
    { id: 'hr-05', name: '绩效评估系统', nameEn: 'Performance Evaluation', department: 'hr', role: 'Performance' },
    { id: 'hr-06', name: '员工数据分析', nameEn: 'Employee Analytics', department: 'hr', role: 'Analytics' },
    { id: 'hr-07', name: '能力发展分析', nameEn: 'Capability Development', department: 'hr', role: 'Development' },
    { id: 'hr-08', name: 'HR智能分析', nameEn: 'HR Intelligence', department: 'hr', role: 'Intelligence' },

    // Finance & Accounting Department (6 modules)
    { id: 'finance-01', name: '财务分析引擎', nameEn: 'Financial Analysis', department: 'finance', role: 'Analysis' },
    { id: 'finance-02', name: '会计核算系统', nameEn: 'Accounting System', department: 'finance', role: 'Accounting' },
    { id: 'finance-03', name: '预算规划引擎', nameEn: 'Budget Planning', department: 'finance', role: 'Planning' },
    { id: 'finance-04', name: '成本核算引擎', nameEn: 'Cost Calculation', department: 'finance', role: 'Costing' },
    { id: 'finance-05', name: '资金流分析', nameEn: 'Cash Flow Analysis', department: 'finance', role: 'CashFlow' },
    { id: 'finance-06', name: '审计检查系统', nameEn: 'Audit System', department: 'finance', role: 'Audit' },
  ];

  // Scenario cards with workflow definitions
  const taskCards: ScenarioCard[] = [
    {
      id: 'scenario-01',
      title: '跨部门智能合规审查',
      titleEn: 'Cross-Department Compliance Review',
      description: '文本解析 → 智能审查（多源数据集成） → 人工决策 → 合规检查 → 风险评估',
      icon: 'FileText',
      requiredModules: ['legal-01', 'legal-02', 'legal-04', 'legal-09', 'finance-01'],
      workflow: [
        { id: 'w1', agentId: 'legal-01', agentName: '法律文本分析', action: '合同文本解析与结构化', actionEn: 'Contract Text Parsing', duration: 3500, details: ['提取合同关键条款', '识别法律术语', '构建条款关系图谱'] },
        { id: 'w2', agentId: 'legal-02', agentName: '合同智能审查', action: '多源数据集成分析', actionEn: 'Multi-source Integrated Analysis', duration: 8000, details: ['调用会议系统API', '通过邮件MCP获取往来', '访问财务信息库', '综合分析风险'] },
        { id: 'w3', agentId: 'legal-04', agentName: '合规性检查', action: '监管要求符合性验证', actionEn: 'Regulatory Compliance Verification', duration: 4000, details: ['数据保护法规检查', '行业标准验证', '反垄断条款审查'] },
        { id: 'w4', agentId: 'legal-09', agentName: '风险评估引擎', action: '综合风险量化评估', actionEn: 'Comprehensive Risk Quantification', duration: 3500, details: ['生成风险矩阵', '量化风险等级', '输出审查报告'] }
      ]
    },
    {
      id: 'scenario-02',
      title: '第三方合作伙伴背景调查',
      titleEn: 'Third-party Partner Background Check',
      description: '资质验证 → 信用评估 → 历史记录分析 → 综合评级',
      icon: 'Users',
      requiredModules: ['legal-01', 'finance-01', 'legal-09', 'product-05'],
      workflow: [
        { id: 'w1', agentId: 'legal-01', agentName: '法律文本分析', action: '企业资质验证', actionEn: 'Enterprise Qualification Verification', duration: 3500, details: ['工商信息查询', '经营范围分析', '证照有效性验证'] },
        { id: 'w2', agentId: 'finance-01', agentName: '财务分析引擎', action: '财务健康度评估', actionEn: 'Financial Health Assessment', duration: 4000, details: ['财报数据分析', '负债率计算', '现金流评估', '偿债能力分析'] },
        { id: 'w3', agentId: 'legal-09', agentName: '风险评估引擎', action: '历史记录与诉讼查询', actionEn: 'Historical Records & Litigation Check', duration: 5000, details: ['裁判文书检索', '失信记录查询', '行政处罚历史', '舆情负面分析'] },
        { id: 'w4', agentId: 'product-05', agentName: '业务智能分析', action: '综合评级与建议', actionEn: 'Comprehensive Rating & Recommendation', duration: 3000, details: ['多维度评分', '生成风险等级', '输出合作建议', '制定监控方案'] }
      ]
    },
    {
      id: 'scenario-03',
      title: '制造设备智能监控预警',
      titleEn: 'Manufacturing Equipment Intelligent Monitoring',
      description: '传感器数据采集 → AI异常检测 → 故障预测 → 预警通知',
      icon: 'Activity',
      requiredModules: ['tech-01', 'tech-02', 'tech-10', 'tech-04'],
      workflow: [
        { id: 'w1', agentId: 'tech-01', agentName: '数据采集系统', action: '设备传感器数据采集', actionEn: 'Sensor Data Collection', duration: 3000, details: ['温度数据采集', '振动频率监测', '电流功率读取', '运行状态记录'] },
        { id: 'w2', agentId: 'tech-02', agentName: '异常检测引擎', action: 'AI异常模式识别', actionEn: 'AI Anomaly Detection', duration: 5000, details: ['机器学习模型分析', '识别异常波动', '对比历史基线', '定位异常参数'] },
        { id: 'w3', agentId: 'tech-10', agentName: '预测模型系统', action: '故障预测与剩余寿命评估', actionEn: 'Failure Prediction & RUL Assessment', duration: 4500, details: ['预测故障时间', '计算剩余寿命', '评估维修紧急度', '生成维护建议'] },
        { id: 'w4', agentId: 'tech-04', agentName: '设备监控系统', action: '智能预警通知', actionEn: 'Intelligent Alert Notification', duration: 2000, details: ['发送预警通知', '推送维修工单', '更新设备档案', '记录预警事件'] }
      ]
    },
    {
      id: 'scenario-04',
      title: '客户投诉智能分析处理',
      titleEn: 'Customer Complaint Intelligent Analysis',
      description: '投诉分类 → 情感分析 → 根因挖掘 → 解决方案生成',
      icon: 'Megaphone',
      requiredModules: ['marketing-04', 'marketing-10', 'product-02', 'marketing-07'],
      workflow: [
        { id: 'w1', agentId: 'marketing-04', agentName: '客户洞察分析', action: '投诉智能分类', actionEn: 'Complaint Intelligent Classification', duration: 3000, details: ['NLP文本分析', '投诉类型识别', '紧急程度评估', '责任部门判定'] },
        { id: 'w2', agentId: 'marketing-10', agentName: '舆情监测系统', action: '客户情感与满意度分析', actionEn: 'Customer Sentiment Analysis', duration: 3500, details: ['情感倾向分析', '不满程度量化', '流失风险评估', '历史互动回顾'] },
        { id: 'w3', agentId: 'product-02', agentName: '用户洞察系统', action: '问题根因挖掘', actionEn: 'Root Cause Analysis', duration: 4000, details: ['关联历史案例', '识别系统性问题', '追溯产品缺陷', '分析流程漏洞'] },
        { id: 'w4', agentId: 'marketing-07', agentName: '客户关系管理', action: '个性化解决方案生成', actionEn: 'Personalized Solution Generation', duration: 3500, details: ['匹配最佳方案', '生成补偿建议', '预测接受度', '输出处理话术'] }
      ]
    },
    {
      id: 'scenario-05',
      title: '营销内容智能合规审核',
      titleEn: 'Marketing Content Compliance Review',
      description: '内容提取 → 合规检测 → 风险识别 → 修改建议',
      icon: 'Briefcase',
      requiredModules: ['marketing-03', 'legal-04', 'legal-05', 'marketing-02'],
      workflow: [
        { id: 'w1', agentId: 'marketing-03', agentName: '内容生成引擎', action: '营销内容提取与解析', actionEn: 'Marketing Content Extraction', duration: 2500, details: ['文本内容提取', '图片元素识别', '视频字幕提取', '广告语解析'] },
        { id: 'w2', agentId: 'legal-04', agentName: '合规性检查', action: '广告法合规检测', actionEn: 'Advertising Law Compliance Check', duration: 4500, details: ['违禁词检测', '夸大宣传识别', '对比广告审查', '虚假承诺分析'] },
        { id: 'w3', agentId: 'legal-05', agentName: '隐私保护检测', action: '数据隐私风险识别', actionEn: 'Data Privacy Risk Identification', duration: 3500, details: ['个人信息检测', 'GDPR合规检查', '敏感数据识别', '授权验证分析'] },
        { id: 'w4', agentId: 'marketing-02', agentName: '品牌监测系统', action: '品牌形象评估与修改建议', actionEn: 'Brand Image Assessment', duration: 3000, details: ['品牌调性分析', '风险等级评估', '生成修改建议', '输出合规报告'] }
      ]
    },
    {
      id: 'scenario-06',
      title: '财务异常智能检测',
      titleEn: 'Financial Anomaly Intelligent Detection',
      description: '数据采集 → 异常检测 → 风险评估 → 审计报告',
      icon: 'Target',
      requiredModules: ['finance-01', 'finance-02', 'tech-02', 'finance-06'],
      workflow: [
        { id: 'w1', agentId: 'finance-01', agentName: '财务分析引擎', action: '多源财务数据整合', actionEn: 'Multi-source Financial Data Integration', duration: 3500, details: ['ERP数据提取', '银行流水导入', '发票数据采集', '报销单据汇总'] },
        { id: 'w2', agentId: 'tech-02', agentName: '异常检测引擎', action: '异常交易模式识别', actionEn: 'Anomaly Transaction Detection', duration: 5000, details: ['机器学习分析', '识别异常金额', '检测频繁小额', '发现重复支付', '标记可疑账户'] },
        { id: 'w3', agentId: 'finance-02', agentName: '会计核算系统', action: '会计准则符合性检查', actionEn: 'Accounting Standards Compliance', duration: 4000, details: ['科目使用规范检查', '凭证完整性验证', '税务合规分析', '跨期调整识别'] },
        { id: 'w4', agentId: 'finance-06', agentName: '审计检查系统', action: '审计风险评估与报告', actionEn: 'Audit Risk Assessment', duration: 4500, details: ['风险等级评估', '异常交易汇总', '生成审计线索', '输出检测报告'] }
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

  // Department areas for Agent positioning - optimized to avoid vertical stacking
  const departmentAreas = {
    tech: { x: 1, y: 3, width: 30, height: 32 },          // 左上 - 技术部12个agent，专为4x3网格优化
    product: { x: 66, y: 3, width: 32, height: 22 },      // 右上 - 产品部8个agent，强制水平布局
    marketing: { x: 1, y: 62, width: 30, height: 32 },    // 左下 - 市场部10个agent，5x2或似方形布局
    legal: { x: 70, y: 62, width: 28, height: 32 },       // 右下 - 法务部6个agent，与市场部Y位置对齐
    finance: { x: 34, y: 3, width: 28, height: 20 },      // 中上 - 财务部6个agent，强制水平布局
    hr: { x: 35, y: 62, width: 35, height: 32 },          // 中下 - 人力部8个agent，与市场部Y位置对齐
  };

  // Module group labels - positioned at top-left corner of each area
  const departmentLabels = [
    { id: 'tech' as const, label: '🔧 数据与技术', subtitle: 'Data & Technology', x: 2, y: 1 },
    { id: 'product' as const, label: '📊 业务分析', subtitle: 'Business Analytics', x: 72, y: 1 },
    { id: 'marketing' as const, label: '📈 营销与客户', subtitle: 'Marketing & Customer', x: 2, y: 60 },
    { id: 'legal' as const, label: '⚖️ 合规与法律', subtitle: 'Compliance & Legal', x: 72, y: 60 },
    { id: 'finance' as const, label: '💰 财务管理', subtitle: 'Financial Management', x: 34, y: 1 },
    { id: 'hr' as const, label: '👥 人才系统', subtitle: 'Talent System', x: 37, y: 60 },
  ];

  const handleTaskHover = (task: ScenarioCard | null) => {
    if (!executionStarted && task) {
      setHighlightedAgents(task.requiredModules);
    } else if (!executionStarted) {
      setHighlightedAgents([]);
    }
  };

  const handleTaskClick = (task: ScenarioCard) => {
    setSelectedTask(task);
    setHighlightedAgents([]); // 先清空高亮
    setExecutionState('dispatching'); // 开始调度阶段
    setExecutionStarted(true);
    setCurrentStepIndex(0);
    setCompletedAgents([]);
    setAgentOutputs([]);
    setIsDispatcherActive(true); // 激活中央调度器
    setDispatchingAgents([]);

    // Pass scenario to parent for data persistence
    onScenarioSelect(task as SelectedScenario);

    setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] 🎯 收到新场景: ${task.title}`, ...prev]);

    // 开始调度流程
    startDispatchingProcess(task);
  };

  const startDispatchingProcess = (task: ScenarioCard) => {
    // 第一阶段：中央调度器分析任务
    setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] 🤖 中央调度器正在分析场景需求...`, ...prev]);

    setTimeout(() => {
      setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] 📋 场景分析完成，需要以下智能模块:`, ...prev]);

      // 获取需要的模块信息并显示
      const requiredModuleDetails = task.requiredModules.map(moduleId => {
        const module = agents.find(a => a.id === moduleId);
        return module ? `${module.name} (${module.department})` : moduleId;
      });

      setTimeout(() => {
        setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] 👥 调度以下智能模块协作完成场景:`, ...prev]);

        // 逐个显示被调度的模块
        let moduleIndex = 0;
        const dispatchModules = () => {
          if (moduleIndex < requiredModuleDetails.length) {
            const moduleDetail = requiredModuleDetails[moduleIndex];
            const moduleId = task.requiredModules[moduleIndex];

            setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] ▶ 调度: ${moduleDetail}`, ...prev]);
            setDispatchingAgents(prev => [...prev, moduleId]);

            moduleIndex++;
            setTimeout(dispatchModules, 800); // 每0.8秒调度一个模块
          } else {
            // 调度完成，开始执行工作流
            setTimeout(() => {
              setExecutionLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ 智能模块调度完成，开始执行工作流`, ...prev]);
              setIsDispatcherActive(false);
              setHighlightedAgents(task.requiredModules);
              setExecutionState('running');

              // 开始正常的工作流执行
              setTimeout(() => {
                startTaskExecution(task);
              }, 1000);
            }, 1000);
          }
        };

        dispatchModules();
      }, 1000);
    }, 1500);
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
          // 移除后端连接日志
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket连接错误:', error);
          setWsConnected(false);
          // 移除后端连接失败日志
        };

        ws.onclose = () => {
          console.log('⚠️ WebSocket连接已关闭');
          setWsConnected(false);
          // 移除后端连接断开日志
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
        // 移除WebSocket创建失败日志
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

  const startRealExecution = async (task: ScenarioCard) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      startTaskExecution(task); // Fallback to simulation
      return;
    }

    try {
      // Send scenario execution request via WebSocket for manual workflow
      const message = {
        type: 'manual-workflow',
        workflowId: task.id,
        sessionId,
        scenarioTitle: task.title,
        scenarioId: task.id,
        workflow: task.workflow,
        requiredModules: task.requiredModules
      };

      console.log('Sending WebSocket message:', message);
      wsRef.current.send(JSON.stringify(message));

      // 移除后端执行日志
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      startTaskExecution(task); // Fallback to simulation
    }
  };

  const startTaskExecution = (task: ScenarioCard) => {
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

        // Add detailed processing info for all scenarios
        setTimeout(() => {
          const processingDetails: Record<string, string[]> = {
              // 场景01: 合同智能审查 - 核心步骤 legal-02
              'scenario-01-legal-02': [
                '获取会议记录 → 3场会议',
                '提取邮件往来 → 12封邮件',
                '检测条款矛盾 → 违约金50% vs 20%',
                '检测知识产权冲突 → 归属不明',
                '风险评分 → 62/100 (中高风险)'
              ],

              // 场景02: 合作伙伴背调 - 核心步骤 legal-09
              'scenario-02-legal-09': [
                '查询裁判文书 → 诉讼3起',
                '检查失信记录 → 无失信',
                '查询行政处罚 → 2次违规',
                '舆情扫描 → 负面新闻5条',
                '综合评级 → B级 (中等风险)'
              ],

              // 场景03: 设备监控预警 - 核心步骤 tech-02
              'scenario-03-tech-02': [
                '加载LSTM模型 → 启动分析',
                '振动数据 → 异常波动+38%',
                '温度曲线 → 升高+12°C',
                '噪音频谱 → 高频异响',
                '定位部件 → 主轴承 (置信度92%)'
              ],

              // 场景04: 客户投诉分析 - 核心步骤 product-02
              'scenario-04-product-02': [
                '检索历史工单 → 相似12起',
                '识别共性 → 物流破损+延迟',
                '追溯供应链 → 定位物流商',
                '质检分析 → 包装不达标',
                '根因确定 → 物流+质检失误'
              ],

              // 场景05: 营销内容合规 - 核心步骤 legal-04
              'scenario-05-legal-04': [
                '加载违禁词库 → 2024版',
                '检测绝对化用词 → "最佳"、"第一"',
                '识别夸大宣传 → "100%有效"',
                '统计违规 → 广告法5处',
                '风险评估 → 中风险'
              ],

              // 场景06: 财务异常检测 - 核心步骤 tech-02
              'scenario-06-tech-02': [
                '启动异常检测 → Isolation Forest',
                '扫描交易记录 → 18,523笔',
                '识别异常金额 → 超限额2笔',
                '检测频繁小额 → ¥9,999×5笔',
                '标记可疑账户 → 异常总额¥285万'
              ]
            };

            const key = `${task.id}-${step.agentId}`;
            const details = processingDetails[key] || step.details;
            if (details) {
              details.forEach((detail, index) => {
                setTimeout(() => {
                  setExecutionLogs(prev => [
                    `[${new Date().toLocaleTimeString()}] ${detail}`,
                    ...prev.slice(0, 50)
                  ]);
                }, index * 1000);  // 5条日志 * 1000ms = 5秒，留3秒给完成日志
              });
            }
          }, 500);

        // Simulate step execution
        setTimeout(() => {
          // Mark as completed and add output
          setCompletedAgents(prev => [...prev, step.agentId]);
          setCurrentExecutingAgent(null);

          // Simulate module output (in real implementation this would come from backend)
          const output: ModuleOutput = {
            moduleId: step.agentId,
            content: `## ${step.action} 执行报告\n\n### 场景概述\n${step.agentName} 已完成 ${step.action}\n\n### 详细结果\n- ${step.details?.join('\n- ')}\n\n### 状态\n✅ 执行成功完成`,
            timestamp: new Date().toISOString()
          };
          setAgentOutputs(prev => [...prev, output]);

          // Add completion logs
          setExecutionLogs(prev => [
            `[${new Date().toLocaleTimeString()}] ✅ ${step.agentName} 已完成 ${step.action}`,
            ...prev.slice(0, 30)
          ]);

          // Update progress
          setTaskProgress(((stepIndex + 1) / task.workflow.length) * 100);

          stepIndex++;
          if (stepIndex < task.workflow.length) {
            executeStep();
          } else {
            // Scenario completed
            setExecutionState('completed');
            setExecutionLogs(prev => [
              `[${new Date().toLocaleTimeString()}] 🎉 场景执行完成!`,
              ...prev.slice(0, 20)
            ]);

            // Auto-navigate after a delay
            setTimeout(() => {
              onScenarioComplete();
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

  // 布局常量（根据视觉可微调）
  const NODE_SIZE_PERCENT = 3.5;        // 节点近似直径（%） - 减小以适应更多节点
  const LABEL_HEIGHT_PERCENT = 2.0;     // 标签高度（%），含行高
  const CELL_X_PADDING = 0.5;           // 每格左右内边距（%）
  const CELL_Y_PADDING = 0.5;           // 每格上下内边距（%）
  const ROW_EXTRA_GAP_FOR_LABEL = 1.0;  // 标签与下一行卡片的额外行距（%）
  const AREA_SAFE_PADDING = 1.5;        // 部门区域整体安全边距（%） - 减小以获得更多可用空间

  // 单元格最小尺寸（硬约束）
  const MIN_CELL_W = NODE_SIZE_PERCENT + CELL_X_PADDING * 2;
  const MIN_CELL_H = NODE_SIZE_PERCENT + LABEL_HEIGHT_PERCENT + CELL_Y_PADDING * 2 + ROW_EXTRA_GAP_FOR_LABEL;

  // 按"列数搜索"选择最优网格（接近方形，且不越界）
  const pickBestGrid = (count: number, usableW: number, usableH: number) => {
    let best: { cols: number; rows: number; cellW: number; cellH: number } | null = null;

    // 从1开始遍历所有可能的列数
    for (let cols = 1; cols <= count; cols++) {
      const rows = Math.ceil(count / cols);
      const cellW = usableW / cols;
      const cellH = usableH / rows;

      // 单元必须满足最小尺寸约束
      if (cellW >= MIN_CELL_W && cellH >= MIN_CELL_H) {
        if (!best) {
          best = { cols, rows, cellW, cellH };
        } else {
          const curScore = Math.abs(cols - rows);
          const bestScore = Math.abs(best.cols - best.rows);
          // 先选择更接近方形的布局，其次选择单元格更宽的（视觉更舒展）
          if (curScore < bestScore || (curScore === bestScore && cellW > best.cellW)) {
            best = { cols, rows, cellW, cellH };
          }
        }
      }
    }

    // 如果一个可行解都没有，降级处理
    if (!best) {
      // 尝试找到最大可能的列数
      let cols = Math.min(count, Math.floor(usableW / MIN_CELL_W));
      cols = Math.max(1, cols);
      let rows = Math.ceil(count / cols);

      // 如果高度还是不够，减少列数增加行数
      while (rows * MIN_CELL_H > usableH && cols > 1) {
        cols -= 1;
        rows = Math.ceil(count / cols);
      }

      const cellW = Math.max(MIN_CELL_W, usableW / cols);
      const cellH = Math.max(MIN_CELL_H, usableH / rows);
      best = { cols, rows, cellW, cellH };
    }

    return best!;
  };

  // 预计算所有模块的位置
  const agentPositions = useMemo(() => {
    const positions: Record<string, ModulePosition> = {};

    // 部门 -> modules 列表
    const deptModulesMap: Record<string, SmartModule[]> = {};
    agents.forEach(a => {
      (deptModulesMap[a.department] ||= []).push(a);
    });

    Object.entries(departmentAreas).forEach(([dept, area]) => {
      const list = deptModulesMap[dept] || [];
      const count = list.length;
      if (count === 0) return;

      // 应用安全边距后的可用区域
      const baseX = area.x + AREA_SAFE_PADDING;
      const baseY = area.y + AREA_SAFE_PADDING;
      const usableW = Math.max(0, area.width - AREA_SAFE_PADDING * 2);
      const usableH = Math.max(0, area.height - AREA_SAFE_PADDING * 2);

      const { cols, rows, cellW, cellH } = pickBestGrid(count, usableW, usableH);

      // 将网格整体居中于部门区域
      const gridW = cols * cellW;
      const gridH = rows * cellH;
      const offsetX = baseX + (usableW - gridW) / 2;
      const offsetY = baseY + (usableH - gridH) / 2;

      list.forEach((module, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;

        // 对于最后一行不足列的情况，计算该行实际列数并水平居中
        const itemsInRow = r === rows - 1 ? (count - r * cols) : cols;
        const rowStartOffset = r === rows - 1 ? (cols - itemsInRow) * cellW / 2 : 0;

        const cellLeft = offsetX + c * cellW + rowStartOffset;
        const cellTop  = offsetY + r * cellH;

        // 节点中心放在上半部分，给下面标签留足空间
        const centerX = cellLeft + cellW / 2;
        const centerY = cellTop + CELL_Y_PADDING + NODE_SIZE_PERCENT / 2;

        const finalX = Math.min(98, Math.max(2, centerX));
        const finalY = Math.min(95, Math.max(5, centerY));

        positions[module.id] = {
          style: { left: `${finalX}%`, top: `${finalY}%` },
          coords: { x: finalX, y: finalY },
        };
      });
    });

    return positions;
  }, [agents, departmentAreas]);

  const getAgentPosition = (agent: SmartModule, index: number): ModulePosition => {
    return agentPositions[agent.id] || { style: { left: '50%', top: '50%' }, coords: { x: 50, y: 50 } };
  };

  const renderAgent = (agent: SmartModule, index: number) => {
    const isHovered = hoveredAgent === agent.id;
    const isHighlighted = highlightedAgents.includes(agent.id);
    const isSelected = selectedTask && selectedTask.requiredModules.includes(agent.id);
    const isExecuting = currentExecutingAgent === agent.id;
    const isCompleted = completedAgents.includes(agent.id);
    const hasOutput = agentOutputs.some(o => o.moduleId === agent.id);
    const isBeingDispatched = executionState === 'dispatching' && dispatchingAgents.includes(agent.id);
    const isDimmed = executionState === 'dispatching' && !isSelected && !isBeingDispatched;

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
          ${(isHighlighted || isSelected) ? 'scale-125 border-primary border-3 shadow-[0_0_30px_hsl(var(--primary)/0.7)] z-30' : isBeingDispatched ? 'scale-125 border-tech-green border-3 shadow-[0_0_30px_hsl(var(--tech-green)/0.7)] z-30' : 'scale-100'}
          ${isDimmed ? 'opacity-20 scale-80' : executionState === 'running' && !isSelected ? 'opacity-30 scale-90' : 'opacity-100'}
          ${isHovered ? 'scale-110 z-40' : ''}
          ${isExecuting ? 'animate-pulse shadow-[0_0_40px_hsl(var(--primary)/0.9)]' : ''}
          ${isCompleted ? 'bg-green-500/30 border-green-400 shadow-[0_0_25px_hsl(120,60%,50%,0.6)]' : ''}
          ${isBeingDispatched ? 'bg-tech-green/30 border-tech-green animate-pulse shadow-[0_0_30px_hsl(var(--tech-green)/0.8)]' : ''}
          ${!isHighlighted && !isSelected && !isHovered && !isExecuting && !isCompleted && executionState === 'idle' && !isBeingDispatched ? 'animate-[breathe_4s_ease-in-out_infinite]' : ''}
        `}
        style={position.style}
        onMouseEnter={() => setHoveredAgent(agent.id)}
        onMouseLeave={() => setHoveredAgent(null)}
        onClick={() => hasOutput && handleAgentClick(agent.id)}
      >
        <div className="relative z-10">
          <Users className="w-8 h-8 opacity-90" />
          {isCompleted && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          {isExecuting && !isCompleted && (
            <Loader2 className="w-3 h-3 text-primary absolute -top-1 -right-1 animate-spin" />
          )}
        </div>

        {/* 名称标签：贴近Agent节点 */}
        <div
          className="
            absolute left-1/2 top-[110%] -translate-x-1/2
            whitespace-nowrap text-xs leading-tight font-bold
            text-foreground pointer-events-none
            bg-black/70 rounded px-1.5 py-0.5
            max-w-[8rem] overflow-hidden text-ellipsis
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
          "
          title={agent.name}
        >
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
                AI智能协同平台
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                50+ 智能模块 · 跨领域协作演示
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

            {/* Connection Lines between Agents - REMOVED */}

            {/* Central Dispatcher Agent */}
            <div
              className={`absolute rounded-2xl border-4 p-4 transition-all duration-700 transform flex flex-col items-center justify-center text-center w-20 h-20 z-50 ${
                executionState === 'dispatching' && isDispatcherActive
                  ? 'border-tech-green bg-tech-green/30 scale-125 shadow-[0_0_60px_hsl(var(--tech-green)/0.8)] animate-pulse'
                  : executionState === 'running'
                  ? 'border-primary/60 bg-primary/10 scale-100 opacity-60'
                  : executionState === 'completed'
                  ? 'border-green-400 bg-green-400/20 scale-100'
                  : 'border-primary bg-primary/20 hover:scale-110 hover:shadow-[0_0_60px_hsl(var(--primary)/0.8)] animate-pulse-glow'
              }`}
              style={{
                left: `${centralDispatcher.x}%`,
                top: `${centralDispatcher.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Network className={`w-10 h-10 ${
                executionState === 'dispatching' && isDispatcherActive
                  ? 'text-tech-green'
                  : executionState === 'running'
                  ? 'text-primary/60'
                  : executionState === 'completed'
                  ? 'text-green-400'
                  : 'text-primary'
              }`} />
              <div className={`absolute left-1/2 top-[125%] -translate-x-1/2 whitespace-nowrap text-sm font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/40 rounded-lg px-2.5 py-1 ${
                executionState === 'dispatching' && isDispatcherActive
                  ? 'text-tech-green'
                  : executionState === 'running'
                  ? 'text-primary/60'
                  : executionState === 'completed'
                  ? 'text-green-400'
                  : 'text-primary'
              }`}>
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
          {/* Scenario Pool Header - Sci-Fi Style */}
          <div className="px-6 py-2 border-b border-tech-blue/30 flex items-center justify-between bg-gradient-to-r from-black/80 via-tech-blue/5 to-black/80">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-tech-blue animate-pulse" />
              <h3 className="text-lg font-bold bg-gradient-to-r from-tech-blue to-primary bg-clip-text text-transparent">
                🚀 智能场景池
              </h3>
              <span className="text-sm text-tech-blue/80 font-mono">[{taskCards.length} SCENARIOS]</span>
            </div>
            <ChevronUp className={`w-5 h-5 text-tech-blue transition-transform duration-300 ${isTaskPoolVisible ? 'rotate-0' : 'rotate-180'}`} />
          </div>

          {/* Scenario Cards */}
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
                            <div className="text-lg font-bold text-tech-green font-mono">{task.requiredModules.length.toString().padStart(2, '0')}</div>
                            <div className="text-xs text-tech-blue/80 font-mono">MODULES</div>
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
              <span className="text-tech-green">▶ COMPLETED: {completedAgents.length}/{selectedTask.requiredModules.length}</span>
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
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-7 text-xs border-tech-blue/50 hover:border-tech-blue hover:bg-tech-blue/10"
                onClick={() => setShowLogDialog(true)}
              >
                <Maximize2 className="w-3 h-3" />
                放大
              </Button>
              <span className="text-xs font-mono text-tech-blue/60">LIVE</span>
            </div>
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

      {/* Execution Log Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-hidden flex flex-col bg-gradient-to-br from-black via-tech-blue/5 to-black border-2 border-tech-blue/50">
          <DialogHeader className="border-b border-tech-blue/30 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-tech-blue to-tech-green bg-clip-text text-transparent flex items-center gap-3">
              <Activity className="w-7 h-7 text-tech-green animate-pulse" />
              实时执行日志 / Real-time Execution Logs
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <div className="space-y-3 py-4">
              {executionLogs.length === 0 ? (
                <div className="text-center text-tech-blue/60 py-20">
                  <Activity className="w-16 h-16 mx-auto mb-4 opacity-50 animate-pulse" />
                  <p className="text-xl font-mono">▶ AWAITING TASK INITIALIZATION...</p>
                </div>
              ) : (
                executionLogs.map((log, index) => (
                  <div
                    key={index}
                    className="bg-black/60 border border-tech-blue/20 rounded-lg p-4 hover:border-tech-green/40 transition-all duration-200"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-tech-blue/20 to-tech-green/20 border border-tech-blue/40 flex items-center justify-center">
                        <span className="text-tech-green font-mono font-bold text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1 leading-relaxed">
                        <p className="text-lg text-green-400/90 font-mono">
                          ▶ {log}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
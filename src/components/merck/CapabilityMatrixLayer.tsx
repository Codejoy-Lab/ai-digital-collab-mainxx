import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft, Database, BarChart3, Brain, Zap, Shield, FileCheck,
  Network, CheckCircle2, Loader2, Crown, ChevronUp, Activity, Clock,
  X, Check, Maximize2, FileText, TrendingUp, Users, DollarSign,
  Factory, ShoppingCart, MessageSquare, Lightbulb, Target, FileSpreadsheet,
  FolderOpen, FileSearch, Link, Eraser, Search, PieChart, Scale,
  GitBranch, Eye, Monitor, Lock, Settings, Play, Send, AlertCircle
} from 'lucide-react';
import { SelectedScenario, WorkflowStep } from '@/pages/MerckAIHubPage';
import { buildApiUrl, WS_BASE_URL } from '@/config/api.config';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckpointDialog } from './CheckpointDialog';

interface CapabilityMatrixLayerProps {
  onScenarioSelect: (scenario: SelectedScenario) => void;
  onBack: () => void;
  onScenarioComplete: (checkpointDecisions?: Record<string, any>) => void;
}

interface AICapability {
  id: string;
  name: string;
  nameEn: string;
  category: 'data' | 'analysis' | 'decision' | 'execution' | 'monitoring' | 'compliance';
  role: string;
}

interface ScenarioCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  requiredCapabilities: string[];
  workflow: WorkflowStep[];
  isRealExecution?: boolean;
}

interface CapabilityPosition {
  style: { left: string; top: string; transform?: string };
  coords: { x: number; y: number };
}

interface CapabilityOutput {
  capabilityId: string;
  content: string;
  timestamp: string;
}

export const CapabilityMatrixLayer = ({
  onScenarioSelect,
  onBack,
  onScenarioComplete
}: CapabilityMatrixLayerProps) => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const [hoveredCapability, setHoveredCapability] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioCard | null>(null);
  const [highlightedCapabilities, setHighlightedCapabilities] = useState<string[]>([]);
  const [isScenarioPoolVisible, setIsScenarioPoolVisible] = useState(false);
  const [executionState, setExecutionState] = useState<'idle' | 'dispatching' | 'running' | 'completed'>('idle');
  const [currentExecutingCapability, setCurrentExecutingCapability] = useState<string | null>(null);
  const [completedCapabilities, setCompletedCapabilities] = useState<string[]>([]);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [scenarioProgress, setScenarioProgress] = useState(0);
  const [capabilityOutputs, setCapabilityOutputs] = useState<CapabilityOutput[]>([]);
  const [selectedCapabilityOutput, setSelectedCapabilityOutput] = useState<CapabilityOutput | null>(null);
  const [showOutputDialog, setShowOutputDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [executionStarted, setExecutionStarted] = useState(false);
  const [isOrchestratorActive, setIsOrchestratorActive] = useState(false);
  const [dispatchingCapabilities, setDispatchingCapabilities] = useState<string[]>([]);
  const [stepDynamicMessages, setStepDynamicMessages] = useState<Record<string, string[]>>({});
  const [currentCheckpoint, setCurrentCheckpoint] = useState<any | null>(null);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [checkpointDecisions, setCheckpointDecisions] = useState<Record<string, any>>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(`merck_${Date.now()}`);
  const wsRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 40+ AI Capabilities organized by categories
  const capabilities: AICapability[] = [
    // Data Processing Capabilities (8)
    { id: 'data-01', name: '数据画像能力', nameEn: 'Data Profiling', category: 'data', role: 'Profiling' },
    { id: 'data-02', name: '数据映射能力', nameEn: 'Data Mapping', category: 'data', role: 'Mapping' },
    { id: 'data-03', name: '信息收集能力', nameEn: 'Info Gathering', category: 'data', role: 'Collection' },
    { id: 'data-04', name: '数据整合能力', nameEn: 'Data Integration', category: 'data', role: 'Integration' },
    { id: 'data-05', name: '数据清洗能力', nameEn: 'Data Cleansing', category: 'data', role: 'Cleansing' },
    { id: 'data-06', name: '数据抽取能力', nameEn: 'Data Extraction', category: 'data', role: 'Extraction' },
    { id: 'data-07', name: '多源检索能力', nameEn: 'Multi-source Search', category: 'data', role: 'Search' },
    { id: 'data-08', name: '知识图谱能力', nameEn: 'Knowledge Graph', category: 'data', role: 'Graph' },

    // Analysis Capabilities (9)
    { id: 'analysis-01', name: '对账分析能力', nameEn: 'Reconciliation', category: 'analysis', role: 'Reconciliation' },
    { id: 'analysis-02', name: '风险评分能力', nameEn: 'Risk Scoring', category: 'analysis', role: 'Scoring' },
    { id: 'analysis-03', name: '风险分析能力', nameEn: 'Risk Analysis', category: 'analysis', role: 'Analysis' },
    { id: 'analysis-04', name: '需求预测能力', nameEn: 'Demand Forecast', category: 'analysis', role: 'Forecasting' },
    { id: 'analysis-05', name: '趋势分析能力', nameEn: 'Trend Analysis', category: 'analysis', role: 'Trends' },
    { id: 'analysis-06', name: '主题聚类能力', nameEn: 'Topic Clustering', category: 'analysis', role: 'Clustering' },
    { id: 'analysis-07', name: '价格弹性分析', nameEn: 'Price Elasticity', category: 'analysis', role: 'Pricing' },
    { id: 'analysis-08', name: '质量风险分析', nameEn: 'Quality Risk', category: 'analysis', role: 'Quality' },
    { id: 'analysis-09', name: '健康监测能力', nameEn: 'Health Monitor', category: 'analysis', role: 'Monitoring' },

    // Decision Support Capabilities (8)
    { id: 'decision-01', name: '评分解释能力', nameEn: 'Score Explanation', category: 'decision', role: 'Explanation' },
    { id: 'decision-02', name: '决策支持能力', nameEn: 'Decision Support', category: 'decision', role: 'Support' },
    { id: 'decision-03', name: '库存产能优化', nameEn: 'Inventory Optimization', category: 'decision', role: 'Optimization' },
    { id: 'decision-04', name: '机会识别能力', nameEn: 'Opportunity ID', category: 'decision', role: 'Opportunity' },
    { id: 'decision-05', name: '产品匹配能力', nameEn: 'Product Matching', category: 'decision', role: 'Matching' },
    { id: 'decision-06', name: '需求理解能力', nameEn: 'Query Understanding', category: 'decision', role: 'Understanding' },
    { id: 'decision-07', name: '线索评分能力', nameEn: 'Lead Scoring', category: 'decision', role: 'Lead' },
    { id: 'decision-08', name: '定价模拟能力', nameEn: 'Pricing Simulation', category: 'decision', role: 'Simulation' },

    // Execution Capabilities (7)
    { id: 'exec-01', name: '催收策略能力', nameEn: 'Collection Strategy', category: 'execution', role: 'Strategy' },
    { id: 'exec-02', name: '升级决策能力', nameEn: 'Escalation', category: 'execution', role: 'Escalation' },
    { id: 'exec-03', name: '失衡预警能力', nameEn: 'Imbalance Alert', category: 'execution', role: 'Alert' },
    { id: 'exec-04', name: '维护派工能力', nameEn: 'Maintenance Dispatch', category: 'execution', role: 'Dispatch' },
    { id: 'exec-05', name: '通话监听能力', nameEn: 'Call Listener', category: 'execution', role: 'Listener' },
    { id: 'exec-06', name: '应答辅助能力', nameEn: 'Answer Assistant', category: 'execution', role: 'Answer' },
    { id: 'exec-07', name: '初稿生成能力', nameEn: 'Draft Generation', category: 'execution', role: 'Drafting' },

    // Monitoring Capabilities (4)
    { id: 'monitor-01', name: '风险看板能力', nameEn: 'Risk Dashboard', category: 'monitoring', role: 'Dashboard' },
    { id: 'monitor-02', name: 'S&OP摘要能力', nameEn: 'S&OP Summary', category: 'monitoring', role: 'Summary' },
    { id: 'monitor-03', name: '工厂报告能力', nameEn: 'Factory Reporting', category: 'monitoring', role: 'Reporting' },
    { id: 'monitor-04', name: '通话总结能力', nameEn: 'Call Summary', category: 'monitoring', role: 'CallSummary' },

    // Compliance Capabilities (6)
    { id: 'compliance-01', name: '审计记录能力', nameEn: 'Audit Trail', category: 'compliance', role: 'Audit' },
    { id: 'compliance-02', name: '合规安全能力', nameEn: 'Safety Compliance', category: 'compliance', role: 'Safety' },
    { id: 'compliance-03', name: '合规提醒能力', nameEn: 'Compliance Alert', category: 'compliance', role: 'Alert' },
    { id: 'compliance-04', name: '科学审校能力', nameEn: 'Scientific Review', category: 'compliance', role: 'Review' },
    { id: 'compliance-05', name: '版本治理能力', nameEn: 'Version Governance', category: 'compliance', role: 'Governance' },
    { id: 'compliance-06', name: '说明生成能力', nameEn: 'Explanation Gen', category: 'compliance', role: 'Explanation' },
  ];

  // 10 Merck Business Scenarios
  const scenarioCards: ScenarioCard[] = [
    // A1 - Master Data & 财务对账
    {
      id: 'scenario-a1',
      title: 'Master Data & 财务对账',
      titleEn: 'Master Data & Reconciliation',
      description: '多ERP系统主数据统一与自动对账',
      descriptionEn: 'Master data unification and auto-reconciliation across ERPs',
      icon: 'FileSpreadsheet',
      requiredCapabilities: ['data-01', 'data-02', 'analysis-01', 'compliance-01'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'data-01',
          capabilityName: '数据画像能力',
          capabilityNameEn: 'Data Profiling',
          action: '扫描多ERP主数据质量',
          actionEn: 'Scan master data quality',
          duration: 3500,
          details: ['识别缺失数据', '发现重复记录', '检测数据冲突', '生成清洗建议'],
          detailsEn: ['Identify missing data', 'Find duplicates', 'Detect conflicts', 'Generate cleanup suggestions']
        },
        {
          id: 'w2',
          capabilityId: 'data-02',
          capabilityName: '数据映射能力',
          capabilityNameEn: 'Data Mapping',
          action: '实体同一性匹配',
          actionEn: 'Entity matching',
          duration: 4000,
          details: ['基于名称匹配', '地址税号关联', '历史交易分析', '输出映射置信度'],
          detailsEn: ['Name-based matching', 'Address & tax ID linking', 'Transaction history analysis', 'Output confidence scores']
        },
        {
          id: 'w3',
          capabilityId: 'analysis-01',
          capabilityName: '对账分析能力',
          capabilityNameEn: 'Reconciliation',
          action: '自动勾对与差异分析',
          actionEn: 'Auto-reconciliation & variance analysis',
          duration: 4500,
          details: ['订单发票匹配', '回款勾对', '识别差异类型', '归类差异原因'],
          detailsEn: ['Match orders & invoices', 'Payment reconciliation', 'Identify variance types', 'Classify root causes']
        },
        {
          id: 'w4',
          capabilityId: 'compliance-01',
          capabilityName: '审计记录能力',
          capabilityNameEn: 'Audit Trail',
          action: '生成审计报告',
          actionEn: 'Generate audit report',
          duration: 3000,
          details: ['记录对账过程', '追踪人工调整', '生成审计轨迹', '支撑内外审计'],
          detailsEn: ['Record reconciliation process', 'Track manual adjustments', 'Generate audit trail', 'Support audits']
        }
      ]
    },

    // A2 - AR & Credit Management
    {
      id: 'scenario-a2',
      title: 'AR & Credit 风险管理',
      titleEn: 'AR & Credit Management',
      description: '应收账款风险量化与催收策略优化',
      descriptionEn: 'AR risk quantification and collection optimization',
      icon: 'DollarSign',
      requiredCapabilities: ['analysis-02', 'exec-01', 'exec-02', 'monitor-01'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'analysis-02',
          capabilityName: '风险评分能力',
          capabilityNameEn: 'Risk Scoring',
          action: '客户信用评分',
          actionEn: 'Customer credit scoring',
          duration: 3500,
          details: ['交易行为分析', 'Overdue模式识别', '外部信用信息', '违约概率预测'],
          detailsEn: ['Transaction behavior analysis', 'Overdue pattern recognition', 'External credit info', 'Default probability prediction']
        },
        {
          id: 'w2',
          capabilityId: 'exec-01',
          capabilityName: '催收策略能力',
          capabilityNameEn: 'Collection Strategy',
          action: '生成催收策略',
          actionEn: 'Generate collection strategy',
          duration: 4000,
          details: ['基于风险等级分层', '推荐催收节奏', '选择沟通渠道', '提供话术模板'],
          detailsEn: ['Risk-based segmentation', 'Recommend collection pace', 'Select channels', 'Provide script templates']
        },
        {
          id: 'checkpoint-a2-1',
          type: 'checkpoint',
          capabilityId: 'exec-01',
          capabilityName: '确认高风险客户催收策略',
          capabilityNameEn: 'Confirm Collection Strategy',
          action: '审核高风险客户催收策略',
          actionEn: 'Review high-risk customer collection strategy',
          duration: 0,
          details: ['确认AI识别结果', '评估催收策略', '选择执行方案'],
          detailsEn: ['Confirm AI identification', 'Evaluate collection strategy', 'Select execution plan'],
          checkpoint: {
            checkpointType: 'decide',
            title: '高风险客户催收策略确认',
            titleEn: 'High-Risk Customer Collection Strategy',
            description: 'AI识别28个高风险客户，总应收¥4,235万，请确认催收策略',
            descriptionEn: 'AI identified 28 high-risk customers with ¥42.35M AR, please confirm strategy',
            capabilityName: '催收策略能力',
            capabilityNameEn: 'Collection Strategy',
            summary: {
              'High-Risk Customers': '28',
              'Total AR': '¥4,235万',
              'Avg Overdue': '47 days',
              'Estimated Recovery': '82%'
            },
            aiInsights: {
              'Critical (>90d)': '8 customers',
              'High (60-90d)': '12 customers',
              'Medium (30-60d)': '8 customers',
              'Recovery Rate': '82% expected'
            },
            options: [
              {
                id: 'approve-ai',
                label: '批准AI推荐策略',
                labelEn: 'Approve AI strategy',
                primary: true
              },
              {
                id: 'adjust',
                label: '调整部分客户策略',
                labelEn: 'Adjust for some customers'
              },
              {
                id: 'manual',
                label: '转人工全面审核',
                labelEn: 'Manual review required',
                risk: true
              }
            ]
          }
        },
        {
          id: 'w3',
          capabilityId: 'exec-02',
          capabilityName: '升级决策能力',
          capabilityNameEn: 'Escalation',
          action: '评估法律升级',
          actionEn: 'Assess legal escalation',
          duration: 3500,
          details: ['识别高风险客户', '评估升级时机', '整理证据材料', '生成法律建议'],
          detailsEn: ['Identify high-risk customers', 'Assess escalation timing', 'Compile evidence', 'Generate legal advice']
        },
        {
          id: 'w4',
          capabilityId: 'monitor-01',
          capabilityName: '风险看板能力',
          capabilityNameEn: 'Risk Dashboard',
          action: '生成AR风险看板',
          actionEn: 'Generate AR risk dashboard',
          duration: 3000,
          details: ['按BU区域拆分', '风险趋势分析', '逾期账龄分布', 'CFO决策视图'],
          detailsEn: ['Breakdown by BU/region', 'Risk trend analysis', 'Aging distribution', 'CFO decision view']
        }
      ]
    },

    // A3 - 供应商尽调
    {
      id: 'scenario-a3',
      title: '供应商尽调 & 风险监测',
      titleEn: 'Supplier Due Diligence',
      description: '供应商准入、复审与动态风险监测',
      descriptionEn: 'Supplier onboarding, review and dynamic risk monitoring',
      icon: 'Shield',
      requiredCapabilities: ['data-03', 'analysis-03', 'decision-01', 'decision-02', 'compliance-01'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'data-03',
          capabilityName: '信息收集能力',
          capabilityNameEn: 'Info Gathering',
          action: '多源信息抓取',
          actionEn: 'Multi-source data collection',
          duration: 4000,
          details: ['财报数据获取', '媒体报道监测', '制裁名单检查', 'ESG报告分析'],
          detailsEn: ['Financial statement retrieval', 'Media monitoring', 'Sanction list check', 'ESG report analysis']
        },
        {
          id: 'checkpoint-a3-1',
          type: 'checkpoint',
          capabilityId: 'data-03',
          capabilityName: '专员确认数据完整性',
          capabilityNameEn: 'Data Completeness Review',
          action: '审核供应商数据完整性',
          actionEn: 'Review supplier data completeness',
          duration: 0,
          details: ['检查数据源覆盖', '评估数据质量', '确认缺失项', '决定是否继续'],
          detailsEn: ['Check data source coverage', 'Assess data quality', 'Identify gaps', 'Decide next steps'],
          checkpoint: {
            checkpointType: 'review',
            title: '供应商数据完整性审核',
            titleEn: 'Supplier Data Completeness Review',
            description: 'AI已收集供应商Acme Chemicals Inc.的多源信息，请确认数据完整性',
            descriptionEn: 'AI collected multi-source data for Acme Chemicals Inc., please confirm completeness',
            capabilityName: '信息收集能力',
            capabilityNameEn: 'Info Gathering',
            summary: {
              'Supplier': 'Acme Chemicals Inc.',
              'Data Sources': '18 sources',
              'Completeness': '92%',
              'Last Updated': '2 hours ago'
            },
            aiInsights: {
              'Financial Data': 'Complete (5 years)',
              'Legal Records': 'Complete',
              'ESG Reports': 'Partial (2023-2024)',
              'Media Coverage': 'Complete'
            },
            anomalies: [
              {
                equipment: '财务数据',
                equipmentEn: 'Financial Data',
                severity: 'info',
                signals: [
                  { type: '年报', value: '2019-2024 (6年)', status: 'normal' },
                  { type: '审计报告', value: '已获取', status: 'normal' },
                  { type: '现金流报表', value: '已获取', status: 'normal' }
                ]
              },
              {
                equipment: '合规记录',
                equipmentEn: 'Compliance Records',
                severity: 'info',
                signals: [
                  { type: '制裁名单', value: '无匹配', status: 'normal' },
                  { type: '诉讼记录', value: '2起已结案', status: 'normal' },
                  { type: 'FDA记录', value: '1起warning letter (2022)', status: 'normal' }
                ]
              },
              {
                equipment: 'ESG数据',
                equipmentEn: 'ESG Data',
                severity: 'warning',
                signals: [
                  { type: 'ESG报告', value: '仅2023-2024', status: 'abnormal' },
                  { type: '碳排放数据', value: '已获取', status: 'normal' },
                  { type: '员工安全记录', value: '未完整获取', status: 'abnormal' }
                ],
                aiRecommendation: 'ESG historical data incomplete. Recommend requesting 2020-2022 reports from supplier.'
              }
            ],
            options: [
              {
                id: 'confirm',
                label: '确认数据完整，继续分析',
                labelEn: 'Confirm data, continue analysis',
                primary: true
              },
              {
                id: 'request-more',
                label: '要求补充ESG历史数据',
                labelEn: 'Request additional ESG data'
              },
              {
                id: 'manual-review',
                label: '转人工深度审查',
                labelEn: 'Escalate to manual review',
                risk: true
              }
            ]
          }
        },
        {
          id: 'w2',
          capabilityId: 'analysis-03',
          capabilityName: '风险分析能力',
          capabilityNameEn: 'Risk Analysis',
          action: '多维度风险评估',
          actionEn: 'Multi-dimensional risk assessment',
          duration: 4500,
          details: ['财务健康评估', '法律合规检查', 'ESG表现评分', '交付稳定性分析'],
          detailsEn: ['Financial health assessment', 'Legal compliance check', 'ESG performance scoring', 'Delivery stability analysis']
        },
        {
          id: 'w3',
          capabilityId: 'decision-01',
          capabilityName: '评分解释能力',
          capabilityNameEn: 'Score Explanation',
          action: '生成风险评分与解释',
          actionEn: 'Generate risk score with explanation',
          duration: 3500,
          details: ['全球本地规则融合', '计算综合评分', '自然语言解释', '对比同行基准'],
          detailsEn: ['Global + local rules integration', 'Calculate comprehensive score', 'Natural language explanation', 'Peer benchmark comparison']
        },
        {
          id: 'checkpoint-a3-2',
          type: 'checkpoint',
          capabilityId: 'decision-01',
          capabilityName: '经理评估风险等级',
          capabilityNameEn: 'Manager Risk Assessment',
          action: '评估供应商风险等级',
          actionEn: 'Assess supplier risk level',
          duration: 0,
          details: ['审核六维度评分', '对比行业基准', '评估风险可控性', '决定是否继续'],
          detailsEn: ['Review 6-dimensional scores', 'Compare to peers', 'Assess risk tolerance', 'Decide continuation'],
          checkpoint: {
            checkpointType: 'decide',
            title: '供应商风险等级评估',
            titleEn: 'Supplier Risk Level Assessment',
            description: 'AI完成六维度风险评分，综合得分68/100（中等风险），请评估是否继续',
            descriptionEn: 'AI completed 6-dimensional risk scoring, overall 68/100 (medium risk), please assess',
            capabilityName: '评分解释能力',
            capabilityNameEn: 'Score Explanation',
            summary: {
              'Overall Score': '68/100',
              'Risk Level': 'Medium',
              'Confidence': '91%',
              'Peer Avg': '72/100'
            },
            aiInsights: {
              'Financial': '75/100 (Good)',
              'Legal': '82/100 (Good)',
              'ESG': '58/100 (Fair)',
              'Delivery': '71/100 (Good)',
              'Quality': '64/100 (Fair)',
              'Innovation': '60/100 (Fair)'
            },
            anomalies: [
              {
                equipment: '财务健康',
                equipmentEn: 'Financial Health',
                severity: 'info',
                signals: [
                  { type: 'Revenue Growth', value: '+12% YoY', status: 'normal' },
                  { type: 'Debt Ratio', value: '0.45', status: 'normal' },
                  { type: 'Current Ratio', value: '2.1', status: 'normal' }
                ],
                aiRecommendation: 'Financial metrics healthy, stable growth trajectory.'
              },
              {
                equipment: 'ESG表现',
                equipmentEn: 'ESG Performance',
                severity: 'warning',
                signals: [
                  { type: 'Carbon Intensity', value: 'High vs peers', status: 'abnormal' },
                  { type: 'Safety Incidents', value: '3 in 2024', status: 'abnormal' },
                  { type: 'Diversity Score', value: '62/100', status: 'normal' }
                ],
                aiRecommendation: 'ESG performance below industry average. Recommend quarterly ESG monitoring.'
              },
              {
                equipment: '质量体系',
                equipmentEn: 'Quality System',
                severity: 'warning',
                signals: [
                  { type: 'ISO Certification', value: 'Valid until 2026', status: 'normal' },
                  { type: 'FDA Warnings', value: '1 in 2022', status: 'abnormal' },
                  { type: 'Batch Rejection', value: '2.3%', status: 'abnormal' }
                ],
                aiRecommendation: 'Quality performance acceptable but requires enhanced incoming QC.'
              }
            ],
            aiRecommendation: {
              reason: '建议条件通过。供应商财务和法律风险低，但ESG和质量表现需要加强监控。建议设置季度复审和强化来料检验。',
              reasonEn: 'Recommend conditional approval. Low financial and legal risk, but ESG and quality require enhanced monitoring. Suggest quarterly reviews and strengthened incoming QC.',
              confidence: 91
            },
            options: [
              {
                id: 'continue',
                label: '风险可控，继续审批流程',
                labelEn: 'Risk acceptable, continue approval',
                primary: true
              },
              {
                id: 'conditional',
                label: '要求供应商整改后继续',
                labelEn: 'Require corrective actions first'
              },
              {
                id: 'reject',
                label: '风险过高，拒绝准入',
                labelEn: 'Risk too high, reject',
                risk: true
              }
            ]
          }
        },
        {
          id: 'w4',
          capabilityId: 'decision-02',
          capabilityName: '决策支持能力',
          capabilityNameEn: 'Decision Support',
          action: '准入决策建议',
          actionEn: 'Onboarding decision recommendation',
          duration: 3000,
          details: ['通过/条件通过/拒绝', '配套风控措施', '复审周期建议', '合同条款建议'],
          detailsEn: ['Approve/Conditional/Reject', 'Risk mitigation measures', 'Review cycle recommendation', 'Contract term suggestions']
        },
        {
          id: 'checkpoint-a3-3',
          type: 'checkpoint',
          capabilityId: 'decision-02',
          capabilityName: '总监最终批准',
          capabilityNameEn: 'Director Final Approval',
          action: '最终批准供应商准入',
          actionEn: 'Final approval for supplier onboarding',
          duration: 0,
          details: ['审核AI建议方案', '评估风控措施', '考虑业务影响', '做出最终决策'],
          detailsEn: ['Review AI recommendation', 'Assess risk measures', 'Consider business impact', 'Make final decision'],
          checkpoint: {
            checkpointType: 'approve',
            title: '供应商准入最终批准',
            titleEn: 'Supplier Onboarding Final Approval',
            description: 'AI建议"条件通过"，配套5项风控措施，请最终批准',
            descriptionEn: 'AI recommends "Conditional Approval" with 5 risk mitigation measures, final approval required',
            capabilityName: '决策支持能力',
            capabilityNameEn: 'Decision Support',
            summary: {
              'Recommendation': 'Conditional Approval',
              'Risk Measures': '5 items',
              'Review Cycle': 'Quarterly',
              'Contract Terms': '8 special clauses'
            },
            plans: [
              {
                id: 'conditional',
                name: '条件通过（AI推荐）',
                nameEn: 'Conditional Approval (AI Recommended)',
                description: '准许准入，但需执行5项风控措施',
                recommended: true,
                impact: {
                  'Risk Mitigation': '5 measures',
                  'Review Frequency': 'Quarterly',
                  'Initial Order Limit': '≤ ¥200万/月',
                  'Quality Inspection': 'Enhanced (100%)'
                }
              },
              {
                id: 'approve',
                name: '无条件通过',
                nameEn: 'Unconditional Approval',
                description: '正常准入，标准风控措施',
                impact: {
                  'Risk Mitigation': 'Standard',
                  'Review Frequency': 'Annual',
                  'Initial Order Limit': 'No limit',
                  'Quality Inspection': 'Standard (sampling)'
                }
              },
              {
                id: 'reject',
                name: '拒绝准入',
                nameEn: 'Reject',
                description: '风险过高，拒绝合作',
                impact: {
                  'Alternative Sourcing': 'Required',
                  'Timeline Impact': '+3-6 months',
                  'Cost Impact': 'Potentially +15%',
                  'Risk Elimination': '100%'
                }
              }
            ],
            aiRecommendation: {
              reason: '条件通过是平衡风险与业务需求的最优方案。通过强化监控和来料检验，可有效控制ESG和质量风险。完全拒绝将导致采购周期延长3-6个月。',
              reasonEn: 'Conditional approval optimally balances risk and business needs. Enhanced monitoring and incoming QC effectively mitigate ESG and quality risks. Complete rejection would delay procurement by 3-6 months.',
              confidence: 89
            },
            options: [
              {
                id: 'approve-conditional',
                label: '批准条件通过方案',
                labelEn: 'Approve conditional plan',
                primary: true
              },
              {
                id: 'approve-full',
                label: '批准无条件通过',
                labelEn: 'Approve unconditionally'
              },
              {
                id: 'reject-supplier',
                label: '拒绝供应商准入',
                labelEn: 'Reject supplier',
                risk: true
              }
            ]
          }
        },
        {
          id: 'w5',
          capabilityId: 'compliance-01',
          capabilityName: '审计记录能力',
          capabilityNameEn: 'Audit Trail',
          action: '生成审计报告',
          actionEn: 'Generate audit report',
          duration: 2500,
          details: ['记录数据来源', '规则版本追溯', '人工调整记录', '历史评估存档'],
          detailsEn: ['Record data sources', 'Rule version tracking', 'Manual adjustment log', 'Historical assessment archive']
        }
      ]
    },

    // B1 - 需求预测与产销平衡
    {
      id: 'scenario-b1',
      title: '需求预测与产销平衡',
      titleEn: 'Demand Forecasting & S&OP',
      description: '端到端需求预测与产销协同优化',
      descriptionEn: 'End-to-end forecasting and sales & operations planning',
      icon: 'TrendingUp',
      requiredCapabilities: ['analysis-04', 'decision-03', 'exec-03', 'monitor-02'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'analysis-04',
          capabilityName: '需求预测能力',
          capabilityNameEn: 'Demand Forecast',
          action: '多维度需求预测',
          actionEn: 'Multi-dimensional demand forecasting',
          duration: 4000,
          details: ['按BU/品类/地区预测', '多模型集成预测', '业务修正记录', '统一预测视图'],
          detailsEn: ['Forecast by BU/category/region', 'Multi-model ensemble', 'Business adjustment tracking', 'Unified forecast view']
        },
        {
          id: 'w2',
          capabilityId: 'decision-03',
          capabilityName: '库存产能优化',
          capabilityNameEn: 'Inventory Optimization',
          action: '生产补货方案',
          actionEn: 'Production & replenishment plan',
          duration: 4500,
          details: ['库存约束分析', '产能瓶颈识别', '物料可用性检查', '多场景方案生成'],
          detailsEn: ['Inventory constraint analysis', 'Capacity bottleneck identification', 'Material availability check', 'Multi-scenario plan generation']
        },
        {
          id: 'checkpoint-b1-1',
          type: 'checkpoint',
          capabilityId: 'decision-03',
          capabilityName: '选择产销调整方案',
          capabilityNameEn: 'Select Adjustment Plan',
          action: '选择产销平衡调整方案',
          actionEn: 'Select supply-demand adjustment plan',
          duration: 0,
          details: ['对比三套方案', '评估业务优先级', '考虑成本影响', '选择执行方案'],
          detailsEn: ['Compare 3 plans', 'Assess business priority', 'Consider cost impact', 'Select execution plan'],
          checkpoint: {
            checkpointType: 'decide',
            title: '产销平衡调整方案选择',
            titleEn: 'Supply-Demand Adjustment Plan Selection',
            description: 'AI生成3套调整方案，请根据业务优先级选择',
            descriptionEn: 'AI generated 3 adjustment plans, please select based on business priority',
            capabilityName: '库存产能优化',
            capabilityNameEn: 'Inventory Optimization',
            summary: {
              'Supply Gap': '¥1,850万',
              'Excess Inventory': '¥920万',
              'Affected SKUs': '156',
              'Planning Horizon': 'Q1 2025'
            },
            plans: [
              {
                id: 'conservative',
                name: '保守方案：优先保供应',
                nameEn: 'Conservative: Prioritize supply',
                description: '增加产能，确保关键SKU供应',
                impact: {
                  'Service Level': '98%',
                  'Inventory Cost': '+¥680万',
                  'Production OT': '15%',
                  'Stockout Risk': '1%'
                }
              },
              {
                id: 'balanced',
                name: '平衡方案：AI推荐',
                nameEn: 'Balanced: AI recommended',
                description: '适度增产，部分调拨优化',
                recommended: true,
                impact: {
                  'Service Level': '95%',
                  'Inventory Cost': '+¥320万',
                  'Production OT': '8%',
                  'Stockout Risk': '3%'
                }
              },
              {
                id: 'aggressive',
                name: '激进方案：优先降库存',
                nameEn: 'Aggressive: Prioritize inventory reduction',
                description: '减少生产，加速去库存',
                impact: {
                  'Service Level': '91%',
                  'Inventory Cost': '-¥150万',
                  'Production OT': '0%',
                  'Stockout Risk': '7%'
                }
              }
            ],
            aiRecommendation: {
              reason: '推荐平衡方案。在保证95%服务水平的前提下，合理控制库存成本和加班时间。',
              reasonEn: 'Balanced plan recommended. Maintains 95% service level while controlling inventory cost and overtime.',
              confidence: 87
            },
            options: [
              {
                id: 'select-balanced',
                label: '选择平衡方案',
                labelEn: 'Select balanced plan',
                primary: true
              },
              {
                id: 'select-conservative',
                label: '选择保守方案',
                labelEn: 'Select conservative plan'
              },
              {
                id: 'select-aggressive',
                label: '选择激进方案',
                labelEn: 'Select aggressive plan'
              }
            ]
          }
        },
        {
          id: 'w3',
          capabilityId: 'exec-03',
          capabilityName: '失衡预警能力',
          capabilityNameEn: 'Imbalance Alert',
          action: '产销失衡识别',
          actionEn: 'Supply-demand imbalance detection',
          duration: 3500,
          details: ['识别滞销产品', '识别缺货风险', '推荐调拨方案', '替代品建议'],
          detailsEn: ['Identify slow-moving items', 'Identify stockout risks', 'Recommend transfer plans', 'Suggest substitutes']
        },
        {
          id: 'w4',
          capabilityId: 'monitor-02',
          capabilityName: 'S&OP摘要能力',
          capabilityNameEn: 'S&OP Summary',
          action: '生成S&OP会议材料',
          actionEn: 'Generate S&OP meeting materials',
          duration: 3000,
          details: ['关键数据汇总', '冲突点识别', '推荐方案整理', '决策建议输出'],
          detailsEn: ['Key data summary', 'Conflict identification', 'Recommendation compilation', 'Decision suggestions']
        }
      ]
    },

    // B2 - Smart Manufacturing
    {
      id: 'scenario-b2',
      title: 'Smart Manufacturing 预测性维护',
      titleEn: 'Smart Manufacturing',
      description: '设备健康预测与质量风险预警',
      descriptionEn: 'Equipment health prediction and quality risk alerts',
      icon: 'Factory',
      requiredCapabilities: ['analysis-09', 'analysis-08', 'exec-04', 'monitor-03'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'analysis-09',
          capabilityName: '健康监测能力',
          capabilityNameEn: 'Health Monitor',
          action: '设备健康评估',
          actionEn: 'Equipment health assessment',
          duration: 3500,
          details: ['传感器数据分析', '历史故障学习', '计算健康指数', '预测故障风险'],
          detailsEn: ['Sensor data analysis', 'Historical failure learning', 'Calculate health index', 'Predict failure risk']
        },
        {
          id: 'w2',
          capabilityId: 'analysis-08',
          capabilityName: '质量风险分析',
          capabilityNameEn: 'Quality Risk',
          action: '质量风险预警',
          actionEn: 'Quality risk alert',
          duration: 4000,
          details: ['工艺参数对比', '历史批次分析', '识别质量风险', '工艺调整建议'],
          detailsEn: ['Process parameter comparison', 'Historical batch analysis', 'Quality risk identification', 'Process adjustment suggestions']
        },
        {
          id: 'checkpoint-b2-1',
          type: 'checkpoint',
          capabilityId: 'analysis-08',
          capabilityName: '工程师审核异常',
          capabilityNameEn: 'Engineer Review',
          action: '审核设备异常信号',
          actionEn: 'Review equipment anomalies',
          duration: 0,
          details: ['确认AI检测结果', '评估风险等级', '调整处理优先级', '决定处理方案'],
          detailsEn: ['Confirm AI detection', 'Assess risk level', 'Adjust priority', 'Decide handling plan'],
          checkpoint: {
            checkpointType: 'review',
            title: '设备异常审核',
            titleEn: 'Equipment Anomaly Review',
            description: 'AI检测到5台设备存在异常信号，请审核确认处理优先级',
            descriptionEn: 'AI detected anomalies in 5 equipment units, please review and confirm handling priority',
            capabilityName: '质量风险分析',
            capabilityNameEn: 'Quality Risk',
            aiInsights: {
              'Scanned': '37 units',
              'Anomalies': '5 critical',
              'Risk Level': 'High',
              'Confidence': '94%'
            },
            anomalies: [
              {
                equipment: '反应釜 R-302',
                equipmentEn: 'Reactor R-302',
                severity: 'critical',
                signals: [
                  { type: 'Temperature', value: '142°C', status: 'abnormal' },
                  { type: 'Pressure', value: '3.2 bar', status: 'normal' },
                  { type: 'Vibration', value: '8.3 mm/s', status: 'abnormal' }
                ],
                prediction: {
                  failureProbability: 78,
                  timeToFailure: '18-24 hours'
                },
                aiRecommendation: 'Immediate inspection recommended. Temperature and vibration exceed safe thresholds.'
              },
              {
                equipment: '离心机 C-105',
                equipmentEn: 'Centrifuge C-105',
                severity: 'warning',
                signals: [
                  { type: 'Vibration', value: '6.1 mm/s', status: 'abnormal' },
                  { type: 'Current', value: '22.5 A', status: 'normal' }
                ],
                prediction: {
                  failureProbability: 45,
                  timeToFailure: '3-5 days'
                },
                aiRecommendation: 'Schedule maintenance within 48 hours. Bearing wear suspected.'
              },
              {
                equipment: '干燥机 D-201',
                equipmentEn: 'Dryer D-201',
                severity: 'warning',
                signals: [
                  { type: 'Temperature', value: '88°C', status: 'abnormal' },
                  { type: 'Humidity', value: '42%', status: 'normal' }
                ],
                prediction: {
                  failureProbability: 35,
                  timeToFailure: '5-7 days'
                },
                aiRecommendation: 'Monitor closely. Heating element efficiency declining.'
              }
            ],
            options: [
              {
                id: 'confirm',
                label: '确认异常，继续分析',
                labelEn: 'Confirm anomalies, continue',
                primary: true
              },
              {
                id: 'adjust',
                label: '调整优先级后继续',
                labelEn: 'Adjust priority and continue'
              },
              {
                id: 'cancel',
                label: '暂停流程，人工处理',
                labelEn: 'Pause for manual handling',
                risk: true
              }
            ]
          }
        },
        {
          id: 'w3',
          capabilityId: 'exec-04',
          capabilityName: '维护派工能力',
          capabilityNameEn: 'Maintenance Dispatch',
          action: '维护计划与派工',
          actionEn: 'Maintenance planning & dispatch',
          duration: 4500,
          details: ['推荐维护时机', '平衡订单优先级', '生成维护工单', '智能派工调度'],
          detailsEn: ['Recommend maintenance timing', 'Balance order priority', 'Generate work orders', 'Intelligent dispatch']
        },
        {
          id: 'checkpoint-b2-2',
          type: 'checkpoint',
          capabilityId: 'exec-04',
          capabilityName: '经理批准维护计划',
          capabilityNameEn: 'Manager Approval',
          action: '批准设备维护计划',
          actionEn: 'Approve maintenance plan',
          duration: 0,
          details: ['对比维护方案', '评估停机影响', '考虑订单交付', '选择执行方案'],
          detailsEn: ['Compare maintenance plans', 'Assess downtime impact', 'Consider delivery', 'Select execution plan'],
          checkpoint: {
            checkpointType: 'approve',
            title: '维护计划批准',
            titleEn: 'Maintenance Plan Approval',
            description: 'AI生成了3套维护方案，平衡停机时间与风险，请选择执行方案',
            descriptionEn: 'AI generated 3 maintenance plans balancing downtime and risk, please select one',
            capabilityName: '维护派工能力',
            capabilityNameEn: 'Maintenance Dispatch',
            summary: {
              'Total Equipment': '5 units',
              'Total Downtime': '14-18 hours',
              'Est. Cost': '¥235万',
              'Risk Reduction': '85%'
            },
            plans: [
              {
                id: 'aggressive',
                name: '激进方案：立即全面维护',
                nameEn: 'Aggressive: Immediate full maintenance',
                description: '所有5台设备立即停机维护',
                impact: {
                  'Downtime': '18 hours',
                  'Production Loss': '¥315万',
                  'Risk Reduction': '95%',
                  'Delivery Impact': '2 orders delayed'
                }
              },
              {
                id: 'balanced',
                name: '平衡方案：分批次维护',
                nameEn: 'Balanced: Staged maintenance',
                description: '高风险设备优先，分2批维护',
                recommended: true,
                impact: {
                  'Downtime': '14 hours',
                  'Production Loss': '¥235万',
                  'Risk Reduction': '85%',
                  'Delivery Impact': '1 order delayed'
                }
              },
              {
                id: 'conservative',
                name: '保守方案：仅紧急维护',
                nameEn: 'Conservative: Emergency only',
                description: '仅维护R-302，其他监控',
                impact: {
                  'Downtime': '6 hours',
                  'Production Loss': '¥85万',
                  'Risk Reduction': '45%',
                  'Delivery Impact': 'No delay'
                }
              }
            ],
            aiRecommendation: {
              reason: '推荐平衡方案。可在保证订单交付的前提下，最大程度降低设备故障风险，避免更大损失。',
              reasonEn: 'Balanced plan recommended. Maximizes risk reduction while maintaining delivery commitments, preventing larger losses.',
              confidence: 88
            },
            options: [
              {
                id: 'approve-balanced',
                label: '批准平衡方案',
                labelEn: 'Approve balanced plan',
                primary: true
              },
              {
                id: 'approve-aggressive',
                label: '批准激进方案',
                labelEn: 'Approve aggressive plan'
              },
              {
                id: 'approve-conservative',
                label: '批准保守方案',
                labelEn: 'Approve conservative plan'
              },
              {
                id: 'reject',
                label: '驳回，重新生成',
                labelEn: 'Reject and regenerate',
                risk: true
              }
            ]
          }
        },
        {
          id: 'w4',
          capabilityId: 'monitor-03',
          capabilityName: '工厂报告能力',
          capabilityNameEn: 'Factory Reporting',
          action: '生成工厂报告',
          actionEn: 'Generate factory report',
          duration: 3000,
          details: ['设备健康状况', '风险点汇总', '维护执行情况', '区域全球视图'],
          detailsEn: ['Equipment health status', 'Risk summary', 'Maintenance execution', 'Regional & global view']
        }
      ]
    },

    // C1 - 30万SKU智能顾问
    {
      id: 'scenario-c1',
      title: 'Life Science 30万SKU智能顾问',
      titleEn: '300K SKU Smart Advisor',
      description: '实验场景智能选型与产品推荐',
      descriptionEn: 'Lab scenario-based product selection and recommendation',
      icon: 'Lightbulb',
      requiredCapabilities: ['decision-06', 'decision-05', 'compliance-02', 'compliance-06'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'decision-06',
          capabilityName: '需求理解能力',
          capabilityNameEn: 'Query Understanding',
          action: '理解实验需求',
          actionEn: 'Understand experiment requirements',
          duration: 3500,
          details: ['提取实验目标', '识别样本类型', '理解仪器条件', '预算约束分析'],
          detailsEn: ['Extract experiment objectives', 'Identify sample types', 'Understand instrument conditions', 'Budget constraint analysis']
        },
        {
          id: 'w2',
          capabilityId: 'decision-05',
          capabilityName: '产品匹配能力',
          capabilityNameEn: 'Product Matching',
          action: '智能产品筛选',
          actionEn: 'Smart product selection',
          duration: 4500,
          details: ['知识图谱查询', '30万SKU筛选', '适配度排序', '组合方案生成'],
          detailsEn: ['Knowledge graph query', '300K SKU filtering', 'Compatibility ranking', 'Combination plan generation']
        },
        {
          id: 'w3',
          capabilityId: 'compliance-02',
          capabilityName: '合规安全能力',
          capabilityNameEn: 'Safety Compliance',
          action: '安全合规检查',
          actionEn: 'Safety & compliance check',
          duration: 3000,
          details: ['危险属性检查', '存储要求提示', '运输限制说明', '操作安全指南'],
          detailsEn: ['Hazard property check', 'Storage requirement alerts', 'Transport restriction notes', 'Handling safety guidelines']
        },
        {
          id: 'w4',
          capabilityId: 'compliance-06',
          capabilityName: '说明生成能力',
          capabilityNameEn: 'Explanation Gen',
          action: '生成推荐说明',
          actionEn: 'Generate recommendation explanation',
          duration: 3500,
          details: ['推荐理由阐述', '替代品对比', '使用要点说明', '注意事项提醒'],
          detailsEn: ['Explain recommendation rationale', 'Compare alternatives', 'Usage key points', 'Precaution reminders']
        }
      ]
    },

    // C2 - Call Center AI Co-pilot
    {
      id: 'scenario-c2',
      title: 'Customer Service AI Co-pilot',
      titleEn: 'Call Center AI Co-pilot',
      description: '客服实时辅助与智能应答',
      descriptionEn: 'Real-time customer service assistance and smart response',
      icon: 'MessageSquare',
      requiredCapabilities: ['exec-05', 'exec-06', 'compliance-03', 'monitor-04'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'exec-05',
          capabilityName: '通话监听能力',
          capabilityNameEn: 'Call Listener',
          action: '实时通话分析',
          actionEn: 'Real-time call analysis',
          duration: 3000,
          details: ['语音转文本', '意图识别', '问题分类', '情绪状态检测'],
          detailsEn: ['Speech-to-text', 'Intent recognition', 'Issue classification', 'Emotion detection']
        },
        {
          id: 'w2',
          capabilityId: 'exec-06',
          capabilityName: '应答辅助能力',
          capabilityNameEn: 'Answer Assistant',
          action: '推送应答建议',
          actionEn: 'Push answer suggestions',
          duration: 4000,
          details: ['检索知识库', '查询订单系统', '查询工单历史', '推送操作建议'],
          detailsEn: ['Search knowledge base', 'Query order system', 'Check ticket history', 'Push action suggestions']
        },
        {
          id: 'w3',
          capabilityId: 'compliance-03',
          capabilityName: '合规提醒能力',
          capabilityNameEn: 'Compliance Alert',
          action: '合规风险提醒',
          actionEn: 'Compliance risk alert',
          duration: 2500,
          details: ['检测敏感话题', '医疗表述检查', '价格承诺提醒', '安全表述建议'],
          detailsEn: ['Detect sensitive topics', 'Medical claim check', 'Price commitment alert', 'Safe phrasing suggestions']
        },
        {
          id: 'w4',
          capabilityId: 'monitor-04',
          capabilityName: '通话总结能力',
          capabilityNameEn: 'Call Summary',
          action: '生成通话摘要',
          actionEn: 'Generate call summary',
          duration: 3500,
          details: ['问题分类归档', '处理结论记录', '跟进任务建议', '质检要点标记'],
          detailsEn: ['Categorize & archive issues', 'Record resolution', 'Follow-up task suggestions', 'QA point tagging']
        }
      ]
    },

    // C3 - Market Intelligence
    {
      id: 'scenario-c3',
      title: '市场洞察与机会识别',
      titleEn: 'Market Intelligence',
      description: '新兴趋势识别与市场机会发现',
      descriptionEn: 'Emerging trend identification and market opportunity discovery',
      icon: 'Target',
      requiredCapabilities: ['data-07', 'analysis-06', 'analysis-05', 'decision-04', 'monitor-03'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'data-07',
          capabilityName: '多源检索能力',
          capabilityNameEn: 'Multi-source Search',
          action: '多源情报收集',
          actionEn: 'Multi-source intelligence collection',
          duration: 4000,
          details: ['论文专利抓取', '会议材料收集', '政策法规监测', '竞品动态跟踪'],
          detailsEn: ['Patent & paper scraping', 'Conference material collection', 'Policy & regulation monitoring', 'Competitor tracking']
        },
        {
          id: 'w2',
          capabilityId: 'analysis-06',
          capabilityName: '主题聚类能力',
          capabilityNameEn: 'Topic Clustering',
          action: '主题聚类分析',
          actionEn: 'Topic clustering analysis',
          duration: 4500,
          details: ['文本聚类', '识别新兴话题', '持续热点追踪', '技术应用分类'],
          detailsEn: ['Text clustering', 'Emerging topic identification', 'Continuous hotspot tracking', 'Tech-application categorization']
        },
        {
          id: 'w3',
          capabilityId: 'analysis-05',
          capabilityName: '趋势分析能力',
          capabilityNameEn: 'Trend Analysis',
          action: '趋势阶段评估',
          actionEn: 'Trend stage assessment',
          duration: 3500,
          details: ['话题生命周期', '萌芽/成长/爆发/衰退', '区域热度对比', '需求变化分析'],
          detailsEn: ['Topic lifecycle', 'Embryonic/Growth/Explosive/Decline', 'Regional heat comparison', 'Demand change analysis']
        },
        {
          id: 'w4',
          capabilityId: 'decision-04',
          capabilityName: '机会识别能力',
          capabilityNameEn: 'Opportunity ID',
          action: '机会与风险识别',
          actionEn: 'Opportunity & risk identification',
          duration: 4000,
          details: ['新产品机会', '解决方案空白点', '竞品压力点', '政策监管风险'],
          detailsEn: ['New product opportunities', 'Solution white spaces', 'Competitive pressure points', 'Policy & regulatory risks']
        },
        {
          id: 'checkpoint-c3-1',
          type: 'checkpoint',
          capabilityId: 'decision-04',
          capabilityName: '选择优先追踪机会',
          capabilityNameEn: 'Select Priority Opportunities',
          action: '选择优先市场机会',
          actionEn: 'Select priority market opportunities',
          duration: 0,
          details: ['审核AI识别结果', '评估市场潜力', '考虑竞争态势', '选择Top 3机会'],
          detailsEn: ['Review AI identification', 'Assess market potential', 'Consider competition', 'Select Top 3'],
          checkpoint: {
            checkpointType: 'decide',
            title: '市场机会优先级选择',
            titleEn: 'Market Opportunity Prioritization',
            description: 'AI识别11个市场机会，请选择优先追踪的Top 3机会',
            descriptionEn: 'AI identified 11 market opportunities, please select top 3 to prioritize',
            capabilityName: '机会识别能力',
            capabilityNameEn: 'Opportunity ID',
            summary: {
              'Total Opportunities': '11',
              'High Potential': '4',
              'Medium Potential': '5',
              'Early Stage': '2'
            },
            aiInsights: {
              'mRNA Vaccines': 'High growth (45% CAGR)',
              'Cell Therapy': 'Emerging (23% CAGR)',
              'AI Diagnostics': 'High potential (38% CAGR)',
              'Green Chemistry': 'Policy-driven (18% CAGR)'
            },
            anomalies: [
              {
                equipment: 'mRNA疫苗技术',
                equipmentEn: 'mRNA Vaccine Technology',
                severity: 'info',
                signals: [
                  { type: 'Market Size', value: '$28B by 2028', status: 'normal' },
                  { type: 'Growth Rate', value: '45% CAGR', status: 'normal' },
                  { type: 'Competition', value: 'High intensity', status: 'abnormal' }
                ],
                aiRecommendation: 'High growth market but intense competition. Focus on niche applications.'
              },
              {
                equipment: '细胞治疗',
                equipmentEn: 'Cell Therapy',
                severity: 'warning',
                signals: [
                  { type: 'Market Size', value: '$12B by 2028', status: 'normal' },
                  { type: 'Growth Rate', value: '23% CAGR', status: 'normal' },
                  { type: 'Regulatory', value: 'Uncertain', status: 'abnormal' }
                ],
                aiRecommendation: 'Emerging market with regulatory uncertainty. Monitor closely.'
              },
              {
                equipment: 'AI诊断技术',
                equipmentEn: 'AI Diagnostics',
                severity: 'info',
                signals: [
                  { type: 'Market Size', value: '$18B by 2028', status: 'normal' },
                  { type: 'Growth Rate', value: '38% CAGR', status: 'normal' },
                  { type: 'Competition', value: 'Moderate', status: 'normal' }
                ],
                aiRecommendation: 'Strong opportunity with balanced risk-reward profile.'
              }
            ],
            aiRecommendation: {
              reason: '推荐优先关注：1) AI诊断技术（高增长+适度竞争）2) mRNA疫苗技术（市场大+细分机会）3) 绿色化学（政策驱动+差异化）',
              reasonEn: 'Recommended priorities: 1) AI Diagnostics (high growth + moderate competition) 2) mRNA Vaccines (large market + niche opportunities) 3) Green Chemistry (policy-driven + differentiation)',
              confidence: 82
            },
            options: [
              {
                id: 'approve-ai',
                label: '采纳AI推荐的Top 3',
                labelEn: 'Accept AI Top 3',
                primary: true
              },
              {
                id: 'custom-select',
                label: '自定义选择Top 3',
                labelEn: 'Custom select Top 3'
              },
              {
                id: 'view-all',
                label: '查看全部11个机会',
                labelEn: 'View all 11 opportunities'
              }
            ]
          }
        },
        {
          id: 'w5',
          capabilityId: 'monitor-03',
          capabilityName: '洞察报告能力',
          capabilityNameEn: 'Insight Reporting',
          action: '生成洞察报告',
          actionEn: 'Generate insight report',
          duration: 3000,
          details: ['管理层摘要', 'BU定制报告', '市场趋势报告', '机会清单输出'],
          detailsEn: ['Executive summary', 'BU customized reports', 'Market trend report', 'Opportunity list output']
        }
      ]
    },

    // C4 - Sales Co-pilot
    {
      id: 'scenario-c4',
      title: '销售副驾与智能定价',
      titleEn: 'Sales Co-pilot & Pricing',
      description: '客户机会识别与定价优化',
      descriptionEn: 'Customer opportunity identification and pricing optimization',
      icon: 'Users',
      requiredCapabilities: ['decision-07', 'exec-06', 'decision-08', 'decision-02'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'decision-07',
          capabilityName: '线索评分能力',
          capabilityNameEn: 'Lead Scoring',
          action: '线索机会评分',
          actionEn: 'Lead & opportunity scoring',
          duration: 3500,
          details: ['潜在价值评估', '成交概率预测', '流失风险识别', '生成跟进清单'],
          detailsEn: ['Potential value assessment', 'Win probability prediction', 'Churn risk identification', 'Generate follow-up list']
        },
        {
          id: 'w2',
          capabilityId: 'exec-06',
          capabilityName: '销售副驾能力',
          capabilityNameEn: 'Sales Co-pilot',
          action: '个性化推荐',
          actionEn: 'Personalized recommendations',
          duration: 4000,
          details: ['分析购买历史', '推荐潜在产品', '识别交叉销售', '提供切入点话术'],
          detailsEn: ['Analyze purchase history', 'Recommend potential products', 'Identify cross-sell opportunities', 'Provide talking points']
        },
        {
          id: 'w3',
          capabilityId: 'decision-08',
          capabilityName: '定价模拟能力',
          capabilityNameEn: 'Pricing Simulation',
          action: '定价策略模拟',
          actionEn: 'Pricing strategy simulation',
          duration: 4500,
          details: ['价格弹性建模', '销量影响预测', '毛利影响分析', '推荐价格区间'],
          detailsEn: ['Price elasticity modeling', 'Volume impact prediction', 'Margin impact analysis', 'Recommended price range']
        },
        {
          id: 'checkpoint-c4-1',
          type: 'checkpoint',
          capabilityId: 'decision-08',
          capabilityName: '选择定价策略',
          capabilityNameEn: 'Select Pricing Strategy',
          action: '选择大客户定价策略',
          actionEn: 'Select key account pricing strategy',
          duration: 0,
          details: ['对比定价方案', '评估成交概率', '平衡价格与利润', '选择最优策略'],
          detailsEn: ['Compare pricing plans', 'Assess win probability', 'Balance price & margin', 'Select optimal strategy'],
          checkpoint: {
            checkpointType: 'decide',
            title: '大客户定价策略选择',
            titleEn: 'Key Account Pricing Strategy Selection',
            description: 'AI模拟了3种定价策略，请选择最优方案',
            descriptionEn: 'AI simulated 3 pricing strategies, please select the optimal one',
            capabilityName: '定价模拟能力',
            capabilityNameEn: 'Pricing Simulation',
            summary: {
              'Customer': 'PharmaCorp',
              'Deal Size': '¥3,580万',
              'Current Margin': '28%',
              'Win Probability': '72%'
            },
            plans: [
              {
                id: 'competitive',
                name: '竞争策略：低价抢单',
                nameEn: 'Competitive: Low price to win',
                description: '降价8%，提升成交概率',
                impact: {
                  'Price': '-8%',
                  'Margin': '22%',
                  'Win Prob': '89%',
                  'Revenue Impact': '-¥286万'
                }
              },
              {
                id: 'balanced',
                name: '平衡策略：AI推荐',
                nameEn: 'Balanced: AI recommended',
                description: '降价4%，平衡价格与利润',
                recommended: true,
                impact: {
                  'Price': '-4%',
                  'Margin': '25%',
                  'Win Prob': '82%',
                  'Revenue Impact': '-¥143万'
                }
              },
              {
                id: 'premium',
                name: '溢价策略：保持高价',
                nameEn: 'Premium: Maintain high price',
                description: '保持当前价格，强调价值',
                impact: {
                  'Price': '0%',
                  'Margin': '28%',
                  'Win Prob': '68%',
                  'Revenue Impact': '¥0'
                }
              }
            ],
            aiRecommendation: {
              reason: '推荐平衡策略。适度降价可将成交概率提升至82%，同时保持25%的合理毛利。竞争对手价格¥3,450万，我们的综合价值优势可支持略高定价。',
              reasonEn: 'Balanced strategy recommended. Moderate discount increases win probability to 82% while maintaining 25% margin. Competitor price is ¥34.5M, our value proposition supports slightly higher pricing.',
              confidence: 84
            },
            options: [
              {
                id: 'select-balanced',
                label: '选择平衡策略',
                labelEn: 'Select balanced strategy',
                primary: true
              },
              {
                id: 'select-competitive',
                label: '选择竞争策略',
                labelEn: 'Select competitive strategy'
              },
              {
                id: 'select-premium',
                label: '选择溢价策略',
                labelEn: 'Select premium strategy'
              }
            ]
          }
        },
        {
          id: 'w4',
          capabilityId: 'decision-02',
          capabilityName: '交易评审能力',
          capabilityNameEn: 'Deal Review',
          action: '大额交易评审',
          actionEn: 'Large deal review',
          duration: 3000,
          details: ['目标毛利检查', '区域价格策略', '渠道冲突评估', '批准流程建议'],
          detailsEn: ['Target margin check', 'Regional price strategy', 'Channel conflict assessment', 'Approval process suggestion']
        }
      ]
    },

    // C5 - AI Content Factory
    {
      id: 'scenario-c5',
      title: '科学内容与营销内容工厂',
      titleEn: 'AI Content Factory',
      description: '多语言科学与营销内容流水线生产',
      descriptionEn: 'Multi-lingual scientific and marketing content production pipeline',
      icon: 'FileText',
      requiredCapabilities: ['exec-07', 'data-08', 'compliance-04', 'data-04', 'compliance-05'],
      workflow: [
        {
          id: 'w1',
          capabilityId: 'exec-07',
          capabilityName: '初稿生成能力',
          capabilityNameEn: 'Draft Generation',
          action: '内容初稿生成',
          actionEn: 'Content draft generation',
          duration: 4000,
          details: ['技术说明撰写', '白皮书生成', '案例文档制作', '营销文案创作'],
          detailsEn: ['Technical documentation writing', 'White paper generation', 'Case study creation', 'Marketing copy creation']
        },
        {
          id: 'w2',
          capabilityId: 'data-08',
          capabilityName: '翻译本地化能力',
          capabilityNameEn: 'Translation & Localization',
          action: '多语言翻译',
          actionEn: 'Multi-language translation',
          duration: 4500,
          details: ['统一术语库', '多语言翻译', '地区表达调整', '文化适配优化'],
          detailsEn: ['Unified terminology', 'Multi-language translation', 'Regional expression adjustment', 'Cultural adaptation']
        },
        {
          id: 'w3',
          capabilityId: 'compliance-04',
          capabilityName: '科学审校能力',
          capabilityNameEn: 'Scientific Review',
          action: '合规科学审校',
          actionEn: 'Compliance & scientific review',
          duration: 4000,
          details: ['禁用表述检查', '夸大疗效识别', '科学描述一致性', '高亮重点审核'],
          detailsEn: ['Prohibited expression check', 'Exaggeration claim detection', 'Scientific consistency check', 'Highlight key review points']
        },
        {
          id: 'w4',
          capabilityId: 'data-04',
          capabilityName: '渠道适配能力',
          capabilityNameEn: 'Channel Adaptation',
          action: '多渠道适配',
          actionEn: 'Multi-channel adaptation',
          duration: 3500,
          details: ['官网长文格式', '电商描述优化', '社交短文改写', '线下物料转换'],
          detailsEn: ['Website long-form format', 'E-commerce description optimization', 'Social media short-form rewrite', 'Offline material conversion']
        },
        {
          id: 'w5',
          capabilityId: 'compliance-05',
          capabilityName: '版本治理能力',
          capabilityNameEn: 'Version Governance',
          action: '版本管理治理',
          actionEn: 'Version management & governance',
          duration: 3000,
          details: ['版本来源追溯', '审批记录管理', '最新版本检索', '历史变更对比'],
          detailsEn: ['Version source tracking', 'Approval record management', 'Latest version retrieval', 'Historical change comparison']
        }
      ]
    }
  ];

  // Central orchestrator position
  const centralOrchestrator = {
    x: 50,
    y: 45,
    width: 10,
    height: 10
  };

  // Category areas for Capability positioning (adjusted to prevent overlap)
  const categoryAreas = {
    data: { x: 1, y: 8, width: 26, height: 25 },          // 数据处理：左上 (8 capabilities)
    execution: { x: 32, y: 8, width: 30, height: 20 },    // 执行能力：中上 (7 capabilities)
    analysis: { x: 68, y: 8, width: 30, height: 28 },     // 分析能力：右上 (9 capabilities)
    decision: { x: 1, y: 66, width: 28, height: 29 },     // 决策支持：左下 (8 capabilities)
    monitoring: { x: 35, y: 66, width: 28, height: 29 },  // 监控能力：中下 (4 capabilities)
    compliance: { x: 68, y: 66, width: 30, height: 29 },  // 合规能力：右下 (6 capabilities)
  };

  // Category labels (positioned above capability areas)
  const categoryLabels = [
    { id: 'data' as const, label: '📊 数据处理', labelEn: 'Data Processing', subtitle: 'Data', x: 2, y: 3 },
    { id: 'execution' as const, label: '⚡ 执行能力', labelEn: 'Execution', subtitle: 'Execution', x: 34, y: 3 },
    { id: 'analysis' as const, label: '🔍 分析能力', labelEn: 'Analysis', subtitle: 'Analysis', x: 70, y: 3 },
    { id: 'decision' as const, label: '🎯 决策支持', labelEn: 'Decision', subtitle: 'Decision', x: 2, y: 61 },
    { id: 'monitoring' as const, label: '📈 监控能力', labelEn: 'Monitoring', subtitle: 'Monitor', x: 37, y: 61 },
    { id: 'compliance' as const, label: '✅ 合规能力', labelEn: 'Compliance', subtitle: 'Compliance', x: 70, y: 61 },
  ];

  const handleScenarioHover = (scenario: ScenarioCard | null) => {
    if (!executionStarted && scenario) {
      setHighlightedCapabilities(scenario.requiredCapabilities);
    } else if (!executionStarted) {
      setHighlightedCapabilities([]);
    }
  };

  const handleScenarioClick = (scenario: ScenarioCard) => {
    setSelectedScenario(scenario);
    setHighlightedCapabilities([]);
    setExecutionState('dispatching');
    setExecutionStarted(true);
    setCurrentStepIndex(0);
    setCompletedCapabilities([]);
    setCapabilityOutputs([]);
    setIsOrchestratorActive(true);
    setDispatchingCapabilities([]);
    setIsScenarioPoolVisible(false); // Auto-hide scenario pool when execution starts
    setStepDynamicMessages({}); // Clear dynamic messages for new execution

    onScenarioSelect(scenario);

    const logMsg = isEnglish
      ? `[${new Date().toLocaleTimeString()}] 🎯 New scenario received: ${scenario.titleEn}`
      : `[${new Date().toLocaleTimeString()}] 🎯 收到新场景: ${scenario.title}`;
    setExecutionLogs(prev => [logMsg, ...prev]);

    startDispatchingProcess(scenario);
  };

  const startDispatchingProcess = (scenario: ScenarioCard) => {
    const analyzeMsg = isEnglish
      ? `[${new Date().toLocaleTimeString()}] 🤖 Central Orchestrator analyzing scenario requirements...`
      : `[${new Date().toLocaleTimeString()}] 🤖 中央编排器正在分析场景需求...`;
    setExecutionLogs(prev => [analyzeMsg, ...prev]);

    setTimeout(() => {
      const completeMsg = isEnglish
        ? `[${new Date().toLocaleTimeString()}] 📋 Analysis complete, required capabilities:`
        : `[${new Date().toLocaleTimeString()}] 📋 分析完成，需要以下能力:`;
      setExecutionLogs(prev => [completeMsg, ...prev]);

      const requiredCapDetails = scenario.requiredCapabilities.map(capId => {
        const cap = capabilities.find(c => c.id === capId);
        return cap ? `${isEnglish ? cap.nameEn : cap.name} (${cap.category})` : capId;
      });

      requiredCapDetails.forEach((detail, index) => {
        setTimeout(() => {
          setExecutionLogs(prev => [`   ${index + 1}. ${detail}`, ...prev]);
        }, index * 200);
      });

      setTimeout(() => {
        const dispatchMsg = isEnglish
          ? `[${new Date().toLocaleTimeString()}] 🚀 Starting capability dispatch...`
          : `[${new Date().toLocaleTimeString()}] 🚀 开始调度能力...`;
        setExecutionLogs(prev => [dispatchMsg, ...prev]);
        dispatchCapabilitiesSequentially(scenario);
      }, requiredCapDetails.length * 200 + 500);
    }, 1500);
  };

  const dispatchCapabilitiesSequentially = (scenario: ScenarioCard) => {
    const capabilities = scenario.requiredCapabilities;
    let currentIndex = 0;

    const dispatchNext = () => {
      if (currentIndex >= capabilities.length) {
        setTimeout(() => {
          const completeMsg = isEnglish
            ? `[${new Date().toLocaleTimeString()}] ✅ All capabilities dispatched, starting workflow execution...`
            : `[${new Date().toLocaleTimeString()}] ✅ 所有能力已调度完毕，开始执行工作流...`;
          setExecutionLogs(prev => [completeMsg, ...prev]);
          setExecutionState('running');
          setIsOrchestratorActive(false);
          setTimeout(() => {
            startWorkflowExecution(scenario);
          }, 1000);
        }, 500);
        return;
      }

      const capId = capabilities[currentIndex];
      const cap = scenario.workflow.find(w => w.capabilityId === capId);

      setDispatchingCapabilities(prev => [...prev, capId]);

      const dispatchMsg = isEnglish
        ? `[${new Date().toLocaleTimeString()}] 📡 Dispatching: ${cap?.capabilityNameEn || capId}`
        : `[${new Date().toLocaleTimeString()}] 📡 正在调度: ${cap?.capabilityName || capId}`;
      setExecutionLogs(prev => [dispatchMsg, ...prev]);

      currentIndex++;
      setTimeout(dispatchNext, 800);
    };

    dispatchNext();
  };

  const startWorkflowExecution = (scenario: ScenarioCard) => {
    executeWorkflowStep(scenario, 0);
  };

  const generateDynamicMessages = (step: WorkflowStep, scenarioId: string): string[] => {
    // Generate realistic, dynamic execution messages based on step and scenario
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Contextual dynamic messages for different capabilities
    const messageTemplates: Record<string, string[]> = {
      'data-01': isEnglish
        ? [`Scanning ${random(3,8)} ERP systems...`, `Found ${random(1200,3500)} master records`, `Detected ${random(15,45)} data quality issues`, `Generated cleanup recommendations`]
        : [`正在扫描${random(3,8)}个ERP系统...`, `发现${random(1200,3500)}条主数据记录`, `检测到${random(15,45)}个数据质量问题`, `生成清洗建议完成`],
      'data-02': isEnglish
        ? [`Analyzing ${random(500,1500)} entities...`, `Matched ${random(85,95)}% by name and tax ID`, `Found ${random(20,60)} potential duplicates`, `Confidence score: ${random(88,96)}%`]
        : [`分析${random(500,1500)}个实体...`, `基于名称和税号匹配成功率${random(85,95)}%`, `发现${random(20,60)}个潜在重复项`, `置信度评分: ${random(88,96)}%`],
      'analysis-01': isEnglish
        ? [`Processing ${random(2000,5000)} transactions...`, `Matched ${random(1800,4500)} order-invoice pairs`, `Identified ${random(10,30)} discrepancies`, `Total variance: $${random(50,200)}K`]
        : [`处理${random(2000,5000)}笔交易记录...`, `匹配${random(1800,4500)}个订单-发票对`, `识别${random(10,30)}项差异`, `总差异金额: ¥${random(300,1200)}万`],
      'compliance-01': isEnglish
        ? [`Recording ${random(100,300)} reconciliation events...`, `Tracked ${random(5,15)} manual adjustments`, `Generated audit trail for ${random(80,150)} entries`, `Compliance check: PASSED`]
        : [`记录${random(100,300)}个对账事件...`, `追踪${random(5,15)}次人工调整`, `生成${random(80,150)}条审计轨迹`, `合规检查: 通过`],
      'analysis-02': isEnglish
        ? [`Analyzing ${random(500,1200)} customer accounts...`, `Identified ${random(30,80)} high-risk customers`, `Avg overdue: ${random(45,90)} days`, `Default probability model accuracy: ${random(85,93)}%`]
        : [`分析${random(500,1200)}个客户账户...`, `识别${random(30,80)}个高风险客户`, `平均逾期${random(45,90)}天`, `违约概率模型准确率: ${random(85,93)}%`],
      'exec-01': isEnglish
        ? [`Segmented ${random(200,500)} overdue accounts`, `Generated ${random(3,6)} collection strategies`, `Recommended contact schedule for next ${random(7,14)} days`, `Expected recovery rate: ${random(60,80)}%`]
        : [`分层${random(200,500)}个逾期账户`, `生成${random(3,6)}套催收策略`, `推荐未来${random(7,14)}天联系计划`, `预期回款率: ${random(60,80)}%`],
      'exec-02': isEnglish
        ? [`Identified ${random(15,40)} high-risk accounts`, `Assessed ${random(8,20)} for legal escalation`, `Compiled evidence for ${random(5,12)} cases`, `Legal action recommended: ${random(3,8)} cases`]
        : [`识别${random(15,40)}个高风险账户`, `评估${random(8,20)}个法律升级案例`, `整理${random(5,12)}个案件证据`, `建议法律诉讼: ${random(3,8)}个案件`],
      'monitor-01': isEnglish
        ? [`Aggregating data from ${random(5,12)} BUs...`, `Risk trend: ${random(-5,15)}% vs last quarter`, `Aging > 90 days: $${random(200,800)}K`, `Dashboard generated for CFO review`]
        : [`汇总${random(5,12)}个BU数据...`, `风险趋势: 较上季度${random(-5,15)}%`, `账龄>90天: ¥${random(1200,5000)}万`, `生成CFO决策看板`],
      'analysis-04': isEnglish
        ? [`Analyzing ${random(18,36)} months historical data...`, `Detected ${random(3,6)} seasonal patterns`, `Forecasting ${random(200,500)} SKUs across ${random(8,15)} regions`, `Model ensemble accuracy: ${random(88,95)}%`]
        : [`分析${random(18,36)}个月历史数据...`, `检测到${random(3,6)}个季节性模式`, `预测${random(200,500)}个SKU，覆盖${random(8,15)}个地区`, `集成模型准确率: ${random(88,95)}%`],
      'decision-03': isEnglish
        ? [`Analyzing ${random(10,20)} production lines...`, `Identified ${random(3,7)} capacity bottlenecks`, `Found ${random(50,150)} material constraints`, `Generated ${random(3,5)} optimization scenarios`]
        : [`分析${random(10,20)}条生产线...`, `识别${random(3,7)}个产能瓶颈`, `发现${random(50,150)}个物料约束`, `生成${random(3,5)}个优化方案`],
      'exec-03': isEnglish
        ? [`Scanned ${random(300,800)} SKUs...`, `Detected ${random(20,50)} slow-moving items`, `Identified ${random(15,40)} stockout risks`, `Recommended ${random(10,25)} transfer actions`]
        : [`扫描${random(300,800)}个SKU...`, `检测到${random(20,50)}个滞销产品`, `识别${random(15,40)}个缺货风险`, `推荐${random(10,25)}个调拨方案`],
      'monitor-02': isEnglish
        ? [`Consolidating data from ${random(8,15)} departments...`, `Identified ${random(5,12)} supply-demand conflicts`, `Prepared ${random(3,6)} recommendation packages`, `Meeting materials ready`]
        : [`整合${random(8,15)}个部门数据...`, `识别${random(5,12)}个产销冲突点`, `准备${random(3,6)}套推荐方案`, `会议材料已就绪`],
      'data-03': isEnglish
        ? [`Fetching data from ${random(5,10)} sources...`, `Retrieved ${random(15,30)} financial reports`, `Monitored ${random(200,500)} media articles`, `ESG report analysis: ${random(80,95)}% complete`]
        : [`从${random(5,10)}个数据源抓取信息...`, `获取${random(15,30)}份财务报告`, `监测${random(200,500)}篇媒体报道`, `ESG报告分析: 完成${random(80,95)}%`],
      'analysis-03': isEnglish
        ? [`Assessing ${random(50,150)} risk dimensions...`, `Financial health score: ${random(60,85)}/100`, `ESG performance: Rank ${random(1,5)}/5`, `Delivery stability: ${random(85,98)}%`]
        : [`评估${random(50,150)}个风险维度...`, `财务健康评分: ${random(60,85)}/100`, `ESG表现: ${random(1,5)}/5级`, `交付稳定性: ${random(85,98)}%`],
      'decision-01': isEnglish
        ? [`Computing comprehensive risk score: ${random(65,88)}/100`, `Generated natural language explanation`, `Compared with ${random(20,50)} peer suppliers`, `Identified ${random(3,8)} key risk factors`]
        : [`计算综合风险评分: ${random(65,88)}/100`, `生成自然语言解释`, `对比${random(20,50)}家同行供应商`, `识别${random(3,8)}个关键风险因素`],
      'decision-02': isEnglish
        ? [`Decision: Conditional approval`, `Recommended ${random(2,5)} risk mitigation measures`, `Review cycle: Every ${random(6,12)} months`, `Suggested ${random(3,7)} contract terms`]
        : [`决策建议: 条件通过`, `推荐${random(2,5)}项风控措施`, `复审周期: 每${random(6,12)}个月`, `建议${random(3,7)}条合同条款`],
      'analysis-09': isEnglish
        ? [`Analyzing sensor data from ${random(50,150)} equipment units...`, `Calculated health index: ${random(65,92)}/100`, `Predicted failure risk: ${random(5,25)}% in next ${random(30,90)} days`, `Identified ${random(3,8)} at-risk units`]
        : [`分析${random(50,150)}台设备传感器数据...`, `计算健康指数: ${random(65,92)}/100`, `预测故障风险: 未来${random(30,90)}天内${random(5,25)}%`, `识别${random(3,8)}台高风险设备`],
      'analysis-08': isEnglish
        ? [`Comparing ${random(100,300)} batch parameters...`, `Detected ${random(5,15)} quality anomalies`, `Risk level: ${['Low', 'Medium', 'High'][random(0,2)]}`, `Recommended ${random(2,5)} process adjustments`]
        : [`对比${random(100,300)}个批次参数...`, `检测到${random(5,15)}个质量异常`, `风险等级: ${['低', '中', '高'][random(0,2)]}`, `推荐${random(2,5)}项工艺调整`],
      'exec-04': isEnglish
        ? [`Optimized maintenance window: ${random(2,8)}h downtime`, `Balanced ${random(5,15)} order priorities`, `Generated ${random(10,25)} work orders`, `Dispatch completed for ${random(15,40)} technicians`]
        : [`优化维护窗口: ${random(2,8)}小时停机时间`, `平衡${random(5,15)}个订单优先级`, `生成${random(10,25)}个维护工单`, `完成${random(15,40)}名技术人员派工`],
      'monitor-03': isEnglish
        ? [`Aggregated data from ${random(5,15)} production sites...`, `Equipment health: ${random(75,95)}% overall`, `${random(3,10)} high-priority risks flagged`, `Regional & global dashboard ready`]
        : [`汇总${random(5,15)}个生产基地数据...`, `设备健康度: 整体${random(75,95)}%`, `标记${random(3,10)}个高优先级风险`, `区域及全球视图就绪`],
      'decision-06': isEnglish
        ? [`Parsing experiment requirements...`, `Identified sample type: ${['Cell culture', 'Tissue', 'Protein'][random(0,2)]}`, `Extracted budget constraint: $${random(500,5000)}`, `Instrument compatibility: ${random(2,5)} platforms`]
        : [`解析实验需求...`, `识别样本类型: ${['细胞培养', '组织', '蛋白质'][random(0,2)]}`, `提取预算约束: ¥${random(3000,30000)}`, `仪器兼容性: ${random(2,5)}个平台`],
      'decision-05': isEnglish
        ? [`Querying knowledge graph with ${random(50,150)} nodes...`, `Filtered ${random(300000,300000)} SKUs to top ${random(20,50)} matches`, `Compatibility ranking complete`, `Generated ${random(2,5)} combination solutions`]
        : [`查询知识图谱包含${random(50,150)}个节点...`, `从30万SKU筛选出前${random(20,50)}个匹配项`, `适配度排序完成`, `生成${random(2,5)}个组合方案`],
      'compliance-02': isEnglish
        ? [`Checked ${random(10,30)} hazard properties`, `Flagged ${random(1,5)} storage requirements`, `Identified ${random(0,3)} transport restrictions`, `Safety guidelines prepared`]
        : [`检查${random(10,30)}项危险属性`, `标记${random(1,5)}个存储要求`, `识别${random(0,3)}项运输限制`, `安全操作指南已准备`],
      'compliance-06': isEnglish
        ? [`Generated recommendation rationale`, `Compared ${random(3,8)} alternative products`, `Highlighted ${random(5,12)} key usage points`, `Listed ${random(2,6)} precautions`]
        : [`生成推荐理由说明`, `对比${random(3,8)}个替代产品`, `标注${random(5,12)}个使用要点`, `列出${random(2,6)}条注意事项`],
      'exec-05': isEnglish
        ? [`Real-time speech-to-text processing...`, `Detected intent: ${['Product inquiry', 'Order issue', 'Technical support'][random(0,2)]}`, `Issue classification: ${['Billing', 'Delivery', 'Quality'][random(0,2)]}`, `Emotion: ${['Neutral', 'Frustrated', 'Satisfied'][random(0,2)]}`]
        : [`实时语音转文本处理中...`, `识别意图: ${['产品咨询', '订单问题', '技术支持'][random(0,2)]}`, `问题分类: ${['计费', '配送', '质量'][random(0,2)]}`, `情绪状态: ${['平静', '焦虑', '满意'][random(0,2)]}`],
      'exec-06': isEnglish
        ? [`Searched knowledge base: ${random(500,2000)} articles`, `Queried order #${random(10000,99999)}`, `Found ${random(2,8)} relevant tickets`, `Pushed ${random(1,3)} action suggestions`]
        : [`检索知识库: ${random(500,2000)}篇文档`, `查询订单 #${random(10000,99999)}`, `找到${random(2,8)}个相关工单`, `推送${random(1,3)}条操作建议`],
      'compliance-03': isEnglish
        ? [`Detected ${random(0,3)} sensitive topics`, `Medical claim check: ${random(0,2)} warnings`, `Price commitment: ${random(0,1)} alerts`, `Safe phrasing: ${random(3,8)} suggestions`]
        : [`检测到${random(0,3)}个敏感话题`, `医疗表述检查: ${random(0,2)}条警告`, `价格承诺: ${random(0,1)}条提醒`, `安全表述: ${random(3,8)}条建议`],
      'monitor-04': isEnglish
        ? [`Categorized issue: ${['Product', 'Service', 'Billing'][random(0,2)]}`, `Resolution: ${['Resolved', 'Escalated', 'Pending'][random(0,2)]}`, `Suggested ${random(1,4)} follow-up tasks`, `QA points: ${random(3,8)} marked`]
        : [`问题分类: ${['产品', '服务', '计费'][random(0,2)]}`, `处理结论: ${['已解决', '已升级', '待处理'][random(0,2)]}`, `建议${random(1,4)}个跟进任务`, `质检要点: 标记${random(3,8)}项`],
      'data-07': isEnglish
        ? [`Scraped ${random(200,800)} patents and papers`, `Collected ${random(50,150)} conference materials`, `Monitored ${random(30,100)} policy updates`, `Tracked ${random(20,60)} competitor moves`]
        : [`抓取${random(200,800)}篇专利和论文`, `收集${random(50,150)}份会议资料`, `监测${random(30,100)}项政策更新`, `跟踪${random(20,60)}个竞品动态`],
      'analysis-06': isEnglish
        ? [`Clustered ${random(500,2000)} documents`, `Identified ${random(15,40)} emerging topics`, `Hot topics tracked: ${random(8,20)}`, `Categorized ${random(30,80)} tech applications`]
        : [`聚类${random(500,2000)}份文档`, `识别${random(15,40)}个新兴话题`, `持续跟踪热点: ${random(8,20)}个`, `技术应用分类: ${random(30,80)}项`],
      'analysis-05': isEnglish
        ? [`Analyzed topic lifecycle stages`, `Stage: ${['Embryonic', 'Growth', 'Explosive', 'Decline'][random(0,3)]}`, `Compared heat across ${random(5,15)} regions`, `Demand change: ${random(-20,50)}% vs last year`]
        : [`分析话题生命周期阶段`, `当前阶段: ${['萌芽期', '成长期', '爆发期', '衰退期'][random(0,3)]}`, `对比${random(5,15)}个地区热度`, `需求变化: 较去年${random(-20,50)}%`],
      'decision-04': isEnglish
        ? [`Identified ${random(5,15)} new product opportunities`, `Found ${random(3,10)} solution white spaces`, `Flagged ${random(2,8)} competitive pressure points`, `Assessed ${random(1,5)} regulatory risks`]
        : [`识别${random(5,15)}个新产品机会`, `发现${random(3,10)}个解决方案空白点`, `标记${random(2,8)}个竞品压力点`, `评估${random(1,5)}个政策监管风险`],
      'decision-07': isEnglish
        ? [`Scored ${random(100,500)} leads`, `Potential value: $${random(50,500)}K total`, `Win probability: ${random(20,80)}% average`, `Churn risk: ${random(5,30)}% flagged`]
        : [`评分${random(100,500)}个销售线索`, `潜在价值: 总计¥${random(300,3000)}万`, `成交概率: 平均${random(20,80)}%`, `流失风险: 标记${random(5,30)}%`],
      'decision-08': isEnglish
        ? [`Modeled price elasticity: ${random(-3,-1)}.${random(0,9)}`, `Volume impact: ${random(-15,25)}% at ${random(5,15)}% price change`, `Margin impact: ${random(-10,30)}%`, `Recommended price range: $${random(50,200)}-$${random(200,400)}`]
        : [`价格弹性建模: ${random(-3,-1)}.${random(0,9)}`, `销量影响: 价格变动${random(5,15)}%时销量${random(-15,25)}%`, `毛利影响: ${random(-10,30)}%`, `推荐价格区间: ¥${random(300,1200)}-¥${random(1200,2400)}`],
      'exec-07': isEnglish
        ? [`Generated ${random(5,20)} content drafts`, `Technical docs: ${random(2,8)} pieces`, `White papers: ${random(1,4)} pieces`, `Marketing copy: ${random(2,10)} pieces`]
        : [`生成${random(5,20)}份内容初稿`, `技术说明: ${random(2,8)}份`, `白皮书: ${random(1,4)}份`, `营销文案: ${random(2,10)}份`],
      'data-08': isEnglish
        ? [`Translated to ${random(8,20)} languages`, `Applied unified terminology: ${random(500,2000)} terms`, `Regional expression adjusted: ${random(50,200)} phrases`, `Cultural adaptation: ${random(85,98)}% complete`]
        : [`翻译到${random(8,20)}种语言`, `应用统一术语库: ${random(500,2000)}个术语`, `地区表达调整: ${random(50,200)}个短语`, `文化适配: 完成${random(85,98)}%`],
      'compliance-04': isEnglish
        ? [`Checked ${random(20,80)} prohibited expressions`, `Detected ${random(0,5)} exaggeration claims`, `Scientific consistency: ${random(90,99)}%`, `Highlighted ${random(5,15)} review points`]
        : [`检查${random(20,80)}项禁用表述`, `检测到${random(0,5)}处夸大疗效`, `科学描述一致性: ${random(90,99)}%`, `高亮${random(5,15)}个审核要点`],
      'data-04': isEnglish
        ? [`Adapted for ${random(4,10)} channels`, `Website long-form: ${random(2,5)} pieces`, `E-commerce optimized: ${random(3,8)} pieces`, `Social media: ${random(5,15)} short posts`]
        : [`适配${random(4,10)}个渠道`, `官网长文: ${random(2,5)}篇`, `电商优化: ${random(3,8)}份`, `社交媒体短文: ${random(5,15)}条`],
      'compliance-05': isEnglish
        ? [`Tracked ${random(50,200)} versions`, `Managed ${random(10,50)} approval records`, `Latest version indexed`, `Historical changes: ${random(100,500)} comparisons available`]
        : [`追溯${random(50,200)}个版本`, `管理${random(10,50)}条审批记录`, `最新版本已索引`, `历史变更: 可对比${random(100,500)}次修改`],
    };

    return messageTemplates[step.capabilityId] || (isEnglish ? step.detailsEn : step.details);
  };

  const executeWorkflowStep = (scenario: ScenarioCard, stepIndex: number) => {
    if (stepIndex >= scenario.workflow.length) {
      setExecutionState('completed');
      setCurrentExecutingCapability(null);
      const completeMsg = isEnglish
        ? `[${new Date().toLocaleTimeString()}] 🎉 Scenario execution completed!`
        : `[${new Date().toLocaleTimeString()}] 🎉 场景执行完成！`;
      setExecutionLogs(prev => [completeMsg, ...prev]);

      setTimeout(() => {
        onScenarioComplete(checkpointDecisions);
      }, 2000);
      return;
    }

    const step = scenario.workflow[stepIndex];
    setCurrentStepIndex(stepIndex);
    setCurrentExecutingCapability(step.capabilityId);

    // Check if this is a checkpoint (human decision point)
    if ((step as any).type === 'checkpoint') {
      const checkpointMsg = isEnglish
        ? `[${new Date().toLocaleTimeString()}] ⏸️ ${step.capabilityNameEn}: Awaiting human decision`
        : `[${new Date().toLocaleTimeString()}] ⏸️ ${step.capabilityName}: 等待人工决策`;
      setExecutionLogs(prev => [checkpointMsg, ...prev]);

      setCurrentCheckpoint((step as any).checkpoint);
      setShowCheckpoint(true);
      return; // Pause execution, wait for user decision
    }

    const startMsg = isEnglish
      ? `[${new Date().toLocaleTimeString()}] ▶️ ${step.capabilityNameEn} executing: ${step.actionEn}`
      : `[${new Date().toLocaleTimeString()}] ▶️ ${step.capabilityName} 执行中: ${step.action}`;
    setExecutionLogs(prev => [startMsg, ...prev]);

    // Generate dynamic messages
    const dynamicMessages = generateDynamicMessages(step, scenario.id);

    // Clear previous step's messages and add new ones progressively
    setStepDynamicMessages(prev => ({ ...prev, [step.id]: [] }));

    dynamicMessages.forEach((message, index) => {
      setTimeout(() => {
        setStepDynamicMessages(prev => ({
          ...prev,
          [step.id]: [...(prev[step.id] || []), message]
        }));
        setExecutionLogs(prev => [`   - ${message}`, ...prev]);
      }, (index + 1) * (step.duration / (dynamicMessages.length + 2)));
    });

    setTimeout(() => {
      setCompletedCapabilities(prev => [...prev, step.capabilityId]);
      setCurrentExecutingCapability(null);

      const completeMsg = isEnglish
        ? `[${new Date().toLocaleTimeString()}] ✅ ${step.capabilityNameEn} completed`
        : `[${new Date().toLocaleTimeString()}] ✅ ${step.capabilityName} 完成`;
      setExecutionLogs(prev => [completeMsg, ...prev]);

      const mockOutput = isEnglish
        ? `Result from ${step.capabilityNameEn}: ${step.actionEn} completed successfully with ${dynamicMessages.length} key outputs.`
        : `${step.capabilityName}输出结果: ${step.action}已成功完成，生成${dynamicMessages.length}项关键产出。`;

      setCapabilityOutputs(prev => [
        ...prev,
        {
          capabilityId: step.capabilityId,
          content: mockOutput,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);

      const progress = ((stepIndex + 1) / scenario.workflow.length) * 100;
      setScenarioProgress(progress);

      setTimeout(() => {
        executeWorkflowStep(scenario, stepIndex + 1);
      }, 500);
    }, step.duration);
  };

  const handleCheckpointDecision = (decision: any) => {
    if (!selectedScenario) return;

    const step = selectedScenario.workflow[currentStepIndex];
    const option = decision.option;

    // Record decision
    const decisionRecord = {
      ...decision,
      operator: 'Zhang Wei', // Would come from user context in real app
      operatorCn: '张伟',
      timestamp: new Date().toISOString()
    };

    setCheckpointDecisions(prev => ({
      ...prev,
      [step.id]: decisionRecord
    }));

    // Determine if this is a terminating/pausing decision
    const isRiskOption = option.risk === true;
    const isRejectOption = option.id.includes('reject');
    const isCancelOption = option.id.includes('cancel');
    const isManualOption = option.id.includes('manual');
    const shouldTerminate = isRiskOption || isRejectOption || isCancelOption || isManualOption;

    // Generate appropriate log message
    let logMessage: string;
    if (shouldTerminate) {
      if (isRejectOption) {
        logMessage = isEnglish
          ? `[${new Date().toLocaleTimeString()}] ❌ Workflow terminated: ${option.labelEn || option.label}`
          : `[${new Date().toLocaleTimeString()}] ❌ 流程已终止: ${option.label}`;
      } else if (isCancelOption || isManualOption) {
        logMessage = isEnglish
          ? `[${new Date().toLocaleTimeString()}] ⏸️ Workflow paused: ${option.labelEn || option.label}`
          : `[${new Date().toLocaleTimeString()}] ⏸️ 流程已暂停: ${option.label}`;
      } else {
        logMessage = isEnglish
          ? `[${new Date().toLocaleTimeString()}] ⚠️ Workflow halted: ${option.labelEn || option.label}`
          : `[${new Date().toLocaleTimeString()}] ⚠️ 流程已中止: ${option.label}`;
      }
    } else {
      logMessage = isEnglish
        ? `[${new Date().toLocaleTimeString()}] ✅ Decision made: ${option.labelEn || option.label}`
        : `[${new Date().toLocaleTimeString()}] ✅ 决策完成: ${option.label}`;
    }

    setExecutionLogs(prev => [logMessage, ...prev]);

    // Close dialog
    setShowCheckpoint(false);
    setCurrentCheckpoint(null);

    if (shouldTerminate) {
      // Terminate workflow
      setTimeout(() => {
        setExecutionState('completed');
        setCurrentExecutingCapability(null);
        setScenarioProgress(100);

        const terminationMsg = isEnglish
          ? `[${new Date().toLocaleTimeString()}] 🏁 Workflow ended by user decision`
          : `[${new Date().toLocaleTimeString()}] 🏁 工作流因人工决策而结束`;
        setExecutionLogs(prev => [terminationMsg, ...prev]);

        // Trigger completion callback
        setTimeout(() => {
          onScenarioComplete(checkpointDecisions);
        }, 1000);
      }, 500);
    } else {
      // Continue to next step
      setTimeout(() => {
        executeWorkflowStep(selectedScenario, currentStepIndex + 1);
      }, 500);
    }
  };

  // Layout calculation - similar to agent matrix but for capabilities
  const capabilityPositions = useMemo(() => {
    const positions: Record<string, CapabilityPosition> = {};

    Object.keys(categoryAreas).forEach(category => {
      const area = categoryAreas[category as keyof typeof categoryAreas];
      const categoryCapabilities = capabilities.filter(c => c.category === category);

      if (categoryCapabilities.length === 0) return;

      const count = categoryCapabilities.length;
      const usableWidth = area.width;
      const usableHeight = area.height;

      const cols = Math.ceil(Math.sqrt(count * (usableWidth / usableHeight)));
      const rows = Math.ceil(count / cols);

      const cellWidth = usableWidth / cols;
      const cellHeight = usableHeight / rows;

      categoryCapabilities.forEach((cap, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        const x = area.x + col * cellWidth + cellWidth / 2;
        const y = area.y + row * cellHeight + cellHeight / 2;

        positions[cap.id] = {
          style: {
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)'
          },
          coords: { x, y }
        };
      });
    });

    return positions;
  }, [capabilities]);

  const getCategoryColor = (category: string) => {
    const colors = {
      data: 'hsl(200, 100%, 45%)',
      analysis: 'hsl(280, 60%, 50%)',
      decision: 'hsl(125, 60%, 45%)',
      execution: 'hsl(30, 90%, 50%)',
      monitoring: 'hsl(210, 80%, 55%)',
      compliance: 'hsl(0, 70%, 50%)',
    };
    return colors[category as keyof typeof colors] || 'hsl(210, 100%, 50%)';
  };

  const getCapabilityIcon = (capId: string) => {
    const iconMap: Record<string, any> = {
      // Data Processing
      'data-01': Database,
      'data-02': Link,
      'data-03': FolderOpen,
      'data-04': GitBranch,
      'data-05': Eraser,
      'data-06': FileSearch,
      'data-07': Search,
      'data-08': Network,
      // Analysis
      'analysis-01': BarChart3,
      'analysis-02': PieChart,
      'analysis-03': Shield,
      'analysis-04': TrendingUp,
      'analysis-05': Activity,
      'analysis-06': Brain,
      'analysis-07': DollarSign,
      'analysis-08': AlertCircle,
      'analysis-09': Monitor,
      // Decision
      'decision-01': FileText,
      'decision-02': Lightbulb,
      'decision-03': Settings,
      'decision-04': Target,
      'decision-05': Search,
      'decision-06': Brain,
      'decision-07': Users,
      'decision-08': BarChart3,
      // Execution
      'exec-01': Play,
      'exec-02': Send,
      'exec-03': AlertCircle,
      'exec-04': Settings,
      'exec-05': Eye,
      'exec-06': MessageSquare,
      'exec-07': FileText,
      // Monitoring
      'monitor-01': Activity,
      'monitor-02': BarChart3,
      'monitor-03': Monitor,
      'monitor-04': FileCheck,
      // Compliance
      'compliance-01': FileCheck,
      'compliance-02': Shield,
      'compliance-03': AlertCircle,
      'compliance-04': CheckCircle2,
      'compliance-05': Lock,
      'compliance-06': FileText,
    };
    return iconMap[capId] || Database;
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      FileSpreadsheet, DollarSign, Shield, TrendingUp, Factory,
      Lightbulb, MessageSquare, Target, Users, FileText
    };
    return icons[iconName] || FileText;
  };

  const resetView = () => {
    setCanvasScale(1);
    setCanvasPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      const newScale = Math.max(0.3, Math.min(2, canvasScale * delta));
      setCanvasScale(newScale);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && e.shiftKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCanvasPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-primary/20">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isEnglish ? 'Back' : '返回'}
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-tech-green bg-clip-text text-transparent">
              {isEnglish ? 'Merck AI Capability Hub' : 'Merck AI 能力中枢'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {executionState !== 'idle' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30">
                {executionState === 'completed' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-base font-medium text-green-400">
                      {isEnglish ? 'Completed' : '已完成'}
                    </span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-base font-medium text-primary">
                      {executionState === 'dispatching'
                        ? (isEnglish ? 'Dispatching' : '调度中')
                        : (isEnglish ? 'Executing' : '执行中')}
                    </span>
                    <span className="text-base text-muted-foreground">
                      {Math.round(scenarioProgress)}%
                    </span>
                  </>
                )}
              </div>
            )}

            <Button
              onClick={() => setIsScenarioPoolVisible(!isScenarioPoolVisible)}
              variant="outline"
              size="sm"
              className={`border-primary/30 hover:bg-primary/10 ${
                isScenarioPoolVisible ? 'bg-primary/10' : ''
              }`}
            >
              <Target className="w-4 h-4 mr-2" />
              {isEnglish ? 'Scenarios' : '场景池'}
              {isScenarioPoolVisible ? <ChevronUp className="w-4 h-4 ml-2" /> : null}
            </Button>

            {executionLogs.length > 0 && (
              <Button
                onClick={() => setShowLogDialog(true)}
                variant="outline"
                size="sm"
                className="border-tech-green/30 hover:bg-tech-green/10"
              >
                <Activity className="w-4 h-4 mr-2" />
                {isEnglish ? 'Logs' : '日志'}
                <span className="ml-1.5 text-sm bg-tech-green/20 px-2 py-0.5 rounded">
                  {executionLogs.length}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Scenario Pool */}
        {isScenarioPoolVisible && (
          <div className="px-6 pb-4 max-h-[40vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {scenarioCards.map((scenario) => {
                const Icon = getIcon(scenario.icon);
                const isSelected = selectedScenario?.id === scenario.id;

                return (
                  <button
                    key={scenario.id}
                    onClick={() => !executionStarted && handleScenarioClick(scenario)}
                    onMouseEnter={() => handleScenarioHover(scenario)}
                    onMouseLeave={() => handleScenarioHover(null)}
                    disabled={executionStarted}
                    className={`
                      group relative p-4 rounded-xl border transition-all duration-300 text-left
                      ${executionStarted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                      ${isSelected
                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_hsl(200_100%_45%/0.3)]'
                        : 'bg-card/50 border-primary/20 hover:border-primary/50 hover:shadow-[0_0_15px_hsl(200_100%_45%/0.2)]'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${isSelected ? 'bg-primary/30' : 'bg-primary/10'}
                      `}>
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <h3 className="text-base font-semibold mb-1 text-foreground line-clamp-2">
                      {isEnglish ? scenario.titleEn : scenario.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {isEnglish ? scenario.descriptionEn : scenario.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Network className="w-4 h-4" />
                      <span>{scenario.requiredCapabilities.length} {isEnglish ? 'capabilities' : '个能力'}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-20"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasScale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {/* Category Labels */}
          {categoryLabels.map((cat) => (
            <div
              key={cat.id}
              className="absolute z-10 pointer-events-none"
              style={{
                left: `${cat.x}%`,
                top: `${cat.y}%`
              }}
            >
              <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20">
                <div className="text-base font-semibold text-foreground">
                  {isEnglish ? cat.labelEn : cat.label}
                </div>
              </div>
            </div>
          ))}

          {/* Central Orchestrator */}
          <div
            className="absolute z-20"
            style={{
              left: `${centralOrchestrator.x}%`,
              top: `${centralOrchestrator.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div
              className={`
                relative w-24 h-24 rounded-full flex items-center justify-center
                border-4 transition-all duration-500
                ${isOrchestratorActive
                  ? 'bg-gradient-to-br from-primary to-tech-green border-white shadow-[0_0_60px_hsl(200_100%_45%/0.6)] animate-pulse-glow'
                  : 'bg-gradient-to-br from-primary/30 to-tech-green/30 border-primary/50 shadow-[0_0_30px_hsl(200_100%_45%/0.3)]'
                }
              `}
            >
              <Crown className={`w-12 h-12 ${isOrchestratorActive ? 'text-white animate-spin-slow' : 'text-primary'}`} />

              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30 shadow-lg">
                  <div className="text-sm font-bold text-primary">
                    {isEnglish ? 'Central Orchestrator' : '中央编排器'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          {capabilities.map((cap) => {
            const position = capabilityPositions[cap.id];
            if (!position) return null;

            const isHighlighted = highlightedCapabilities.includes(cap.id);
            const isExecuting = currentExecutingCapability === cap.id;
            const isCompleted = completedCapabilities.includes(cap.id);
            const isDispatching = dispatchingCapabilities.includes(cap.id);
            const CapIcon = getCapabilityIcon(cap.id);

            return (
              <div
                key={cap.id}
                className={`absolute transition-all ${hoveredCapability === cap.id ? 'z-[200]' : 'z-10'}`}
                style={position.style}
                onMouseEnter={() => setHoveredCapability(cap.id)}
                onMouseLeave={() => setHoveredCapability(null)}
              >
                <div className="relative flex flex-col items-center">
                  {/* Icon Card */}
                  <div
                    className={`
                      w-20 h-20 rounded-xl flex items-center justify-center
                      border-2 transition-all duration-300 cursor-pointer
                      ${isExecuting
                        ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_20px_hsl(45_100%_50%/0.5)] animate-pulse scale-110'
                        : isCompleted
                        ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_hsl(125_60%_45%/0.4)]'
                        : isDispatching
                        ? 'bg-tech-green/20 border-tech-green shadow-[0_0_15px_hsl(125_60%_45%/0.4)] animate-pulse'
                        : isHighlighted
                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_hsl(200_100%_45%/0.4)] scale-110'
                        : 'bg-card/50 border-border hover:border-primary/50 hover:scale-105'
                      }
                    `}
                  >
                    <CapIcon className={`w-8 h-8 ${
                      isExecuting ? 'text-yellow-500' :
                      isCompleted ? 'text-green-500' :
                      isDispatching ? 'text-tech-green' :
                      isHighlighted ? 'text-primary' :
                      'text-muted-foreground'
                    }`} />

                    {isExecuting && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg animate-pulse">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {isCompleted && !isExecuting && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Tooltip on hover - with high z-index to overlay other cards */}
                {hoveredCapability === cap.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap z-[100]">
                    <div className="bg-background/98 backdrop-blur-md px-5 py-3 rounded-lg border-2 border-primary/50 shadow-2xl">
                      <div className="text-base font-bold text-foreground mb-1">
                        {isEnglish ? cap.nameEn : cap.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cap.role}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Canvas Controls */}
      <div className="absolute bottom-6 right-6 z-40">
        <div className="bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg p-2 shadow-lg">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setCanvasScale(Math.min(2, canvasScale + 0.2))}
              size="sm"
              variant="ghost"
              className="hover:bg-primary/10"
            >
              +
            </Button>
            <div className="text-sm text-center font-mono text-muted-foreground px-2">
              {Math.round(canvasScale * 100)}%
            </div>
            <Button
              onClick={() => setCanvasScale(Math.max(0.3, canvasScale - 0.2))}
              size="sm"
              variant="ghost"
              className="hover:bg-primary/10"
            >
              -
            </Button>
            <div className="h-px bg-border my-1" />
            <Button
              onClick={resetView}
              size="sm"
              variant="ghost"
              className="hover:bg-primary/10"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground text-center mt-2">
          {isEnglish ? 'Scroll to zoom, Shift+Drag to pan' : '滚轮缩放，Shift+拖动平移'}
        </div>
      </div>

      {/* Workflow Progress Panel */}
      {selectedScenario && executionState !== 'idle' && (
        <div className="absolute top-24 right-6 z-40 w-96 max-h-[calc(100vh-200px)] bg-background/95 backdrop-blur-sm border border-primary/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-tech-green/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-foreground">
                {isEnglish ? 'Workflow Progress' : '工作流进度'}
              </h3>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {Math.round(scenarioProgress)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-tech-green transition-all duration-500"
                style={{ width: `${scenarioProgress}%` }}
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[60vh] p-3 space-y-2 custom-scrollbar">
            {selectedScenario.workflow.map((step, index) => {
              const isCurrent = currentStepIndex === index && executionState === 'running';
              const isPast = index < currentStepIndex || completedCapabilities.includes(step.capabilityId);
              const isFuture = index > currentStepIndex && executionState !== 'completed';
              const isCheckpoint = (step as any).type === 'checkpoint';

              return (
                <div
                  key={step.id}
                  className={`
                    p-3 rounded-lg border transition-all duration-300
                    ${isCurrent
                      ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_hsl(45_100%_50%/0.2)]'
                      : isPast
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-card/30 border-border/30 opacity-50'
                    }
                    ${isCheckpoint ? 'border-l-4 border-l-primary/60' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                      ${isCurrent
                        ? 'bg-yellow-500 animate-pulse'
                        : isPast
                        ? 'bg-green-500'
                        : 'bg-muted'
                      }
                      ${isCheckpoint && !isCurrent && !isPast ? 'ring-2 ring-primary/50' : ''}
                    `}>
                      {isPast && !isCurrent ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-semibold text-foreground">
                          {isEnglish ? step.capabilityNameEn : step.capabilityName}
                        </div>
                        {isCheckpoint && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                            {isEnglish ? 'Decision' : '决策点'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        ▶ {isEnglish ? (step as any).actionEn : (step as any).action}
                      </div>

                      {isCurrent && stepDynamicMessages[step.id] && (
                        <div className="space-y-1">
                          {stepDynamicMessages[step.id].map((message, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-muted-foreground pl-2 border-l-2 border-yellow-500/30 animate-fade-in"
                            >
                              • {message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Execution Logs Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              {isEnglish ? 'Execution Logs' : '执行日志'}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-1 font-mono text-sm bg-black/80 p-4 rounded-lg custom-scrollbar">
            {executionLogs.map((log, index) => (
              <div
                key={index}
                className={`
                  ${log.includes('🎯') || log.includes('🤖') ? 'text-primary font-semibold' :
                    log.includes('✅') || log.includes('🎉') ? 'text-green-400' :
                    log.includes('▶️') ? 'text-yellow-400' :
                    log.includes('📡') || log.includes('🚀') ? 'text-tech-green' :
                    'text-green-400/70'}
                `}
              >
                {log}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkpoint Dialog for Human Decision Points */}
      <CheckpointDialog
        open={showCheckpoint}
        checkpoint={currentCheckpoint}
        onDecision={handleCheckpointDecision}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--background));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, hsl(200 100% 45%), hsl(280 60% 50%));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, hsl(200 100% 55%), hsl(280 60% 60%));
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

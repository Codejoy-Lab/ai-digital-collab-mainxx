import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Download, TrendingDown, TrendingUp, AlertTriangle, AlertCircle, CheckCircle2, DollarSign, Users, Calendar, BarChart3, FileText, Shield, Factory, Lightbulb, MessageSquare, Target, Network } from 'lucide-react';
import { SelectedScenario } from '@/pages/MerckAIHubPage';
import { useLanguage } from '@/contexts/LanguageContext';

interface MerckResultDisplayProps {
  scenario: SelectedScenario | null;
  checkpointDecisions?: Record<string, any>;
  onContinue: () => void;
}

export const MerckResultDisplay = ({ scenario, checkpointDecisions = {}, onContinue }: MerckResultDisplayProps) => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  if (!scenario) return null;

  const hasCheckpoints = Object.keys(checkpointDecisions).length > 0;

  // Scenario-specific report templates
  const getScenarioReport = () => {
    const reports: Record<string, any> = {
      'scenario-a1': {
        title: isEnglish ? 'Master Data & Reconciliation Report' : '主数据对账报告',
        icon: FileText,
        sections: [
          {
            title: isEnglish ? 'Data Quality Overview' : '数据质量概览',
            type: 'metrics',
            data: [
              { label: isEnglish ? 'ERP Systems Scanned' : '扫描ERP系统', value: '5', trend: 'neutral' },
              { label: isEnglish ? 'Master Records Found' : '发现主数据记录', value: '2,847', trend: 'neutral' },
              { label: isEnglish ? 'Data Quality Issues' : '数据质量问题', value: '32', trend: 'warning' },
              { label: isEnglish ? 'Cleanup Success Rate' : '清洗成功率', value: '96.5%', trend: 'success' },
            ]
          },
          {
            title: isEnglish ? 'Entity Matching Results' : '实体匹配结果',
            type: 'metrics',
            data: [
              { label: isEnglish ? 'Entities Analyzed' : '分析实体数', value: '1,234', trend: 'neutral' },
              { label: isEnglish ? 'Auto-matched' : '自动匹配成功', value: '1,156 (93.7%)', trend: 'success' },
              { label: isEnglish ? 'Potential Duplicates' : '潜在重复项', value: '45', trend: 'warning' },
              { label: isEnglish ? 'Avg Confidence Score' : '平均置信度', value: '92%', trend: 'success' },
            ]
          },
          {
            title: isEnglish ? 'Reconciliation Summary' : '对账汇总',
            type: 'reconciliation',
            data: [
              { label: isEnglish ? 'Transactions Processed' : '处理交易笔数', value: '3,456', matched: '3,289', variance: '167' },
              { label: isEnglish ? 'Order-Invoice Pairs' : '订单-发票配对', value: '2,984', matched: '2,890', variance: '94' },
              { label: isEnglish ? 'Payment Reconciliation' : '回款勾对', value: '1,234', matched: '1,201', variance: '33' },
              { label: isEnglish ? 'Total Variance Amount' : '总差异金额', value: isEnglish ? '$127K' : '¥856万', note: isEnglish ? 'Within acceptable range' : '在可接受范围内' },
            ]
          }
        ],
        outputs: [
          { name: isEnglish ? 'Master Data Quality Report' : '主数据质量报告', type: 'PDF', size: '2.4 MB' },
          { name: isEnglish ? 'Entity Mapping Table' : '实体映射表', type: 'Excel', size: '1.8 MB' },
          { name: isEnglish ? 'Variance Analysis' : '差异分析明细', type: 'Excel', size: '890 KB' },
          { name: isEnglish ? 'Audit Trail' : '审计轨迹', type: 'PDF', size: '560 KB' },
        ]
      },
      'scenario-a2': {
        title: isEnglish ? 'AR & Credit Risk Management Report' : 'AR风险管理报告',
        icon: DollarSign,
        sections: [
          {
            title: isEnglish ? 'Customer Credit Assessment' : '客户信用评估',
            type: 'risk-distribution',
            data: [
              { level: isEnglish ? 'Low Risk' : '低风险', count: 684, percentage: 54.9, color: 'green' },
              { level: isEnglish ? 'Medium Risk' : '中风险', count: 384, percentage: 30.8, color: 'yellow' },
              { level: isEnglish ? 'High Risk' : '高风险', count: 123, percentage: 9.9, color: 'orange' },
              { level: isEnglish ? 'Critical Risk' : '极高风险', count: 56, percentage: 4.5, color: 'red' },
            ]
          },
          {
            title: isEnglish ? 'Collection Strategy Overview' : '催收策略概览',
            type: 'strategy-breakdown',
            data: [
              { strategy: isEnglish ? 'Gentle Reminder' : '温和提醒', accounts: 468, avgOverdue: '15 days', channel: isEnglish ? 'Email' : '邮件' },
              { strategy: isEnglish ? 'Active Follow-up' : '主动跟进', accounts: 287, avgOverdue: '42 days', channel: isEnglish ? 'Phone + Email' : '电话+邮件' },
              { strategy: isEnglish ? 'Escalated Collection' : '升级催收', accounts: 91, avgOverdue: '68 days', channel: isEnglish ? 'Manager Call' : '经理致电' },
              { strategy: isEnglish ? 'Legal Consideration' : '法律考量', accounts: 12, avgOverdue: '95 days', channel: isEnglish ? 'Legal Review' : '法务评估' },
            ]
          },
          {
            title: isEnglish ? 'Risk Dashboard Metrics' : '风险看板指标',
            type: 'metrics',
            data: [
              { label: isEnglish ? 'Total AR Outstanding' : '应收账款总额', value: isEnglish ? '$8.7M' : '¥5,863万', trend: 'neutral' },
              { label: isEnglish ? 'Aging > 90 Days' : '账龄>90天', value: isEnglish ? '$567K (6.5%)' : '¥382万 (6.5%)', trend: 'warning' },
              { label: isEnglish ? 'Expected Recovery Rate' : '预期回款率', value: '74%', trend: 'success' },
              { label: isEnglish ? 'Risk Trend vs Last Quarter' : '风险趋势', value: '-8.3%', trend: 'success' },
            ]
          }
        ],
        outputs: [
          { name: isEnglish ? 'Customer Credit Score Report' : '客户信用评分报告', type: 'PDF', size: '3.1 MB' },
          { name: isEnglish ? 'Collection Strategy Playbook' : '催收策略手册', type: 'PDF', size: '1.9 MB' },
          { name: isEnglish ? 'Legal Escalation Recommendations' : '法律升级建议', type: 'Excel', size: '450 KB' },
          { name: isEnglish ? 'AR Risk Dashboard' : 'AR风险看板', type: 'Power BI', size: '12.3 MB' },
        ]
      },
      'scenario-a3': {
        title: isEnglish ? 'Supplier Due Diligence Report' : '供应商尽调报告',
        icon: Shield,
        sections: [
          {
            title: isEnglish ? 'Information Collection Summary' : '信息收集汇总',
            type: 'metrics',
            data: [
              { label: isEnglish ? 'Data Sources Accessed' : '访问数据源', value: '8', trend: 'neutral' },
              { label: isEnglish ? 'Financial Reports Retrieved' : '获取财务报告', value: '23', trend: 'neutral' },
              { label: isEnglish ? 'Media Articles Monitored' : '监测媒体报道', value: '347', trend: 'neutral' },
              { label: isEnglish ? 'ESG Reports Analyzed' : 'ESG报告分析', value: '15', trend: 'neutral' },
            ]
          },
          {
            title: isEnglish ? 'Multi-Dimensional Risk Assessment' : '多维度风险评估',
            type: 'risk-scores',
            data: [
              { dimension: isEnglish ? 'Financial Health' : '财务健康', score: 78, rating: isEnglish ? 'Good' : '良好', color: 'green' },
              { dimension: isEnglish ? 'Legal Compliance' : '法律合规', score: 92, rating: isEnglish ? 'Excellent' : '优秀', color: 'green' },
              { dimension: isEnglish ? 'ESG Performance' : 'ESG表现', score: 65, rating: isEnglish ? 'Fair' : '一般', color: 'yellow' },
              { dimension: isEnglish ? 'Delivery Stability' : '交付稳定性', score: 88, rating: isEnglish ? 'Good' : '良好', color: 'green' },
            ]
          },
          {
            title: isEnglish ? 'Onboarding Decision' : '准入决策建议',
            type: 'decision',
            data: {
              decision: isEnglish ? 'Conditional Approval' : '条件通过',
              overallScore: 81,
              riskLevel: isEnglish ? 'Medium' : '中',
              mitigationMeasures: [
                isEnglish ? 'Quarterly ESG performance review' : '季度ESG表现复审',
                isEnglish ? 'Enhanced quality inspection for first 6 months' : '前6个月强化质量检验',
                isEnglish ? 'Payment terms: 30% deposit required' : '付款条款：要求30%预付款',
              ],
              reviewCycle: isEnglish ? 'Every 6 months' : '每6个月',
            }
          }
        ],
        outputs: [
          { name: isEnglish ? 'Supplier Risk Assessment' : '供应商风险评估报告', type: 'PDF', size: '4.2 MB' },
          { name: isEnglish ? 'ESG Performance Scorecard' : 'ESG表现计分卡', type: 'Excel', size: '780 KB' },
          { name: isEnglish ? 'Onboarding Decision Matrix' : '准入决策矩阵', type: 'Excel', size: '520 KB' },
          { name: isEnglish ? 'Audit Documentation' : '审计文档包', type: 'ZIP', size: '8.7 MB' },
        ]
      },
      'scenario-b1': {
        title: isEnglish ? 'Demand Forecasting & S&OP Report' : '需求预测与S&OP报告',
        icon: TrendingUp,
        sections: [
          {
            title: isEnglish ? 'Demand Forecast Accuracy' : '需求预测准确度',
            type: 'metrics',
            data: [
              { label: isEnglish ? 'Historical Data Analyzed' : '分析历史数据', value: '28 months', trend: 'neutral' },
              { label: isEnglish ? 'Seasonal Patterns Detected' : '检测季节性模式', value: '5', trend: 'neutral' },
              { label: isEnglish ? 'SKUs Forecasted' : '预测SKU数', value: '412', trend: 'neutral' },
              { label: isEnglish ? 'Forecast Accuracy' : '模型准确率', value: '93%', trend: 'success' },
            ]
          },
          {
            title: isEnglish ? 'Production & Inventory Optimization' : '生产与库存优化',
            type: 'optimization',
            data: [
              { category: isEnglish ? 'Capacity Bottlenecks Identified' : '识别产能瓶颈', value: 5, impact: isEnglish ? 'High' : '高' },
              { category: isEnglish ? 'Material Constraints' : '物料约束', value: 87, impact: isEnglish ? 'Medium' : '中' },
              { category: isEnglish ? 'Optimization Scenarios Generated' : '生成优化方案', value: 4, impact: isEnglish ? 'High' : '高' },
              { category: isEnglish ? 'Potential Inventory Reduction' : '潜在库存降低', value: '-16%', impact: isEnglish ? 'High' : '高' },
            ]
          },
          {
            title: isEnglish ? 'Supply-Demand Imbalances' : '产销失衡预警',
            type: 'imbalances',
            data: {
              slowMoving: { count: 34, value: isEnglish ? '$2.1M inventory' : '¥1,418万库存' },
              stockoutRisk: { count: 28, value: isEnglish ? '$1.8M potential loss' : '¥1,214万潜在损失' },
              transferRecommendations: 17,
              substituteSuggestions: 12,
            }
          }
        ],
        outputs: [
          { name: isEnglish ? 'Demand Forecast Report' : '需求预测报告', type: 'Excel', size: '2.8 MB' },
          { name: isEnglish ? 'Production & Replenishment Plan' : '生产补货计划', type: 'Excel', size: '1.6 MB' },
          { name: isEnglish ? 'Supply-Demand Imbalance Alert' : '产销失衡预警', type: 'PDF', size: '890 KB' },
          { name: isEnglish ? 'S&OP Meeting Materials' : 'S&OP会议材料', type: 'PowerPoint', size: '5.4 MB' },
        ]
      },
      'scenario-b2': {
        title: isEnglish ? 'Smart Manufacturing Health Report' : '智能制造健康报告',
        icon: Factory,
        sections: [
          {
            title: isEnglish ? 'Equipment Health Assessment' : '设备健康评估',
            type: 'health-distribution',
            data: [
              { status: isEnglish ? 'Healthy' : '健康', count: 98, percentage: 77.2, color: 'green' },
              { status: isEnglish ? 'Warning' : '预警', count: 21, percentage: 16.5, color: 'yellow' },
              { status: isEnglish ? 'At-Risk' : '风险', count: 8, percentage: 6.3, color: 'red' },
            ],
            overallHealth: 84
          },
          {
            title: isEnglish ? 'Quality Risk Analysis' : '质量风险分析',
            type: 'quality',
            data: [
              { parameter: isEnglish ? 'Batches Compared' : '对比批次数', value: '187', status: 'normal' },
              { parameter: isEnglish ? 'Quality Anomalies Detected' : '检测质量异常', value: '11', status: 'warning' },
              { parameter: isEnglish ? 'Risk Level' : '风险等级', value: isEnglish ? 'Medium' : '中', status: 'warning' },
              { parameter: isEnglish ? 'Process Adjustments Recommended' : '推荐工艺调整', value: '4', status: 'info' },
            ]
          },
          {
            title: isEnglish ? 'Maintenance Planning' : '维护计划',
            type: 'maintenance',
            data: {
              maintenanceWindow: isEnglish ? '5.2 hours avg downtime' : '平均5.2小时停机',
              ordersBalanced: 11,
              workOrdersGenerated: 18,
              techniciansDispatched: 27,
              estimatedCostSaving: isEnglish ? '$45K' : '¥304万',
            }
          }
        ],
        outputs: [
          { name: isEnglish ? 'Equipment Health Report' : '设备健康报告', type: 'PDF', size: '3.7 MB' },
          { name: isEnglish ? 'Quality Risk Analysis' : '质量风险分析', type: 'Excel', size: '1.2 MB' },
          { name: isEnglish ? 'Maintenance Work Orders' : '维护工单', type: 'Excel', size: '640 KB' },
          { name: isEnglish ? 'Factory Dashboard' : '工厂报告看板', type: 'Power BI', size: '15.8 MB' },
        ]
      },
      'scenario-c1': {
        title: isEnglish ? '300K SKU Product Recommendation Report' : '30万SKU产品推荐报告',
        icon: Lightbulb,
        sections: [
          {
            title: isEnglish ? 'Requirement Understanding' : '需求理解',
            type: 'requirements',
            data: {
              experimentObjective: isEnglish ? 'Protein expression and purification' : '蛋白表达与纯化',
              sampleType: isEnglish ? 'E. coli lysate' : '大肠杆菌裂解液',
              instrumentPlatform: isEnglish ? 'ÄKTA™ chromatography system' : 'ÄKTA™层析系统',
              budgetConstraint: isEnglish ? '$3,000 - $5,000' : '¥20,000 - ¥35,000',
            }
          },
          {
            title: isEnglish ? 'Product Matching Results' : '产品匹配结果',
            type: 'product-match',
            data: [
              {
                product: isEnglish ? 'HisTrap™ HP Column (5 x 1 mL)' : 'HisTrap™ HP 亲和柱 (5 x 1 mL)',
                sku: 'GE17-5248-02',
                compatibility: 98,
                price: isEnglish ? '$890' : '¥6,012'
              },
              {
                product: isEnglish ? 'HiLoad™ 16/600 Superdex™ 75 pg' : 'HiLoad™ 16/600 Superdex™ 75 pg',
                sku: 'GE28-9893-33',
                compatibility: 96,
                price: isEnglish ? '$1,240' : '¥8,371'
              },
              {
                product: isEnglish ? 'Complete His-Tag Purification Kit' : 'His标签纯化完整试剂盒',
                sku: 'MS-PKG-5847',
                compatibility: 94,
                price: isEnglish ? '$1,680' : '¥11,344'
              },
            ],
            totalRecommended: 8,
            combinationSolutions: 3
          },
          {
            title: isEnglish ? 'Safety & Compliance Check' : '安全合规检查',
            type: 'compliance-check',
            data: {
              hazardChecks: 18,
              storageRequirements: isEnglish ? '2-8°C, dry place' : '2-8°C，干燥处',
              transportRestrictions: isEnglish ? 'None' : '无',
              safetyLevel: isEnglish ? 'Standard laboratory precautions' : '标准实验室防护',
            }
          }
        ],
        outputs: [
          { name: isEnglish ? 'Product Recommendation Report' : '产品推荐报告', type: 'PDF', size: '2.1 MB' },
          { name: isEnglish ? 'Alternative Products Comparison' : '替代品对比', type: 'Excel', size: '580 KB' },
          { name: isEnglish ? 'Safety & Handling Guidelines' : '安全操作指南', type: 'PDF', size: '450 KB' },
          { name: isEnglish ? 'Quotation Package' : '报价方案包', type: 'PDF', size: '720 KB' },
        ]
      },
      'scenario-c2': {
        title: isEnglish ? 'Customer Service AI Co-pilot Report' : '客服AI副驾报告',
        icon: MessageSquare,
        sections: [
          {
            title: isEnglish ? 'Call Analysis Summary' : '通话分析汇总',
            type: 'call-analysis',
            data: {
              intent: isEnglish ? 'Technical Support - Product Usage' : '技术支持 - 产品使用',
              issueClassification: isEnglish ? 'Application Issue' : '应用问题',
              emotionState: isEnglish ? 'Frustrated → Satisfied' : '焦虑 → 满意',
              resolutionTime: isEnglish ? '8 min 42 sec' : '8分42秒',
            }
          },
          {
            title: isEnglish ? 'Real-time Assistance Provided' : '实时辅助推送',
            type: 'assistance',
            data: [
              { type: isEnglish ? 'Knowledge Base Articles' : '知识库文档', count: 1247, retrieved: 5 },
              { type: isEnglish ? 'Order Query' : '订单查询', orderNumber: '#78452', status: isEnglish ? 'Shipped' : '已发货' },
              { type: isEnglish ? 'Relevant Tickets' : '相关工单', count: 4, similar: 2 },
              { type: isEnglish ? 'Action Suggestions Pushed' : '操作建议推送', count: 2, accepted: 2 },
            ]
          },
          {
            title: isEnglish ? 'Compliance & Quality Check' : '合规与质检',
            type: 'compliance-qa',
            data: {
              sensitiveTopics: 0,
              medicalClaims: 0,
              priceCommitments: 0,
              phrasingAdjustments: 3,
              qaScore: 94,
              followUpTasks: 1,
            }
          }
        ],
        outputs: [
          { name: isEnglish ? 'Call Transcript & Summary' : '通话记录与摘要', type: 'PDF', size: '280 KB' },
          { name: isEnglish ? 'Issue Classification Report' : '问题分类报告', type: 'Excel', size: '120 KB' },
          { name: isEnglish ? 'Follow-up Task List' : '跟进任务清单', type: 'PDF', size: '95 KB' },
          { name: isEnglish ? 'Quality Assurance Scorecard' : '质检评分卡', type: 'PDF', size: '180 KB' },
        ]
      },
      'scenario-c3': {
        title: isEnglish ? 'Market Intelligence & Opportunity Report' : '市场洞察与机会报告',
        icon: Target,
        sections: [
          {
            title: isEnglish ? 'Intelligence Collection' : '情报收集',
            type: 'metrics',
            data: [
              { label: isEnglish ? 'Patents & Papers Scraped' : '抓取专利论文', value: '547', trend: 'neutral' },
              { label: isEnglish ? 'Conference Materials' : '会议资料', value: '94', trend: 'neutral' },
              { label: isEnglish ? 'Policy Updates Monitored' : '政策更新监测', value: '67', trend: 'neutral' },
              { label: isEnglish ? 'Competitor Moves Tracked' : '竞品动态跟踪', value: '38', trend: 'neutral' },
            ]
          },
          {
            title: isEnglish ? 'Topic Clustering & Trend Analysis' : '主题聚类与趋势分析',
            type: 'trends',
            data: [
              { topic: isEnglish ? 'mRNA Therapeutics' : 'mRNA治疗', documents: 234, stage: isEnglish ? 'Growth' : '成长期', heat: 87, change: '+45%' },
              { topic: isEnglish ? 'Cell-Free Protein Synthesis' : '无细胞蛋白合成', documents: 156, stage: isEnglish ? 'Explosive' : '爆发期', heat: 94, change: '+128%' },
              { topic: isEnglish ? 'AI-Driven Drug Discovery' : 'AI药物发现', documents: 189, stage: isEnglish ? 'Growth' : '成长期', heat: 78, change: '+62%' },
            ],
            emergingTopics: 28,
            trackedTopics: 14
          },
          {
            title: isEnglish ? 'Opportunities & Risks' : '机会与风险识别',
            type: 'opportunities',
            data: {
              newProductOpportunities: 11,
              solutionWhiteSpaces: 6,
              competitivePressurePoints: 4,
              regulatoryRisks: 2,
              topOpportunity: isEnglish
                ? 'Cell-Free Protein Synthesis Kits for Academic Research'
                : '面向学术研究的无细胞蛋白合成试剂盒',
            }
          }
        ],
        outputs: [
          { name: isEnglish ? 'Executive Summary' : '管理层摘要', type: 'PDF', size: '1.8 MB' },
          { name: isEnglish ? 'BU Market Trend Report' : 'BU市场趋势报告', type: 'PowerPoint', size: '7.2 MB' },
          { name: isEnglish ? 'Opportunity Pipeline' : '机会清单', type: 'Excel', size: '840 KB' },
          { name: isEnglish ? 'Competitive Intelligence Brief' : '竞品情报简报', type: 'PDF', size: '2.3 MB' },
        ]
      },
      'scenario-c4': {
        title: isEnglish ? 'Sales Co-pilot & Pricing Report' : '销售副驾与定价报告',
        icon: Users,
        sections: [
          {
            title: isEnglish ? 'Lead Scoring & Prioritization' : '线索评分与优先级',
            type: 'lead-scoring',
            data: [
              { segment: isEnglish ? 'Hot Leads (Score 80-100)' : '热门线索 (80-100分)', count: 34, totalValue: isEnglish ? '$2.8M' : '¥1,889万', winProb: '68%' },
              { segment: isEnglish ? 'Warm Leads (Score 60-79)' : '温和线索 (60-79分)', count: 89, totalValue: isEnglish ? '$4.1M' : '¥2,768万', winProb: '42%' },
              { segment: isEnglish ? 'Cold Leads (Score <60)' : '冷线索 (<60分)', count: 127, totalValue: isEnglish ? '$1.9M' : '¥1,283万', winProb: '18%' },
            ],
            churnRisk: 47,
            followUpList: 23
          },
          {
            title: isEnglish ? 'Personalized Recommendations' : '个性化推荐',
            type: 'recommendations',
            data: {
              purchaseHistoryAnalyzed: 3,
              potentialProducts: 8,
              crossSellOpportunities: 5,
              talkingPoints: [
                isEnglish ? 'Customer increased antibody purchases by 45% last quarter' : '客户上季度抗体采购增长45%',
                isEnglish ? 'Recommend complete western blot workflow solution' : '推荐完整蛋白印迹工作流方案',
                isEnglish ? 'Competitive price point available for bulk orders' : '批量订单可提供竞争性价格',
              ]
            }
          },
          {
            title: isEnglish ? 'Pricing Strategy Simulation' : '定价策略模拟',
            type: 'pricing',
            data: {
              priceElasticity: -2.3,
              currentPrice: isEnglish ? '$850' : '¥5,738',
              recommendedRange: isEnglish ? '$780 - $920' : '¥5,267 - ¥6,211',
              optimalPrice: isEnglish ? '$835' : '¥5,637',
              volumeImpact: '+12%',
              marginImpact: '+8.5%',
            }
          }
        ],
        outputs: [
          { name: isEnglish ? 'Lead Scoring Report' : '线索评分报告', type: 'Excel', size: '1.4 MB' },
          { name: isEnglish ? 'Weekly Follow-up Priority List' : '本周跟进优先级清单', type: 'PDF', size: '420 KB' },
          { name: isEnglish ? 'Pricing Strategy Analysis' : '定价策略分析', type: 'Excel', size: '780 KB' },
          { name: isEnglish ? 'Customer Engagement Playbook' : '客户互动手册', type: 'PDF', size: '1.9 MB' },
        ]
      },
      'scenario-c5': {
        title: isEnglish ? 'AI Content Factory Report' : 'AI内容工厂报告',
        icon: FileText,
        sections: [
          {
            title: isEnglish ? 'Content Generation Summary' : '内容生成汇总',
            type: 'content-generated',
            data: [
              { type: isEnglish ? 'Technical Documentation' : '技术说明', count: 5, languages: 12 },
              { type: isEnglish ? 'White Papers' : '白皮书', count: 2, languages: 8 },
              { type: isEnglish ? 'Marketing Copy' : '营销文案', count: 8, languages: 15 },
              { type: isEnglish ? 'Social Media Posts' : '社交媒体内容', count: 24, languages: 6 },
            ],
            totalPieces: 39,
            totalLanguages: 16
          },
          {
            title: isEnglish ? 'Translation & Localization' : '翻译与本地化',
            type: 'translation',
            data: {
              unifiedTerms: 1247,
              languagesCovered: 16,
              regionalAdjustments: 128,
              culturalAdaptation: '95%',
              topLanguages: ['English', 'Chinese', 'German', 'French', 'Japanese'],
            }
          },
          {
            title: isEnglish ? 'Compliance & Quality Review' : '合规与质量审校',
            type: 'compliance-review',
            data: {
              prohibitedExpressions: 54,
              exaggerationDetected: 2,
              scientificConsistency: '97%',
              reviewPointsHighlighted: 11,
              approvalReady: '92%',
            }
          },
          {
            title: isEnglish ? 'Multi-Channel Adaptation' : '多渠道适配',
            type: 'channels',
            data: [
              { channel: isEnglish ? 'Website (Long-form)' : '官网（长文）', pieces: 4 },
              { channel: isEnglish ? 'E-commerce (Product Pages)' : '电商（产品页）', pieces: 6 },
              { channel: isEnglish ? 'Social Media (Short Posts)' : '社交媒体（短文）', pieces: 12 },
              { channel: isEnglish ? 'Offline Materials (Brochures)' : '线下物料（手册）', pieces: 3 },
            ]
          }
        ],
        outputs: [
          { name: isEnglish ? 'Content Library Package' : '内容库总包', type: 'ZIP', size: '45.2 MB' },
          { name: isEnglish ? 'Translation Memory Database' : '翻译记忆库', type: 'TMX', size: '8.7 MB' },
          { name: isEnglish ? 'Compliance Review Report' : '合规审校报告', type: 'PDF', size: '1.2 MB' },
          { name: isEnglish ? 'Version Control Manifest' : '版本治理清单', type: 'Excel', size: '340 KB' },
        ]
      },
    };

    return reports[scenario.id] || reports['scenario-a1'];
  };

  const report = getScenarioReport();
  const Icon = report.icon;

  // Render different section types
  const renderSection = (section: any) => {
    switch (section.type) {
      case 'metrics':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {section.data.map((metric: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-br from-background to-muted/20 p-4 rounded-lg border border-border">
                <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                {metric.trend === 'success' && <TrendingUp className="w-4 h-4 text-green-500 mt-2" />}
                {metric.trend === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-2" />}
              </div>
            ))}
          </div>
        );

      case 'reconciliation':
        return (
          <div className="space-y-3">
            {section.data.map((item: any, idx: number) => (
              <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{isEnglish ? 'Total' : '总计'}: {item.value}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{isEnglish ? 'Matched' : '已匹配'}: <span className="font-semibold">{item.matched}</span></span>
                  </div>
                  {item.variance && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span>{isEnglish ? 'Variance' : '差异'}: <span className="font-semibold">{item.variance}</span></span>
                    </div>
                  )}
                </div>
                {item.note && <div className="mt-2 text-xs text-muted-foreground italic">{item.note}</div>}
              </div>
            ))}
          </div>
        );

      case 'risk-distribution':
        return (
          <div className="space-y-3">
            {section.data.map((item: any, idx: number) => {
              const colorMap: Record<string, string> = {
                green: 'bg-green-500',
                yellow: 'bg-yellow-500',
                orange: 'bg-orange-500',
                red: 'bg-red-500',
              };
              return (
                <div key={idx} className="bg-background/50 p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colorMap[item.color]}`} />
                      <span className="font-medium">{item.level}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{item.count}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full ${colorMap[item.color]}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'strategy-breakdown':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold">{isEnglish ? 'Strategy' : '策略'}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">{isEnglish ? 'Accounts' : '账户数'}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">{isEnglish ? 'Avg Overdue' : '平均逾期'}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">{isEnglish ? 'Channel' : '渠道'}</th>
                </tr>
              </thead>
              <tbody>
                {section.data.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{item.strategy}</td>
                    <td className="py-3 px-4">{item.accounts}</td>
                    <td className="py-3 px-4">{item.avgOverdue}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'risk-scores':
        return (
          <div className="space-y-3">
            {section.data.map((item: any, idx: number) => {
              const colorMap: Record<string, string> = {
                green: 'bg-green-500',
                yellow: 'bg-yellow-500',
                red: 'bg-red-500',
              };
              return (
                <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.dimension}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xl">{item.score}</span>
                      <span className={`text-sm px-2 py-1 rounded ${item.color === 'green' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                        {item.rating}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full ${colorMap[item.color]}`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'decision':
        return (
          <div className="bg-gradient-to-br from-primary/10 to-tech-green/10 p-6 rounded-lg border-2 border-primary/30">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Decision' : '决策'}</div>
                <div className="text-2xl font-bold text-primary">{section.data.decision}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Overall Score' : '综合评分'}</div>
                <div className="text-2xl font-bold text-foreground">{section.data.overallScore}/100</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-sm font-semibold text-foreground">{isEnglish ? 'Risk Mitigation Measures' : '风控措施'}:</div>
              {section.data.mitigationMeasures.map((measure: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{measure}</span>
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">{isEnglish ? 'Review Cycle' : '复审周期'}: </span>
              <span className="font-semibold">{section.data.reviewCycle}</span>
            </div>
          </div>
        );

      case 'optimization':
      case 'quality':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {section.data.map((item: any, idx: number) => (
              <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.category || item.parameter}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.impact === (isEnglish ? 'High' : '高') || item.status === 'warning' ? 'bg-yellow-500/20 text-yellow-600' :
                    item.status === 'normal' ? 'bg-green-500/20 text-green-600' :
                    'bg-blue-500/20 text-blue-600'
                  }`}>
                    {item.impact || item.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mt-2">{item.value}</div>
              </div>
            ))}
          </div>
        );

      case 'imbalances':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-foreground">{isEnglish ? 'Slow-Moving Items' : '滞销产品'}</h3>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{section.data.slowMoving.count}</div>
              <div className="text-sm text-muted-foreground">{section.data.slowMoving.value}</div>
            </div>
            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-foreground">{isEnglish ? 'Stockout Risk' : '缺货风险'}</h3>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{section.data.stockoutRisk.count}</div>
              <div className="text-sm text-muted-foreground">{section.data.stockoutRisk.value}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Transfer Recommendations' : '调拨建议'}</div>
              <div className="text-xl font-bold text-foreground">{section.data.transferRecommendations}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Substitute Suggestions' : '替代品建议'}</div>
              <div className="text-xl font-bold text-foreground">{section.data.substituteSuggestions}</div>
            </div>
          </div>
        );

      case 'health-distribution':
        return (
          <div>
            <div className="mb-4 p-4 bg-gradient-to-br from-primary/10 to-tech-green/10 rounded-lg border border-primary/30">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Overall Equipment Health' : '设备整体健康度'}</div>
              <div className="text-3xl font-bold text-primary">{section.overallHealth}/100</div>
            </div>
            <div className="space-y-3">
              {section.data.map((item: any, idx: number) => {
                const colorMap: Record<string, string> = {
                  green: 'bg-green-500',
                  yellow: 'bg-yellow-500',
                  red: 'bg-red-500',
                };
                return (
                  <div key={idx} className="bg-background/50 p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colorMap[item.color]}`} />
                        <span className="font-medium">{item.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{item.count}</div>
                        <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`h-2 rounded-full ${colorMap[item.color]}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Maintenance Window' : '维护窗口'}</div>
              <div className="text-lg font-bold text-foreground">{section.data.maintenanceWindow}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Orders Balanced' : '平衡订单数'}</div>
              <div className="text-lg font-bold text-foreground">{section.data.ordersBalanced}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Work Orders Generated' : '生成工单'}</div>
              <div className="text-lg font-bold text-foreground">{section.data.workOrdersGenerated}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Technicians Dispatched' : '派工技术人员'}</div>
              <div className="text-lg font-bold text-foreground">{section.data.techniciansDispatched}</div>
            </div>
            <div className="md:col-span-2 bg-green-500/10 p-4 rounded-lg border border-green-500/30">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Estimated Cost Saving' : '预计成本节约'}</div>
              <div className="text-2xl font-bold text-green-600">{section.data.estimatedCostSaving}</div>
            </div>
          </div>
        );

      case 'requirements':
        return (
          <div className="bg-background/50 p-5 rounded-lg border border-border space-y-3">
            {Object.entries(section.data).map(([key, value], idx) => (
              <div key={idx} className="flex items-start justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="font-semibold text-foreground text-right ml-4">{value as string}</span>
              </div>
            ))}
          </div>
        );

      case 'product-match':
        return (
          <div>
            <div className="space-y-3 mb-4">
              {section.data.map((product: any, idx: number) => (
                <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-foreground mb-1">{product.product}</div>
                      <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{product.price}</div>
                      <div className="text-xs text-green-600">{product.compatibility}% {isEnglish ? 'match' : '匹配'}</div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${product.compatibility}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div>{isEnglish ? 'Total Recommended' : '总推荐数'}: <span className="font-semibold">{section.data.totalRecommended}</span></div>
              <div>{isEnglish ? 'Combination Solutions' : '组合方案'}: <span className="font-semibold">{section.data.combinationSolutions}</span></div>
            </div>
          </div>
        );

      case 'compliance-check':
      case 'compliance-qa':
      case 'compliance-review':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(section.data).map(([key, value], idx) => (
              <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-xl font-bold text-foreground">{value as any}</div>
              </div>
            ))}
          </div>
        );

      case 'call-analysis':
        return (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(section.data).map(([key, value], idx) => (
              <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-lg font-semibold text-foreground">{value as string}</div>
              </div>
            ))}
          </div>
        );

      case 'assistance':
        return (
          <div className="space-y-3">
            {section.data.map((item: any, idx: number) => (
              <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{item.type}</span>
                  {item.count !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {item.retrieved || item.similar || item.accepted}/{item.count}
                    </span>
                  )}
                  {item.orderNumber && (
                    <span className="text-sm font-mono text-primary">{item.orderNumber}</span>
                  )}
                </div>
                {item.status && (
                  <div className="text-sm text-muted-foreground mt-1">{isEnglish ? 'Status' : '状态'}: {item.status}</div>
                )}
              </div>
            ))}
          </div>
        );

      case 'trends':
        return (
          <div>
            <div className="space-y-3 mb-4">
              {section.data.map((trend: any, idx: number) => (
                <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-foreground">{trend.topic}</div>
                      <div className="text-sm text-muted-foreground mt-1">{trend.documents} {isEnglish ? 'documents' : '文档'}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm px-2 py-1 rounded ${
                        trend.stage.includes('Explosive') || trend.stage.includes('爆发')
                          ? 'bg-red-500/20 text-red-600'
                          : 'bg-green-500/20 text-green-600'
                      }`}>
                        {trend.stage}
                      </div>
                      <div className="text-lg font-bold text-primary mt-1">{trend.change}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${trend.heat}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{trend.heat}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div>{isEnglish ? 'Emerging Topics' : '新兴话题'}: <span className="font-semibold">{section.emergingTopics}</span></div>
              <div>{isEnglish ? 'Tracked Topics' : '跟踪话题'}: <span className="font-semibold">{section.trackedTopics}</span></div>
            </div>
          </div>
        );

      case 'opportunities':
        return (
          <div className="bg-gradient-to-br from-primary/10 to-tech-green/10 p-5 rounded-lg border-2 border-primary/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{section.data.newProductOpportunities}</div>
                <div className="text-xs text-muted-foreground">{isEnglish ? 'New Products' : '新产品'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-tech-green mb-1">{section.data.solutionWhiteSpaces}</div>
                <div className="text-xs text-muted-foreground">{isEnglish ? 'White Spaces' : '空白点'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">{section.data.competitivePressurePoints}</div>
                <div className="text-xs text-muted-foreground">{isEnglish ? 'Pressure Points' : '压力点'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">{section.data.regulatoryRisks}</div>
                <div className="text-xs text-muted-foreground">{isEnglish ? 'Reg. Risks' : '监管风险'}</div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Top Opportunity' : '首要机会'}</div>
              <div className="text-lg font-semibold text-foreground">{section.data.topOpportunity}</div>
            </div>
          </div>
        );

      case 'lead-scoring':
        return (
          <div>
            <div className="space-y-3 mb-4">
              {section.data.map((segment: any, idx: number) => (
                <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{segment.segment}</span>
                    <div className="text-right">
                      <div className="font-bold text-lg">{segment.count}</div>
                      <div className="text-sm text-primary">{segment.totalValue}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isEnglish ? 'Win Probability' : '成交概率'}: <span className="font-semibold">{segment.winProb}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 p-3 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground">{isEnglish ? 'Churn Risk Flagged' : '流失风险标记'}</div>
                <div className="text-xl font-bold text-foreground">{section.churnRisk}</div>
              </div>
              <div className="bg-background/50 p-3 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground">{isEnglish ? 'Follow-up List' : '跟进清单'}</div>
                <div className="text-xl font-bold text-foreground">{section.followUpList}</div>
              </div>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="bg-background/50 p-5 rounded-lg border border-border">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{section.data.purchaseHistoryAnalyzed}</div>
                <div className="text-xs text-muted-foreground">{isEnglish ? 'Years Analyzed' : '年度分析'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{section.data.potentialProducts}</div>
                <div className="text-xs text-muted-foreground">{isEnglish ? 'Products' : '推荐产品'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{section.data.crossSellOpportunities}</div>
                <div className="text-xs text-muted-foreground">{isEnglish ? 'Cross-sell' : '交叉销售'}</div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="text-sm font-semibold text-foreground mb-2">{isEnglish ? 'Talking Points' : '切入点话术'}:</div>
              <div className="space-y-2">
                {section.data.talkingPoints.map((point: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Current Price' : '当前价格'}</div>
              <div className="text-2xl font-bold text-foreground">{section.data.currentPrice}</div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Optimal Price' : '最优价格'}</div>
              <div className="text-2xl font-bold text-primary">{section.data.optimalPrice}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Price Elasticity' : '价格弹性'}</div>
              <div className="text-xl font-bold text-foreground">{section.data.priceElasticity}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Recommended Range' : '推荐区间'}</div>
              <div className="text-lg font-semibold text-foreground">{section.data.recommendedRange}</div>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Volume Impact' : '销量影响'}</div>
              <div className="text-xl font-bold text-green-600">{section.data.volumeImpact}</div>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Margin Impact' : '毛利影响'}</div>
              <div className="text-xl font-bold text-green-600">{section.data.marginImpact}</div>
            </div>
          </div>
        );

      case 'content-generated':
        return (
          <div>
            <div className="space-y-3 mb-4">
              {section.data.map((item: any, idx: number) => (
                <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.type}</span>
                    <div className="text-right">
                      <div className="font-bold text-lg">{item.count}</div>
                      <div className="text-sm text-muted-foreground">{item.languages} {isEnglish ? 'languages' : '语言'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/30">
                <div className="text-sm text-muted-foreground">{isEnglish ? 'Total Pieces' : '总内容数'}</div>
                <div className="text-2xl font-bold text-primary">{section.data.totalPieces}</div>
              </div>
              <div className="bg-tech-green/10 p-3 rounded-lg border border-tech-green/30">
                <div className="text-sm text-muted-foreground">{isEnglish ? 'Languages' : '语言数'}</div>
                <div className="text-2xl font-bold text-tech-green">{section.data.totalLanguages}</div>
              </div>
            </div>
          </div>
        );

      case 'translation':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Unified Terms' : '统一术语'}</div>
              <div className="text-xl font-bold text-foreground">{section.data.unifiedTerms}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Languages' : '覆盖语言'}</div>
              <div className="text-xl font-bold text-foreground">{section.data.languagesCovered}</div>
            </div>
            <div className="bg-background/50 p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Adjustments' : '地区调整'}</div>
              <div className="text-xl font-bold text-foreground">{section.data.regionalAdjustments}</div>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
              <div className="text-sm text-muted-foreground mb-1">{isEnglish ? 'Adaptation' : '文化适配'}</div>
              <div className="text-xl font-bold text-green-600">{section.data.culturalAdaptation}</div>
            </div>
          </div>
        );

      case 'channels':
        return (
          <div className="grid grid-cols-2 gap-4">
            {section.data.map((channel: any, idx: number) => (
              <div key={idx} className="bg-background/50 p-4 rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-1">{channel.channel}</div>
                <div className="text-2xl font-bold text-foreground">{channel.pieces}</div>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-sm text-muted-foreground">Rendering for {section.type} not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-tech-green/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(200_100%_50%/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(125_60%_45%/0.05),transparent_50%)]" />

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-12">
            <div className="flex items-start gap-6 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-tech-green/5 to-primary/5 backdrop-blur-sm border-2 border-primary/20 shadow-[0_0_40px_hsl(200_100%_45%/0.15)]">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-tech-green flex items-center justify-center shadow-[0_0_30px_hsl(200_100%_45%/0.4)] flex-shrink-0">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-primary to-tech-green bg-clip-text text-transparent">
                  {report.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">{isEnglish ? scenario.titleEn : scenario.title}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-primary/30">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tech-green/10 backdrop-blur-sm border border-tech-green/30">
                    <CheckCircle2 className="w-4 h-4 text-tech-green" />
                    <span className="text-foreground">{isEnglish ? 'Execution Completed' : '执行完成'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Sections */}
          <div className="space-y-6 mb-12">
            {report.sections.map((section: any, idx: number) => (
              <Card key={idx} className="p-8 bg-card/50 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all shadow-[0_0_20px_hsl(200_100%_45%/0.1)] hover:shadow-[0_0_30px_hsl(200_100%_45%/0.2)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary to-tech-green rounded-full" />
                  <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                </div>
                {renderSection(section)}
              </Card>
            ))}
        </div>

        {/* Human-AI Collaboration Section */}
        {hasCheckpoints && (() => {
          // Check if workflow was terminated/rejected
          const hasRejection = Object.values(checkpointDecisions).some((decision: any) => {
            const option = decision?.option;
            return option?.risk === true || option?.id?.includes('reject') || option?.id?.includes('cancel') || option?.id?.includes('manual');
          });

          return (
            <Card className={`p-8 mb-8 border-2 shadow-[0_0_30px_hsl(200_100%_45%/0.15)] ${hasRejection ? 'bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/40' : 'bg-gradient-to-br from-primary/5 to-tech-green/5 border-primary/30'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-tech-green flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {isEnglish ? 'Human-AI Collaboration Record' : '人机协同记录'}
                </h2>
              </div>
              <div className="space-y-4">
                {Object.entries(checkpointDecisions).map(([stepId, decision]: [string, any]) => {
                  const option = decision?.option;
                  const isRisk = option?.risk === true;
                  const isReject = option?.id?.includes('reject');
                  const isCancel = option?.id?.includes('cancel');
                  const isManual = option?.id?.includes('manual');
                  const isNegative = isRisk || isReject || isCancel || isManual;

                  return (
                    <div key={stepId} className={`flex items-start gap-5 p-5 rounded-xl border-2 backdrop-blur-sm transition-all hover:shadow-lg ${isNegative ? 'bg-red-500/5 border-red-500/40 hover:border-red-500/60' : 'bg-background/80 border-primary/20 hover:border-primary/40'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${isNegative ? 'bg-red-500/10 ring-2 ring-red-500/20' : 'bg-primary/10 ring-2 ring-primary/20'}`}>
                        {isReject ? (
                          <AlertTriangle className="w-6 h-6 text-red-500" />
                        ) : isCancel || isManual ? (
                          <AlertCircle className="w-6 h-6 text-orange-500" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className={`font-bold text-lg ${isNegative ? 'text-red-500' : 'text-foreground'}`}>
                            {decision.option?.labelEn && isEnglish ? decision.option.labelEn : decision.option?.label || 'Decision Made'}
                          </h3>
                          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-background/50">
                            {new Date(decision.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{isEnglish ? decision.operator : decision.operatorCn}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-6 border-t-2 border-border/30">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${hasRejection ? 'bg-orange-500/10 border-2 border-orange-500/30' : 'bg-primary/10 border-2 border-primary/30'}`}>
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 ${hasRejection ? 'text-orange-500' : 'text-primary'}`} />
                  <span className="text-sm font-medium text-foreground">
                    {hasRejection
                      ? (isEnglish
                        ? `Workflow terminated by human decision. ${Object.keys(checkpointDecisions).length} decision point(s) involved.`
                        : `流程因人工决策而终止，涉及 ${Object.keys(checkpointDecisions).length} 个决策点。`
                      )
                      : (isEnglish
                        ? `${Object.keys(checkpointDecisions).length} human decision point(s) in this workflow, demonstrating AI-assisted decision making.`
                        : `本次流程包含 ${Object.keys(checkpointDecisions).length} 个人工决策点，体现AI辅助决策的价值。`
                      )
                    }
                  </span>
                </div>
              </div>
            </Card>
          );
        })()}

          {/* Generated Outputs - At Bottom */}
          <Card className="p-8 bg-gradient-to-br from-card/50 to-primary/5 border-2 border-primary/30 mb-12 shadow-[0_0_20px_hsl(200_100%_45%/0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-tech-green flex items-center justify-center shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {isEnglish ? 'Generated Outputs' : '生成产出'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {report.outputs.map((output: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-background/80 backdrop-blur-sm rounded-xl border-2 border-border hover:border-primary/50 hover:shadow-[0_0_15px_hsl(200_100%_45%/0.2)] transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{output.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{output.type} · {output.size}</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onContinue}
              size="lg"
              className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-primary to-tech-green hover:shadow-[0_0_40px_hsl(200_100%_45%/0.6)] hover:scale-105 transition-all"
            >
              {isEnglish ? 'View Value Summary' : '查看价值总结'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

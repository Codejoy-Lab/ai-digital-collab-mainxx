import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Home, Sparkles, TrendingUp, Clock, Target, AlertCircle, CheckCircle2, ArrowRight, Zap, Users, Shield, Award } from 'lucide-react';
import { SelectedScenario } from '@/pages/MerckAIHubPage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface MerckResultCollectionProps {
  scenario: SelectedScenario | null;
  onRestart: () => void;
}

export const MerckResultCollection = ({ scenario, onRestart }: MerckResultCollectionProps) => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';
  const navigate = useNavigate();

  if (!scenario) return null;

  // Value demonstration data for each scenario
  const valueData: Record<string, any> = {
    'scenario-a1': {
      icon: Sparkles,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Multiple ERP systems operating independently',
          'Master data chaos across entities',
          'Manual reconciliation taking days each month',
          'Entity-to-entity reconciliation by feel or Excel',
          'Low accuracy and high error rate'
        ] : [
          '多套ERP各自为政，数据分散',
          '主数据混乱，实体信息不一致',
          '对账工作每月耗费数天人力',
          '各entity之间对账凭感觉或Excel',
          '准确率低，错误率高'
        ],
        metrics: [
          { label: isEnglish ? 'Time per Month' : '每月耗时', value: '5-8天', icon: Clock },
          { label: isEnglish ? 'Error Rate' : '错误率', value: '15-25%', icon: AlertCircle },
          { label: isEnglish ? 'Manual Work' : '人工操作', value: '95%', icon: Users }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'Automated master data identification and entity matching',
          'Automated reconciliation with anomaly detection',
          'Real-time variance alerts and recommendations',
          'Cross-entity reconciliation with 95%+ accuracy',
          'End-to-end process visibility and audit trail'
        ] : [
          '系统自动识别主数据并进行实体匹配',
          '对账流程全自动化，异常自动检测',
          '实时差异提示和修正建议',
          '跨实体对账准确率达95%+',
          '全流程可视化，可审计可追溯'
        ],
        metrics: [
          { label: isEnglish ? 'Time per Month' : '每月耗时', value: '2-4小时', icon: Zap },
          { label: isEnglish ? 'Accuracy' : '准确率', value: '95%+', icon: Target },
          { label: isEnglish ? 'Automation' : '自动化率', value: '90%', icon: CheckCircle2 }
        ]
      }
    },
    'scenario-a2': {
      icon: Shield,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Collection based on "gut feeling" and experience',
          'Risk management relies on historical records only',
          'No real-time credit scoring system',
          'Reactive approach - issues found too late',
          'Inconsistent collection strategies'
        ] : [
          '催收工作凭"感觉"和经验判断',
          '风险管理仅依赖历史记录',
          '缺少实时信用评分机制',
          '被动应对，问题发现太晚',
          '催收策略不一致，效果差异大'
        ],
        metrics: [
          { label: isEnglish ? 'DSO (Days)' : 'DSO天数', value: '65-80天', icon: Clock },
          { label: isEnglish ? 'Bad Debt Rate' : '坏账率', value: '3-5%', icon: AlertCircle },
          { label: isEnglish ? 'Collection Efficiency' : '催收效率', value: '40%', icon: TrendingUp }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'AI-driven credit scoring with multi-source data',
          'Real-time risk assessment and early warning',
          'Intelligent collection strategy recommendations',
          'Predictive analytics for payment behavior',
          'Proactive risk prevention and mitigation'
        ] : [
          'AI根据多源数据实时评估客户信用',
          '风险预警前置，及时发现异常',
          '智能推荐个性化催收策略',
          '预测客户付款行为和意愿',
          '主动防范，降低坏账风险'
        ],
        metrics: [
          { label: isEnglish ? 'DSO (Days)' : 'DSO天数', value: '45-55天', icon: Zap },
          { label: isEnglish ? 'Bad Debt Rate' : '坏账率', value: '<1.5%', icon: Target },
          { label: isEnglish ? 'Collection Efficiency' : '催收效率', value: '75%', icon: CheckCircle2 }
        ]
      }
    },
    'scenario-a3': {
      icon: Shield,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Manual verification of business registration',
          'Questionnaire collection and manual scoring',
          'Expert review takes 2-3 weeks',
          'Compliance and ESG checks are fragmented',
          'High cost and inconsistent quality'
        ] : [
          '人工查询工商注册、资质信息',
          '问卷收集、人工打分、专家审核',
          '整个流程耗时2-3周',
          '合规和ESG检查碎片化、不全面',
          '成本高、质量不一致'
        ],
        metrics: [
          { label: isEnglish ? 'Time per Supplier' : '每家供应商', value: '2-3周', icon: Clock },
          { label: isEnglish ? 'Manual Work' : '人工操作', value: '90%', icon: Users },
          { label: isEnglish ? 'Coverage' : '检查覆盖度', value: '60%', icon: AlertCircle }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'One-click automated data collection',
          'AI-powered ESG and risk scoring',
          'Comprehensive compliance verification',
          'Auto-generated due diligence report',
          'Completed within hours instead of weeks'
        ] : [
          '一键自动抓取工商、风险、合规数据',
          'AI自动进行ESG/风险评分',
          '全面的合规性验证检查',
          '自动生成详细尽调报告',
          '几小时内完成全部流程'
        ],
        metrics: [
          { label: isEnglish ? 'Time per Supplier' : '每家供应商', value: '2-4小时', icon: Zap },
          { label: isEnglish ? 'Automation' : '自动化率', value: '85%', icon: CheckCircle2 },
          { label: isEnglish ? 'Coverage' : '检查覆盖度', value: '95%', icon: Target }
        ]
      }
    },
    'scenario-b1': {
      icon: TrendingUp,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Demand forecasts based on regional reports',
          'Frequent production overages or shortages',
          'Inventory buildup or stockouts',
          'S&OP meeting materials manually compiled',
          'Imbalances discovered too late to adjust'
        ] : [
          '需求预测靠各地上报+经验判断',
          '经常出现生产过多或不足',
          '库存积压或断货现象频发',
          'S&OP会议材料靠人工汇总',
          '产销失衡发现太晚，难以调整'
        ],
        metrics: [
          { label: isEnglish ? 'Forecast Accuracy' : '预测准确率', value: '65-75%', icon: AlertCircle },
          { label: isEnglish ? 'Inventory Cost' : '库存成本', value: '基准值', icon: Clock },
          { label: isEnglish ? 'Material Prep' : '材料准备', value: '2-3天', icon: Users }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'AI-unified demand forecasting across regions',
          'Automatic supply-demand imbalance detection',
          'Auto-generated S&OP meeting materials',
          'Recommended adjustment plans with impact analysis',
          'Real-time visibility into production health'
        ] : [
          'AI统一预测全国需求，消除偏差',
          '自动识别产销失衡风险点',
          '自动生成S&OP会议材料',
          '推荐调整方案并模拟影响',
          '实时掌握产销健康状况'
        ],
        metrics: [
          { label: isEnglish ? 'Forecast Accuracy' : '预测准确率', value: '85-90%', icon: Target },
          { label: isEnglish ? 'Inventory Cost' : '库存成本', value: '↓20%', icon: Zap },
          { label: isEnglish ? 'Material Prep' : '材料准备', value: '实时生成', icon: CheckCircle2 }
        ]
      }
    },
    'scenario-b2': {
      icon: Zap,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Equipment maintenance based on experience',
          'Sudden breakdowns cause major production losses',
          'Production line health status opaque',
          'Reactive maintenance approach',
          'High unplanned downtime'
        ] : [
          '设备维护靠经验和定期巡检',
          '突发故障导致停线，损失巨大',
          '产线健康状况不透明',
          '被动维护，缺乏预防机制',
          '计划外停机时间长'
        ],
        metrics: [
          { label: isEnglish ? 'Unplanned Downtime' : '计划外停机', value: '8-12%', icon: AlertCircle },
          { label: isEnglish ? 'Maintenance Cost' : '维护成本', value: '基准值', icon: Clock },
          { label: isEnglish ? 'Failure Prediction' : '故障预测', value: '10%', icon: Users }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'Production line-level health monitoring',
          'AI early warning for equipment anomalies',
          'Recommended preventive maintenance plans',
          'Reduced unplanned downtime',
          'Optimized maintenance scheduling'
        ] : [
          '产线级健康检测，全方位监控',
          'AI预警设备异常和潜在故障',
          '推荐预防性维护计划',
          '大幅减少计划外停机',
          '优化维护排期，降低成本'
        ],
        metrics: [
          { label: isEnglish ? 'Unplanned Downtime' : '计划外停机', value: '2-4%', icon: Target },
          { label: isEnglish ? 'Maintenance Cost' : '维护成本', value: '↓30%', icon: Zap },
          { label: isEnglish ? 'Failure Prediction' : '故障预测', value: '80%', icon: CheckCircle2 }
        ]
      }
    },
    'scenario-c1': {
      icon: Sparkles,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Complex customer needs require internal expert consultation',
          'Response time of 2-3 days',
          'Solutions may not be optimal',
          'Heavy reliance on expert availability',
          'Inconsistent recommendation quality'
        ] : [
          '客户复杂需求需要@各种专家',
          '响应时间需要2-3天',
          '给出的方案不一定最优',
          '严重依赖专家可用性',
          '推荐质量不一致'
        ],
        metrics: [
          { label: isEnglish ? 'Response Time' : '响应时间', value: '2-3天', icon: Clock },
          { label: isEnglish ? 'Expert Dependency' : '专家依赖', value: '高', icon: Users },
          { label: isEnglish ? 'Solution Quality' : '方案质量', value: '70%', icon: AlertCircle }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'Instant recommendations from 300K+ SKU database',
          'Compatibility and scenario-based matching',
          'Product comparison with detailed reasoning',
          'Response in seconds instead of days',
          'Consistent high-quality recommendations'
        ] : [
          '几秒内基于30万+SKU库智能推荐',
          '考虑兼容性和应用场景',
          '提供产品对比和详细理由',
          '从天级降至秒级响应',
          '推荐质量稳定且优化'
        ],
        metrics: [
          { label: isEnglish ? 'Response Time' : '响应时间', value: '<10秒', icon: Zap },
          { label: isEnglish ? 'Automation' : '自动化率', value: '95%', icon: CheckCircle2 },
          { label: isEnglish ? 'Solution Quality' : '方案质量', value: '90%', icon: Target }
        ]
      }
    },
    'scenario-c2': {
      icon: Users,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Agents must search across 3-5 systems',
          'Answers vary widely, inconsistent quality',
          'New hire training takes weeks',
          'Compliance risks from incorrect information',
          'Low customer satisfaction'
        ] : [
          '客服需要在3-5个系统查资料',
          '答案五花八门，质量不一致',
          '新人培训周期长达数周',
          '合规风险高，易出错',
          '客户满意度低'
        ],
        metrics: [
          { label: isEnglish ? 'Avg Handle Time' : '平均处理时长', value: '8-12分钟', icon: Clock },
          { label: isEnglish ? 'First Call Resolution' : '首次解决率', value: '60%', icon: AlertCircle },
          { label: isEnglish ? 'Training Time' : '培训周期', value: '3-4周', icon: Users }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'AI real-time push of standard answers',
          'Related products and historical cases surfaced',
          'Compliance-checked and professional responses',
          'Faster training and onboarding',
          'Improved customer satisfaction'
        ] : [
          'AI实时推送标准答案',
          '关联产品和历史案例',
          '确保合规且专业',
          '新人快速上手',
          '客户满意度大幅提升'
        ],
        metrics: [
          { label: isEnglish ? 'Avg Handle Time' : '平均处理时长', value: '3-5分钟', icon: Zap },
          { label: isEnglish ? 'First Call Resolution' : '首次解决率', value: '85%', icon: Target },
          { label: isEnglish ? 'Training Time' : '培训周期', value: '<1周', icon: CheckCircle2 }
        ]
      }
    },
    'scenario-c3': {
      icon: TrendingUp,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Regional reports are fragmented',
          'Manual competitor and trend analysis',
          'Always a step behind market changes',
          'Miss opportunities due to slow insights',
          'Reactive strategy adjustments'
        ] : [
          '各地市场报告碎片化',
          '竞品、趋势靠人工整理',
          '慢半拍，滞后于市场变化',
          '错过商机和时间窗口',
          '被动调整策略'
        ],
        metrics: [
          { label: isEnglish ? 'Insight Timeliness' : '洞察时效性', value: '滞后1-2周', icon: Clock },
          { label: isEnglish ? 'Coverage' : '覆盖广度', value: '60%', icon: AlertCircle },
          { label: isEnglish ? 'Manual Work' : '人工操作', value: '85%', icon: Users }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'AI auto-scans social media, news, and reports',
          'Identifies trend inflection points and opportunities',
          'Regular automated insight reports',
          'Proactive market intelligence',
          'Faster response to market changes'
        ] : [
          'AI自动扫描社交媒体、新闻、行业报告',
          '识别热度拐点和商机',
          '定期自动输出洞察报告',
          '主动发现市场机会',
          '快速响应市场变化'
        ],
        metrics: [
          { label: isEnglish ? 'Insight Timeliness' : '洞察时效性', value: '实时-1天', icon: Zap },
          { label: isEnglish ? 'Coverage' : '覆盖广度', value: '90%', icon: Target },
          { label: isEnglish ? 'Automation' : '自动化率', value: '80%', icon: CheckCircle2 }
        ]
      }
    },
    'scenario-c4': {
      icon: Target,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Lead scoring based on sales "gut feeling"',
          'Pricing depends on individual experience',
          'Inconsistent pricing across sales team',
          'No impact simulation for pricing decisions',
          'Missed high-value opportunities'
        ] : [
          '线索打分靠销售"感觉"',
          '定价凭个人经验',
          '不同销售给的价格不一致',
          '无法模拟定价影响',
          '错失高价值机会'
        ],
        metrics: [
          { label: isEnglish ? 'Lead Conversion' : '线索转化率', value: '15-20%', icon: AlertCircle },
          { label: isEnglish ? 'Pricing Consistency' : '定价一致性', value: '低', icon: Clock },
          { label: isEnglish ? 'Win Rate' : '赢单率', value: '25%', icon: Users }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'AI auto-scores leads and recommends follow-up',
          'Simulates pricing strategies and impact',
          'Consistent data-driven pricing decisions',
          'Personalized recommendations for each opportunity',
          'Improved win rate and deal value'
        ] : [
          'AI自动给线索打分和推荐跟进策略',
          '模拟定价策略及影响',
          '数据驱动的一致性定价',
          '每个商机个性化建议',
          '提升赢单率和订单价值'
        ],
        metrics: [
          { label: isEnglish ? 'Lead Conversion' : '线索转化率', value: '30-35%', icon: Target },
          { label: isEnglish ? 'Pricing Consistency' : '定价一致性', value: '高', icon: Zap },
          { label: isEnglish ? 'Win Rate' : '赢单率', value: '40%', icon: CheckCircle2 }
        ]
      }
    },
    'scenario-c5': {
      icon: Sparkles,
      before: {
        title: isEnglish ? 'Before AI' : 'AI之前',
        titleColor: 'text-red-400',
        bgGradient: 'from-red-500/10 to-orange-500/10',
        borderColor: 'border-red-500/30',
        challenges: isEnglish ? [
          'Multi-language, multi-channel content takes 2-3 weeks',
          'High cost for manual translation and localization',
          'Compliance review is time-consuming',
          'Different versions hard to manage',
          'Slow time-to-market'
        ] : [
          '多语种、多渠道内容制作耗时2-3周',
          '人工翻译、本地化成本高',
          '合规审核耗时长',
          '多版本管理困难',
          '上市速度慢'
        ],
        metrics: [
          { label: isEnglish ? 'Production Time' : '制作周期', value: '2-3周', icon: Clock },
          { label: isEnglish ? 'Cost per Asset' : '单个成本', value: '基准值', icon: AlertCircle },
          { label: isEnglish ? 'Language Coverage' : '语言覆盖', value: '3-5种', icon: Users }
        ]
      },
      after: {
        title: isEnglish ? 'After AI' : 'AI之后',
        titleColor: 'text-green-400',
        bgGradient: 'from-primary/10 to-tech-green/10',
        borderColor: 'border-primary/30',
        improvements: isEnglish ? [
          'AI generates multi-language content in minutes',
          'Auto-translation with localization',
          'Built-in compliance checking',
          'Adapts content for different channels',
          'Dramatically faster time-to-market'
        ] : [
          'AI几分钟生成多语种内容',
          '自动翻译和本地化',
          '自动合规检查',
          '适配不同渠道格式',
          '大幅缩短上市时间'
        ],
        metrics: [
          { label: isEnglish ? 'Production Time' : '制作周期', value: '数分钟', icon: Zap },
          { label: isEnglish ? 'Cost per Asset' : '单个成本', value: '↓70%', icon: Target },
          { label: isEnglish ? 'Language Coverage' : '语言覆盖', value: '15+种', icon: CheckCircle2 }
        ]
      }
    }
  };

  const data = valueData[scenario.id] || valueData['scenario-a1'];
  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary via-tech-green to-primary shadow-[0_0_40px_hsl(200_100%_45%/0.4)] animate-pulse-glow">
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-tech-green to-primary bg-clip-text text-transparent">
            {isEnglish ? 'AI Value Demonstration' : 'AI价值展示'}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {isEnglish ? scenario.titleEn : scenario.title}
          </p>
        </div>

        {/* Before vs After Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Before AI Card */}
          <Card className={`p-8 bg-gradient-to-br ${data.before.bgGradient} backdrop-blur-sm border-2 ${data.before.borderColor}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className={`text-2xl font-bold ${data.before.titleColor}`}>
                {data.before.title}
              </h2>
            </div>

            {/* Challenges */}
            <div className="space-y-3 mb-8">
              {data.before.challenges.map((challenge: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{challenge}</p>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="space-y-3 pt-6 border-t border-red-500/20">
              {data.before.metrics.map((metric: any, idx: number) => {
                const MetricIcon = metric.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MetricIcon className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{metric.value}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* After AI Card */}
          <Card className={`p-8 bg-gradient-to-br ${data.after.bgGradient} backdrop-blur-sm border-2 ${data.after.borderColor} hover:shadow-[0_0_30px_hsl(200_100%_45%/0.3)] transition-all`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <h2 className={`text-2xl font-bold ${data.after.titleColor}`}>
                {data.after.title}
              </h2>
            </div>

            {/* Improvements */}
            <div className="space-y-3 mb-8">
              {data.after.improvements.map((improvement: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{improvement}</p>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="space-y-3 pt-6 border-t border-primary/20">
              {data.after.metrics.map((metric: any, idx: number) => {
                const MetricIcon = metric.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2">
                      <MetricIcon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-400">{metric.value}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Key Value Summary */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-primary/5 to-tech-green/5 border-primary/30">
          <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            {isEnglish ? 'Key Value Delivered' : '核心价值交付'}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-lg border border-primary/10">
              <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary to-tech-green flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {isEnglish ? 'Efficiency Gain' : '效率提升'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? 'Automated workflows reduce manual work by 70-90%'
                  : '自动化工作流减少70-90%人工操作'}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-lg border border-tech-green/10">
              <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-tech-green to-primary flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {isEnglish ? 'Accuracy Improvement' : '准确度提升'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? 'AI-driven decisions improve accuracy to 85-95%'
                  : 'AI驱动决策将准确率提升至85-95%'}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-lg border border-accent/10">
              <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-accent to-tech-green flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {isEnglish ? 'Business Impact' : '业务影响'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? 'Reduced costs, faster time-to-market, better outcomes'
                  : '降低成本、缩短周期、提升业务成果'}
              </p>
            </div>
          </div>
        </Card>

        {/* Orchestration Highlight */}
        <Card className="p-6 mb-12 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {isEnglish ? 'Multi-Capability Orchestration' : '多能力协同编排'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEnglish
                  ? `${scenario.requiredCapabilities.length} AI capabilities worked seamlessly together through ${scenario.workflow.length} orchestrated steps to deliver end-to-end automation`
                  : `${scenario.requiredCapabilities.length}个AI能力通过${scenario.workflow.length}步协同编排，实现端到端自动化交付`}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button
            onClick={onRestart}
            size="lg"
            className="group bg-gradient-to-r from-primary to-tech-green hover:shadow-[0_0_30px_hsl(200_100%_45%/0.5)] transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            {isEnglish ? 'Try Another Scenario' : '尝试其他场景'}
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/10"
          >
            <Home className="w-5 h-5 mr-2" />
            {isEnglish ? 'Back to Home' : '返回首页'}
          </Button>
        </div>
      </div>
    </div>
  );
};

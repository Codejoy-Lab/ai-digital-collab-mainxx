import { Button } from '@/components/ui/button';
import { SelectedScenario } from '@/pages/CapabilityHubPage';
import { TrendingUp, Clock, Shield, CheckCircle, ArrowRight, FileText, BarChart, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResultDisplayProps {
  scenario: SelectedScenario | null;
  onContinue: () => void;
}

export const CapabilityResultDisplay = ({ scenario, onContinue }: ResultDisplayProps) => {
  const { language, t } = useLanguage();
  // Handle null scenario gracefully
  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Processing Results...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we generate your results.
          </p>
        </div>
      </div>
    );
  }

  const getResultContent = () => {
    // 根据不同的场景返回不同的内容
    const contentMap: Record<string, any> = {
      'scenario-01': {
        title: '合同智能审查报告',
        titleEn: 'Intelligent Contract Review Report',
        summary: '智能合规系统完成了跨部门协同自动化审查，通过多源数据集成发现了3项高风险条款和2项中风险条款。系统自动调用企业信用库、法律法规库、历史案例库进行深度验证，综合风险评分62/100（中等风险），已生成详细的风险分析报告和改进建议。',
        summaryEn: 'Intelligent compliance system completed automated cross-department review through multi-source data integration, identified 3 high-risk and 2 medium-risk clauses. System verified via enterprise credit, legal regulation, and historical case databases. Comprehensive risk score: 62/100 (Medium Risk). Detailed risk analysis report and improvement recommendations generated.',
        metrics: {
          pages: 15,
          charts: 6,
          insights: 10,
          recommendations: 8
        },
        tags: ['自动审查', '风险识别', '合规验证', '多源集成', '改进建议', '法律分析'],
        tagsEn: ['Auto Review', 'Risk Identification', 'Compliance Check', 'Multi-source Integration', 'Improvement Suggestions', 'Legal Analysis'],
        roi: {
          time: { value: '-92%', desc: '审查时间 5天 → 10分钟', descEn: 'Review time: 5 days → 10 minutes' },
          efficiency: { value: '+90%', desc: '风险识别准确率', descEn: 'Risk identification accuracy' },
          risk: { value: '+95%', desc: '条款检测覆盖率', descEn: 'Clause detection coverage' }
        }
      },
      'scenario-02': {
        title: '合作伙伴背调报告',
        titleEn: 'Partner Background Check Report',
        summary: '背景调查系统自动完成了全方位尽职调查，包括企业资质验证、财务健康度分析、诉讼记录详查、供应链稳定性评估。该企业综合评分78/100（B+级），虽存在2起历史诉讼但已和解，财务状况趋于稳定，建议可以合作并设置季度监控机制。',
        summaryEn: 'Background check system completed comprehensive due diligence including qualification verification, financial health analysis, litigation review, and supply chain stability assessment. Overall rating: 78/100 (B+ grade). Despite 2 historical lawsuits (resolved), financial condition is stabilizing. Recommend cooperation with quarterly monitoring mechanism.',
        metrics: {
          pages: 18,
          charts: 10,
          insights: 12,
          recommendations: 8
        },
        tags: ['自动背调', '资质验证', '财务分析', '诉讼详查', '信用评级', '监控方案'],
        tagsEn: ['Auto Background Check', 'Qualification Verification', 'Financial Analysis', 'Litigation Review', 'Credit Rating', 'Monitoring Plan'],
        roi: {
          time: { value: '-95%', desc: '调查时间 10天 → 15分钟', descEn: 'Investigation time: 10 days → 15 minutes' },
          efficiency: { value: '+88%', desc: '信息覆盖完整度', descEn: 'Information coverage completeness' },
          risk: { value: '+92%', desc: '风险识别准确率', descEn: 'Risk identification accuracy' }
        }
      },
      'scenario-03': {
        title: '设备智能预警报告',
        titleEn: 'Equipment Intelligent Alert Report',
        summary: '设备监控系统通过AI异常检测发现3号注塑机存在故障征兆，预测48小时内故障概率85%，剩余寿命约120小时，已生成紧急维护工单。',
        summaryEn: 'Equipment monitoring system detected fault indicators in Injection Machine #3 via AI anomaly detection. Predicted failure probability: 85% within 48 hours. Remaining useful life: ~120 hours. Emergency maintenance work order generated.',
        metrics: {
          pages: 8,
          charts: 12,
          insights: 6,
          recommendations: 4
        },
        tags: ['异常检测', '故障预测', 'RUL评估', '传感器数据', '维护工单', '预警通知'],
        tagsEn: ['Anomaly Detection', 'Fault Prediction', 'RUL Assessment', 'Sensor Data', 'Work Order', 'Alert Notification'],
        roi: {
          time: { value: '-96%', desc: '检测时间 实时监控', descEn: 'Detection time: Real-time monitoring' },
          efficiency: { value: '+92%', desc: '故障预测准确率', descEn: 'Fault prediction accuracy' },
          risk: { value: '-85%', desc: '停机损失降低', descEn: 'Downtime loss reduction' }
        }
      },
      'scenario-04': (() => {
        // 根据决策历史返回不同的结果
        const decision = scenario?.decisionHistory?.[0];
        const decisionPath = decision?.optionId || 'default';

        if (decisionPath === 'option-approve') {
          // 审核通过：执行AI方案
          return {
            title: '客户投诉AI方案执行报告',
            titleEn: 'AI Solution Execution Report',
            summary: '您审核通过了AI生成的处理方案。系统按照建议执行：全额退款¥12,800 + VIP补偿礼包（3000积分+¥500券+3月VIP）+ 专属客户经理张经理跟进 + 3天后回访。客户满意度从35%提升至92%，流失风险从85%降至15%，成功挽回高价值客户。AI方案执行效果优异！',
            summaryEn: 'You approved the AI-generated solution. System executed: Full refund ¥12,800 + VIP compensation package (3000 points + ¥500 voucher + 3-month VIP) + Dedicated manager follow-up + 3-day callback. Customer satisfaction increased from 35% to 92%, churn risk reduced from 85% to 15%. Successfully retained high-value customer. Excellent AI solution execution!',
            metrics: {
              pages: 14,
              charts: 8,
              insights: 10,
              recommendations: 6
            },
            tags: ['AI方案', '方案审核', 'VIP挽回', '补偿礼包', '满意度提升', '客户挽回'],
            tagsEn: ['AI Solution', 'Plan Review', 'VIP Retention', 'Compensation Package', 'Satisfaction Boost', 'Customer Recovery'],
            roi: {
              time: { value: '-95%', desc: '处理时间 2天 → 2小时', descEn: 'Processing time: 2 days → 2 hours' },
              efficiency: { value: '+160%', desc: '客户满意度提升', descEn: 'Customer satisfaction improvement' },
              risk: { value: '-82%', desc: '客户流失率降低', descEn: 'Customer churn rate reduction' }
            },
            decisionOutcome: {
              label: '✅ 方案通过',
              labelEn: '✅ Plan Approved',
              color: 'green',
              result: 'AI方案执行完美！退款¥12,800 + 补偿礼包成功挽回客户。满意度92%，客户承诺继续合作，避免12万元LTV流失。',
              resultEn: 'AI plan executed perfectly! Refund ¥12,800 + compensation package successfully retained customer. Satisfaction 92%, customer committed to continue cooperation, avoided ¥120K LTV loss.'
            }
          };
        } else if (decisionPath === 'option-modify') {
          // 人工修改：优化后执行
          return {
            title: '客户投诉优化方案执行报告',
            titleEn: 'Optimized Solution Execution Report',
            summary: '您对AI方案进行了人工优化。修改内容：调整补偿金额、优化客服话术、增加定制化服务。优化后方案执行：全额退款¥12,800 + 定制补偿礼包 + 优化话术沟通 + 专属经理跟进。客户满意度提升至88%，流失风险降至20%，成功挽回客户并体现人工关怀。',
            summaryEn: 'You optimized the AI solution with manual adjustments: compensation amount tuning, service script optimization, customized services added. Executed plan: Full refund ¥12,800 + Customized compensation package + Optimized communication scripts + Dedicated manager follow-up. Customer satisfaction increased to 88%, churn risk reduced to 20%. Successfully retained customer with personal touch.',
            metrics: {
              pages: 15,
              charts: 9,
              insights: 11,
              recommendations: 7
            },
            tags: ['人工优化', '定制方案', '话术优化', '灵活调整', '满意度恢复', '人工智慧'],
            tagsEn: ['Manual Optimization', 'Customized Plan', 'Script Optimization', 'Flexible Adjustment', 'Satisfaction Recovery', 'Human Intelligence'],
            roi: {
              time: { value: '-90%', desc: '处理时间 2天 → 3小时', descEn: 'Processing time: 2 days → 3 hours' },
              efficiency: { value: '+150%', desc: '客户满意度提升', descEn: 'Customer satisfaction improvement' },
              risk: { value: '-76%', desc: '客户流失率降低', descEn: 'Customer churn rate reduction' }
            },
            decisionOutcome: {
              label: '✏️ 方案优化',
              labelEn: '✏️ Plan Optimized',
              color: 'yellow',
              result: '人工优化方案执行成功！定制化服务+优化话术体现人文关怀。满意度88%，客户认可人工调整的细节，关系更稳固。',
              resultEn: 'Optimized plan executed successfully! Customized service + optimized scripts demonstrate human care. Satisfaction 88%, customer appreciated manual adjustments, relationship more stable.'
            }
          };
        } else {
          // 默认：AI分析完成
          return {
            title: '客户投诉AI分析与方案',
            titleEn: 'AI Analysis and Solution',
            summary: 'AI系统完成投诉分析：产品质量问题（严重度高）、VIP客户（价值¥12万）、流失风险85%。AI建议方案：全额退款+VIP补偿礼包+专属经理+回访计划。系统已生成详细话术和执行步骤，等待人工审核确认。',
            summaryEn: 'AI system completed complaint analysis: Product quality issue (High severity), VIP customer (Value ¥120K), Churn risk 85%. AI recommended solution: Full refund + VIP compensation package + Dedicated manager + Follow-up plan. System generated detailed scripts and execution steps, awaiting manual review and confirmation.',
            metrics: {
              pages: 12,
              charts: 7,
              insights: 9,
              recommendations: 5
            },
            tags: ['AI分析', '投诉分类', '方案生成', '话术准备', '等待审核', '智能建议'],
            tagsEn: ['AI Analysis', 'Complaint Classification', 'Solution Generation', 'Script Preparation', 'Pending Review', 'Intelligent Recommendations'],
            roi: {
              time: { value: '-92%', desc: '分析时间 1天 → 6分钟', descEn: 'Analysis time: 1 day → 6 minutes' },
              efficiency: { value: '+85%', desc: '方案准确度', descEn: 'Solution accuracy' },
              risk: { value: '-70%', desc: '预期流失降低', descEn: 'Expected churn reduction' }
            }
          };
        }
      })(),
      'scenario-05': {
        title: '营销内容合规审核报告',
        titleEn: 'Marketing Content Compliance Report',
        summary: '合规审核系统完成了营销内容全面检测，发现2处广告法违规（夸大宣传）、1处隐私风险（未经授权使用数据），已生成合规修改建议和风险等级评估。',
        summaryEn: 'Compliance audit system completed comprehensive marketing content review. Detected 2 advertising law violations (exaggerated claims) and 1 privacy risk (unauthorized data usage). Compliance modification suggestions and risk level assessment generated.',
        metrics: {
          pages: 9,
          charts: 4,
          insights: 7,
          recommendations: 6
        },
        tags: ['违禁词检测', '广告法审查', '隐私检测', '品牌调性', '修改建议', '合规报告'],
        tagsEn: ['Prohibited Words Detection', 'Advertising Law Review', 'Privacy Check', 'Brand Tone', 'Modification Suggestions', 'Compliance Report'],
        roi: {
          time: { value: '-93%', desc: '审核时间 1天 → 5分钟', descEn: 'Review time: 1 day → 5 minutes' },
          efficiency: { value: '+86%', desc: '违规识别准确率', descEn: 'Violation detection accuracy' },
          risk: { value: '-91%', desc: '合规风险降低', descEn: 'Compliance risk reduction' }
        }
      },
      'scenario-06': {
        title: '财务异常检测报告',
        titleEn: 'Financial Anomaly Detection Report',
        summary: '异常检测引擎发现12笔可疑交易，包括2笔异常金额、5笔频繁小额支付、3笔重复支付，总金额¥285万，风险等级：高，建议立即启动审计流程。',
        summaryEn: 'Anomaly detection engine identified 12 suspicious transactions: 2 abnormal amounts, 5 frequent small payments, 3 duplicate payments. Total amount: ¥2.85M. Risk level: High. Recommend immediate audit process initiation.',
        metrics: {
          pages: 14,
          charts: 10,
          insights: 12,
          recommendations: 8
        },
        tags: ['异常交易', '模式识别', '会计合规', '审计线索', '风险评估', '检测报告'],
        tagsEn: ['Anomaly Transactions', 'Pattern Recognition', 'Accounting Compliance', 'Audit Clues', 'Risk Assessment', 'Detection Report'],
        roi: {
          time: { value: '-97%', desc: '检测时间 实时监控', descEn: 'Detection time: Real-time monitoring' },
          efficiency: { value: '+94%', desc: '异常识别准确率', descEn: 'Anomaly detection accuracy' },
          risk: { value: '-88%', desc: '财务损失风险降低', descEn: 'Financial loss risk reduction' }
        }
      }
    };

    const defaultContent = {
      title: `${scenario.title}完成报告`,
      titleEn: `${scenario.titleEn} Report`,
      summary: '基于 AI 智能协同平台，我们为您生成了高质量的分析报告，包含深度洞察和实用建议。',
      summaryEn: 'Based on AI intelligent collaboration platform, we have generated a high-quality analysis report with deep insights and practical recommendations.',
      metrics: {
        pages: 20,
        charts: 10,
        insights: 15,
        recommendations: 8
      },
      tags: ['执行摘要', '数据分析', '可视化图表', '关键洞察', '行动建议', '风险评估'],
      tagsEn: ['Executive Summary', 'Data Analysis', 'Visualization Charts', 'Key Insights', 'Action Recommendations', 'Risk Assessment'],
      roi: {
        time: { value: '-90%', desc: '人工 3 天 → AI 协作 15 分钟', descEn: 'Manual 3 days → AI collaboration 15 minutes' },
        efficiency: { value: '+70%', desc: '多维度分析与智能洞察', descEn: 'Multi-dimensional analysis & intelligent insights' },
        risk: { value: '+40%', desc: 'AI 智能风险预警与建议', descEn: 'AI intelligent risk alerts & recommendations' }
      }
    };

    return contentMap[scenario.id] || defaultContent;
  };

  const result = getResultContent();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left: Result Preview */}
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center fade-in-up">
            <div className="inline-flex items-center px-6 py-3 bg-accent/10 rounded-full border border-accent/20 mb-6">
              <CheckCircle className="w-5 h-5 text-accent mr-2" />
              <span className="text-accent font-medium">
                {t('capability.result.taskCompleted')}
              </span>
            </div>

            <div className="mb-4" />
          </div>

          {/* Result Card */}
          <div className="card-gradient border border-border/50 rounded-2xl p-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {language === 'zh' ? result.title : result.titleEn}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {language === 'zh' ? result.summary : result.summaryEn}
                </p>
              </div>
            </div>

            {/* Task-specific Results Display */}
            {/* Scenario 01: Contract Review Results */}
            {scenario.id === 'scenario-01' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {t('capability.result.contractRiskDetails')}
                </h3>

                {/* High Risk */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-semibold">{language === 'zh' ? '高风险条款 (3项)' : 'High Risk Clauses (3)'}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-base text-red-400 font-medium">{language === 'zh' ? '1. 违约金条款不对等' : '1. Unequal Penalty Clause'}</div>
                      <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                        <span className="text-yellow-400">{language === 'zh' ? '原文:' : 'Original:'}</span> {language === 'zh' ? '乙方违约金50% vs 甲方以实际损失为限' : 'Party B penalty 50% vs Party A limited to actual loss'}
                      </div>
                      <div className="bg-green-500/10 rounded p-3 text-sm text-green-400">
                        <span className="font-medium">{language === 'zh' ? '建议:' : 'Suggestion:'}</span> {language === 'zh' ? '双方违约金统一为合同总额20%，最高不超过实际损失1.5倍' : 'Both parties penalty 20% of contract amount, max 1.5x actual loss'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-base text-red-400 font-medium">{language === 'zh' ? '2. 知识产权归属冲突' : '2. IP Rights Ownership Conflict'}</div>
                      <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                        <span className="text-yellow-400">{language === 'zh' ? '原文:' : 'Original:'}</span> {language === 'zh' ? '所有知识产权归甲方，未保留乙方原有技术权益' : 'All IP rights to Party A, no preservation of Party B\'s existing tech rights'}
                      </div>
                      <div className="bg-green-500/10 rounded p-3 text-sm text-green-400">
                        <span className="font-medium">{language === 'zh' ? '建议:' : 'Suggestion:'}</span> {language === 'zh' ? '交付成果归甲方，乙方保留原有技术和通用组件知识产权' : 'Deliverables to Party A, Party B retains original tech and general components IP'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-base text-red-400 font-medium">{language === 'zh' ? '3. 付款账期异常延长' : '3. Abnormally Extended Payment Terms'}</div>
                      <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                        <span className="text-yellow-400">{language === 'zh' ? '原文:' : 'Original:'}</span> {language === 'zh' ? '验收后180天付款 vs 行业标准45天' : 'Payment 180 days post-acceptance vs industry standard 45 days'}
                      </div>
                      <div className="bg-green-500/10 rounded p-3 text-sm text-green-400">
                        <span className="font-medium">{language === 'zh' ? '建议:' : 'Suggestion:'}</span> {language === 'zh' ? '签订后付30%，中期付30%，验收后30天内付余款40%' : '30% upon signing, 30% mid-term, 40% balance within 30 days post-acceptance'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medium Risk */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-400 font-semibold">{language === 'zh' ? '中风险条款 (2项)' : 'Medium Risk Clauses (2)'}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm text-yellow-400 font-medium">{language === 'zh' ? '1. 验收标准模糊' : '1. Vague Acceptance Criteria'}</div>
                      <div className="bg-black/20 rounded p-2 text-sm text-muted-foreground">
                        <span className="text-yellow-400">{language === 'zh' ? '原文:' : 'Original:'}</span> {language === 'zh' ? '以甲方验收为准，标准由甲方最终决定' : 'Party A\'s acceptance as standard, criteria decided by Party A'}
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-sm text-green-400">
                        <span className="font-medium">{language === 'zh' ? '建议:' : 'Suggestion:'}</span> {language === 'zh' ? '明确技术规格清单，验收期限15工作日，逾期视为通过' : 'Clear technical specs, 15-day acceptance period, deemed accepted if overdue'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-yellow-400 font-medium">{language === 'zh' ? '2. 保密期限不合理' : '2. Unreasonable Confidentiality Period'}</div>
                      <div className="bg-black/20 rounded p-2 text-sm text-muted-foreground">
                        <span className="text-yellow-400">{language === 'zh' ? '原文:' : 'Original:'}</span> {language === 'zh' ? '乙方永久保密，无时间限制' : 'Party B permanent confidentiality, no time limit'}
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-sm text-green-400">
                        <span className="font-medium">{language === 'zh' ? '建议:' : 'Suggestion:'}</span> {language === 'zh' ? '保密期限调整为合同终止后5年，行业标准范围' : 'Confidentiality period: 5 years post-termination, industry standard'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Low Risk */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 font-semibold">{language === 'zh' ? '低风险条款 (8项)' : 'Low Risk Clauses (8)'}</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1 ml-4">
                    <div>• {language === 'zh' ? '合同主体资质完备，信用状况良好' : 'Contract parties qualified, good credit status'}</div>
                    <div>• {language === 'zh' ? '交付时间安排合理，有充足缓冲期' : 'Reasonable delivery schedule with buffer time'}</div>
                    <div>• {language === 'zh' ? '售后服务条款标准合理' : 'After-sales service terms reasonable'}</div>
                    <div>• {language === 'zh' ? '不可抗力条款符合法律规定' : 'Force majeure clause compliant with law'}</div>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <div className="text-base font-semibold text-primary mb-2">{language === 'zh' ? '综合风险评分与建议' : 'Overall Risk Score & Recommendations'}</div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">62/100</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• {language === 'zh' ? '风险等级:' : 'Risk Level:'} <span className="text-yellow-400 font-semibold">{language === 'zh' ? '中等风险' : 'Medium Risk'}</span></div>
                    <div>• {language === 'zh' ? '建议: 重点协商修改3项高风险条款' : 'Suggestion: Focus on negotiating 3 high-risk clauses'}</div>
                    <div>• {language === 'zh' ? '优先级: 违约金条款 > 知识产权 > 付款条件' : 'Priority: Penalty Clause > IP Rights > Payment Terms'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 02: Partner Background Check Results */}
            {scenario.id === 'scenario-02' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {t('capability.result.backgroundCheckDetails')}
                </h3>

                {/* 综合评分 */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base text-muted-foreground mb-1">{language === 'zh' ? '企业综合评分' : 'Overall Company Score'}</div>
                      <div className="text-4xl font-bold text-blue-400">78/100</div>
                      <div className="text-sm text-blue-400 mt-1">{language === 'zh' ? 'B+ 级 (中等风险)' : 'B+ Grade (Medium Risk)'}</div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground space-y-1">
                      <div>{language === 'zh' ? '资质: 90分 ✓' : 'Qualification: 90 ✓'}</div>
                      <div>{language === 'zh' ? '财务: 75分 ⚠️' : 'Financial: 75 ⚠️'}</div>
                      <div>{language === 'zh' ? '信用: 72分 ⚠️' : 'Credit: 72 ⚠️'}</div>
                      <div>{language === 'zh' ? '舆情: 68分 ⚠️' : 'Sentiment: 68 ⚠️'}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 资质验证 */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '✅ 资质验证 (优秀)' : '✅ Qualification Verification (Excellent)'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• {language === 'zh' ? '营业执照:' : 'Business License:'} <span className="text-green-400">{language === 'zh' ? '有效' : 'Valid'}</span></div>
                      <div>• {language === 'zh' ? '经营年限: 8年' : 'Operating Years: 8'}</div>
                      <div>• {language === 'zh' ? '注册资本: ¥5000万' : 'Registered Capital: ¥50M'}</div>
                      <div>• {language === 'zh' ? '资质认证: ISO9001, ISO14001' : 'Certifications: ISO9001, ISO14001'}</div>
                      <div>• {language === 'zh' ? '行业资质: 齐全' : 'Industry Qualifications: Complete'}</div>
                    </div>
                  </div>

                  {/* 财务状况 */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '⚠️ 财务状况 (中等)' : '⚠️ Financial Status (Medium)'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• {language === 'zh' ? '年营收: ¥2.3亿 (同比+12%)' : 'Annual Revenue: ¥230M (YoY +12%)'}</div>
                      <div>• {language === 'zh' ? '资产负债率:' : 'Debt-to-Asset Ratio:'} <span className="text-yellow-400">58%</span> {language === 'zh' ? '(偏高)' : '(High)'}</div>
                      <div>• {language === 'zh' ? '现金流: 健康 (充足)' : 'Cash Flow: Healthy (Sufficient)'}</div>
                      <div>• {language === 'zh' ? '净利润率: 8.5%' : 'Net Profit Margin: 8.5%'}</div>
                      <div>• {language === 'zh' ? '信用评级: B+' : 'Credit Rating: B+'}</div>
                    </div>
                  </div>

                  {/* 诉讼记录 */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '📜 诉讼记录 (需关注)' : '📜 Litigation Records (Attention Required)'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• {language === 'zh' ? '历史诉讼:' : 'Historical Litigation:'} <span className="text-orange-400">{language === 'zh' ? '3起' : '3 Cases'}</span></div>
                      <div className="ml-4">- {language === 'zh' ? '合同纠纷 (已结案)' : 'Contract Dispute (Closed)'}</div>
                      <div className="ml-4">- {language === 'zh' ? '账款纠纷 (已结案)' : 'Payment Dispute (Closed)'}</div>
                      <div className="ml-4">- {language === 'zh' ? '劳动争议 (在审)' : 'Labor Dispute (Pending)'}</div>
                      <div>• {language === 'zh' ? '行政处罚: 2次 (安全生产)' : 'Admin Penalties: 2 (Safety Production)'}</div>
                      <div>• {language === 'zh' ? '失信记录: 无' : 'Dishonesty Records: None'}</div>
                    </div>
                  </div>

                  {/* 舆情分析 */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '📰 舆情分析 (需警惕)' : '📰 Public Sentiment (Caution Advised)'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• {language === 'zh' ? '负面新闻:' : 'Negative News:'} <span className="text-red-400">{language === 'zh' ? '5条' : '5 Articles'}</span> {language === 'zh' ? '(近3个月)' : '(Last 3 Months)'}</div>
                      <div className="ml-4">- {language === 'zh' ? '员工投诉欠薪 (2条)' : 'Employee Wage Complaints (2)'}</div>
                      <div className="ml-4">- {language === 'zh' ? '产品质量问题 (2条)' : 'Product Quality Issues (2)'}</div>
                      <div className="ml-4">- {language === 'zh' ? '安全事故 (1条)' : 'Safety Incidents (1)'}</div>
                      <div>• {language === 'zh' ? '舆情指数: 68分 (偏负面)' : 'Sentiment Index: 68 (Negative Leaning)'}</div>
                    </div>
                  </div>
                </div>

                {/* 合作建议 */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="text-base font-semibold text-primary mb-2">{language === 'zh' ? '🎯 合作建议与风险控制' : '🎯 Cooperation Recommendations & Risk Control'}</div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="bg-blue-500/10 rounded p-2">
                      <span className="text-blue-400 font-semibold">{language === 'zh' ? 'AI建议:' : 'AI Recommendation:'}</span> {language === 'zh' ? '可以合作，企业综合评分B+级，历史问题已解决，建议加强风险控制和定期监控' : 'Cooperation feasible. Company rated B+, historical issues resolved. Recommend enhanced risk control and regular monitoring'}
                    </div>
                    <div className="space-y-1 ml-2">
                      <div>• {language === 'zh' ? '合同条款: 加强违约责任和付款保障条款' : 'Contract Terms: Strengthen breach liability and payment guarantee clauses'}</div>
                      <div>• {language === 'zh' ? '付款方式: 建议分期付款，首付不超过30%' : 'Payment Method: Installment payment recommended, down payment max 30%'}</div>
                      <div>• {language === 'zh' ? '履约保证: 要求提供履约保证金或银行保函' : 'Performance Guarantee: Require deposit or bank guarantee'}</div>
                      <div>• {language === 'zh' ? '持续监控: 设置季度财务审查和舆情监控机制' : 'Ongoing Monitoring: Set up quarterly financial review and sentiment monitoring'}</div>
                      <div>• {language === 'zh' ? '预警机制: 建立异常情况自动预警通知' : 'Alert System: Establish automatic anomaly alert notifications'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 03: Equipment Alert Results */}
            {scenario.id === 'scenario-03' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {t('capability.result.equipmentAlertDetails')}
                </h3>

                {/* Real-time Data Charts */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">{language === 'zh' ? '实时监控数据趋势' : 'Real-time Monitoring Data Trends'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* 温度趋势图 */}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>{language === 'zh' ? '温度 (°C)' : 'Temperature (°C)'}</span>
                        <span className="text-red-400 font-semibold">{language === 'zh' ? '↑ +12°C 异常' : '↑ +12°C Abnormal'}</span>
                      </div>
                      <div className="h-24 bg-black/20 rounded relative overflow-hidden">
                        <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                          {/* 基准线 */}
                          <line x1="0" y1="60" x2="200" y2="60" stroke="rgb(75, 85, 99)" strokeWidth="1" strokeDasharray="3,3" />
                          {/* 温度曲线 - 上升趋势 */}
                          <polyline
                            points="0,65 20,63 40,61 60,58 80,52 100,48 120,42 140,38 160,35 180,28 200,22"
                            fill="none"
                            stroke="rgb(239, 68, 68)"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        </svg>
                        <div className="absolute bottom-1 right-2 text-sm text-red-400">88°C</div>
                        <div className="absolute bottom-1 left-2 text-sm text-muted-foreground">{language === 'zh' ? '基线:76°C' : 'Baseline:76°C'}</div>
                      </div>
                    </div>

                    {/* 振动趋势图 */}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>{language === 'zh' ? '振动频率 (Hz)' : 'Vibration Frequency (Hz)'}</span>
                        <span className="text-red-400 font-semibold">{language === 'zh' ? '↑ +38% 异常' : '↑ +38% Abnormal'}</span>
                      </div>
                      <div className="h-24 bg-black/20 rounded relative overflow-hidden">
                        <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                          <line x1="0" y1="70" x2="200" y2="70" stroke="rgb(75, 85, 99)" strokeWidth="1" strokeDasharray="3,3" />
                          {/* 振动曲线 - 波动增大 */}
                          <polyline
                            points="0,72 20,68 40,75 60,65 80,78 100,58 120,82 140,52 160,85 180,48 200,88"
                            fill="none"
                            stroke="rgb(251, 146, 60)"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        </svg>
                        <div className="absolute bottom-1 right-2 text-sm text-orange-400">5.8Hz</div>
                        <div className="absolute bottom-1 left-2 text-sm text-muted-foreground">{language === 'zh' ? '基线:4.2Hz' : 'Baseline:4.2Hz'}</div>
                      </div>
                    </div>

                    {/* 噪音趋势图 */}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>{language === 'zh' ? '噪音 (dB)' : 'Noise (dB)'}</span>
                        <span className="text-yellow-400 font-semibold">{language === 'zh' ? '↑ +15dB 异常' : '↑ +15dB Abnormal'}</span>
                      </div>
                      <div className="h-24 bg-black/20 rounded relative overflow-hidden">
                        <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                          <line x1="0" y1="65" x2="200" y2="65" stroke="rgb(75, 85, 99)" strokeWidth="1" strokeDasharray="3,3" />
                          <polyline
                            points="0,68 20,67 40,64 60,61 80,58 100,54 120,48 140,44 160,38 180,34 200,28"
                            fill="none"
                            stroke="rgb(234, 179, 8)"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        </svg>
                        <div className="absolute bottom-1 right-2 text-sm text-yellow-400">85dB</div>
                        <div className="absolute bottom-1 left-2 text-sm text-muted-foreground">{language === 'zh' ? '基线:70dB' : 'Baseline:70dB'}</div>
                      </div>
                    </div>

                    {/* 能耗趋势图 */}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>{language === 'zh' ? '功率 (kW)' : 'Power (kW)'}</span>
                        <span className="text-yellow-400 font-semibold">{language === 'zh' ? '↑ +25% 波动' : '↑ +25% Fluctuation'}</span>
                      </div>
                      <div className="h-24 bg-black/20 rounded relative overflow-hidden">
                        <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                          <line x1="0" y1="60" x2="200" y2="60" stroke="rgb(75, 85, 99)" strokeWidth="1" strokeDasharray="3,3" />
                          <polyline
                            points="0,62 20,58 40,65 60,55 80,68 100,52 120,70 140,48 160,72 180,45 200,75"
                            fill="none"
                            stroke="rgb(59, 130, 246)"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        </svg>
                        <div className="absolute bottom-1 right-2 text-sm text-blue-400">15.6kW</div>
                        <div className="absolute bottom-1 left-2 text-sm text-muted-foreground">{language === 'zh' ? '基线:12.5kW' : 'Baseline:12.5kW'}</div>
                      </div>
                    </div>
                  </div>

                  {/* 趋势说明 */}
                  <div className="mt-3 text-sm text-muted-foreground bg-black/20 rounded p-2">
                    <div className="font-semibold text-yellow-400 mb-1">{language === 'zh' ? '⚠️ 异常趋势分析:' : '⚠️ Anomaly Trend Analysis:'}</div>
                    <div className="space-y-1">
                      <div>• <span className="text-red-400">{language === 'zh' ? '温度持续升高' : 'Temperature Rising'}</span> - {language === 'zh' ? '从76°C升至88°C，表明轴承摩擦加剧' : '76°C to 88°C, indicating increased bearing friction'}</div>
                      <div>• <span className="text-orange-400">{language === 'zh' ? '振动剧烈波动' : 'Severe Vibration'}</span> - {language === 'zh' ? '频率从4.2Hz激增至5.8Hz，疑似轴承磨损' : 'Frequency surged from 4.2Hz to 5.8Hz, suspected bearing wear'}</div>
                      <div>• <span className="text-yellow-400">{language === 'zh' ? '噪音显著增大' : 'Noise Significantly Increased'}</span> - {language === 'zh' ? '从70dB升至85dB，出现高频异响' : '70dB to 85dB, high-frequency abnormal sound detected'}</div>
                      <div>• <span className="text-blue-400">{language === 'zh' ? '功率不稳定' : 'Unstable Power'}</span> - {language === 'zh' ? '波动范围扩大25%，能耗异常' : 'Fluctuation range expanded by 25%, abnormal energy consumption'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 font-semibold">{language === 'zh' ? '⚠️ 紧急预警: 3号注塑机' : '⚠️ Emergency Alert: Injection Machine #3'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 rounded p-3">
                        <div className="text-red-400 font-semibold mb-1">{language === 'zh' ? '🔧 异常定位' : '🔧 Fault Location'}</div>
                        <div className="text-sm text-muted-foreground">
                          • {language === 'zh' ? '异常部件: 主轴承系统' : 'Faulty Component: Main Bearing System'}<br/>
                          • {language === 'zh' ? '故障类型: 轴承磨损' : 'Fault Type: Bearing Wear'}<br/>
                          • {language === 'zh' ? '影响范围: 核心动力' : 'Impact Scope: Core Power'}<br/>
                          • {language === 'zh' ? '紧急程度: 高' : 'Urgency Level: High'}
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-3">
                        <div className="text-yellow-400 font-semibold mb-1">{language === 'zh' ? '📊 故障预测' : '📊 Fault Prediction'}</div>
                        <div className="text-sm text-muted-foreground">
                          • {language === 'zh' ? '故障概率: 85%' : 'Failure Probability: 85%'}<br/>
                          • {language === 'zh' ? '预测时间: 48小时内' : 'Predicted Time: Within 48 hours'}<br/>
                          • {language === 'zh' ? '剩余寿命: ~120小时' : 'Remaining Useful Life: ~120 hours'}<br/>
                          • {language === 'zh' ? '置信度: 92%' : 'Confidence: 92%'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 rounded p-3">
                      <div className="text-base text-green-400 font-semibold mb-1">{language === 'zh' ? '✅ 处理建议' : '✅ Recommended Actions'}</div>
                      <div className="text-sm text-muted-foreground">
                        • {language === 'zh' ? '建议: 立即停机检修，更换主轴承组件' : 'Recommendation: Immediate shutdown for maintenance, replace main bearing assembly'}<br/>
                        • {language === 'zh' ? '维护工单: 已生成 #WO-2024-0315' : 'Work Order: Generated #WO-2024-0315'}<br/>
                        • {language === 'zh' ? '预计停机时间: 4-6小时' : 'Expected Downtime: 4-6 hours'}<br/>
                        • {language === 'zh' ? '备件准备: 轴承SKF-6309 × 2 (库存充足)' : 'Spare Parts: Bearing SKF-6309 × 2 (In Stock)'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 04: Complaint Analysis Results */}
            {scenario.id === 'scenario-04' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {t('capability.result.complaintAnalysisDetails')}
                </h3>

                {/* 投诉概览 */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-purple-400 font-semibold">{language === 'zh' ? '投诉类型: 产品质量问题' : 'Complaint Type: Product Quality Issue'}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'zh' ? '紧急度:' : 'Urgency:'} <span className="text-red-400 font-semibold">{language === 'zh' ? '高' : 'High'}</span> |
                        {language === 'zh' ? '优先级:' : 'Priority:'} <span className="text-red-400 font-semibold">P0</span> |
                        {language === 'zh' ? '响应时限:' : 'Response Deadline:'} <span className="text-orange-400">{language === 'zh' ? '2小时内' : 'Within 2 hours'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-400">73%</div>
                      <div className="text-sm text-muted-foreground">{language === 'zh' ? '客户流失风险' : 'Customer Churn Risk'}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 情感分析 */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      {language === 'zh' ? '😠 情感分析' : '😠 Sentiment Analysis'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex justify-between">
                        <span>{language === 'zh' ? '情绪状态:' : 'Emotional State:'}</span>
                        <span className="text-red-400 font-semibold">{language === 'zh' ? '愤怒/失望' : 'Angry/Disappointed'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'zh' ? '情绪强度:' : 'Emotion Intensity:'}</span>
                        <span className="text-orange-400">8.5/10</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div>{language === 'zh' ? '投诉语气:' : 'Tone:'} <span className="text-red-400">{language === 'zh' ? '强烈不满' : 'Strongly Dissatisfied'}</span></div>
                      <div>{language === 'zh' ? '流失风险:' : 'Churn Risk:'} <span className="text-red-400 font-semibold">{language === 'zh' ? '73% (高)' : '73% (High)'}</span></div>
                      <div className="pt-1 border-t border-border/30">
                        {language === 'zh' ? '关键词: 失望、欺骗、再也不买' : 'Keywords: disappointed, deceived, never buy again'}
                      </div>
                    </div>
                  </div>

                  {/* 根因分析 */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '🔍 根因分析' : '🔍 Root Cause Analysis'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-red-400 font-semibold">{language === 'zh' ? '主因 (权重60%):' : 'Primary Cause (Weight 60%):'}</div>
                        <div className="ml-2">{language === 'zh' ? '产品包装破损 - 质检环节漏检' : 'Damaged packaging - QC inspection failure'}</div>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-orange-400 font-semibold">{language === 'zh' ? '次因 (权重30%):' : 'Secondary Cause (Weight 30%):'}</div>
                        <div className="ml-2">{language === 'zh' ? '物流时效延迟 - 未选优质物流' : 'Logistics delay - Subpar carrier selection'}</div>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-yellow-400 font-semibold">{language === 'zh' ? '附加因素:' : 'Contributing Factor:'}</div>
                        <div className="ml-2">{language === 'zh' ? '客服响应慢，未及时安抚' : 'Slow customer service response, inadequate appeasement'}</div>
                      </div>
                      <div className="pt-1 border-t border-border/30">
                        {language === 'zh' ? '责任方: 质检部门 + 物流供应商' : 'Responsible Parties: QC Dept + Logistics Provider'}
                      </div>
                    </div>
                  </div>

                  {/* 历史关联 */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '📊 历史关联分析' : '📊 Historical Correlation Analysis'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• {language === 'zh' ? '相似投诉:' : 'Similar Complaints:'} <span className="text-orange-400">{language === 'zh' ? '12起' : '12 Cases'}</span> {language === 'zh' ? '(近3个月)' : '(Last 3 Months)'}</div>
                      <div>• {language === 'zh' ? '共性问题: 物流破损 + 延迟' : 'Common Issues: Logistics damage + Delay'}</div>
                      <div>• {language === 'zh' ? '问题物流商: XX快递 (8起)' : 'Problem Carrier: XX Express (8 cases)'}</div>
                      <div>• {language === 'zh' ? '问题商品: SKU-A123 (10起)' : 'Problem SKU: SKU-A123 (10 cases)'}</div>
                      <div>• {language === 'zh' ? '系统性问题: ✓ 已识别' : 'Systemic Issue: ✓ Identified'}</div>
                      <div className="pt-1 border-t border-border/30 text-yellow-400">
                        {language === 'zh' ? '⚠️ 需启动流程改进方案' : '⚠️ Process improvement plan required'}
                      </div>
                    </div>
                  </div>

                  {/* 解决方案 - 仅在无决策时显示，决策后显示在decisionOutcome中 */}
                  {!result.decisionOutcome && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-green-400 font-semibold mb-2 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {language === 'zh' ? '💡 个性化解决方案' : '💡 Personalized Solution'}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="bg-green-500/10 rounded p-2">
                          <div className="text-green-400 font-semibold mb-1">{language === 'zh' ? '即时方案:' : 'Immediate Solution:'}</div>
                          <div className="ml-2 space-y-0.5">
                            <div>• {language === 'zh' ? '立即换货 (同城2小时达)' : 'Immediate replacement (2-hour local delivery)'}</div>
                            <div>• {language === 'zh' ? '赠送¥200代金券' : '¥200 voucher gift'}</div>
                            <div>• {language === 'zh' ? '专人上门取旧送新' : 'Door-to-door exchange service'}</div>
                          </div>
                        </div>
                        <div className="bg-blue-500/10 rounded p-2">
                          <div className="text-blue-400 font-semibold mb-1">{language === 'zh' ? '补偿升级:' : 'Compensation Upgrade:'}</div>
                          <div className="ml-2 space-y-0.5">
                            <div>• {language === 'zh' ? '升级VIP会员 (1年)' : 'VIP membership upgrade (1 year)'}</div>
                            <div>• {language === 'zh' ? '专属客服对接' : 'Dedicated customer service'}</div>
                            <div>• {language === 'zh' ? '未来订单包邮特权' : 'Free shipping privilege for future orders'}</div>
                          </div>
                        </div>
                        <div className="text-sm text-green-400 pt-1">
                          {language === 'zh' ? '预计挽回成功率: 82%' : 'Expected retention rate: 82%'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 后续行动 */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="text-base font-semibold text-primary mb-2">{language === 'zh' ? '📋 后续行动计划' : '📋 Follow-up Action Plan'}</div>
                  <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                    <div>• {language === 'zh' ? '更换物流供应商评估 (7天内)' : 'Logistics provider evaluation (Within 7 days)'}</div>
                    <div>• {language === 'zh' ? '质检流程优化方案 (3天内)' : 'QC process optimization plan (Within 3 days)'}</div>
                    <div>• {language === 'zh' ? '相似案例客户回访' : 'Follow-up with similar case customers'}</div>
                    <div>• {language === 'zh' ? '预警机制建立' : 'Early warning system establishment'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 05: Marketing Compliance Results */}
            {scenario.id === 'scenario-05' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {t('capability.result.complianceReviewDetails')}
                </h3>

                {/* 合规评分 */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base text-muted-foreground mb-1">{language === 'zh' ? '合规综合评分' : 'Overall Compliance Score'}</div>
                      <div className="text-4xl font-bold text-yellow-400">68/100</div>
                      <div className="text-sm text-yellow-400 mt-1">{language === 'zh' ? '需要修改 (中风险)' : 'Revision Required (Medium Risk)'}</div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground space-y-1">
                      <div>{language === 'zh' ? '广告法:' : 'Ad Law:'} <span className="text-red-400">{language === 'zh' ? '60分 ✗' : '60 ✗'}</span></div>
                      <div>{language === 'zh' ? '隐私合规:' : 'Privacy:'} <span className="text-yellow-400">{language === 'zh' ? '70分 ⚠️' : '70 ⚠️'}</span></div>
                      <div>{language === 'zh' ? '品牌调性:' : 'Brand Tone:'} <span className="text-green-400">{language === 'zh' ? '85分 ✓' : '85 ✓'}</span></div>
                      <div>{language === 'zh' ? '虚假宣传:' : 'False Claims:'} <span className="text-green-400">{language === 'zh' ? '90分 ✓' : '90 ✓'}</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 广告法违规 */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      {language === 'zh' ? '⚠️ 广告法违规 (5处)' : '⚠️ Advertising Law Violations (5)'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-red-400 font-semibold mb-1">{language === 'zh' ? '绝对化用词 (2处):' : 'Absolute Terms (2):'}</div>
                        <div className="ml-2 space-y-1">
                          <div>• {language === 'zh' ? '"行业' : '"Industry '}<span className="text-red-400">{language === 'zh' ? '最佳' : 'Best'}</span>{language === 'zh' ? '解决方案" → "优质"' : ' Solution" → "High-quality"'}</div>
                          <div>• {language === 'zh' ? '"市场' : '"Market '}<span className="text-red-400">{language === 'zh' ? '第一' : 'No.1'}</span>{language === 'zh' ? '品牌" → "领先"' : ' Brand" → "Leading"'}</div>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-orange-400 font-semibold mb-1">{language === 'zh' ? '夸大宣传 (2处):' : 'Exaggerated Claims (2):'}</div>
                        <div className="ml-2 space-y-1">
                          <div>• "<span className="text-orange-400">{language === 'zh' ? '100%有效' : '100% Effective'}</span>" → {language === 'zh' ? '"显著效果"' : '"Significant Results"'}</div>
                          <div>• "<span className="text-orange-400">{language === 'zh' ? '绝无仅有' : 'One and Only'}</span>" → {language === 'zh' ? '"独特"' : '"Unique"'}</div>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-yellow-400 font-semibold mb-1">{language === 'zh' ? '未经证实声明 (1处):' : 'Unverified Claims (1):'}</div>
                        <div className="ml-2">• {language === 'zh' ? '"获权威机构认证" (需提供证明)' : '"Certified by authorities" (Proof required)'}</div>
                      </div>
                    </div>
                  </div>

                  {/* 隐私合规 */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '🔒 隐私合规风险 (1处)' : '🔒 Privacy Compliance Risk (1)'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-yellow-400 font-semibold mb-1">{language === 'zh' ? '问题:' : 'Issue:'}</div>
                        <div className="ml-2">{language === 'zh' ? '使用客户真实案例和数据，未标注授权说明' : 'Real customer cases used without authorization disclosure'}</div>
                      </div>
                      <div className="bg-green-500/10 rounded p-2">
                        <div className="text-green-400 font-semibold mb-1">{language === 'zh' ? '修改建议:' : 'Recommendations:'}</div>
                        <div className="ml-2 space-y-1">
                          <div>• {language === 'zh' ? '添加"已获客户授权使用"声明' : 'Add "Customer authorization obtained" statement'}</div>
                          <div>• {language === 'zh' ? '敏感数据脱敏处理' : 'Anonymize sensitive data'}</div>
                          <div>• {language === 'zh' ? '补充隐私政策链接' : 'Add privacy policy link'}</div>
                        </div>
                      </div>
                      <div className="text-yellow-400 pt-1">
                        {language === 'zh' ? '风险等级: 中 (整改优先级: P1)' : 'Risk Level: Medium (Priority: P1)'}
                      </div>
                    </div>
                  </div>

                  {/* 对比广告 */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '✅ 对比广告审查 (通过)' : '✅ Comparative Advertising Review (Passed)'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• {language === 'zh' ? '未贬低竞品: ✓ 合规' : 'No competitor disparagement: ✓ Compliant'}</div>
                      <div>• {language === 'zh' ? '未使用竞品商标: ✓ 合规' : 'No competitor trademarks used: ✓ Compliant'}</div>
                      <div>• {language === 'zh' ? '对比数据真实: ✓ 有依据' : 'Comparison data authentic: ✓ Substantiated'}</div>
                      <div>• {language === 'zh' ? '对比维度合理: ✓ 客观' : 'Comparison dimensions reasonable: ✓ Objective'}</div>
                      <div className="pt-1 border-t border-border/30 text-green-400">
                        {language === 'zh' ? '该部分无违规问题' : 'No violations in this section'}
                      </div>
                    </div>
                  </div>

                  {/* 品牌调性 */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-blue-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      {language === 'zh' ? '🎨 品牌调性评估 (良好)' : '🎨 Brand Tone Assessment (Good)'}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• {language === 'zh' ? '语言风格: 专业、友好' : 'Language Style: Professional, Friendly'}</div>
                      <div>• {language === 'zh' ? '品牌定位: 清晰一致' : 'Brand Positioning: Clear & Consistent'}</div>
                      <div>• {language === 'zh' ? '视觉元素: 符合规范' : 'Visual Elements: Standards-compliant'}</div>
                      <div>• {language === 'zh' ? '目标受众: 匹配度高' : 'Target Audience: High Match'}</div>
                      <div className="pt-1 border-t border-border/30">
                        <div className="text-blue-400">{language === 'zh' ? '建议:' : 'Recommendation:'}</div>
                        <div className="ml-2">{language === 'zh' ? '保持现有风格，微调绝对化表述' : 'Maintain current style, fine-tune absolute language'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 修改清单 */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="text-base font-semibold text-primary mb-2">{language === 'zh' ? '📋 修改清单 (7项)' : '📋 Revision Checklist (7 Items)'}</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>{language === 'zh' ? '"最佳" → "优质" (2处)' : '"Best" → "High-quality" (2 instances)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>{language === 'zh' ? '"第一" → "领先" (1处)' : '"No.1" → "Leading" (1 instance)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>{language === 'zh' ? '"100%有效" → "显著效果" (1处)' : '"100% Effective" → "Significant Results" (1 instance)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>{language === 'zh' ? '"绝无仅有" → "独特" (1处)' : '"One and Only" → "Unique" (1 instance)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>{language === 'zh' ? '补充认证证明材料 (1处)' : 'Add certification proof (1 instance)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>{language === 'zh' ? '添加授权使用声明 (1处)' : 'Add authorization statement (1 instance)'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>{language === 'zh' ? '补充隐私政策链接' : 'Add privacy policy link'}</span>
                    </div>
                    <div className="pt-2 text-yellow-400">
                      {language === 'zh' ? '⏱️ 预计修改时间: 30分钟 | 修改后需重新审核' : '⏱️ Estimated revision time: 30 minutes | Re-review required after revision'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 06: Financial Anomaly Detection Results */}
            {scenario.id === 'scenario-06' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {t('capability.result.anomalyTransactionDetails')}
                </h3>

                {/* High Risk Transactions */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-semibold">{language === 'zh' ? '发现12笔可疑交易 (风险等级: 高)' : '12 Suspicious Transactions Detected (Risk Level: High)'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-red-400 font-semibold mb-1">{language === 'zh' ? '💰 异常金额 (2笔)' : '💰 Abnormal Amounts (2)'}</div>
                      <div className="text-sm text-muted-foreground">
                        • {language === 'zh' ? '交易A: ¥125万 (超限额3倍)' : 'Transaction A: ¥1.25M (3× limit)'}<br/>
                        • {language === 'zh' ? '交易B: ¥98万 (超限额2.4倍)' : 'Transaction B: ¥980K (2.4× limit)'}<br/>
                        • {language === 'zh' ? '总计: ¥223万' : 'Total: ¥2.23M'}
                      </div>
                    </div>
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-yellow-400 font-semibold mb-1">{language === 'zh' ? '🔄 频繁小额 (5笔)' : '🔄 Frequent Small Amounts (5)'}</div>
                      <div className="text-sm text-muted-foreground">
                        • {language === 'zh' ? '24小时内5笔相同金额' : '5 identical amounts within 24 hours'}<br/>
                        • {language === 'zh' ? '单笔: ¥9,999' : 'Per transaction: ¥9,999'}<br/>
                        • {language === 'zh' ? '总计: ¥5万' : 'Total: ¥50K'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 rounded p-3 mt-3">
                    <div className="text-base text-orange-400 font-semibold mb-1">{language === 'zh' ? '⚠️ 重复支付 (3笔)' : '⚠️ Duplicate Payments (3)'}</div>
                    <div className="text-sm text-muted-foreground">
                      • {language === 'zh' ? '相同收款方，相同金额，10分钟内重复支付' : 'Same payee, same amount, repeated within 10 minutes'}<br/>
                      • {language === 'zh' ? '单笔: ¥22万 × 3 = ¥66万' : 'Per transaction: ¥220K × 3 = ¥660K'}<br/>
                      • {language === 'zh' ? '疑似系统故障或操作失误' : 'Suspected system error or operational mistake'}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <div className="text-base font-semibold text-primary mb-2">{language === 'zh' ? '综合评估' : 'Overall Assessment'}</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• {language === 'zh' ? '异常交易总额:' : 'Total Anomaly Amount:'} <span className="text-red-400 font-semibold">{language === 'zh' ? '¥285万' : '¥2.85M'}</span></div>
                    <div>• {language === 'zh' ? '风险等级:' : 'Risk Level:'} <span className="text-red-400 font-semibold">{language === 'zh' ? '高' : 'High'}</span></div>
                    <div>• {language === 'zh' ? '建议:' : 'Recommendation:'} <span className="text-yellow-400">{language === 'zh' ? '立即启动审计流程，冻结相关账户' : 'Initiate audit process immediately, freeze related accounts'}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <div className="text-2xl font-bold text-primary">
                  {result.metrics.pages}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'zh' ? t('capability.result.pages') : t('capability.result.pagesEn')}
                </div>
              </div>
              <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                <div className="text-2xl font-bold text-accent">
                  {result.metrics.charts}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'zh' ? t('capability.result.charts') : t('capability.result.chartsEn')}
                </div>
              </div>
              <div className="bg-tech-blue/5 rounded-xl p-4 border border-tech-blue/10">
                <div className="text-2xl font-bold text-tech-blue">
                  {result.metrics.insights}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'zh' ? t('capability.result.insights') : t('capability.result.insightsEn')}
                </div>
              </div>
              <div className="bg-tech-green/5 rounded-xl p-4 border border-tech-green/10">
                <div className="text-2xl font-bold text-tech-green">
                  {result.metrics.recommendations}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'zh' ? t('capability.result.recommendations') : t('capability.result.recommendationsEn')}
                </div>
              </div>
            </div>

            {/* Preview Tags */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground mb-3">
                {language === 'zh' ? t('capability.result.reportContents') : t('capability.result.reportContentsEn')}:
              </div>
              <div className="flex flex-wrap gap-2">
                {(language === 'zh' ? result.tags : (result.tagsEn || result.tags)).map((tag: string, index: number) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-muted/30 rounded-full text-sm text-muted-foreground border border-border/50 fade-in-up"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: ROI Dashboard */}
        <div className="space-y-8">
          <div className="text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('capability.result.valueDemo')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('capability.result.roiDemo')}
            </p>
          </div>

          {/* ROI Metrics */}
          <div className="space-y-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
            {/* Time Saving */}
            <div className="card-gradient border border-border/50 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('capability.result.timeSaving')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('capability.result.timeSavingEn')}
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold text-accent mb-2">
                {result.roi.time.value}
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-accent to-accent/60 h-2 rounded-full"
                     style={{ width: Math.min(100, parseInt(result.roi.time.value.replace('-', '').replace('+', '').replace('%', '')) || 0) + '%' }} />
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'zh' ? result.roi.time.desc : (result.roi.time.descEn || result.roi.time.desc)}
              </p>
            </div>

            {/* Efficiency Boost */}
            <div className="card-gradient border border-border/50 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('capability.result.efficiencyBoost')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('capability.result.efficiencyBoostEn')}
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {result.roi.efficiency.value}
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full"
                     style={{ width: Math.min(100, parseInt(result.roi.efficiency.value.replace('-', '').replace('+', '').replace('%', '')) || 0) + '%' }} />
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'zh' ? result.roi.efficiency.desc : (result.roi.efficiency.descEn || result.roi.efficiency.desc)}
              </p>
            </div>

            {/* Risk Detection */}
            <div className="card-gradient border border-border/50 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-tech-green/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-tech-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('capability.result.riskDetection')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('capability.result.riskDetectionEn')}
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold text-tech-green mb-2">
                {result.roi.risk.value}
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-tech-green to-tech-green/60 h-2 rounded-full"
                     style={{ width: Math.min(100, parseInt(result.roi.risk.value.replace('-', '').replace('+', '').replace('%', '')) || 0) + '%' }} />
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'zh' ? result.roi.risk.desc : (result.roi.risk.descEn || result.roi.risk.desc)}
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={onContinue}
              size="lg"
              className="px-8 py-4 text-lg glow-effect hover:scale-105 transition-all duration-300"
            >
              {t('capability.result.viewComplete')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              {t('result.download')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
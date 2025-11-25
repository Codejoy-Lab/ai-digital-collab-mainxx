import { Button } from '@/components/ui/button';
import { SelectedScenario } from '@/pages/CapabilityHubPage';
import { TrendingUp, Clock, Shield, CheckCircle, RotateCcw, FileText, BarChart, Activity } from 'lucide-react';
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
        title: '智能服务开通执行报告',
        titleEn: 'Smart Service Onboarding Report',
        summary: 'AI系统自动完成全流程：验证客户资格（合同有效期至2025.12）→ 解析3份授权文档（信息完整率100%）→ 协调开通时间（2024-12-01 14:00）→ 配置系统权限并通知相关团队。整个流程无需人工介入，运营负责人可查看总结报告进行抽检确认。',
        summaryEn: 'AI system automatically completed full process: Verified customer eligibility (contract valid until 2025.12) → Parsed 3 authorization documents (100% information completeness) → Coordinated activation time (2024-12-01 14:00) → Configured system permissions and notified teams. Entire process required no manual intervention, operations manager can review summary report for spot checks.',
        metrics: {
          pages: 8,
          charts: 4,
          insights: 6,
          recommendations: 3
        },
        tags: ['自动化开通', '文档解析', '资源排期', '零人工介入', '末端抽检', '效率提升'],
        tagsEn: ['Automated Onboarding', 'Document Parsing', 'Resource Scheduling', 'Zero Manual Intervention', 'Spot Check', 'Efficiency Boost'],
        roi: {
          time: { value: '-94%', desc: '开通时间 3天 → 4小时', descEn: 'Onboarding time: 3 days → 4 hours' },
          efficiency: { value: '+88%', desc: '流程自动化率', descEn: 'Process automation rate' },
          risk: { value: '-72%', desc: '人为错误降低', descEn: 'Human error reduction' }
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
      'scenario-06': (() => {
        // 根据决策历史返回不同的结果
        const decision = scenario?.decisionHistory?.[0];
        const decisionPath = decision?.optionId || 'default';

        if (decisionPath === 'option-approve') {
          // 财务审批通过：执行AI调整方案
          return {
            title: '账单调整执行报告',
            titleEn: 'Billing Adjustment Execution Report',
            summary: '您审核通过了AI生成的调整方案。系统自动执行：增值服务费部分退款¥1,400（50%） + 客户解释邮件（说明计费规则） + 销售流程改进通知 + 客户关怀礼包（200积分）。客户满意度从不满（35%）提升至80%，投诉成功化解，客户关系得以维护。AI调整方案执行效果良好！',
            summaryEn: 'You approved the AI-generated adjustment plan. System auto-executed: Value-added service partial refund ¥1,400 (50%) + Customer explanation email (billing rules clarification) + Sales process improvement notification + Customer care package (200 points). Customer satisfaction increased from dissatisfied (35%) to 80%, complaint successfully resolved, customer relationship maintained. Excellent AI adjustment plan execution!',
            metrics: {
              pages: 10,
              charts: 6,
              insights: 8,
              recommendations: 4
            },
            tags: ['AI方案', '部分退款', '客户解释', '流程改进', '满意度提升', '投诉化解'],
            tagsEn: ['AI Solution', 'Partial Refund', 'Customer Explanation', 'Process Improvement', 'Satisfaction Boost', 'Complaint Resolution'],
            roi: {
              time: { value: '-91%', desc: '处理时间 3天 → 4小时', descEn: 'Processing time: 3 days → 4 hours' },
              efficiency: { value: '+128%', desc: '客户满意度提升', descEn: 'Customer satisfaction improvement' },
              risk: { value: '-65%', desc: '财务纠纷风险降低', descEn: 'Financial dispute risk reduction' }
            },
            decisionOutcome: {
              label: '✅ 方案通过',
              labelEn: '✅ Plan Approved',
              color: 'green',
              result: 'AI调整方案执行顺利！部分退款¥1,400 + 解释说明成功化解客户投诉。满意度提升至80%，客户表示理解并认可处理方式，避免升级纠纷。',
              resultEn: 'AI adjustment plan executed smoothly! Partial refund ¥1,400 + explanation successfully resolved customer complaint. Satisfaction increased to 80%, customer expressed understanding and approval of handling method, avoided escalation.'
            }
          };
        } else if (decisionPath === 'option-reject') {
          // 财务审批拒绝：维持原账单
          return {
            title: '账单维持决策报告',
            titleEn: 'Billing Maintained Decision Report',
            summary: '您审核后拒绝了AI的调整建议，决定维持原账单。理由：增值服务已实际提供，销售流程虽有疏漏但不影响计费合理性。系统执行：发送详细计费说明邮件 + 销售培训改进通知 + 客户关怀补偿（100积分作为情绪安抚）。客户接受解释，满意度从35%恢复至65%，投诉结案。',
            summaryEn: 'After review, you rejected the AI adjustment recommendation and decided to maintain original bill. Reason: Value-added services were actually provided, sales process had oversight but does not affect billing legitimacy. System executed: Sent detailed billing explanation email + Sales training improvement notification + Customer care compensation (100 points as goodwill gesture). Customer accepted explanation, satisfaction recovered from 35% to 65%, complaint closed.',
            metrics: {
              pages: 9,
              charts: 5,
              insights: 7,
              recommendations: 3
            },
            tags: ['人工决策', '维持账单', '详细解释', '销售培训', '客户安抚', '投诉结案'],
            tagsEn: ['Manual Decision', 'Bill Maintained', 'Detailed Explanation', 'Sales Training', 'Customer Appeasement', 'Complaint Closed'],
            roi: {
              time: { value: '-85%', desc: '处理时间 3天 → 5小时', descEn: 'Processing time: 3 days → 5 hours' },
              efficiency: { value: '+85%', desc: '客户满意度恢复', descEn: 'Customer satisfaction recovery' },
              risk: { value: '-55%', desc: '升级投诉风险降低', descEn: 'Escalation risk reduction' }
            },
            decisionOutcome: {
              label: '❌ 方案拒绝',
              labelEn: '❌ Plan Rejected',
              color: 'red',
              result: '人工决策维持原账单。通过详细解释 + 销售改进 + 情绪安抚，客户理解并接受。满意度恢复至65%，投诉成功结案，体现财务原则性。',
              resultEn: 'Manual decision maintained original bill. Through detailed explanation + sales improvement + goodwill gesture, customer understood and accepted. Satisfaction recovered to 65%, complaint successfully closed, demonstrates financial principles.'
            }
          };
        } else {
          // 默认：AI分析完成，等待审批
          return {
            title: '账单调整AI分析与建议',
            titleEn: 'Billing Adjustment AI Analysis and Recommendation',
            summary: 'AI系统完成账单对账分析：客户投诉季度服务费高出¥2,800，根因为增值服务计费未提前说明（销售疏漏）。AI建议调整方案：增值服务费部分退款¥1,400（50%，体现诚意）+ 客户解释邮件 + 销售流程改进通知 + 客户关怀补偿。方案已生成，等待财务主管审批确认。',
            summaryEn: 'AI system completed billing reconciliation analysis: Customer complained about ¥2,800 higher quarterly service fee, root cause is value-added service charges not explained in advance (sales oversight). AI recommended adjustment plan: Value-added service partial refund ¥1,400 (50%, showing goodwill) + Customer explanation email + Sales process improvement notification + Customer care compensation. Plan generated, awaiting financial supervisor approval.',
            metrics: {
              pages: 11,
              charts: 7,
              insights: 9,
              recommendations: 5
            },
            tags: ['AI分析', '对账核查', '方案生成', '销售疏漏', '等待审批', '智能建议'],
            tagsEn: ['AI Analysis', 'Reconciliation Check', 'Solution Generation', 'Sales Oversight', 'Pending Approval', 'Intelligent Recommendations'],
            roi: {
              time: { value: '-93%', desc: '分析时间 2天 → 5分钟', descEn: 'Analysis time: 2 days → 5 minutes' },
              efficiency: { value: '+88%', desc: '方案准确度', descEn: 'Solution accuracy' },
              risk: { value: '-70%', desc: '预期纠纷风险降低', descEn: 'Expected dispute risk reduction' }
            }
          };
        }
      })()
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
                  {language === 'zh' ? '🎯 服务开通全流程执行详情' : '🎯 Service Onboarding Full Process Details'}
                </h3>

                {/* 客户体验改善: 流程透明化 */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">
                      {language === 'zh' ? '✅ 客户体验改善：流程全程透明可视' : '✅ Customer Experience: Fully Transparent Process'}
                    </span>
                  </div>

                  {/* 4步流程进度可视化 */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">✓</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground">{language === 'zh' ? '步骤1: 账户资格核查' : 'Step 1: Account Eligibility Check'}</div>
                        <div className="text-xs text-muted-foreground">{language === 'zh' ? '耗时: 2分钟 | 状态: 已完成 | 合同有效期至2025.12.31' : 'Duration: 2min | Status: Completed | Contract valid until 2025.12.31'}</div>
                      </div>
                      <div className="text-xs text-green-400">{language === 'zh' ? '客户已收到SMS通知' : 'Customer notified via SMS'}</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">✓</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground">{language === 'zh' ? '步骤2: 文档智能解析' : 'Step 2: Intelligent Document Parsing'}</div>
                        <div className="text-xs text-muted-foreground">{language === 'zh' ? '耗时: 3分钟 | 状态: 已完成 | 3份文档100%信息完整' : 'Duration: 3min | Status: Completed | 3 docs 100% info complete'}</div>
                      </div>
                      <div className="text-xs text-green-400">{language === 'zh' ? '客户可在线查看进度' : 'Customer can view progress online'}</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">✓</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground">{language === 'zh' ? '步骤3: 资源智能排期' : 'Step 3: Intelligent Resource Scheduling'}</div>
                        <div className="text-xs text-muted-foreground">{language === 'zh' ? '耗时: 1分钟 | 状态: 已完成 | 开通时间: 2024-12-01 14:00' : 'Duration: 1min | Status: Completed | Activation: 2024-12-01 14:00'}</div>
                      </div>
                      <div className="text-xs text-green-400">{language === 'zh' ? '预期时间已告知' : 'Expected time notified'}</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">✓</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground">{language === 'zh' ? '步骤4: 系统自动配置' : 'Step 4: Automated System Configuration'}</div>
                        <div className="text-xs text-muted-foreground">{language === 'zh' ? '耗时: 2分钟 | 状态: 已完成 | 5个模块权限已配置' : 'Duration: 2min | Status: Completed | 5 module permissions configured'}</div>
                      </div>
                      <div className="text-xs text-green-400">{language === 'zh' ? '客户收到开通邮件' : 'Customer received activation email'}</div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                    <div className="font-semibold text-green-400 mb-1">{language === 'zh' ? '🎯 客户痛点解决:' : '🎯 Customer Pain Points Solved:'}</div>
                    <div className="space-y-1">
                      <div>• <span className="text-green-400">{language === 'zh' ? '告别黑箱' : 'No More Black Box'}</span> - {language === 'zh' ? '客户全程可见4步进度，实时收到SMS/邮件通知' : 'Customer sees all 4 steps in real-time via SMS/email notifications'}</div>
                      <div>• <span className="text-green-400">{language === 'zh' ? '预期明确' : 'Clear Expectations'}</span> - {language === 'zh' ? 'AI提前告知开通时间（2024-12-01 14:00），不再焦虑等待' : 'AI pre-notifies activation time (2024-12-01 14:00), no more anxious waiting'}</div>
                      <div>• <span className="text-green-400">{language === 'zh' ? '一次说清' : 'One-time Clarity'}</span> - {language === 'zh' ? 'AI第一步生成完整资料清单，避免反复补交' : 'AI generates complete doc checklist in Step 1, avoids repeated submissions'}</div>
                    </div>
                  </div>
                </div>

                {/* 内部效率提升: 跨系统自动协同 */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400">
                      {language === 'zh' ? '⚡ 内部效率提升：跨系统自动协同编排' : '⚡ Internal Efficiency: Cross-System Auto-Orchestration'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-blue-400 font-semibold mb-2 text-sm">{language === 'zh' ? '🔗 系统自动打通 (4个)' : '🔗 Systems Auto-Integrated (4)'}</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• {language === 'zh' ? 'CRM客户系统 → 自动查询账号状态' : 'CRM System → Auto query account status'}</div>
                        <div>• {language === 'zh' ? '合同管理系统 → 自动验证合同' : 'Contract System → Auto verify contract'}</div>
                        <div>• {language === 'zh' ? 'HR排班系统 → 自动协调时间' : 'HR Scheduling → Auto coordinate time'}</div>
                        <div>• {language === 'zh' ? '技术配置系统 → 自动授权' : 'Tech Config → Auto authorization'}</div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded p-3">
                      <div className="text-yellow-400 font-semibold mb-2 text-sm">{language === 'zh' ? '🤖 机械劳动自动化' : '🤖 Manual Work Automated'}</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• {language === 'zh' ? 'OCR自动识别3份文档（100%准确）' : 'OCR auto-recognizes 3 docs (100% accuracy)'}</div>
                        <div>• {language === 'zh' ? '合规性自动校验（0人工检查）' : 'Compliance auto-verified (0 manual checks)'}</div>
                        <div>• {language === 'zh' ? '排期冲突自动检测和优化' : 'Schedule conflicts auto-detected/optimized'}</div>
                        <div>• {language === 'zh' ? '5个团队自动通知（邮件已发）' : '5 teams auto-notified (emails sent)'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                    <div className="font-semibold text-blue-400 mb-1">{language === 'zh' ? '💡 运营团队痛点解决:' : '💡 Operations Team Pain Points Solved:'}</div>
                    <div className="space-y-1">
                      <div>• <span className="text-blue-400">{language === 'zh' ? '告别人肉编排' : 'No More Manual Orchestration'}</span> - {language === 'zh' ? '4个系统AI自动打通，无需Excel/微信群协调' : '4 systems AI auto-integrated, no Excel/WeChat coordination needed'}</div>
                      <div>• <span className="text-blue-400">{language === 'zh' ? '重复劳动消失' : 'Repetitive Work Eliminated'}</span> - {language === 'zh' ? 'OCR+自动校验替代人工，释放80%时间处理异常' : 'OCR+auto-check replaces manual work, frees 80% time for exceptions'}</div>
                      <div>• <span className="text-blue-400">{language === 'zh' ? '统一视图可见' : 'Unified View Available'}</span> - {language === 'zh' ? '管理者可看到"卡在哪、谁在等"，追责清晰' : 'Managers see "where stuck, who waiting", clear accountability'}</div>
                    </div>
                  </div>
                </div>

                {/* 管理层价值: 数据驱动决策 */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <BarChart className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">
                      {language === 'zh' ? '📊 管理层价值：数据驱动流程优化' : '📊 Management Value: Data-Driven Process Optimization'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-black/20 rounded p-3 text-center">
                      <div className="text-2xl font-bold text-green-400">94%</div>
                      <div className="text-xs text-muted-foreground mt-1">{language === 'zh' ? '开通周期缩短' : 'Cycle Time Reduced'}</div>
                      <div className="text-xs text-green-400 mt-1">{language === 'zh' ? '3天 → 4小时' : '3 days → 4 hours'}</div>
                    </div>

                    <div className="bg-black/20 rounded p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">100%</div>
                      <div className="text-xs text-muted-foreground mt-1">{language === 'zh' ? '流程数据可见' : 'Process Data Visible'}</div>
                      <div className="text-xs text-blue-400 mt-1">{language === 'zh' ? '每步耗时+成功率' : 'Each step time+success rate'}</div>
                    </div>

                    <div className="bg-black/20 rounded p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">0</div>
                      <div className="text-xs text-muted-foreground mt-1">{language === 'zh' ? '人为错误次数' : 'Human Errors'}</div>
                      <div className="text-xs text-yellow-400 mt-1">{language === 'zh' ? '自动化消除风险' : 'Automation eliminates risk'}</div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                    <div className="font-semibold text-purple-400 mb-2">{language === 'zh' ? '📈 本次开通的精准数据链路:' : '📈 Precise Data Trail for This Activation:'}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>• {language === 'zh' ? '步骤1耗时: 2分钟（历史平均: 45分钟）' : 'Step 1 time: 2min (avg: 45min)'}</div>
                      <div>• {language === 'zh' ? '步骤2耗时: 3分钟（历史平均: 2小时）' : 'Step 2 time: 3min (avg: 2hrs)'}</div>
                      <div>• {language === 'zh' ? '步骤3耗时: 1分钟（历史平均: 1天）' : 'Step 3 time: 1min (avg: 1 day)'}</div>
                      <div>• {language === 'zh' ? '步骤4耗时: 2分钟（历史平均: 30分钟）' : 'Step 4 time: 2min (avg: 30min)'}</div>
                      <div>• {language === 'zh' ? '瓶颈识别: 步骤3（排期）原为最大痛点' : 'Bottleneck: Step 3 (scheduling) was biggest pain'}</div>
                      <div>• {language === 'zh' ? '优化建议: 可进一步简化步骤2文档要求' : 'Optimization: Can further simplify Step 2 doc requirements'}</div>
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
                  {language === 'zh' ? '📊 账单调整执行详情' : '📊 Billing Adjustment Execution Details'}
                </h3>

                {/* 可视化账单对比 */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <BarChart className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400">
                      {language === 'zh' ? '💰 可视化账单对比分析' : '💰 Visual Billing Comparison Analysis'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* 原账单 */}
                    <div className="bg-black/20 rounded p-4">
                      <div className="text-red-400 font-semibold mb-3 text-center">{language === 'zh' ? '❌ 原账单（客户质疑）' : '❌ Original Bill (Disputed)'}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{language === 'zh' ? '基础服务费' : 'Base Service Fee'}</span>
                          <span className="text-foreground">¥8,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{language === 'zh' ? '增值服务费' : 'Value-added Fee'}</span>
                          <span className="text-red-400 font-semibold">¥3,200</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-semibold">
                          <span>{language === 'zh' ? '合计' : 'Total'}</span>
                          <span className="text-red-400">¥11,200</span>
                        </div>
                        <div className="bg-red-500/20 rounded px-2 py-1 text-xs text-red-400 text-center mt-2">
                          {language === 'zh' ? '客户预期: ¥8,400（差异¥2,800）' : 'Customer Expected: ¥8,400 (Diff ¥2,800)'}
                        </div>
                      </div>
                    </div>

                    {/* 调整后账单 */}
                    <div className="bg-black/20 rounded p-4 border-2 border-green-500/50">
                      <div className="text-green-400 font-semibold mb-3 text-center">{language === 'zh' ? '✅ 调整后账单（AI建议）' : '✅ Adjusted Bill (AI Recommended)'}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{language === 'zh' ? '基础服务费' : 'Base Service Fee'}</span>
                          <span className="text-foreground">¥8,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{language === 'zh' ? '增值服务费（50%）' : 'Value-added Fee (50%)'}</span>
                          <span className="text-green-400 font-semibold">¥1,800</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-semibold">
                          <span>{language === 'zh' ? '合计' : 'Total'}</span>
                          <span className="text-green-400">¥9,800</span>
                        </div>
                        <div className="bg-green-500/20 rounded px-2 py-1 text-xs text-green-400 text-center mt-2">
                          {language === 'zh' ? '退款¥1,400（体现企业诚意）' : 'Refund ¥1,400 (Shows Goodwill)'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                    <div className="font-semibold text-blue-400 mb-1">{language === 'zh' ? '🎯 差异分析:' : '🎯 Variance Analysis:'}</div>
                    <div className="space-y-1">
                      <div>• <span className="text-blue-400">{language === 'zh' ? '根本原因' : 'Root Cause'}</span> - {language === 'zh' ? '销售签约时未充分说明增值服务独立计费规则' : 'Sales did not fully explain value-added service billing rules during signing'}</div>
                      <div>• <span className="text-blue-400">{language === 'zh' ? '调整逻辑' : 'Adjustment Logic'}</span> - {language === 'zh' ? '服务已提供（47次使用），部分退款兼顾客户体验与财务原则' : 'Service provided (47 uses), partial refund balances customer experience and financial principles'}</div>
                      <div>• <span className="text-blue-400">{language === 'zh' ? '预期效果' : 'Expected Outcome'}</span> - {language === 'zh' ? '客户满意度从35%提升至80%，避免升级投诉' : 'Customer satisfaction from 35% to 80%, avoid escalation'}</div>
                    </div>
                  </div>
                </div>

                {/* 智能分流逻辑说明 */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-400">
                      {language === 'zh' ? '🤖 智能分流决策逻辑' : '🤖 Intelligent Routing Decision Logic'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-sm font-semibold text-foreground mb-2">{language === 'zh' ? '本案件路由判定:' : 'Case Routing Determination:'}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-red-500/20 rounded p-2">
                          <div className="text-red-400 font-semibold mb-1">{language === 'zh' ? '❌ 金额阈值' : '❌ Amount Threshold'}</div>
                          <div className="text-muted-foreground">{language === 'zh' ? '¥1,400 > ¥1,000' : '¥1,400 > ¥1,000'}</div>
                          <div className="text-red-400 text-xs">{language === 'zh' ? '需人工审批' : 'Requires approval'}</div>
                        </div>
                        <div className="bg-green-500/20 rounded p-2">
                          <div className="text-green-400 font-semibold mb-1">{language === 'zh' ? '✅ 根因明确' : '✅ Clear Root Cause'}</div>
                          <div className="text-muted-foreground">{language === 'zh' ? '销售流程疏漏' : 'Sales oversight'}</div>
                          <div className="text-green-400 text-xs">{language === 'zh' ? 'AI准确定位' : 'AI accurately located'}</div>
                        </div>
                        <div className="bg-yellow-500/20 rounded p-2">
                          <div className="text-yellow-400 font-semibold mb-1">{language === 'zh' ? '⚠️ 最终判定' : '⚠️ Final Decision'}</div>
                          <div className="text-muted-foreground">{language === 'zh' ? '触发人工审批' : 'Trigger manual approval'}</div>
                          <div className="text-yellow-400 text-xs">{language === 'zh' ? '财务主管介入' : 'Supervisor involved'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                      <div className="font-semibold text-yellow-400 mb-2">{language === 'zh' ? '💡 智能分流规则体系（未来完整版）:' : '💡 Intelligent Routing Rules (Full Version):'}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>• {language === 'zh' ? '金额≤¥500 + 根因明确 → 自动批准' : 'Amount ≤¥500 + clear cause → Auto-approve'}</div>
                        <div>• {language === 'zh' ? '¥500 < 金额 ≤¥1000 → 主管抽检' : '¥500 < amount ≤¥1000 → Supervisor spot-check'}</div>
                        <div>• {language === 'zh' ? '金额 > ¥1000 → 必须审批（本案）' : 'Amount > ¥1000 → Approval required (this case)'}</div>
                        <div>• {language === 'zh' ? '根因不明 → 人工介入调查' : 'Unclear cause → Manual investigation'}</div>
                        <div>• {language === 'zh' ? 'VIP客户 → 优先处理通道' : 'VIP customer → Priority processing'}</div>
                        <div>• {language === 'zh' ? '重复投诉 → 升级处理流程' : 'Repeat complaint → Escalation process'}</div>
                      </div>
                      <div className="mt-2 text-yellow-400">
                        {language === 'zh' ? '🎯 预期效果: 70%案件AI自动处理，30%高价值案件人工介入' : '🎯 Expected: 70% cases AI auto-handled, 30% high-value cases manual intervention'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 财务团队痛点解决 */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">
                      {language === 'zh' ? '⚡ 财务团队痛点解决方案' : '⚡ Finance Team Pain Points Solved'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-purple-400 font-semibold mb-2 text-sm">{language === 'zh' ? '📧 邮件驱动自动化' : '📧 Email-Driven Automation'}</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• {language === 'zh' ? 'AI自动解析邮件内容（100%准确）' : 'AI auto-parses email content (100% accuracy)'}</div>
                        <div>• {language === 'zh' ? '自动提取账单号、时间段、问题类型' : 'Auto-extracts bill#, period, issue type'}</div>
                        <div>• {language === 'zh' ? '无需人工"啃"非结构化请求' : 'No manual parsing of unstructured requests'}</div>
                        <div className="text-purple-400">{language === 'zh' ? '→ 节省2小时/案件' : '→ Saves 2 hours/case'}</div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded p-3">
                      <div className="text-blue-400 font-semibold mb-2 text-sm">{language === 'zh' ? '🔗 多系统自动对账' : '🔗 Multi-System Auto Reconciliation'}</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• {language === 'zh' ? '计费系统 + CRM + 支付记录自动调取' : 'Billing + CRM + Payment auto-retrieved'}</div>
                        <div>• {language === 'zh' ? 'AI自动对比差异、定位根因' : 'AI auto-compares variances, locates cause'}</div>
                        <div>• {language === 'zh' ? '无需在多个系统间来回切换' : 'No need to switch between systems'}</div>
                        <div className="text-blue-400">{language === 'zh' ? '→ 体力活彻底消失' : '→ Manual work eliminated'}</div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded p-3">
                      <div className="text-green-400 font-semibold mb-2 text-sm">{language === 'zh' ? '📋 审批材料自动生成' : '📋 Approval Materials Auto-Generated'}</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• {language === 'zh' ? 'AI自动整理：诉求+数据+分析+政策' : 'AI auto-organizes: request+data+analysis+policy'}</div>
                        <div>• {language === 'zh' ? '包含风险评估、调整建议、执行步骤' : 'Includes risk assessment, recommendations, steps'}</div>
                        <div>• {language === 'zh' ? '财务主管收到结构化Brief' : 'Supervisor receives structured brief'}</div>
                        <div className="text-green-400">{language === 'zh' ? '→ 高金额案件准备时间 3小时 → 5分钟' : '→ High-value case prep: 3hrs → 5min'}</div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded p-3">
                      <div className="text-yellow-400 font-semibold mb-2 text-sm">{language === 'zh' ? '⚖️ 风控与效率兼顾' : '⚖️ Risk Control & Efficiency Balanced'}</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• {language === 'zh' ? '简单/安全案件AI自动处理' : 'Simple/safe cases AI auto-handles'}</div>
                        <div>• {language === 'zh' ? '复杂/高风险案件自动浮到人手里' : 'Complex/risky cases auto-escalate to human'}</div>
                        <div>• {language === 'zh' ? '管理层聚焦战略性决策' : 'Management focuses on strategic decisions'}</div>
                        <div className="text-yellow-400">{language === 'zh' ? '→ 审批流程既安全又高效' : '→ Approval process both safe & efficient'}</div>
                      </div>
                    </div>
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

          {/* Restart Button */}
          <div className="text-center fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={onContinue}
              size="lg"
              className="px-8 py-4 text-lg glow-effect hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {t('capability.collection.startNew')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
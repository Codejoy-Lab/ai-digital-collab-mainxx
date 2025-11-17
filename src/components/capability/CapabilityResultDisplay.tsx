import { Button } from '@/components/ui/button';
import { SelectedScenario } from '@/pages/CapabilityHubPage';
import { TrendingUp, Clock, Shield, CheckCircle, ArrowRight, FileText, BarChart, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ResultDisplayProps {
  scenario: SelectedScenario | null;
  onContinue: () => void;
}

export const CapabilityResultDisplay = ({ scenario, onContinue }: ResultDisplayProps) => {
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
        summaryEn: 'Intelligent compliance system completed automated cross-department review, identified 5 risk clauses through multi-source data integration.',
        metrics: {
          pages: 15,
          charts: 6,
          insights: 10,
          recommendations: 8
        },
        tags: ['自动审查', '风险识别', '合规验证', '多源集成', '改进建议', '法律分析'],
        roi: {
          time: { value: '-92%', desc: '审查时间 5天 → 10分钟' },
          efficiency: { value: '+90%', desc: '风险识别准确率' },
          risk: { value: '+95%', desc: '条款检测覆盖率' }
        }
      },
      'scenario-02': {
        title: '合作伙伴背调报告',
        titleEn: 'Partner Background Check Report',
        summary: '背景调查系统自动完成了全方位尽职调查，包括企业资质验证、财务健康度分析、诉讼记录详查、供应链稳定性评估。该企业综合评分78/100（B+级），虽存在2起历史诉讼但已和解，财务状况趋于稳定，建议可以合作并设置季度监控机制。',
        summaryEn: 'Automated comprehensive due diligence completed. Credit rating 78/100 (B+ grade), historical issues resolved, recommend cooperation with quarterly monitoring.',
        metrics: {
          pages: 18,
          charts: 10,
          insights: 12,
          recommendations: 8
        },
        tags: ['自动背调', '资质验证', '财务分析', '诉讼详查', '信用评级', '监控方案'],
        roi: {
          time: { value: '-95%', desc: '调查时间 10天 → 15分钟' },
          efficiency: { value: '+88%', desc: '信息覆盖完整度' },
          risk: { value: '+92%', desc: '风险识别准确率' }
        }
      },
      'scenario-03': {
        title: '设备智能预警报告',
        titleEn: 'Equipment Intelligent Alert Report',
        summary: '设备监控系统通过AI异常检测发现3号注塑机存在故障征兆，预测48小时内故障概率85%，剩余寿命约120小时，已生成紧急维护工单。',
        summaryEn: 'Equipment monitoring system detected fault signs, 85% failure probability within 48h, emergency maintenance order generated.',
        metrics: {
          pages: 8,
          charts: 12,
          insights: 6,
          recommendations: 4
        },
        tags: ['异常检测', '故障预测', 'RUL评估', '传感器数据', '维护工单', '预警通知'],
        roi: {
          time: { value: '-96%', desc: '检测时间 实时监控' },
          efficiency: { value: '+92%', desc: '故障预测准确率' },
          risk: { value: '-85%', desc: '停机损失降低' }
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
            summaryEn: 'You approved AI solution. Full refund + VIP package executed. Satisfaction increased to 92%, churn risk reduced to 15%.',
            metrics: {
              pages: 14,
              charts: 8,
              insights: 10,
              recommendations: 6
            },
            tags: ['AI方案', '方案审核', 'VIP挽回', '补偿礼包', '满意度提升', '客户挽回'],
            roi: {
              time: { value: '-95%', desc: '处理时间 2天 → 2小时' },
              efficiency: { value: '+160%', desc: '客户满意度提升' },
              risk: { value: '-82%', desc: '客户流失率降低' }
            },
            decisionOutcome: {
              label: '✅ 方案通过',
              color: 'green',
              result: 'AI方案执行完美！退款¥12,800 + 补偿礼包成功挽回客户。满意度92%，客户承诺继续合作，避免12万元LTV流失。'
            }
          };
        } else if (decisionPath === 'option-modify') {
          // 人工修改：优化后执行
          return {
            title: '客户投诉优化方案执行报告',
            titleEn: 'Optimized Solution Execution Report',
            summary: '您对AI方案进行了人工优化。修改内容：调整补偿金额、优化客服话术、增加定制化服务。优化后方案执行：全额退款¥12,800 + 定制补偿礼包 + 优化话术沟通 + 专属经理跟进。客户满意度提升至88%，流失风险降至20%，成功挽回客户并体现人工关怀。',
            summaryEn: 'You optimized AI solution. Customized compensation and service scripts. Satisfaction 88%, churn risk 20%.',
            metrics: {
              pages: 15,
              charts: 9,
              insights: 11,
              recommendations: 7
            },
            tags: ['人工优化', '定制方案', '话术优化', '灵活调整', '满意度恢复', '人工智慧'],
            roi: {
              time: { value: '-90%', desc: '处理时间 2天 → 3小时' },
              efficiency: { value: '+150%', desc: '客户满意度提升' },
              risk: { value: '-76%', desc: '客户流失率降低' }
            },
            decisionOutcome: {
              label: '✏️ 方案优化',
              color: 'yellow',
              result: '人工优化方案执行成功！定制化服务+优化话术体现人文关怀。满意度88%，客户认可人工调整的细节，关系更稳固。'
            }
          };
        } else {
          // 默认：AI分析完成
          return {
            title: '客户投诉AI分析与方案',
            titleEn: 'AI Analysis and Solution',
            summary: 'AI系统完成投诉分析：产品质量问题（严重度高）、VIP客户（价值¥12万）、流失风险85%。AI建议方案：全额退款+VIP补偿礼包+专属经理+回访计划。系统已生成详细话术和执行步骤，等待人工审核确认。',
            summaryEn: 'AI analysis completed. VIP customer, high churn risk 85%. AI recommended full refund + compensation plan, awaiting review.',
            metrics: {
              pages: 12,
              charts: 7,
              insights: 9,
              recommendations: 5
            },
            tags: ['AI分析', '投诉分类', '方案生成', '话术准备', '等待审核', '智能建议'],
            roi: {
              time: { value: '-92%', desc: '分析时间 1天 → 6分钟' },
              efficiency: { value: '+85%', desc: '方案准确度' },
              risk: { value: '-70%', desc: '预期流失降低' }
            }
          };
        }
      })(),
      'scenario-05': {
        title: '营销内容合规审核报告',
        titleEn: 'Marketing Content Compliance Report',
        summary: '合规审核系统完成了营销内容全面检测，发现2处广告法违规（夸大宣传）、1处隐私风险（未经授权使用数据），已生成合规修改建议和风险等级评估。',
        summaryEn: 'Compliance audit system detected 2 advertising law violations and 1 privacy risk, modification suggestions generated.',
        metrics: {
          pages: 9,
          charts: 4,
          insights: 7,
          recommendations: 6
        },
        tags: ['违禁词检测', '广告法审查', '隐私检测', '品牌调性', '修改建议', '合规报告'],
        roi: {
          time: { value: '-93%', desc: '审核时间 1天 → 5分钟' },
          efficiency: { value: '+86%', desc: '违规识别准确率' },
          risk: { value: '-91%', desc: '合规风险降低' }
        }
      },
      'scenario-06': {
        title: '财务异常检测报告',
        titleEn: 'Financial Anomaly Detection Report',
        summary: '异常检测引擎发现12笔可疑交易，包括2笔异常金额、5笔频繁小额支付、3笔重复支付，总金额¥285万，风险等级：高，建议立即启动审计流程。',
        summaryEn: 'Anomaly detection engine found 12 suspicious transactions totaling ¥2.85M, risk level: High, audit recommended.',
        metrics: {
          pages: 14,
          charts: 10,
          insights: 12,
          recommendations: 8
        },
        tags: ['异常交易', '模式识别', '会计合规', '审计线索', '风险评估', '检测报告'],
        roi: {
          time: { value: '-97%', desc: '检测时间 实时监控' },
          efficiency: { value: '+94%', desc: '异常识别准确率' },
          risk: { value: '-88%', desc: '财务损失风险降低' }
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
      roi: {
        time: { value: '-90%', desc: '人工 3 天 → AI 协作 15 分钟' },
        efficiency: { value: '+70%', desc: '多维度分析与智能洞察' },
        risk: { value: '+40%', desc: 'AI 智能风险预警与建议' }
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
                AI 智能协同已完成任务
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
                  {result.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  {result.titleEn}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Task-specific Results Display */}
            {/* Scenario 01: Contract Review Results */}
            {scenario.id === 'scenario-01' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  合同风险详情 / Contract Risk Details
                </h3>

                {/* High Risk */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-semibold">高风险条款 (3项)</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-base text-red-400 font-medium">1. 违约金条款不对等</div>
                      <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                        <span className="text-yellow-400">原文:</span> 乙方违约金50% vs 甲方以实际损失为限
                      </div>
                      <div className="bg-green-500/10 rounded p-3 text-sm text-green-400">
                        <span className="font-medium">建议:</span> 双方违约金统一为合同总额20%，最高不超过实际损失1.5倍
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-base text-red-400 font-medium">2. 知识产权归属冲突</div>
                      <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                        <span className="text-yellow-400">原文:</span> 所有知识产权归甲方，未保留乙方原有技术权益
                      </div>
                      <div className="bg-green-500/10 rounded p-3 text-sm text-green-400">
                        <span className="font-medium">建议:</span> 交付成果归甲方，乙方保留原有技术和通用组件知识产权
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-base text-red-400 font-medium">3. 付款账期异常延长</div>
                      <div className="bg-black/20 rounded p-3 text-sm text-muted-foreground">
                        <span className="text-yellow-400">原文:</span> 验收后180天付款 vs 行业标准45天
                      </div>
                      <div className="bg-green-500/10 rounded p-3 text-sm text-green-400">
                        <span className="font-medium">建议:</span> 签订后付30%，中期付30%，验收后30天内付余款40%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medium Risk */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-400 font-semibold">中风险条款 (2项)</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm text-yellow-400 font-medium">1. 验收标准模糊</div>
                      <div className="bg-black/20 rounded p-2 text-sm text-muted-foreground">
                        <span className="text-yellow-400">原文:</span> 以甲方验收为准，标准由甲方最终决定
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-sm text-green-400">
                        <span className="font-medium">建议:</span> 明确技术规格清单，验收期限15工作日，逾期视为通过
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-yellow-400 font-medium">2. 保密期限不合理</div>
                      <div className="bg-black/20 rounded p-2 text-sm text-muted-foreground">
                        <span className="text-yellow-400">原文:</span> 乙方永久保密，无时间限制
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-sm text-green-400">
                        <span className="font-medium">建议:</span> 保密期限调整为合同终止后5年，行业标准范围
                      </div>
                    </div>
                  </div>
                </div>

                {/* Low Risk */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 font-semibold">低风险条款 (8项)</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1 ml-4">
                    <div>• 合同主体资质完备，信用状况良好</div>
                    <div>• 交付时间安排合理，有充足缓冲期</div>
                    <div>• 售后服务条款标准合理</div>
                    <div>• 不可抗力条款符合法律规定</div>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <div className="text-base font-semibold text-primary mb-2">综合风险评分与建议</div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">62/100</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• 风险等级: <span className="text-yellow-400 font-semibold">中等风险</span></div>
                    <div>• 建议: 重点协商修改3项高风险条款</div>
                    <div>• 优先级: 违约金条款 &gt; 知识产权 &gt; 付款条件</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 02: Partner Background Check Results */}
            {scenario.id === 'scenario-02' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  背调详情 / Background Check Details
                </h3>

                {/* 综合评分 */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base text-muted-foreground mb-1">企业综合评分</div>
                      <div className="text-4xl font-bold text-blue-400">78/100</div>
                      <div className="text-sm text-blue-400 mt-1">B+ 级 (中等风险)</div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground space-y-1">
                      <div>资质: 90分 ✓</div>
                      <div>财务: 75分 ⚠️</div>
                      <div>信用: 72分 ⚠️</div>
                      <div>舆情: 68分 ⚠️</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 资质验证 */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      ✅ 资质验证 (优秀)
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• 营业执照: <span className="text-green-400">有效</span></div>
                      <div>• 经营年限: 8年</div>
                      <div>• 注册资本: ¥5000万</div>
                      <div>• 资质认证: ISO9001, ISO14001</div>
                      <div>• 行业资质: 齐全</div>
                    </div>
                  </div>

                  {/* 财务状况 */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      ⚠️ 财务状况 (中等)
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• 年营收: ¥2.3亿 (同比+12%)</div>
                      <div>• 资产负债率: <span className="text-yellow-400">58%</span> (偏高)</div>
                      <div>• 现金流: 健康 (充足)</div>
                      <div>• 净利润率: 8.5%</div>
                      <div>• 信用评级: B+</div>
                    </div>
                  </div>

                  {/* 诉讼记录 */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      📜 诉讼记录 (需关注)
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• 历史诉讼: <span className="text-orange-400">3起</span></div>
                      <div className="ml-4">- 合同纠纷 (已结案)</div>
                      <div className="ml-4">- 账款纠纷 (已结案)</div>
                      <div className="ml-4">- 劳动争议 (在审)</div>
                      <div>• 行政处罚: 2次 (安全生产)</div>
                      <div>• 失信记录: 无</div>
                    </div>
                  </div>

                  {/* 舆情分析 */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      📰 舆情分析 (需警惕)
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• 负面新闻: <span className="text-red-400">5条</span> (近3个月)</div>
                      <div className="ml-4">- 员工投诉欠薪 (2条)</div>
                      <div className="ml-4">- 产品质量问题 (2条)</div>
                      <div className="ml-4">- 安全事故 (1条)</div>
                      <div>• 舆情指数: 68分 (偏负面)</div>
                    </div>
                  </div>
                </div>

                {/* 合作建议 */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="text-base font-semibold text-primary mb-2">🎯 合作建议与风险控制</div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="bg-blue-500/10 rounded p-2">
                      <span className="text-blue-400 font-semibold">AI建议:</span> 可以合作，企业综合评分B+级，历史问题已解决，建议加强风险控制和定期监控
                    </div>
                    <div className="space-y-1 ml-2">
                      <div>• 合同条款: 加强违约责任和付款保障条款</div>
                      <div>• 付款方式: 建议分期付款，首付不超过30%</div>
                      <div>• 履约保证: 要求提供履约保证金或银行保函</div>
                      <div>• 持续监控: 设置季度财务审查和舆情监控机制</div>
                      <div>• 预警机制: 建立异常情况自动预警通知</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 03: Equipment Alert Results */}
            {scenario.id === 'scenario-03' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  设备预警详情 / Equipment Alert Details
                </h3>

                {/* Real-time Data Charts */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">实时监控数据趋势</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* 温度趋势图 */}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>温度 (°C)</span>
                        <span className="text-red-400 font-semibold">↑ +12°C 异常</span>
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
                        <div className="absolute bottom-1 left-2 text-sm text-muted-foreground">基线:76°C</div>
                      </div>
                    </div>

                    {/* 振动趋势图 */}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>振动频率 (Hz)</span>
                        <span className="text-red-400 font-semibold">↑ +38% 异常</span>
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
                        <div className="absolute bottom-1 left-2 text-sm text-muted-foreground">基线:4.2Hz</div>
                      </div>
                    </div>

                    {/* 噪音趋势图 */}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>噪音 (dB)</span>
                        <span className="text-yellow-400 font-semibold">↑ +15dB 异常</span>
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
                        <div className="absolute bottom-1 left-2 text-sm text-muted-foreground">基线:70dB</div>
                      </div>
                    </div>

                    {/* 能耗趋势图 */}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>功率 (kW)</span>
                        <span className="text-yellow-400 font-semibold">↑ +25% 波动</span>
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
                        <div className="absolute bottom-1 left-2 text-sm text-muted-foreground">基线:12.5kW</div>
                      </div>
                    </div>
                  </div>

                  {/* 趋势说明 */}
                  <div className="mt-3 text-sm text-muted-foreground bg-black/20 rounded p-2">
                    <div className="font-semibold text-yellow-400 mb-1">⚠️ 异常趋势分析:</div>
                    <div className="space-y-1">
                      <div>• <span className="text-red-400">温度持续升高</span> - 从76°C升至88°C，表明轴承摩擦加剧</div>
                      <div>• <span className="text-orange-400">振动剧烈波动</span> - 频率从4.2Hz激增至5.8Hz，疑似轴承磨损</div>
                      <div>• <span className="text-yellow-400">噪音显著增大</span> - 从70dB升至85dB，出现高频异响</div>
                      <div>• <span className="text-blue-400">功率不稳定</span> - 波动范围扩大25%，能耗异常</div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 font-semibold">⚠️ 紧急预警: 3号注塑机</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 rounded p-3">
                        <div className="text-red-400 font-semibold mb-1">🔧 异常定位</div>
                        <div className="text-sm text-muted-foreground">
                          • 异常部件: 主轴承系统<br/>
                          • 故障类型: 轴承磨损<br/>
                          • 影响范围: 核心动力<br/>
                          • 紧急程度: 高
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-3">
                        <div className="text-yellow-400 font-semibold mb-1">📊 故障预测</div>
                        <div className="text-sm text-muted-foreground">
                          • 故障概率: 85%<br/>
                          • 预测时间: 48小时内<br/>
                          • 剩余寿命: ~120小时<br/>
                          • 置信度: 92%
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 rounded p-3">
                      <div className="text-base text-green-400 font-semibold mb-1">✅ 处理建议</div>
                      <div className="text-sm text-muted-foreground">
                        • 建议: 立即停机检修，更换主轴承组件<br/>
                        • 维护工单: 已生成 #WO-2024-0315<br/>
                        • 预计停机时间: 4-6小时<br/>
                        • 备件准备: 轴承SKF-6309 × 2 (库存充足)
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
                  投诉分析详情 / Complaint Analysis Details
                </h3>

                {/* 投诉概览 */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-purple-400 font-semibold">投诉类型: 产品质量问题</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        紧急度: <span className="text-red-400 font-semibold">高</span> |
                        优先级: <span className="text-red-400 font-semibold">P0</span> |
                        响应时限: <span className="text-orange-400">2小时内</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-400">73%</div>
                      <div className="text-sm text-muted-foreground">客户流失风险</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 情感分析 */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      😠 情感分析
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex justify-between">
                        <span>情绪状态:</span>
                        <span className="text-red-400 font-semibold">愤怒/失望</span>
                      </div>
                      <div className="flex justify-between">
                        <span>情绪强度:</span>
                        <span className="text-orange-400">8.5/10</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div>投诉语气: <span className="text-red-400">强烈不满</span></div>
                      <div>流失风险: <span className="text-red-400 font-semibold">73% (高)</span></div>
                      <div className="pt-1 border-t border-border/30">
                        关键词: 失望、欺骗、再也不买
                      </div>
                    </div>
                  </div>

                  {/* 根因分析 */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      🔍 根因分析
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-red-400 font-semibold">主因 (权重60%):</div>
                        <div className="ml-2">产品包装破损 - 质检环节漏检</div>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-orange-400 font-semibold">次因 (权重30%):</div>
                        <div className="ml-2">物流时效延迟 - 未选优质物流</div>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-yellow-400 font-semibold">附加因素:</div>
                        <div className="ml-2">客服响应慢，未及时安抚</div>
                      </div>
                      <div className="pt-1 border-t border-border/30">
                        责任方: 质检部门 + 物流供应商
                      </div>
                    </div>
                  </div>

                  {/* 历史关联 */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      📊 历史关联分析
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• 相似投诉: <span className="text-orange-400">12起</span> (近3个月)</div>
                      <div>• 共性问题: 物流破损 + 延迟</div>
                      <div>• 问题物流商: XX快递 (8起)</div>
                      <div>• 问题商品: SKU-A123 (10起)</div>
                      <div>• 系统性问题: ✓ 已识别</div>
                      <div className="pt-1 border-t border-border/30 text-yellow-400">
                        ⚠️ 需启动流程改进方案
                      </div>
                    </div>
                  </div>

                  {/* 解决方案 - 仅在无决策时显示，决策后显示在decisionOutcome中 */}
                  {!result.decisionOutcome && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-green-400 font-semibold mb-2 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        💡 个性化解决方案
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="bg-green-500/10 rounded p-2">
                          <div className="text-green-400 font-semibold mb-1">即时方案:</div>
                          <div className="ml-2 space-y-0.5">
                            <div>• 立即换货 (同城2小时达)</div>
                            <div>• 赠送¥200代金券</div>
                            <div>• 专人上门取旧送新</div>
                          </div>
                        </div>
                        <div className="bg-blue-500/10 rounded p-2">
                          <div className="text-blue-400 font-semibold mb-1">补偿升级:</div>
                          <div className="ml-2 space-y-0.5">
                            <div>• 升级VIP会员 (1年)</div>
                            <div>• 专属客服对接</div>
                            <div>• 未来订单包邮特权</div>
                          </div>
                        </div>
                        <div className="text-sm text-green-400 pt-1">
                          预计挽回成功率: 82%
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 后续行动 */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="text-base font-semibold text-primary mb-2">📋 后续行动计划</div>
                  <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                    <div>• 更换物流供应商评估 (7天内)</div>
                    <div>• 质检流程优化方案 (3天内)</div>
                    <div>• 相似案例客户回访</div>
                    <div>• 预警机制建立</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 05: Marketing Compliance Results */}
            {scenario.id === 'scenario-05' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  合规审核详情 / Compliance Review Details
                </h3>

                {/* 合规评分 */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base text-muted-foreground mb-1">合规综合评分</div>
                      <div className="text-4xl font-bold text-yellow-400">68/100</div>
                      <div className="text-sm text-yellow-400 mt-1">需要修改 (中风险)</div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground space-y-1">
                      <div>广告法: <span className="text-red-400">60分 ✗</span></div>
                      <div>隐私合规: <span className="text-yellow-400">70分 ⚠️</span></div>
                      <div>品牌调性: <span className="text-green-400">85分 ✓</span></div>
                      <div>虚假宣传: <span className="text-green-400">90分 ✓</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 广告法违规 */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      ⚠️ 广告法违规 (5处)
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-red-400 font-semibold mb-1">绝对化用词 (2处):</div>
                        <div className="ml-2 space-y-1">
                          <div>• "行业<span className="text-red-400">最佳</span>解决方案" → "优质"</div>
                          <div>• "市场<span className="text-red-400">第一</span>品牌" → "领先"</div>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-orange-400 font-semibold mb-1">夸大宣传 (2处):</div>
                        <div className="ml-2 space-y-1">
                          <div>• "<span className="text-orange-400">100%有效</span>" → "显著效果"</div>
                          <div>• "<span className="text-orange-400">绝无仅有</span>" → "独特"</div>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-yellow-400 font-semibold mb-1">未经证实声明 (1处):</div>
                        <div className="ml-2">• "获权威机构认证" (需提供证明)</div>
                      </div>
                    </div>
                  </div>

                  {/* 隐私合规 */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      🔒 隐私合规风险 (1处)
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="bg-black/20 rounded p-2">
                        <div className="text-yellow-400 font-semibold mb-1">问题:</div>
                        <div className="ml-2">使用客户真实案例和数据，未标注授权说明</div>
                      </div>
                      <div className="bg-green-500/10 rounded p-2">
                        <div className="text-green-400 font-semibold mb-1">修改建议:</div>
                        <div className="ml-2 space-y-1">
                          <div>• 添加"已获客户授权使用"声明</div>
                          <div>• 敏感数据脱敏处理</div>
                          <div>• 补充隐私政策链接</div>
                        </div>
                      </div>
                      <div className="text-yellow-400 pt-1">
                        风险等级: 中 (整改优先级: P1)
                      </div>
                    </div>
                  </div>

                  {/* 对比广告 */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      ✅ 对比广告审查 (通过)
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• 未贬低竞品: ✓ 合规</div>
                      <div>• 未使用竞品商标: ✓ 合规</div>
                      <div>• 对比数据真实: ✓ 有依据</div>
                      <div>• 对比维度合理: ✓ 客观</div>
                      <div className="pt-1 border-t border-border/30 text-green-400">
                        该部分无违规问题
                      </div>
                    </div>
                  </div>

                  {/* 品牌调性 */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-blue-400 font-semibold mb-2 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      🎨 品牌调性评估 (良好)
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• 语言风格: 专业、友好</div>
                      <div>• 品牌定位: 清晰一致</div>
                      <div>• 视觉元素: 符合规范</div>
                      <div>• 目标受众: 匹配度高</div>
                      <div className="pt-1 border-t border-border/30">
                        <div className="text-blue-400">建议:</div>
                        <div className="ml-2">保持现有风格，微调绝对化表述</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 修改清单 */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="text-base font-semibold text-primary mb-2">📋 修改清单 (7项)</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>"最佳" → "优质" (2处)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>"第一" → "领先" (1处)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>"100%有效" → "显著效果" (1处)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>"绝无仅有" → "独特" (1处)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>补充认证证明材料 (1处)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>添加授权使用声明 (1处)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="w-3 h-3" />
                      <span>补充隐私政策链接</span>
                    </div>
                    <div className="pt-2 text-yellow-400">
                      ⏱️ 预计修改时间: 30分钟 | 修改后需重新审核
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 06: Financial Anomaly Detection Results */}
            {scenario.id === 'scenario-06' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  异常交易详情 / Anomaly Transaction Details
                </h3>

                {/* High Risk Transactions */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-semibold">发现12笔可疑交易 (风险等级: 高)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-red-400 font-semibold mb-1">💰 异常金额 (2笔)</div>
                      <div className="text-sm text-muted-foreground">
                        • 交易A: ¥125万 (超限额3倍)<br/>
                        • 交易B: ¥98万 (超限额2.4倍)<br/>
                        • 总计: ¥223万
                      </div>
                    </div>
                    <div className="bg-black/20 rounded p-3">
                      <div className="text-yellow-400 font-semibold mb-1">🔄 频繁小额 (5笔)</div>
                      <div className="text-sm text-muted-foreground">
                        • 24小时内5笔相同金额<br/>
                        • 单笔: ¥9,999<br/>
                        • 总计: ¥5万
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 rounded p-3 mt-3">
                    <div className="text-base text-orange-400 font-semibold mb-1">⚠️ 重复支付 (3笔)</div>
                    <div className="text-sm text-muted-foreground">
                      • 相同收款方，相同金额，10分钟内重复支付<br/>
                      • 单笔: ¥22万 × 3 = ¥66万<br/>
                      • 疑似系统故障或操作失误
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <div className="text-base font-semibold text-primary mb-2">综合评估</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• 异常交易总额: <span className="text-red-400 font-semibold">¥285万</span></div>
                    <div>• 风险等级: <span className="text-red-400 font-semibold">高</span></div>
                    <div>• 建议: <span className="text-yellow-400">立即启动审计流程，冻结相关账户</span></div>
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
                  页面内容 / Pages
                </div>
              </div>
              <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                <div className="text-2xl font-bold text-accent">
                  {result.metrics.charts}
                </div>
                <div className="text-sm text-muted-foreground">
                  数据图表 / Charts
                </div>
              </div>
              <div className="bg-tech-blue/5 rounded-xl p-4 border border-tech-blue/10">
                <div className="text-2xl font-bold text-tech-blue">
                  {result.metrics.insights}
                </div>
                <div className="text-sm text-muted-foreground">
                  深度洞察 / Insights
                </div>
              </div>
              <div className="bg-tech-green/5 rounded-xl p-4 border border-tech-green/10">
                <div className="text-2xl font-bold text-tech-green">
                  {result.metrics.recommendations}
                </div>
                <div className="text-sm text-muted-foreground">
                  建议方案 / Recommendations
                </div>
              </div>
            </div>

            {/* Preview Tags */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground mb-3">
                报告包含内容 / Report Contents:
              </div>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag: string, index: number) => (
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
              价值展示
            </h2>
            <p className="text-lg text-muted-foreground">
              ROI & Value Demonstration
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
                    时间节省
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Time Saving
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
                {result.roi.time.desc}
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
                    效率提升
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Efficiency Boost
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
                {result.roi.efficiency.desc}
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
                    风险识别
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Risk Detection
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
                {result.roi.risk.desc}
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
              查看完整成果
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              View complete results & download
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
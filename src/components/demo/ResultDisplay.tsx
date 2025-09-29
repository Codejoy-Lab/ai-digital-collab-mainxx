import { Button } from '@/components/ui/button';
import { SelectedTask } from '@/pages/AIDemoPage';
import { TrendingUp, Clock, Shield, CheckCircle, ArrowRight, FileText, BarChart } from 'lucide-react';

interface ResultDisplayProps {
  task: SelectedTask | null;
  onContinue: () => void;
}

export const ResultDisplay = ({ task, onContinue }: ResultDisplayProps) => {
  // Handle null task gracefully
  if (!task) {
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
    // 根据不同的任务返回不同的内容
    const contentMap: Record<string, any> = {
      'task-01': {
        title: '算法工程师招聘方案',
        titleEn: 'AI Engineer Recruitment Plan',
        summary: 'AI团队完成了全方位的招聘评估，从职位需求分析到候选人技术测评，生成了详尽的招聘决策报告，包含人才画像、面试评估和薪酬建议。',
        summaryEn: 'Complete recruitment assessment from job analysis to technical evaluation with talent profiling and compensation recommendations.',
        metrics: {
          pages: 28,
          charts: 12,
          insights: 15,
          recommendations: 8
        },
        tags: ['候选人画像', '技术评估', '面试记录', '薪酬分析', '背景调查', '入职方案'],
        roi: {
          time: { value: '-85%', desc: '招聘周期 30天 → 4.5天' },
          efficiency: { value: '+65%', desc: '候选人匹配度提升' },
          risk: { value: '+45%', desc: '人才风险识别能力' }
        }
      },
      'task-02': {
        title: '产品需求文档PRD',
        titleEn: 'Product Requirements Document',
        summary: '基于深度用户调研和市场分析，AI团队生成了完整的产品需求文档，包含用户故事、功能规格、技术架构和验收标准。',
        summaryEn: 'Complete PRD based on user research and market analysis with user stories, specifications, and acceptance criteria.',
        metrics: {
          pages: 35,
          charts: 15,
          insights: 18,
          recommendations: 10
        },
        tags: ['用户调研', '竞品分析', '功能规格', '技术架构', '交互设计', '验收标准'],
        roi: {
          time: { value: '-88%', desc: 'PRD编写 5天 → 30分钟' },
          efficiency: { value: '+75%', desc: '需求完整度提升' },
          risk: { value: '+55%', desc: '需求风险识别率' }
        }
      },
      'task-03': {
        title: 'Google广告投放方案',
        titleEn: 'Google Ads Campaign Strategy',
        summary: 'AI营销团队完成了全面的广告策略制定，包含关键词研究、创意设计、投放策略和ROI预测，确保广告效果最大化。',
        summaryEn: 'Complete advertising strategy with keyword research, creative design, campaign tactics and ROI prediction.',
        metrics: {
          pages: 22,
          charts: 18,
          insights: 20,
          recommendations: 12
        },
        tags: ['关键词分析', '创意方案', '投放策略', 'ROI预测', '竞价策略', '转化优化'],
        roi: {
          time: { value: '-92%', desc: '策划周期 3天 → 20分钟' },
          efficiency: { value: '+80%', desc: '广告转化率预期提升' },
          risk: { value: '+60%', desc: '预算浪费风险降低' }
        }
      },
      'task-04': {
        title: 'Bug修复与版本发布报告',
        titleEn: 'Bug Fix & Release Report',
        summary: 'AI技术团队完成了全面的Bug分析与修复，包含根因分析、代码修复、测试验证和版本发布计划，确保系统稳定性。',
        summaryEn: 'Complete bug analysis and fix with root cause analysis, code patches, test verification and release planning.',
        metrics: {
          pages: 18,
          charts: 10,
          insights: 14,
          recommendations: 6
        },
        tags: ['Bug分析', '根因定位', '修复方案', '测试报告', '发布计划', '监控方案'],
        roi: {
          time: { value: '-75%', desc: 'Bug修复 2天 → 12小时' },
          efficiency: { value: '+85%', desc: '问题定位准确率' },
          risk: { value: '+70%', desc: '回归问题发现率' }
        }
      },
      'task-05': {
        title: '商务合同文本',
        titleEn: 'Business Contract Document',
        summary: 'AI法务团队起草了完整的商务合同，涵盖所有关键条款、风险控制措施和合规性要求，确保双方权益得到充分保护。',
        summaryEn: 'Complete business contract with key terms, risk controls and compliance requirements to protect all parties.',
        metrics: {
          pages: 25,
          charts: 5,
          insights: 12,
          recommendations: 8
        },
        tags: ['合同条款', '风险控制', '法律审查', '财务条款', '争议解决', '合规检查'],
        roi: {
          time: { value: '-90%', desc: '起草时间 3天 → 15分钟' },
          efficiency: { value: '+95%', desc: '条款完整性提升' },
          risk: { value: '+85%', desc: '法律风险识别率' }
        }
      },
      'task-06': {
        title: '合同审查分析报告',
        titleEn: 'Contract Review Analysis',
        summary: 'AI法务团队完成了全面的合同审查，识别了所有潜在风险点，提供了详细的修改建议和风险控制方案。',
        summaryEn: 'Comprehensive contract review identifying all risks with detailed modification suggestions and risk control solutions.',
        metrics: {
          pages: 30,
          charts: 8,
          insights: 25,
          recommendations: 15
        },
        tags: ['风险识别', '条款分析', '合规审查', '财务影响', '修改建议', '执行方案'],
        roi: {
          time: { value: '-95%', desc: '审查时间 5天 → 10分钟' },
          efficiency: { value: '+90%', desc: '风险识别准确率' },
          risk: { value: '+80%', desc: '合规问题发现率' }
        }
      }
    };

    const defaultContent = {
      title: `${task.title}完成报告`,
      titleEn: `${task.titleEn} Report`,
      summary: '基于 AI 数字员工团队协作，我们为您生成了高质量的分析报告，包含深度洞察和实用建议。',
      summaryEn: 'Based on AI digital workforce collaboration, we have generated a high-quality analysis report with deep insights and practical recommendations.',
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

    return contentMap[task.id] || defaultContent;
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
                AI 数字员工团队已完成任务
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
            {/* Task 01: AI Engineer Recruitment Results */}
            {task.id === 'task-01' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  招聘执行结果 / Recruitment Results
                </h3>

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-primary font-semibold">候选人推荐结果</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-black/20 rounded p-3">
                        <div className="text-green-400 font-semibold mb-1">✅ 已发布职位</div>
                        <div className="text-xs text-muted-foreground">
                          • 发布平台: LinkedIn、Boss直聘、拉勾网<br/>
                          • 覆盖人数: 50,000+<br/>
                          • 24小时内收到简历: 186份
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-3">
                        <div className="text-blue-400 font-semibold mb-1">📊 筛选结果</div>
                        <div className="text-xs text-muted-foreground">
                          • 初筛通过: 42人<br/>
                          • 技术面试通过: 12人<br/>
                          • 终面候选: 5人
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 rounded p-3">
                      <div className="text-sm text-green-400 font-semibold mb-1">🎯 推荐候选人TOP 3</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>1. 张XX - 前百度高级算法工程师，5年经验，匹配度95%</div>
                        <div>2. 李XX - 前阿里AI专家，8年经验，匹配度92%</div>
                        <div>3. 王XX - 前字节跳动算法负责人，6年经验，匹配度90%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task 02: Product Requirements Document Results */}
            {task.id === 'task-02' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  PRD文档成果 / PRD Document Results
                </h3>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-purple-400 font-semibold">产品需求文档已生成</span>
                    </div>

                    <div className="bg-black/20 rounded p-3 text-sm">
                      <div className="text-purple-400 font-semibold mb-2">📄 文档概览</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• 文档页数: 45页</div>
                        <div>• 功能模块: 12个</div>
                        <div>• 用户故事: 38个</div>
                        <div>• 原型设计: 25个界面</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 rounded p-2 text-xs">
                        <div className="text-blue-400 font-semibold mb-1">核心功能</div>
                        <div className="text-muted-foreground">
                          • 用户认证系统<br/>
                          • 数据分析仪表板<br/>
                          • AI智能推荐<br/>
                          • 实时协作功能
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-2 text-xs">
                        <div className="text-green-400 font-semibold mb-1">技术评估</div>
                        <div className="text-muted-foreground">
                          • 开发周期: 3个月<br/>
                          • 所需人力: 8人<br/>
                          • 技术栈: React+Node<br/>
                          • 预算评估: 120万
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task 03: Google Ads Campaign Results */}
            {task.id === 'task-03' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  广告投放成果 / Campaign Results
                </h3>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold">广告已成功投放</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 rounded p-3">
                        <div className="text-green-400 font-semibold mb-1">🚀 投放平台</div>
                        <div className="text-xs text-muted-foreground">
                          • Google Ads: 搜索+展示网络<br/>
                          • Facebook Ads: 信息流广告<br/>
                          • LinkedIn: B2B精准投放<br/>
                          • YouTube: 视频广告
                        </div>
                      </div>
                      <div className="bg-black/20 rounded p-3">
                        <div className="text-blue-400 font-semibold mb-1">📈 首日数据</div>
                        <div className="text-xs text-muted-foreground">
                          • 曝光量: 125,000次<br/>
                          • 点击量: 3,750次<br/>
                          • CTR: 3.0%<br/>
                          • 转化数: 45个
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/10 rounded p-3">
                      <div className="text-sm text-primary font-semibold mb-1">💡 关键词策略</div>
                      <div className="text-xs text-muted-foreground">
                        • 核心词: AI解决方案、数字化转型、智能办公（CPC: ¥15-25）<br/>
                        • 长尾词: 企业AI数字员工、智能协作平台、AI流程自动化（CPC: ¥8-15）<br/>
                        • 预计ROI: 投入1元预计产出3.5元
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task 04: Bug Fix Results */}
            {task.id === 'task-04' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Bug修复成果 / Bug Fix Results
                </h3>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-400 font-semibold">问题已修复并发布</span>
                    </div>

                    <div className="bg-black/20 rounded p-3">
                      <div className="text-blue-400 font-semibold mb-2">🐛 修复详情</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• 严重Bug: 3个（内存泄漏、数据同步、权限漏洞）</div>
                        <div>• 一般Bug: 8个（UI显示、性能优化、兼容性）</div>
                        <div>• 优化项: 5个（代码重构、性能提升）</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-500/10 rounded p-2">
                        <div className="text-green-400 text-xs font-semibold mb-1">✅ 版本发布</div>
                        <div className="text-xs text-muted-foreground">
                          • 版本号: v2.3.1<br/>
                          • 发布时间: 2024-01-15 18:30<br/>
                          • 影响用户: 0（灰度发布）
                        </div>
                      </div>
                      <div className="bg-yellow-500/10 rounded p-2">
                        <div className="text-yellow-400 text-xs font-semibold mb-1">📊 测试覆盖</div>
                        <div className="text-xs text-muted-foreground">
                          • 单元测试: 98%<br/>
                          • 集成测试: 通过<br/>
                          • 回归测试: 无问题
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task 05: Contract Draft Results */}
            {task.id === 'task-05' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  合同起草成果 / Contract Draft Results
                </h3>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-orange-400 font-semibold">合同文本已完成</span>
                    </div>

                    <div className="bg-black/20 rounded p-3">
                      <div className="text-orange-400 font-semibold mb-2">📜 合同概要</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>• 合同类型: 技术服务合同</div>
                        <div>• 合同金额: ¥500,000</div>
                        <div>• 服务期限: 12个月</div>
                        <div>• 条款数量: 28条</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-green-500/10 rounded p-2">
                        <div className="text-green-400 font-semibold mb-1">✅ 已包含条款</div>
                        <div className="text-muted-foreground">
                          • 服务范围与交付<br/>
                          • 付款方式与进度<br/>
                          • 知识产权归属<br/>
                          • 保密与竞业限制
                        </div>
                      </div>
                      <div className="bg-blue-500/10 rounded p-2">
                        <div className="text-blue-400 font-semibold mb-1">🛡️ 风险保护</div>
                        <div className="text-muted-foreground">
                          • 违约责任明确<br/>
                          • 争议解决机制<br/>
                          • 不可抗力条款<br/>
                          • 终止与解除条件
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task 06: Contract Risk Analysis - Existing */}
            {task.id === 'task-06' && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  合同风险分析结果 / Risk Analysis Results
                </h3>

                {/* High Risk */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 font-semibold">高风险 / High Risk (3项)</span>
                  </div>

                  <div className="space-y-3">
                    {/* Risk 1 */}
                    <div className="space-y-2">
                      <div className="text-sm text-red-400 font-medium">1. 违约责任条款不对等</div>
                      <div className="bg-black/20 rounded p-2 text-xs text-muted-foreground">
                        <span className="text-yellow-400">原文：</span>"乙方如违反本合同任何条款，应支付合同总额50%的违约金。甲方违约责任以实际损失为限。"
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-xs text-green-400">
                        <span className="font-medium">修改建议：</span>"双方如违反本合同约定，应支付合同总额20%的违约金，最高不超过实际损失的1.5倍。"
                      </div>
                    </div>

                    {/* Risk 2 */}
                    <div className="space-y-2">
                      <div className="text-sm text-red-400 font-medium">2. 知识产权归属条款</div>
                      <div className="bg-black/20 rounded p-2 text-xs text-muted-foreground">
                        <span className="text-yellow-400">原文：</span>"项目过程中产生的所有知识产权，包括但不限于技术方案、源代码、文档等，均归甲方所有。"
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-xs text-green-400">
                        <span className="font-medium">修改建议：</span>"项目交付成果的知识产权归甲方所有，乙方保留其原有技术和通用技术组件的知识产权。"
                      </div>
                    </div>

                    {/* Risk 3 */}
                    <div className="space-y-2">
                      <div className="text-sm text-red-400 font-medium">3. 付款条件</div>
                      <div className="bg-black/20 rounded p-2 text-xs text-muted-foreground">
                        <span className="text-yellow-400">原文：</span>"合同签订后乙方开始工作，项目完成并通过验收后180天内支付全部款项。"
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-xs text-green-400">
                        <span className="font-medium">修改建议：</span>"合同签订后支付30%预付款，项目中期支付30%，验收后30天内支付剩余40%。"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medium Risk */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-400 font-semibold">中风险 / Medium Risk (2项)</span>
                  </div>

                  <div className="space-y-3">
                    {/* Medium Risk 1 */}
                    <div className="space-y-2">
                      <div className="text-sm text-yellow-400 font-medium">1. 履约保证金条款</div>
                      <div className="bg-black/20 rounded p-2 text-xs text-muted-foreground">
                        <span className="text-yellow-400">原文：</span>"乙方应在合同签订后5日内支付合同总额30%作为履约保证金。"
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-xs text-green-400">
                        <span className="font-medium">修改建议：</span>"乙方应在收到预付款后5日内支付合同总额10%作为履约保证金。"
                      </div>
                    </div>

                    {/* Medium Risk 2 */}
                    <div className="space-y-2">
                      <div className="text-sm text-yellow-400 font-medium">2. 验收标准条款</div>
                      <div className="bg-black/20 rounded p-2 text-xs text-muted-foreground">
                        <span className="text-yellow-400">原文：</span>"项目交付物应满足甲方要求，具体以甲方验收为准。"
                      </div>
                      <div className="bg-green-500/10 rounded p-2 text-xs text-green-400">
                        <span className="font-medium">修改建议：</span>"项目交付物应满足合同附件一所列技术规格和验收标准，验收期限为15个工作日。"
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground italic mt-2">
                      * 另有3项中风险条款涉及保密期限、争议解决、不可抗力等...
                    </div>
                  </div>
                </div>

                {/* Low Risk */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 font-semibold">低风险 / Low Risk (8项)</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• 合同主体资质完备，信用状况良好</li>
                    <li>• 交付时间安排合理，有充足缓冲期</li>
                    <li>• 技术规格说明清晰完整</li>
                    <li>• 售后服务条款标准合理</li>
                  </ul>
                </div>

                {/* Summary */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-semibold text-primary mb-2">
                    综合评估 / Overall Assessment
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    本合同存在 <span className="text-red-400 font-semibold">3项高风险</span> 和 <span className="text-yellow-400 font-semibold">5项中风险</span> 条款，
                    建议在签署前重点协商修改高风险条款，特别是违约责任和知识产权相关条款。
                    整体风险等级：<span className="text-yellow-400 font-semibold">中高风险</span>，需谨慎处理。
                  </p>
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
                     style={{ width: result.roi.time.value.replace('-', '').replace('+', '') }} />
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
                     style={{ width: result.roi.efficiency.value.replace('-', '').replace('+', '') }} />
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
                     style={{ width: result.roi.risk.value.replace('-', '').replace('+', '') }} />
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
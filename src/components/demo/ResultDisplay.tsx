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
            
            <h1 className="text-4xl font-bold text-gradient mb-4">
              成果展示
            </h1>
            <p className="text-xl text-muted-foreground">
              Task completed by AI digital workforce
            </p>
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
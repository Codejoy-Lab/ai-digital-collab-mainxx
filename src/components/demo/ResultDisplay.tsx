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
    const baseContent = {
      title: `${task.title}完成报告`,
      titleEn: `${task.titleEn} Report`,
      summary: '基于 AI 数字员工团队协作，我们为您生成了高质量的分析报告，包含深度洞察和实用建议。',
      summaryEn: 'Based on AI digital workforce collaboration, we have generated a high-quality analysis report with deep insights and practical recommendations.',
      metrics: {
        pages: Math.floor(Math.random() * 20) + 15,
        charts: Math.floor(Math.random() * 10) + 8,
        insights: Math.floor(Math.random() * 15) + 12,
        recommendations: Math.floor(Math.random() * 8) + 5
      }
    };

    return baseContent;
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
                {['执行摘要', '数据分析', '可视化图表', '关键洞察', '行动建议', '风险评估'].map((tag, index) => (
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
                -90%
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-accent to-accent/60 h-2 rounded-full w-[90%]" />
              </div>
              <p className="text-sm text-muted-foreground">
                人工 3 天 → AI 协作 15 分钟 / Manual 3 days → AI 15 minutes
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
                +70%
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full w-[70%]" />
              </div>
              <p className="text-sm text-muted-foreground">
                多维度分析与智能洞察 / Multi-dimensional analysis & insights
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
                +40%
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-tech-green to-tech-green/60 h-2 rounded-full w-[40%]" />
              </div>
              <p className="text-sm text-muted-foreground">
                AI 智能风险预警与建议 / AI intelligent risk warning & suggestions
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
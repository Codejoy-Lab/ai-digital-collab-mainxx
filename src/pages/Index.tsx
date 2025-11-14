import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Brain, ArrowRight, Sparkles, Zap, FileText, Network } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl floating-animation" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-tech-blue/10 blur-3xl floating-animation" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-1/3 w-36 h-36 rounded-full bg-tech-green/10 blur-3xl floating-animation" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Sparkles className="w-16 h-16 text-primary animate-pulse" />
            <Brain className="w-16 h-16 text-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Users className="w-16 h-16 text-tech-blue animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <h1 className="text-6xl font-bold text-gradient leading-tight mb-4">
            AI 数字协作平台
          </h1>
          <h2 className="text-4xl font-semibold text-muted-foreground mb-6">
            AI Digital Collaboration Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            探索 AI 驱动的智能协作，体验未来工作方式
          </p>
          <p className="text-lg text-muted-foreground/80 max-w-3xl mx-auto mt-2">
            Explore AI-driven intelligent collaboration and experience the future of work
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Multi-Agent Collaboration */}
          <div
            className="group cursor-pointer transition-all duration-500 hover:scale-105"
            onClick={() => navigate('/demo')}
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-background to-primary/5 p-8 h-full backdrop-blur-sm hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary)/0.3)] transition-all duration-500">
              {/* Icon */}
              <div className="mb-6 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-foreground mb-3 text-center">
                多 Agent 协同工作
              </h3>
              <p className="text-xl text-primary/80 mb-6 text-center font-medium">
                Multi-Agent Collaboration
              </p>

              {/* Description */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">智能任务分配：</span>
                    AI 自动编排，跨部门协作无缝衔接
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">实时执行：</span>
                    80+ 数字员工并行处理，效率倍增
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-tech-blue mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">可视化流程：</span>
                    实时查看任务进度，协作过程透明化
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full text-lg py-6 group-hover:scale-105 transition-transform duration-300"
                size="lg"
              >
                <span>开始体验</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Executive Assistant */}
          <div
            className="group cursor-pointer transition-all duration-500 hover:scale-105"
            onClick={() => navigate('/executive-assistant')}
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-background to-accent/5 p-8 h-full backdrop-blur-sm hover:border-accent/50 hover:shadow-[0_0_30px_rgba(var(--accent)/0.3)] transition-all duration-500">
              {/* Icon */}
              <div className="mb-6 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-tech-green flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-foreground mb-3 text-center">
                决策助手 Agent
              </h3>
              <p className="text-xl text-accent/80 mb-6 text-center font-medium">
                Executive AI Assistant
              </p>

              {/* Description */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">会前准备：</span>
                    智能汇总 8+ 数据源，深度分析会议背景
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-tech-green mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">实时助手：</span>
                    会议中实时分析，捕捉关键决策时刻
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">智能总结：</span>
                    自动生成会议报告，提炼核心要点
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full text-lg py-6 bg-accent hover:bg-accent/90 group-hover:scale-105 transition-transform duration-300"
                size="lg"
              >
                <span>立即体验</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Merck AI Hub */}
          <div
            className="group cursor-pointer transition-all duration-500 hover:scale-105"
            onClick={() => navigate('/merck-ai-hub')}
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-border/50 bg-gradient-to-br from-background to-tech-blue/5 p-8 h-full backdrop-blur-sm hover:border-tech-blue/50 hover:shadow-[0_0_30px_rgba(var(--tech-blue)/0.3)] transition-all duration-500">
              {/* Icon */}
              <div className="mb-6 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-tech-blue to-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Network className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-tech-green rounded-full flex items-center justify-center animate-pulse">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-foreground mb-3 text-center">
                Merck AI 能力中枢
              </h3>
              <p className="text-xl text-tech-blue/80 mb-6 text-center font-medium">
                AI Capability Hub
              </p>

              {/* Description */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-tech-blue mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">40+ AI能力：</span>
                    数据、分析、决策、执行全方位覆盖
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">10大场景：</span>
                    覆盖财务、供应链、制造、销售等领域
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-tech-green mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">智能编排：</span>
                    中央编排器统一调度，协同执行
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full text-lg py-6 bg-tech-blue hover:bg-tech-blue/90 group-hover:scale-105 transition-transform duration-300"
                size="lg"
              >
                <span>探索能力</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-muted-foreground text-sm fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p>选择一个功能开始您的 AI 协作之旅</p>
          <p className="mt-1 text-xs">Choose a feature to start your AI collaboration journey</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MerckEntryLayerProps {
  onStart: () => void;
}

export const MerckEntryLayer = ({ onStart }: MerckEntryLayerProps) => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full">
        {/* Logo Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_hsl(210_100%_50%/0.3)] animate-pulse-glow">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-breathe">
            {isEnglish ? 'Merck AI Capability Hub' : 'Merck AI 能力中枢'}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {isEnglish
              ? 'Intelligent Orchestration of 40+ AI Capabilities'
              : '智能编排 40+ AI能力，赋能业务场景'}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(210_100%_50%/0.2)]">
            <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-primary">
              {isEnglish ? 'Multi-Capability Intelligence' : '多能力协同'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? '40+ specialized AI capabilities working together seamlessly'
                : '40+专业AI能力无缝协作，解决复杂业务问题'}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-tech-green/20 hover:border-tech-green/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(125_60%_45%/0.2)]">
            <div className="w-12 h-12 mb-4 rounded-lg bg-tech-green/10 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-tech-green">
              {isEnglish ? '10 Business Scenarios' : '10大业务场景'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? 'Finance, Supply Chain, Manufacturing, Sales & Marketing'
                : '覆盖财务、供应链、制造、销售等核心领域'}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(125_60%_45%/0.2)]">
            <div className="w-12 h-12 mb-4 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-accent">
              {isEnglish ? 'Real-time Visualization' : '实时可视化'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isEnglish
                ? 'Watch AI capabilities collaborate in real-time'
                : '实时观察AI能力调度与执行全过程'}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={onStart}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_hsl(210_100%_50%/0.5)] transition-all duration-300 px-8 py-6 text-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isEnglish ? 'Enter AI Hub' : '进入能力中枢'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>

        {/* Info Text */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          {isEnglish
            ? 'Experience the future of AI-powered business automation'
            : '体验AI驱动的下一代业务自动化'}
        </p>
      </div>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { Play, Sparkles, Users, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroImage from '@/assets/ai-workforce-hero.jpg';

interface EntryLayerProps {
  onStart: () => void;
}

export const EntryLayer = ({ onStart }: EntryLayerProps) => {
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  
  const subtitles = [
    { zh: "50+ AI Agents", en: "50+ 数字员工" },
    { zh: "跨部门协作", en: "Cross-department Collaboration" },
    { zh: "任务驱动", en: "Task-driven" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % subtitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="AI Digital Workforce Visualization"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 floating-animation" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-accent/10 floating-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 rounded-full bg-tech-blue/10 floating-animation" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 rounded-full bg-tech-green/10 floating-animation" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div className="text-center space-y-8 fade-in-up relative z-10">
        {/* Main Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            <Users className="w-12 h-12 text-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Zap className="w-12 h-12 text-tech-blue animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <h1 className="text-6xl font-bold text-gradient leading-tight">
            AI 数字员工即刻体验台
          </h1>
          <h2 className="text-4xl font-semibold text-muted-foreground">
            AI Digital Workforce Hub
          </h2>
        </div>

        {/* Dynamic Subtitle */}
        <div className="h-20 flex items-center justify-center">
          <div
            key={currentSubtitle}
            className="text-2xl font-medium text-primary slide-up"
          >
            <div className="flex items-center space-x-4">
              <span className="text-foreground">{subtitles[currentSubtitle].zh}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{subtitles[currentSubtitle].en}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xl text-muted-foreground">
            体验 AI 数字员工团队的智能协作，从需求到成果的完整工作流程
          </p>
          <p className="text-lg text-muted-foreground/80">
            Experience intelligent collaboration of AI digital workforce team, from requirements to results
          </p>
        </div>

        {/* Start Button */}
        <div className="pt-8">
          <Button
            onClick={onStart}
            size="lg"
            className="px-12 py-6 text-xl font-semibold glow-effect hover:scale-105 transition-all duration-300"
          >
            <Play className="w-6 h-6 mr-3" />
            开始体验 / Start Demo
          </Button>
        </div>

        {/* Feature Icons */}
        <div className="pt-12">
          <div className="flex justify-center space-x-8 text-muted-foreground">
            <div className="flex flex-col items-center space-y-2 hover:text-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm">智能分工</span>
            </div>
            <div className="flex flex-col items-center space-y-2 hover:text-accent transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-sm">高效执行</span>
            </div>
            <div className="flex flex-col items-center space-y-2 hover:text-tech-blue transition-colors">
              <div className="w-12 h-12 rounded-full bg-tech-blue/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-sm">智能输出</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
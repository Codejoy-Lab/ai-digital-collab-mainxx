import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PreMeetingPreparation } from '@/components/demo/executive/PreMeetingPreparation';
import { LiveMeetingAssistant } from '@/components/demo/executive/LiveMeetingAssistant';
import { MeetingSummary } from '@/components/demo/executive/MeetingSummary';

type DemoScene = 'selection' | 'pre-meeting' | 'live-meeting' | 'meeting-summary';

const ExecutiveAssistantDemo = () => {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState<DemoScene>('selection');

  const renderScene = () => {
    switch (currentScene) {
      case 'selection':
        return (
          <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 flex items-center justify-center">
            <div className="container mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-12">
                <Button
                  variant="ghost"
                  className="mb-8"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                  智能决策助手
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  选择演示场景，体验 AI 如何主动支持企业决策
                </p>
              </div>

              {/* Scene Selection */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Pre-Meeting Preparation */}
                <div
                  className="group relative bg-card border-2 border-border hover:border-accent/50 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                  onClick={() => setCurrentScene('pre-meeting')}
                >
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3">会前主动准备</h2>
                    <p className="text-muted-foreground text-sm">
                      AI 主动检测日程，跨 8+ 数据源智能检索，生成会前准备报告
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5">01</span>
                      <span>日程自动检测与会议信息提取</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5">02</span>
                      <span>多数据源并行检索（CRM、邮件、财务、文档等）</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5">03</span>
                      <span>智能分析与建议生成</span>
                    </li>
                  </ul>
                  <div className="flex items-center text-accent font-medium group-hover:translate-x-2 transition-transform">
                    开始演示 →
                  </div>
                </div>

                {/* Live Meeting Assistant */}
                <div
                  className="group relative bg-card border-2 border-border hover:border-primary/50 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                  onClick={() => setCurrentScene('live-meeting')}
                >
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3">会中实时辅助</h2>
                    <p className="text-muted-foreground text-sm">
                      实时监听会议对话，即时检索企业数据，提供决策支持
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">01</span>
                      <span>实时对话转录与语义理解</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">02</span>
                      <span>关键词触发智能检索与分析</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">03</span>
                      <span>即时建议与风险提示</span>
                    </li>
                  </ul>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    开始演示 →
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="text-center mt-12 text-sm text-muted-foreground">
                💡 演示内容为模拟场景，展示 AI 决策支持能力
              </div>
            </div>
          </div>
        );

      case 'pre-meeting':
        return <PreMeetingPreparation onBack={() => setCurrentScene('selection')} onComplete={() => setCurrentScene('live-meeting')} />;

      case 'live-meeting':
        return <LiveMeetingAssistant onBack={() => setCurrentScene('selection')} onShowSummary={() => setCurrentScene('meeting-summary')} />;

      case 'meeting-summary':
        return <MeetingSummary onBack={() => setCurrentScene('live-meeting')} />;

      default:
        return null;
    }
  };

  return renderScene();
};

export default ExecutiveAssistantDemo;

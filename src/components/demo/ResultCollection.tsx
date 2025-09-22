import { Button } from '@/components/ui/button';
import { SelectedTask } from '@/pages/AIDemoPage';
import { QrCode, Download, FileText, Globe, RotateCcw, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface ResultCollectionProps {
  task: SelectedTask | null;
  onRestart: () => void;
}

export const ResultCollection = ({ task, onRestart }: ResultCollectionProps) => {
  const [qrGenerated, setQrGenerated] = useState(false);

  // Handle null task gracefully
  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Loading Results...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we prepare your results.
          </p>
        </div>
      </div>
    );
  }

  const generateQR = () => {
    setQrGenerated(true);
  };

  const getFileSize = () => {
    return (Math.random() * 5 + 2).toFixed(1) + ' MB';
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('zh-CN');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      {/* Success Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-tech-green/10 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10 text-center">
        {/* 扫描二维码标题 */}
        <div className="mb-12 fade-in-up">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            扫描二维码！
          </h1>
        </div>

        {/* 二维码区域 */}
        <div className="mb-12 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-gradient border border-border/50 rounded-2xl p-8 inline-block">
            {/* 二维码占位区域 */}
            <div className="w-64 h-64 bg-muted/20 border-2 border-dashed border-border rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-24 h-24 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-lg">二维码图片待放</p>
              </div>
            </div>
          </div>
        </div>

        {/* 开始新的体验按钮 */}
        <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={onRestart}
            size="lg"
            className="px-8 py-4 text-xl bg-primary hover:bg-primary/90 glow-effect"
          >
            <RotateCcw className="w-6 h-6 mr-3" />
            开始新的体验
          </Button>
        </div>
      </div>
    </div>
  );
};
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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Success Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="inline-flex items-center px-8 py-4 bg-accent/10 rounded-full border border-accent/20 mb-6">
            <CheckCircle className="w-6 h-6 text-accent mr-3" />
            <span className="text-xl font-medium text-accent">
              成果生成完成！
            </span>
            <span className="mx-3 text-muted-foreground">|</span>
            <span className="text-lg text-muted-foreground">
              Results Generated Successfully!
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gradient mb-4">
            获取您的专属成果
          </h1>
          <p className="text-2xl text-muted-foreground">
            Your result is ready, scan to download
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Result Summary */}
          <div className="space-y-8">
            {/* Result Card */}
            <div className="card-gradient border border-border/50 rounded-2xl p-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {task.title} - 完整版
                  </h2>
                  <p className="text-lg text-muted-foreground mb-3">
                    {task.titleEn} - Complete Version
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>任务：{task.title}</span>
                    <span>•</span>
                    <span>文件大小：{getFileSize()}</span>
                    <span>•</span>
                    <span>生成时间：{getCurrentTime()}</span>
                  </div>
                </div>
              </div>

              {/* File Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  文件内容 / File Contents
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">中文版完整报告</p>
                      <p className="text-sm text-muted-foreground">包含执行摘要、详细分析、图表、建议</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                    <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">English Version Report</p>
                      <p className="text-sm text-muted-foreground">Complete bilingual professional report</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="card-gradient border border-border/50 rounded-2xl p-6 fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                使用说明 / Instructions
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p>扫描右侧二维码或点击下载按钮获取文件</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p>文件包含中英文双语版本，可直接使用或进一步编辑</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p>建议在专业场合使用，支持打印和数字分享</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: QR Code & Download */}
          <div className="space-y-8">
            {/* QR Code Section */}
            <div className="text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-gradient border border-border/50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  扫码下载完整成果
                </h3>
                
                {!qrGenerated ? (
                  <div className="space-y-6">
                    <div className="w-48 h-48 mx-auto bg-muted/20 border-2 border-dashed border-border rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">点击生成二维码</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={generateQR}
                      size="lg"
                      className="w-full glow-effect"
                    >
                      <QrCode className="w-5 h-5 mr-2" />
                      生成下载二维码
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Mock QR Code */}
                    <div className="w-48 h-48 mx-auto bg-background border-2 border-border rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-4 bg-foreground rounded-lg opacity-80">
                        <div className="grid grid-cols-8 gap-1 p-2 h-full">
                          {Array.from({ length: 64 }, (_, i) => (
                            <div
                              key={i}
                              className={`rounded-sm ${
                                Math.random() > 0.5 ? 'bg-background' : 'bg-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-overlay" />
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-muted-foreground">
                        使用手机扫描二维码下载
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Scan with mobile device to download
                      </p>
                    </div>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-accent/50 hover:bg-accent/5"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      直接下载 / Direct Download
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Button
                onClick={onRestart}
                size="lg"
                variant="outline"
                className="w-full py-4 text-lg border-primary/50 hover:bg-primary/5"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                开始新的体验 / Start New Demo
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  感谢体验 AI 数字员工协作平台
                </p>
                <p className="text-xs text-muted-foreground">
                  Thank you for experiencing AI Digital Workforce Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
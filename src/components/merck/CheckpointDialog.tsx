import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  User,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface CheckpointDialogProps {
  open: boolean;
  checkpoint: any;
  onDecision: (decision: any) => void;
}

export const CheckpointDialog = ({ open, checkpoint, onDecision }: CheckpointDialogProps) => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  if (!checkpoint) return null;

  const handleOptionClick = (option: any) => {
    onDecision({
      optionId: option.id,
      timestamp: new Date().toISOString(),
      option: option
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/10';
      case 'warning': return 'border-orange-500/50 bg-orange-500/10';
      case 'info': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-border/50 bg-muted/10';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return { text: '严重', color: 'bg-red-500' };
      case 'warning': return { text: '警告', color: 'bg-orange-500' };
      case 'info': return { text: '正常', color: 'bg-primary' };
      default: return { text: '一般', color: 'bg-muted' };
    }
  };

  const getCheckpointIcon = () => {
    switch (checkpoint.checkpointType) {
      case 'review': return <Eye className="w-8 h-8" />;
      case 'decide': return <TrendingUp className="w-8 h-8" />;
      case 'approve': return <CheckCircle2 className="w-8 h-8" />;
      default: return <User className="w-8 h-8" />;
    }
  };

  const getCheckpointTitle = () => {
    switch (checkpoint.checkpointType) {
      case 'review': return '🔍 审核确认';
      case 'decide': return '🎯 决策选择';
      case 'approve': return '✅ 审批通过';
      default: return '⚡ 人工决策';
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-2 border-primary/30 shadow-[0_0_80px_hsl(200_100%_45%/0.3)] custom-scrollbar">
        {/* 顶部标题栏 */}
        <div className="sticky top-0 z-10 -mx-6 -mt-6 px-8 pt-6 pb-5 bg-gradient-to-r from-primary/20 via-tech-green/20 to-primary/20 backdrop-blur-md border-b border-primary/30">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-tech-green flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_hsl(200_100%_45%/0.5)]">
              {getCheckpointIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{getCheckpointTitle()}</h2>
                <Badge className="bg-primary/20 text-primary border-primary/40 backdrop-blur-sm">
                  {checkpoint.capabilityName}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-tech-green bg-clip-text text-transparent">
                {checkpoint.title}
              </h1>
              <p className="text-muted-foreground text-lg">{checkpoint.description}</p>
            </div>
          </div>
        </div>

        {/* 主体内容区 */}
        <div className="space-y-6 mt-6 mb-28">
          {/* 关键指标 */}
          {checkpoint.summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(checkpoint.summary).map(([key, value]: [string, any]) => (
                <Card key={key} className="p-6 text-center bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(200_100%_45%/0.2)] transition-all">
                  <div className="text-sm text-muted-foreground mb-2 font-medium">{key}</div>
                  <div className="text-4xl font-black bg-gradient-to-r from-primary to-tech-green bg-clip-text text-transparent">
                    {value}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* AI分析洞察 */}
          {checkpoint.aiInsights && (
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-primary/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-tech-green flex items-center justify-center shadow-[0_0_15px_hsl(200_100%_45%/0.4)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">AI智能分析</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(checkpoint.aiInsights).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-background/50 backdrop-blur-sm p-5 rounded-xl border border-primary/20">
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                      {key}
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 检测问题/异常列表 */}
          {checkpoint.anomalies && checkpoint.anomalies.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">检测到的问题</h3>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                  {checkpoint.anomalies.length} 项
                </Badge>
              </div>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {checkpoint.anomalies.slice(0, 5).map((anomaly: any, idx: number) => {
                  const badge = getSeverityBadge(anomaly.severity);
                  return (
                    <Card key={idx} className={`border-2 overflow-hidden ${getSeverityColor(anomaly.severity)} backdrop-blur-sm`}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-1.5 h-16 rounded-full ${badge.color} shadow-[0_0_10px_currentColor]`}></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-xl text-foreground">{anomaly.equipment}</span>
                                <Badge className={`${badge.color} text-white text-xs`}>{badge.text}</Badge>
                              </div>
                              {anomaly.signals && (
                                <div className="space-y-2 mt-3">
                                  {anomaly.signals.map((signal: any, sIdx: number) => (
                                    <div key={sIdx} className="flex items-center gap-4 text-sm">
                                      <span className="text-muted-foreground font-medium min-w-[100px]">{signal.type}</span>
                                      <span className="font-bold text-foreground">{signal.value}</span>
                                      {signal.status === 'abnormal' && (
                                        <span className="flex items-center gap-1 text-red-500 text-xs">
                                          <AlertTriangle className="w-3.5 h-3.5" />
                                          异常
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {anomaly.prediction && (
                            <div className="text-center ml-6 bg-background/80 backdrop-blur-sm rounded-xl p-4 border-2 border-red-500/50 shadow-[0_0_20px_hsl(0_70%_50%/0.3)]">
                              <div className="text-5xl font-black text-red-500">
                                {anomaly.prediction.failureProbability}%
                              </div>
                              <div className="text-xs text-muted-foreground font-semibold mt-2">
                                故障风险
                              </div>
                            </div>
                          )}
                        </div>
                        {anomaly.aiRecommendation && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <div className="flex items-start gap-3 bg-primary/10 p-4 rounded-lg border border-primary/20">
                              <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="font-bold text-primary">AI建议：</span>
                                <span className="text-muted-foreground ml-2">{anomaly.aiRecommendation}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* 方案对比 */}
          {checkpoint.plans && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">可选方案对比</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {checkpoint.plans.map((plan: any) => (
                  <Card
                    key={plan.id}
                    className={`overflow-hidden transition-all ${
                      plan.recommended
                        ? 'border-2 border-tech-green/60 bg-tech-green/10 shadow-[0_0_30px_hsl(125_60%_45%/0.3)]'
                        : 'border border-border/50 bg-card/30 hover:border-primary/50 hover:shadow-[0_0_15px_hsl(200_100%_45%/0.2)]'
                    } backdrop-blur-sm`}
                  >
                    {plan.recommended && (
                      <div className="bg-gradient-to-r from-tech-green to-primary px-4 py-2.5 text-center font-bold text-sm">
                        ⭐ AI推荐方案
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="font-bold text-xl text-foreground mb-3">
                        {plan.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{plan.description}</p>
                      {plan.impact && (
                        <div className="space-y-2.5 bg-background/50 backdrop-blur-sm p-4 rounded-lg border border-border/30">
                          {Object.entries(plan.impact).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground font-medium">{key}</span>
                              <span className="text-sm font-bold text-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* AI最终建议 */}
          {checkpoint.aiRecommendation && (
            <Card className="p-6 bg-gradient-to-br from-tech-green/20 via-primary/10 to-tech-green/20 backdrop-blur-sm border-2 border-tech-green/40 shadow-[0_0_30px_hsl(125_60%_45%/0.2)]">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-tech-green to-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_hsl(125_60%_45%/0.5)]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-tech-green to-primary bg-clip-text text-transparent">
                      AI综合建议
                    </h3>
                    {checkpoint.aiRecommendation.confidence && (
                      <Badge className="bg-tech-green/30 text-tech-green border-tech-green/50">
                        置信度 {checkpoint.aiRecommendation.confidence}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-base text-foreground leading-relaxed">
                    {checkpoint.aiRecommendation.reason}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* 决策按钮区 - 底部固定 */}
        <div className="sticky bottom-0 -mx-6 -mb-6 px-8 py-5 bg-background/95 backdrop-blur-xl border-t-2 border-primary/30 shadow-[0_-10px_40px_hsl(200_100%_45%/0.1)]">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">请选择您的决策：</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {checkpoint.options?.map((option: any) => (
              <Button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                size="lg"
                className={`flex-1 min-w-[200px] h-16 text-base font-bold transition-all ${
                  option.primary
                    ? 'bg-gradient-to-r from-primary to-tech-green hover:shadow-[0_0_30px_hsl(200_100%_45%/0.5)] text-white'
                    : option.risk
                    ? 'bg-card/50 text-red-500 border-2 border-red-500/50 hover:bg-red-500/10'
                    : 'bg-card/50 text-foreground border-2 border-border/50 hover:border-primary/50'
                }`}
              >
                {option.primary && <CheckCircle2 className="w-5 h-5 mr-2" />}
                {option.risk && <AlertCircle className="w-5 h-5 mr-2" />}
                <span>{option.label}</span>
                {option.primary && <span className="ml-2">→</span>}
              </Button>
            ))}
          </div>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: hsl(var(--background));
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, hsl(200 100% 45%), hsl(125 60% 45%));
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, hsl(200 100% 55%), hsl(125 60% 55%));
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

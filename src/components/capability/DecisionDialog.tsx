import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  color: 'green' | 'yellow' | 'red';
}

export interface DecisionPoint {
  id: string;
  title: string;
  description: string;
  keyInfo: Array<{ label: string; value: string; color?: string }>;
  riskDetails?: Array<{ title: string; content: string; severity: 'high' | 'medium' | 'low' }>;
  aiRecommendations?: Array<{ title: string; content: string }>;
  question: string;
  options: DecisionOption[];
}

interface DecisionDialogProps {
  open: boolean;
  decision: DecisionPoint | null;
  onDecide: (option: DecisionOption) => void;
}

export const DecisionDialog = ({ open, decision, onDecide }: DecisionDialogProps) => {
  if (!decision) return null;

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'yellow': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'red': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return 'bg-primary/20 border-primary/50 text-primary';
    }
  };

  const getIcon = (color: string) => {
    switch (color) {
      case 'green': return <CheckCircle className="w-5 h-5" />;
      case 'yellow': return <AlertCircle className="w-5 h-5" />;
      case 'red': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getButtonClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-600 hover:bg-green-700 text-white border-green-500';
      case 'yellow': return 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500';
      case 'red': return 'bg-red-600 hover:bg-red-700 text-white border-red-500';
      default: return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-2 border-primary/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient flex items-center space-x-2">
            <span>👤</span>
            <span>{decision.title}</span>
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            {decision.description}
          </DialogDescription>
        </DialogHeader>

        {/* 关键信息展示 */}
        <div className="my-6 space-y-3">
          <h3 className="text-sm font-semibold text-foreground mb-3">📊 关键信息</h3>
          <div className="grid grid-cols-2 gap-3">
            {decision.keyInfo.map((info, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${getColorClass(info.color || 'blue')}`}
              >
                <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                <div className="text-xl font-bold">{info.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 风险详情 */}
        {decision.riskDetails && decision.riskDetails.length > 0 && (
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">⚠️ 风险详情</h3>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {decision.riskDetails.map((risk, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    risk.severity === 'high'
                      ? 'bg-red-500/10 border-red-500/50'
                      : risk.severity === 'medium'
                      ? 'bg-yellow-500/10 border-yellow-500/50'
                      : 'bg-blue-500/10 border-blue-500/50'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      risk.severity === 'high'
                        ? 'bg-red-500 text-white'
                        : risk.severity === 'medium'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {risk.severity === 'high' ? '高风险' : risk.severity === 'medium' ? '中风险' : '低风险'}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-foreground mb-1">{risk.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{risk.content}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI建议方案 */}
        {decision.aiRecommendations && decision.aiRecommendations.length > 0 && (
          <div className="mb-6 space-y-3">
            <h3 className="text-base font-semibold text-foreground mb-3">💡 AI建议方案</h3>
            <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
              {decision.aiRecommendations.map((recommendation, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/50"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500 text-white flex-shrink-0">
                      AI建议
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-foreground mb-2">{recommendation.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{recommendation.content}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 决策问题 */}
        <div className="mb-6">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-primary mb-2">
              ❓ {decision.question}
            </h3>
            <p className="text-sm text-muted-foreground">
              请根据以上信息做出决策，不同选择将影响后续执行流程和结果
            </p>
          </div>
        </div>

        {/* 决策选项 */}
        <div className="space-y-2">
          {decision.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onDecide(option)}
              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${getButtonClass(option.color)} flex items-center space-x-2 text-left`}
            >
              <div className="flex-shrink-0">
                {getIcon(option.color)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-base">{option.label}</div>
                <div className="text-xs opacity-80">{option.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* 提示信息 */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          💡 此决策将被记录并影响后续流程和最终结果
        </div>
      </DialogContent>
    </Dialog>
  );
};

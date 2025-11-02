import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Mail,
  FileText,
  DollarSign,
  Newspaper,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Building2,
  MessageSquare,
  Brain,
  Bell,
  Zap,
} from 'lucide-react';

interface StepCard {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  status: 'pending' | 'thinking' | 'loading' | 'completed';
  results?: {
    type: string;
    content: string;
    highlight?: boolean;
  }[];
  thinkingText?: string;
}

type Stage = 'trigger' | 'working' | 'report';

interface PreMeetingPreparationProps {
  onBack: () => void;
  onComplete: () => void;
}

export const PreMeetingPreparation = ({ onBack, onComplete }: PreMeetingPreparationProps) => {
  const [stage, setStage] = useState<Stage>('trigger');
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isThinking, setIsThinking] = useState(false);
  const [steps, setSteps] = useState<StepCard[]>([
    {
      id: 'crm',
      title: 'CRM 客户档案查询',
      icon: Users,
      color: 'text-blue-500',
      description: '检索客户基本信息和历史记录',
      status: 'pending',
      thinkingText: '检测到客户"智云科技"，决策第一步：查询 CRM 系统了解客户背景',
      results: [
        { type: '公司概况', content: '成立5年，B轮融资，年营收2亿+' },
        { type: '交互记录', content: '找到 10 条历史交互记录', highlight: true },
        { type: '商机状态', content: '谈判中，预计成单金额 500万' },
        { type: '关键联系人', content: '李总(决策人)、王经理(使用者)' },
      ],
    },
    {
      id: 'email',
      title: '邮件系统分析',
      icon: Mail,
      color: 'text-cyan-500',
      description: '搜索历史邮件往来，了解沟通细节',
      status: 'pending',
      thinkingText: 'CRM显示有10条交互记录，决策下一步：查询邮件系统获取沟通细节',
      results: [
        { type: '历史邮件', content: '找到 23 封相关邮件（近6个月）' },
        { type: '关键主题', content: '技术讨论(8封)、商务谈判(5封)、需求确认(10封)', highlight: true },
        { type: '待办事项', content: '技术方案补充、报价调整' },
        { type: '最近沟通', content: '2周前关于价格的讨论' },
      ],
    },
    {
      id: 'finance',
      title: '财务系统检索',
      icon: DollarSign,
      color: 'text-green-500',
      description: '查询历史订单、报价和回款情况',
      status: 'pending',
      thinkingText: '邮件中多次提到价格讨论，决策下一步：查询财务数据准备价格策略',
      results: [
        { type: '历史订单', content: '8 笔订单，累计成交 180万' },
        { type: '报价记录', content: '12 次报价，平均单价 ¥420', highlight: true },
        { type: '回款情况', content: '回款及时率 98%，信用良好' },
        { type: '成本数据', content: '当前成本 ¥320/单位' },
      ],
    },
    {
      id: 'docs',
      title: '文档系统检索',
      icon: FileText,
      color: 'text-yellow-500',
      description: '查找项目文档、技术方案和产品资料',
      status: 'pending',
      thinkingText: '需要准备技术讨论材料，决策下一步：检索项目文档和技术方案',
      results: [
        { type: '项目文档', content: '5 份相关文档（POC方案、技术架构）' },
        { type: 'POC测试报告', content: '性能提升30%，准确率95%', highlight: true },
        { type: '产品手册', content: '3 份（API文档、使用指南、技术规格）' },
        { type: '定制方案', content: '2 份针对客户需求的定制化方案' },
      ],
    },
    {
      id: 'external',
      title: '外部数据获取',
      icon: Newspaper,
      color: 'text-emerald-500',
      description: '爬取客户公司动态、行业新闻和竞品信息',
      status: 'pending',
      thinkingText: '为全面了解客户现状，决策下一步：获取外部市场和企业动态',
      results: [
        { type: '最新动态', content: 'B+轮融资5000万（2周前），业务扩张', highlight: true },
        { type: '行业趋势', content: 'AI行业景气度上升，企业采购预算增加' },
        { type: '竞品价格', content: '市场均价 ¥410-550，我们有价格优势' },
        { type: '企业评价', content: '业内口碑良好，注重技术实力' },
      ],
    },
  ]);

  // 触发阶段 - 显示会议检测通知
  useEffect(() => {
    if (stage === 'trigger') {
      const timer = setTimeout(() => {
        setStage('working');
        // 先显示思考，然后启动第一步
        setIsThinking(true);
        setTimeout(() => {
          setIsThinking(false);
          executeStep(0);
        }, 2500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // 开始下一个步骤
  const startNextStep = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= steps.length) {
      // 所有步骤完成，进入报告阶段
      setTimeout(() => {
        setStage('report');
      }, 2000);
      return;
    }

    // 先显示AI思考
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      executeStep(nextIndex);
    }, 2500); // 思考2.5秒
  };

  // 执行步骤
  const executeStep = (index: number) => {
    setCurrentStepIndex(index);

    // 设置为 loading
    setSteps((prev) =>
      prev.map((step, idx) =>
        idx === index ? { ...step, status: 'loading' as const } : step
      )
    );

    // 5秒后完成
    setTimeout(() => {
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === index ? { ...step, status: 'completed' as const } : step
        )
      );

      // 1秒后开始下一步
      setTimeout(() => {
        startNextStep(index);
      }, 1000);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回场景选择
          </Button>
          <Badge variant="outline" className="px-4 py-1">
            <Sparkles className="w-3 h-3 mr-2" />
            会前主动准备
          </Badge>
        </div>

        {/* Trigger Stage - 会议检测通知 */}
        {stage === 'trigger' && (
          <div className="flex items-center justify-center min-h-[500px]">
            <Card className="w-full max-w-2xl border-2 border-primary/50 shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-pulse">
              <CardContent className="p-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Bell className="w-20 h-20 text-primary animate-bounce" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold">🔔 检测到新会议</h2>
                    <p className="text-xl text-muted-foreground">
                      日历系统发现今日 14:00 有一场重要客户会议
                    </p>
                    <div className="flex items-center justify-center gap-2 text-lg pt-4">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="text-primary font-medium">AI 助手自动启动会前准备...</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Working Stage - 步骤执行 */}
        {stage === 'working' && (
          <div className="space-y-6">
            {/* Meeting Info Card - 固定在顶部 */}
            <Card className="border-purple-500/30 bg-purple-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  会议信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">时间</div>
                    <div className="font-medium">今日 14:00-15:30</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">客户</div>
                    <div className="font-medium">智云科技</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">主题</div>
                    <div className="font-medium">年度采购洽谈</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">参会人</div>
                    <div className="font-medium">李总、王经理</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI 思考中 */}
            {isThinking && (
              <Card className="border-2 border-accent/50 bg-accent/5 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Brain className="w-6 h-6 text-accent animate-pulse flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium mb-2 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI 正在分析并决策下一步...
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentStepIndex >= 0 && currentStepIndex < steps.length - 1
                          ? steps[currentStepIndex + 1].thinkingText
                          : currentStepIndex === -1
                          ? steps[0].thinkingText
                          : '基于当前信息，AI正在自主决策下一步行动...'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 已完成和当前步骤 */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                // 只显示已开始的步骤
                if (index > currentStepIndex) return null;

                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = step.status === 'completed';
                const isLoading = step.status === 'loading';

                return (
                  <Card
                    key={step.id}
                    className={`transition-all duration-500 ${
                      isActive
                        ? 'border-2 border-primary bg-primary/5 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                        : isCompleted
                        ? 'border-green-500/30 bg-green-500/5'
                        : ''
                    } ${isActive ? 'animate-in slide-in-from-bottom-4' : ''}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-3">
                        <div className={step.color}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span>{step.title}</span>
                        <div className="ml-auto">
                          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                          {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

                      {isLoading && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-primary">正在检索数据...</span>
                          </div>
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                            ))}
                          </div>
                        </div>
                      )}

                      {isCompleted && step.results && (
                        <div className="space-y-2">
                          {step.results.map((result, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg text-sm ${
                                result.highlight
                                  ? 'bg-primary/10 border border-primary/30'
                                  : 'bg-muted/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-xs text-muted-foreground">
                                  {result.type}
                                </span>
                                {result.highlight && (
                                  <Badge variant="secondary" className="text-xs">
                                    关键信息
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-1">{result.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Report Stage - 生成报告 */}
        {stage === 'report' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
            {/* 汇总卡片 */}
            <Card className="border-2 border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  数据收集完成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">6</div>
                    <div className="text-muted-foreground mt-1">数据源</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-green-500">40+</div>
                    <div className="text-muted-foreground mt-1">关键信息</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">100%</div>
                    <div className="text-muted-foreground mt-1">数据完整度</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 会前准备报告 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-accent" />
                  会前准备报告
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Client Profile */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    客户画像
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">智云科技</span> - 成立5年，B轮融资企业，年营收2亿+
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📊 数据来源：CRM档案、外部数据
                    </p>
                  </div>
                </div>

                {/* Key History */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    关键历史
                  </h3>
                  <div className="space-y-2">
                    <div className="border-l-2 border-blue-500 pl-4 py-2">
                      <p className="text-sm font-medium">2024年3月：首次接触</p>
                      <p className="text-xs text-muted-foreground">技术方案演示，客户反馈积极</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4 py-2">
                      <p className="text-sm font-medium">2024年6月：POC测试</p>
                      <p className="text-xs text-muted-foreground">测试通过，性能提升30%</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4 py-2">
                      <p className="text-sm font-medium">2024年9月：商务谈判</p>
                      <p className="text-xs text-muted-foreground">价格存在分歧，等待后续沟通</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-4 py-2">
                      <p className="text-sm font-medium">2024年10月：最新动态</p>
                      <p className="text-xs text-muted-foreground">
                        完成B+轮融资5000万，业务扩张（重要机会！）
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      📊 数据来源：CRM、邮件系统、外部新闻
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    建议话术
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">💡 开场建议</p>
                      <p className="text-xs">
                        祝贺融资成功，强调长期合作价值，展示我们如何助力业务扩张
                      </p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">💡 价格策略</p>
                      <p className="text-xs">
                        提供阶梯折扣方案：单价降至¥385（-8.3%），总量+40%，总金额500万
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        依据：历史均价¥420，成本¥320，竞品¥410-550
                      </p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">💡 技术优势</p>
                      <p className="text-xs">
                        强调POC数据：性能+30%，准确率95%，明显优于竞品
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risks */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    风险提示
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <p className="text-sm">
                        ⚠️ "交付周期"问题尚未完全解决，需主动说明优化方案
                      </p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <p className="text-sm">⚠️ 竞品价格低20%，强调性价比而非单纯价格</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1">
                    导出报告
                  </Button>
                  <Button onClick={onComplete} className="flex-1 bg-accent hover:bg-accent/90">
                    进入会议模式
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

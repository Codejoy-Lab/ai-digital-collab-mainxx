import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Mic,
  Clock,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  BarChart3,
  User,
  Building2,
  MessageSquare,
  Bot,
  Sparkles,
} from 'lucide-react';

interface Message {
  id: string;
  timestamp: string;
  speaker: 'client' | 'ceo' | 'ai';
  speakerName: string;
  text: string;
  keywords?: string[];
  triggersAnalysis?: boolean;
  topics?: ('purchase' | 'price' | 'tech' | 'delivery' | 'service')[];
  sentiment?: 'positive' | 'neutral' | 'concern';
  isDecision?: boolean;
  decisionText?: string;
}

interface AnalysisEvent {
  id: string;
  timestamp: string;
  type: 'focus' | 'retrieval' | 'suggestion' | 'risk';
  title: string;
  content: string;
  source?: string;
  status?: 'loading' | 'completed';
}

interface LiveMeetingAssistantProps {
  onBack: () => void;
  onShowSummary?: () => void;
}

export const LiveMeetingAssistant = ({ onBack, onShowSummary }: LiveMeetingAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysisEvents, setAnalysisEvents] = useState<AnalysisEvent[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const analysisEndRef = useRef<HTMLDivElement>(null);

  // 会议洞察统计
  const [topicStats, setTopicStats] = useState({ purchase: 0, price: 0, tech: 0, delivery: 0, service: 0 });
  const [sentiment, setSentiment] = useState({ positive: 0, neutral: 0, concern: 0 });
  const [decisions, setDecisions] = useState<string[]>([]);

  const meetingDialogue: Message[] = [
    {
      id: 'm1',
      timestamp: '14:05:12',
      speaker: 'client',
      speakerName: '李总',
      text: '张总您好，很高兴今天能够面对面交流。我们最近完成了B+轮融资，公司发展进入了新阶段。',
      keywords: ['融资', '新阶段'],
      topics: ['purchase'],
      sentiment: 'positive',
    },
    {
      id: 'm2',
      timestamp: '14:05:35',
      speaker: 'ceo',
      speakerName: 'CEO 张总',
      text: '恭喜恭喜！我们也看到了贵司的融资新闻，这对整个行业都是非常振奋的消息。',
      topics: ['purchase'],
      sentiment: 'positive',
    },
    {
      id: 'm3',
      timestamp: '14:05:58',
      speaker: 'client',
      speakerName: '李总',
      text: '是的，有了资金支持，我们计划大幅扩大业务规模。关于你们的AI解决方案，我们内部讨论后觉得确实能解决很多痛点，但之前的报价确实让我们有些犹豫。',
      keywords: ['扩大规模', '报价', '犹豫'],
      topics: ['purchase', 'price'],
      sentiment: 'concern',
      triggersAnalysis: true,
    },
    {
      id: 'm4',
      timestamp: '14:06:42',
      speaker: 'ceo',
      speakerName: 'CEO 张总',
      text: '理解您的考虑。考虑到贵司现在的发展阶段和采购规模的提升，我们确实可以提供更有竞争力的方案。',
      topics: ['price', 'purchase'],
      sentiment: 'positive',
    },
    {
      id: 'm5',
      timestamp: '14:07:15',
      speaker: 'client',
      speakerName: '李总',
      text: '我们初步预算在500万左右，不知道这个规模能否有更好的价格？',
      keywords: ['500万', '价格'],
      topics: ['price', 'purchase'],
      sentiment: 'neutral',
      triggersAnalysis: true,
    },
    {
      id: 'm6',
      timestamp: '14:08:20',
      speaker: 'ceo',
      speakerName: 'CEO 张总',
      text: '500万的规模，我们可以提供阶梯折扣。如果采购量达到13000单位，单价可以降到385元，总计500万，相比之前的报价有明显优惠。',
      topics: ['price'],
      sentiment: 'positive',
      isDecision: true,
      decisionText: '价格方案确定',
    },
    {
      id: 'm7',
      timestamp: '14:08:55',
      speaker: 'client',
      speakerName: '李总',
      text: '这个价格有吸引力。不过我注意到市场上也有其他供应商报价更低，你们在技术上有什么独特优势吗？',
      keywords: ['竞品', '技术优势'],
      topics: ['price', 'tech'],
      sentiment: 'neutral',
      triggersAnalysis: true,
    },
    {
      id: 'm8',
      timestamp: '14:09:45',
      speaker: 'ceo',
      speakerName: 'CEO 张总',
      text: '好问题。我们的核心优势在于自研算法。根据您6月份的POC测试数据，我们的处理速度比行业平均水平快30%，准确率也高出5个百分点。',
      topics: ['tech'],
      sentiment: 'positive',
    },
    {
      id: 'm9',
      timestamp: '14:10:30',
      speaker: 'client',
      speakerName: '李总',
      text: '确实，POC的表现我们都很满意。还有一个问题就是交付周期，上次提到这个点我们有些担心。',
      keywords: ['交付周期', '担心'],
      topics: ['delivery', 'tech'],
      sentiment: 'concern',
      triggersAnalysis: true,
    },
    {
      id: 'm10',
      timestamp: '14:11:25',
      speaker: 'ceo',
      speakerName: 'CEO 张总',
      text: '关于交付周期，我们最近优化了生产流程。标准配置的交付时间已经从之前的6周缩短到4周，如果有特殊需求，我们也能加急处理。',
      topics: ['delivery'],
      sentiment: 'positive',
      isDecision: true,
      decisionText: '交付周期确认',
    },
    {
      id: 'm11',
      timestamp: '14:12:10',
      speaker: 'client',
      speakerName: '李总',
      text: '很好。如果技术支持和培训方面能跟上，我觉得我们可以认真考虑这个方案。',
      keywords: ['技术支持', '培训'],
      topics: ['service'],
      sentiment: 'positive',
      triggersAnalysis: true,
    },
    {
      id: 'm12',
      timestamp: '14:12:50',
      speaker: 'ceo',
      speakerName: 'CEO 张总',
      text: '技术支持这块我们有专门的团队，包括驻场支持和7×24小时在线服务。培训的话，我们会提供为期2周的全面培训，确保团队能够熟练使用。',
      topics: ['service'],
      sentiment: 'positive',
    },
    {
      id: 'm13',
      timestamp: '14:13:40',
      speaker: 'client',
      speakerName: '王经理',
      text: '我这边补充一个问题，关于系统集成，我们现有的ERP和CRM系统能和你们的方案对接吗？',
      keywords: ['系统集成', 'ERP', 'CRM'],
      topics: ['tech'],
      sentiment: 'neutral',
      triggersAnalysis: true,
    },
    {
      id: 'm14',
      timestamp: '14:14:25',
      speaker: 'ceo',
      speakerName: 'CEO 张总',
      text: '完全可以。我们支持主流ERP和CRM系统的API对接，包括SAP、Oracle、Salesforce等。我们技术团队会提供完整的集成方案。',
      topics: ['tech'],
      sentiment: 'positive',
      isDecision: true,
      decisionText: '系统集成方案',
    },
    {
      id: 'm15',
      timestamp: '14:15:10',
      speaker: 'client',
      speakerName: '李总',
      text: '好的。那我们内部需要再评估一下，大概一周内给你们明确答复。如果确定合作，希望能在本季度内完成首批部署。',
      keywords: ['评估', '一周', '本季度'],
      topics: ['purchase', 'delivery'],
      sentiment: 'positive',
      triggersAnalysis: true,
    },
    {
      id: 'm16',
      timestamp: '14:15:55',
      speaker: 'ceo',
      speakerName: 'CEO 张总',
      text: '没问题。我会安排团队准备详细的实施计划，包括时间节点、人员配置和风险预案。期待我们的合作！',
      topics: ['purchase', 'delivery', 'service'],
      sentiment: 'positive',
      isDecision: true,
      decisionText: '下一步行动确定',
    },
  ];

  // 模拟打字机效果
  useEffect(() => {
    if (currentMessageIndex >= meetingDialogue.length) {
      // 会议结束，显示总结按钮
      setTimeout(() => {
        setIsMeetingEnded(true);
      }, 2000);
      return;
    }

    const currentMsg = meetingDialogue[currentMessageIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    const typingTimer = setInterval(() => {
      if (charIndex < currentMsg.text.length) {
        setDisplayedText(currentMsg.text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingTimer);
        setIsTyping(false);

        // 添加完整消息
        setMessages((prev) => [...prev, { ...currentMsg, text: currentMsg.text }]);
        setDisplayedText('');

        // 更新话题统计
        if (currentMsg.topics) {
          setTopicStats((prev) => {
            const newStats = { ...prev };
            currentMsg.topics!.forEach((topic) => {
              newStats[topic] = (newStats[topic] || 0) + 1;
            });
            return newStats;
          });
        }

        // 更新情绪统计
        if (currentMsg.sentiment) {
          setSentiment((prev) => ({
            ...prev,
            [currentMsg.sentiment!]: prev[currentMsg.sentiment!] + 1,
          }));
        }

        // 更新决策点
        if (currentMsg.isDecision && currentMsg.decisionText) {
          setDecisions((prev) => [...prev, currentMsg.decisionText!]);
        }

        // 如果触发分析，添加分析事件
        if (currentMsg.triggersAnalysis) {
          handleAnalysis(currentMsg);
        }

        // 继续下一条消息
        setTimeout(() => {
          setCurrentMessageIndex((prev) => prev + 1);
        }, 4000); // 增加间隔到4秒
      }
    }, 80); // 放慢打字速度到80ms/字符

    return () => clearInterval(typingTimer);
  }, [currentMessageIndex]);

  // 处理分析事件
  const handleAnalysis = (message: Message) => {
    const eventId = `analysis-${message.id}`;

    // 根据关键词触发不同的分析
    if (message.keywords?.includes('报价') || message.keywords?.includes('500万')) {
      // 添加检索事件
      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-retrieval-1`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'retrieval',
            title: '正在检索财务系统...',
            content: '查询历史报价和成本数据',
            status: 'loading',
          },
        ]);
      }, 800);

      setTimeout(() => {
        setAnalysisEvents((prev) =>
          prev.map((e) =>
            e.id === `${eventId}-retrieval-1`
              ? { ...e, status: 'completed' as const, content: '找到历史报价记录 12 条，当前成本数据已更新' }
              : e
          )
        );
      }, 3500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-retrieval-2`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'retrieval',
            title: '正在检索市场数据...',
            content: '查询行业价格对比',
            status: 'loading',
          },
        ]);
      }, 4000);

      setTimeout(() => {
        setAnalysisEvents((prev) =>
          prev.map((e) =>
            e.id === `${eventId}-retrieval-2`
              ? { ...e, status: 'completed' as const, content: '行业均价 ¥410-550，我们具有价格优势' }
              : e
          )
        );
      }, 6500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-suggestion`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'suggestion',
            title: '💡 价格建议',
            content: '基于客户预算500万，建议：方案A: 13000单位 × ¥385 = 500万，单价下降5.7%，总量提升40%，利润率18%（安全范围）',
            source: '数据来源：财务成本系统、历史定价记录',
          },
        ]);
      }, 7000);
    }

    if (message.keywords?.includes('竞品') || message.keywords?.includes('技术优势')) {
      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-retrieval-3`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'retrieval',
            title: '正在检索项目文档...',
            content: '查询POC测试数据',
            status: 'loading',
          },
        ]);
      }, 800);

      setTimeout(() => {
        setAnalysisEvents((prev) =>
          prev.map((e) =>
            e.id === `${eventId}-retrieval-3`
              ? { ...e, status: 'completed' as const, content: 'POC测试报告：性能提升30%，准确率95%' }
              : e
          )
        );
      }, 3500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-suggestion-2`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'suggestion',
            title: '💡 技术优势话术',
            content: '强调自研算法优势：POC测试中处理速度快30%，准确率高5%。强调性价比而非单纯价格竞争。',
            source: '数据来源：项目管理系统、技术文档',
          },
        ]);
      }, 4000);
    }

    if (message.keywords?.includes('交付周期')) {
      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-risk`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'risk',
            title: '⚠️ 风险提示',
            content: '客户上次会议对交付周期表示担忧，需主动说明优化方案：已从6周缩短至4周，可提供加急服务。',
            source: '数据来源：CRM交互记录、项目管理',
          },
        ]);
      }, 800);
    }

    // 技术支持和培训
    if (message.keywords?.includes('技术支持') || message.keywords?.includes('培训')) {
      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-retrieval-4`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'retrieval',
            title: '正在检索服务系统...',
            content: '查询服务团队配置和历史表现',
            status: 'loading',
          },
        ]);
      }, 800);

      setTimeout(() => {
        setAnalysisEvents((prev) =>
          prev.map((e) =>
            e.id === `${eventId}-retrieval-4`
              ? { ...e, status: 'completed' as const, content: '找到服务团队配置：15人技术支持团队，客户满意度 98.5%' }
              : e
          )
        );
      }, 3500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-retrieval-5`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'retrieval',
            title: '正在检索培训记录...',
            content: '查询历史培训数据',
            status: 'loading',
          },
        ]);
      }, 4000);

      setTimeout(() => {
        setAnalysisEvents((prev) =>
          prev.map((e) =>
            e.id === `${eventId}-retrieval-5`
              ? { ...e, status: 'completed' as const, content: '历史培训数据：87家企业，平均上手周期 1.2 周' }
              : e
          )
        );
      }, 6500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-suggestion-3`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'suggestion',
            title: '💡 服务优势建议',
            content: '强调服务体系：专属客户成功经理 + 驻场支持 + 定期回访。可提供某科技公司成功案例（3个月 ROI 提升 40%）。',
            source: '数据来源：服务管理系统、客户反馈记录',
          },
        ]);
      }, 7000);
    }

    // 系统集成
    if (message.keywords?.includes('系统集成') || message.keywords?.includes('ERP') || message.keywords?.includes('CRM')) {
      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-retrieval-6`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'retrieval',
            title: '正在检索技术文档...',
            content: '查询集成方案和兼容性',
            status: 'loading',
          },
        ]);
      }, 800);

      setTimeout(() => {
        setAnalysisEvents((prev) =>
          prev.map((e) =>
            e.id === `${eventId}-retrieval-6`
              ? { ...e, status: 'completed' as const, content: '找到集成方案文档 23 份，支持 SAP/Oracle/Salesforce 等主流系统' }
              : e
          )
        );
      }, 3500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-retrieval-7`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'retrieval',
            title: '正在检索集成案例...',
            content: '查询相似规模客户案例',
            status: 'loading',
          },
        ]);
      }, 4000);

      setTimeout(() => {
        setAnalysisEvents((prev) =>
          prev.map((e) =>
            e.id === `${eventId}-retrieval-7`
              ? { ...e, status: 'completed' as const, content: '相似规模客户集成案例：某物流公司（ERP SAP + CRM Salesforce），集成周期 2 周' }
              : e
          )
        );
      }, 6500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-suggestion-4`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'suggestion',
            title: '💡 技术可行性保证',
            content: '客户使用 SAP ERP，我们有 8 个成功案例。建议强调：提供标准 API 接口 + 技术团队驻场 + 集成测试环境，确保无缝对接。',
            source: '数据来源：技术文档库、项目管理系统',
          },
        ]);
      }, 7000);
    }

    // 评估和时间节点
    if (message.keywords?.includes('评估') || message.keywords?.includes('一周') || message.keywords?.includes('本季度')) {
      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-retrieval-8`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'retrieval',
            title: '正在检索销售策略...',
            content: '查询相似客户成交周期',
            status: 'loading',
          },
        ]);
      }, 800);

      setTimeout(() => {
        setAnalysisEvents((prev) =>
          prev.map((e) =>
            e.id === `${eventId}-retrieval-8`
              ? { ...e, status: 'completed' as const, content: '找到 B 轮融资客户成交周期：平均 8.5 天，成交率 73%' }
              : e
          )
        );
      }, 3500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-suggestion-5`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'suggestion',
            title: '💡 跟进策略建议',
            content: '建议后续行动：① 24小时内发送会议纪要 + 详细报价单  ② 3天内提供技术集成方案白皮书  ③ 5天后主动跟进评估进度  ④ 准备本季度实施计划（9-11月排期）',
            source: '数据来源：销售 CRM、历史成交记录',
          },
        ]);
      }, 4500);

      setTimeout(() => {
        setAnalysisEvents((prev) => [
          ...prev,
          {
            id: `${eventId}-risk-2`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'risk',
            title: '⚠️ 商机风险提示',
            content: '注意：客户提到"还需评估"，通常意味着内部还有决策人未参与。建议询问是否需要安排技术演示或高层会面。',
            source: '数据来源：商机分析模型',
          },
        ]);
      }, 5500);
    }
  };

  // 自动滚动
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, displayedText]);

  useEffect(() => {
    analysisEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [analysisEvents]);

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'client':
        return 'text-blue-500';
      case 'ceo':
        return 'text-green-500';
      default:
        return 'text-purple-500';
    }
  };

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'client':
        return Building2;
      case 'ceo':
        return User;
      default:
        return Mic;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回场景选择
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-1">
              <Mic className="w-3 h-3 mr-2 text-red-500 animate-pulse" />
              会议进行中
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{messages.length > 0 ? messages[messages.length - 1]?.timestamp || '14:05:12' : '14:05:12'}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Live Transcription */}
          <Card className="flex flex-col h-[600px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                实时对话转录
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg) => {
                  const SpeakerIcon = getSpeakerIcon(msg.speaker);
                  return (
                    <div key={msg.id} className="flex gap-3">
                      <div className={`${getSpeakerColor(msg.speaker)} mt-1`}>
                        <SpeakerIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className={`font-medium ${getSpeakerColor(msg.speaker)}`}>
                            {msg.speakerName}
                          </span>
                          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        {msg.keywords && msg.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {msg.keywords.map((keyword, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing message */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className={`${getSpeakerColor(meetingDialogue[currentMessageIndex].speaker)} mt-1`}>
                      {(() => {
                        const Icon = getSpeakerIcon(meetingDialogue[currentMessageIndex].speaker);
                        return <Icon className="w-5 h-5" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-medium ${getSpeakerColor(meetingDialogue[currentMessageIndex].speaker)}`}>
                          {meetingDialogue[currentMessageIndex].speakerName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {meetingDialogue[currentMessageIndex].timestamp}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {displayedText}
                        <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Right: AI Agent Assistant */}
          <Card className="flex flex-col h-[600px] border-accent/30 bg-accent/5">
            <CardHeader className="pb-3 border-b border-accent/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    决策助手 Agent
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-500">
                      运行中
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    实时监听并提供决策支持
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {analysisEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                      <Bot className="w-10 h-10 text-accent animate-pulse" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-ping">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-2">Agent 正在待命...</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    监听会议对话中，检测到关键信息时将主动提供分析和建议
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex gap-3 animate-in slide-in-from-right-4"
                    >
                      {/* Agent Avatar */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Agent Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-accent">决策助手</span>
                          <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                        </div>

                        <div
                          className={`rounded-lg p-3 ${
                            event.type === 'suggestion'
                              ? 'bg-green-500/10 border border-green-500/30'
                              : event.type === 'risk'
                              ? 'bg-orange-500/10 border border-orange-500/30'
                              : event.type === 'retrieval'
                              ? event.status === 'loading'
                                ? 'bg-primary/10 border border-primary/30'
                                : 'bg-muted/50 border border-border'
                              : 'bg-muted/50 border border-border'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {event.type === 'retrieval' && event.status === 'loading' && (
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                              )}
                              {event.type === 'retrieval' && event.status === 'completed' && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                              {event.type === 'suggestion' && <Lightbulb className="w-4 h-4 text-yellow-500" />}
                              {event.type === 'risk' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium mb-1">{event.title}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{event.content}</p>
                              {event.source && (
                                <p className="text-xs text-muted-foreground mt-2 italic">📊 {event.source}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={analysisEndRef} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom: Meeting Insights Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              会议洞察仪表盘
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Discussion Topics */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  讨论话题分布
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const total = Object.values(topicStats).reduce((a, b) => a + b, 0) || 1;
                    const topics = [
                      { key: 'purchase', label: '采购', color: 'bg-blue-500', value: topicStats.purchase },
                      { key: 'price', label: '价格', color: 'bg-green-500', value: topicStats.price },
                      { key: 'tech', label: '技术', color: 'bg-purple-500', value: topicStats.tech },
                      { key: 'delivery', label: '交付', color: 'bg-orange-500', value: topicStats.delivery },
                      { key: 'service', label: '服务', color: 'bg-pink-500', value: topicStats.service },
                    ];
                    return topics.filter(t => t.value > 0).map((topic) => (
                      <div key={topic.key} className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${topic.color} transition-all duration-500`}
                            style={{ width: `${Math.round((topic.value / total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-20">
                          {topic.label} {Math.round((topic.value / total) * 100)}%
                        </span>
                      </div>
                    ));
                  })()}
                  {Object.values(topicStats).reduce((a, b) => a + b, 0) === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      等待会议开始...
                    </p>
                  )}
                </div>
              </div>

              {/* Client Sentiment */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  客户情绪分析
                </h4>
                <div className="space-y-3">
                  {(() => {
                    const total = sentiment.positive + sentiment.neutral + sentiment.concern || 1;
                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">😊 积极</span>
                          <span className="text-sm font-medium text-green-500">
                            {Math.round((sentiment.positive / total) * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">😐 中性</span>
                          <span className="text-sm font-medium text-yellow-500">
                            {Math.round((sentiment.neutral / total) * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">😟 担忧</span>
                          <span className="text-sm font-medium text-orange-500">
                            {Math.round((sentiment.concern / total) * 100)}%
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Key Decisions */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  关键决策点
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {decisions.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      等待会议开始...
                    </p>
                  ) : (
                    decisions.map((decision, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm animate-in slide-in-from-left">
                        <Badge variant="outline" className="text-xs border-green-500/30 text-green-500">
                          已识别
                        </Badge>
                        <span className="text-muted-foreground flex-1">{decision}</span>
                      </div>
                    ))
                  )}
                </div>
                {decisions.length > 0 && (
                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                    共识别 {decisions.length} 个决策点
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meeting Summary Button */}
        {isMeetingEnded && (
          <Card className="mt-6 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/50 animate-in fade-in slide-in-from-bottom duration-500">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">会议已结束</h3>
                  <p className="text-muted-foreground">
                    AI 已完成会议分析，点击查看详细的会议总结和下一步行动建议
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={onShowSummary}
                  className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  查看会议总结报告
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

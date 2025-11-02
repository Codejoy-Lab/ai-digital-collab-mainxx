import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  DollarSign,
  Package,
  Settings,
  BookOpen,
} from 'lucide-react';

interface MeetingSummaryProps {
  onBack: () => void;
}

export const MeetingSummary = ({ onBack }: MeetingSummaryProps) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回会议界面
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                会议总结报告
              </h1>
              <p className="text-muted-foreground">
                由 AI 决策助手自动生成 • 基于会议实时分析
              </p>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-1" />
              AI 生成
            </Badge>
          </div>
        </div>

        {/* Meeting Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              会议基本信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">会议时间</div>
                    <div className="font-medium">2024年9月15日 14:05 - 14:16</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">参会人员</div>
                    <div className="font-medium">李总、王经理（智云科技）、CEO 张总</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">会议时长</div>
                    <div className="font-medium">11 分钟</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">会议主题</div>
                    <div className="font-medium">AI 解决方案采购商务会议</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Outcomes */}
        <Card className="mb-6 border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              会议关键成果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">价格方案达成共识</div>
                  <p className="text-sm text-muted-foreground">
                    客户预算 500 万，采购 13000 单位，单价 ¥385，相比初始报价降低 5.7%，总量提升 40%
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="w-3 h-3 mr-1" />
                      利润率 18%（安全范围）
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">交付周期确认</div>
                  <p className="text-sm text-muted-foreground">
                    标准配置 4 周交付（已从 6 周优化），可提供加急服务。客户对优化方案表示满意。
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      周期缩短 33%
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">技术集成可行性确认</div>
                  <p className="text-sm text-muted-foreground">
                    确认支持客户现有 SAP ERP 和 CRM 系统对接，有 8 个成功案例，集成周期约 2 周。
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      技术风险低
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1 text-yellow-600">待跟进事项</div>
                  <p className="text-sm text-muted-foreground">
                    客户需内部评估，一周内给予答复。如确定合作，希望本季度内完成首批部署。
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-600">
                      <Target className="w-3 h-3 mr-1" />
                      成交概率 73%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Discussion Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                讨论内容分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">价格与采购</span>
                    <span className="text-sm text-muted-foreground">35%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '35%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">技术能力</span>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '25%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">交付与服务</span>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: '25%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">服务支持</span>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-3">客户情绪走向</h4>
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-2xl mb-1">😊</div>
                    <div className="text-xs text-muted-foreground">积极 50%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">😐</div>
                    <div className="text-xs text-muted-foreground">中性 31%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">😟</div>
                    <div className="text-xs text-muted-foreground">担忧 19%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decision Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                关键决策点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/30 mt-0.5">01</Badge>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">价格方案确定</div>
                    <p className="text-xs text-muted-foreground">
                      500万预算，13000单位，单价¥385
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/30 mt-0.5">02</Badge>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">交付周期确认</div>
                    <p className="text-xs text-muted-foreground">
                      标准4周，可加急处理
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/30 mt-0.5">03</Badge>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">系统集成方案</div>
                    <p className="text-xs text-muted-foreground">
                      支持SAP ERP对接，2周集成周期
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/30 mt-0.5">04</Badge>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">下一步行动确定</div>
                    <p className="text-xs text-muted-foreground">
                      一周内客户答复，本季度部署
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Package className="w-5 h-5" />
              下一步行动清单
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">发送会议纪要</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    24小时内发送详细会议纪要，附详细报价单（500万/13000单位方案）
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      责任人: 助理
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      截止: 24小时内
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">准备技术集成方案白皮书</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    详细说明 SAP ERP 对接方案，包括 API 文档、集成时间表、测试计划
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      责任人: 技术团队
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      截止: 3天内
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">准备财务正式报价单</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    包含详细成本拆解、付款条款、阶梯折扣说明
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      责任人: 财务部
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      截止: 2天内
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">主动跟进评估进度</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    5 天后主动联系李总了解内部评估进展，询问是否需要技术演示或高层会面
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      责任人: CEO 张总
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      提醒: 5天后
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">5</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">准备本季度实施计划</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    规划 9-11 月排期，包括生产、物流、部署、培训时间表
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      责任人: 项目管理
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      截止: 3天内
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risks and Recommendations */}
        <Card className="mb-6 border-orange-500/30 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              风险提示与建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">决策人识别风险</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    客户提到"还需评估"，通常意味着内部还有决策人未参与本次会议。
                  </p>
                  <div className="text-sm">
                    <span className="font-medium text-primary">建议：</span>
                    <span className="text-muted-foreground">
                      跟进时询问是否需要安排技术演示或与其他决策层会面，确保所有关键人都认可方案。
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">时间压力</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    客户希望本季度内完成部署，留给评估和签约的时间较紧张。
                  </p>
                  <div className="text-sm">
                    <span className="font-medium text-primary">建议：</span>
                    <span className="text-muted-foreground">
                      提前准备所有合同和技术文档，简化审批流程，必要时提供加急部署方案。
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1 text-green-600">竞争优势维持</div>
                  <p className="text-sm text-muted-foreground mb-2">
                    客户对 POC 测试结果和技术能力认可度高，但也提到市场有其他供应商。
                  </p>
                  <div className="text-sm">
                    <span className="font-medium text-primary">建议：</span>
                    <span className="text-muted-foreground">
                      在跟进材料中继续强调技术优势（速度快30%、准确率高5%），避免陷入价格战。
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-5 h-5" />
              数据来源与分析方法
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium mb-2">实时数据源</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 会议实时转录与语义分析</li>
                  <li>• 关键词触发的数据检索（财务、CRM、技术文档）</li>
                  <li>• 客户情绪实时识别</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">历史数据源</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• CRM 客户交互记录</li>
                  <li>• 历史报价与成交数据</li>
                  <li>• 项目管理系统（POC测试、集成案例）</li>
                  <li>• 销售流程最佳实践库</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              本报告由 AI 决策助手基于 16 轮对话、6 次实时数据检索、4 个决策点识别自动生成。
              生成时间：2024-09-15 14:18
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

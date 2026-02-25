"use client"
import { TrendingUp, AlertTriangle, DollarSign, CheckCircle, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as PieChartComponent,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RiskAlert {
  id: string
  projectId: number
  projectName: string
  riskType: "deadline" | "budget" | "quality" | "resource"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  impact: string
  probability: number
  mitigation: string
}

interface ProjectMetrics {
  projectId: number
  projectName: string
  progress: number
  budgetUsed: number
  budgetTotal: number
  daysRemaining: number
  teamSize: number
  status: "on-track" | "at-risk" | "delayed"
}

export default function AnalyticsDashboard() {
  // Mock data for analytics
  const riskAlerts: RiskAlert[] = [
    {
      id: "1",
      projectId: 1,
      projectName: "Khu du lịch Bãi Dài",
      riskType: "deadline",
      severity: "critical",
      description: "Dự án sắp hết hạn trong 3 ngày",
      impact: "Có thể phải trì hoãn khai thác",
      probability: 85,
      mitigation: "Tăng cường nhân lực, làm việc thêm giờ",
    },
    {
      id: "2",
      projectId: 2,
      projectName: "Trung tâm Hội chợ",
      riskType: "budget",
      severity: "high",
      description: "Chi phí đã vượt 85% ngân sách",
      impact: "Có thể vượt ngân sách 15-20%",
      probability: 72,
      mitigation: "Xem xét cắt giảm chi phí không cần thiết",
    },
    {
      id: "3",
      projectId: 3,
      projectName: "Cảng Hàng không",
      riskType: "quality",
      severity: "high",
      description: "Chất lượng công trình không đạt tiêu chuẩn",
      impact: "Cần sửa chữa, tăng chi phí",
      probability: 45,
      mitigation: "Tăng cường kiểm tra chất lượng",
    },
    {
      id: "4",
      projectId: 4,
      projectName: "Khu công nghiệp",
      riskType: "resource",
      severity: "medium",
      description: "Thiếu nhân lực chuyên môn",
      impact: "Tiến độ có thể chậm lại",
      probability: 60,
      mitigation: "Tuyển dụng hoặc thuê ngoài",
    },
  ]

  const projectMetrics: ProjectMetrics[] = [
    {
      projectId: 1,
      projectName: "Khu du lịch Bãi Dài",
      progress: 92,
      budgetUsed: 8500000,
      budgetTotal: 10000000,
      daysRemaining: 3,
      teamSize: 45,
      status: "at-risk",
    },
    {
      projectId: 2,
      projectName: "Trung tâm Hội chợ",
      progress: 78,
      budgetUsed: 8500000,
      budgetTotal: 10000000,
      daysRemaining: 45,
      teamSize: 38,
      status: "at-risk",
    },
    {
      projectId: 3,
      projectName: "Cảng Hàng không",
      progress: 65,
      budgetUsed: 6500000,
      budgetTotal: 15000000,
      daysRemaining: 120,
      teamSize: 52,
      status: "on-track",
    },
    {
      projectId: 4,
      projectName: "Khu công nghiệp",
      progress: 45,
      budgetUsed: 4500000,
      budgetTotal: 12000000,
      daysRemaining: 180,
      teamSize: 30,
      status: "on-track",
    },
    {
      projectId: 5,
      projectName: "Trung tâm Y tế",
      progress: 88,
      budgetUsed: 7200000,
      budgetTotal: 8000000,
      daysRemaining: 15,
      teamSize: 35,
      status: "on-track",
    },
  ]

  // Calculate summary metrics
  const totalProjects = projectMetrics.length
  const onTrackProjects = projectMetrics.filter((p) => p.status === "on-track").length
  const atRiskProjects = projectMetrics.filter((p) => p.status === "at-risk").length
  const avgProgress = Math.round(projectMetrics.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
  const totalBudgetUsed = projectMetrics.reduce((sum, p) => sum + p.budgetUsed, 0)
  const totalBudgetTotal = projectMetrics.reduce((sum, p) => sum + p.budgetTotal, 0)
  const budgetUtilization = Math.round((totalBudgetUsed / totalBudgetTotal) * 100)

  // Chart data
  const progressTrendData = [
    { month: "T1", progress: 15 },
    { month: "T2", progress: 28 },
    { month: "T3", progress: 42 },
    { month: "T4", progress: 58 },
    { month: "T5", progress: 72 },
    { month: "T6", progress: 85 },
  ]

  const budgetTrendData = [
    { month: "T1", spent: 2000000, budget: 10000000 },
    { month: "T2", spent: 3500000, budget: 10000000 },
    { month: "T3", spent: 5200000, budget: 10000000 },
    { month: "T4", spent: 6800000, budget: 10000000 },
    { month: "T5", spent: 8200000, budget: 10000000 },
    { month: "T6", spent: 9700000, budget: 10000000 },
  ]

  const projectStatusData = [
    { name: "Đúng tiến độ", value: onTrackProjects, fill: "hsl(var(--chart-1))" },
    { name: "Có rủi ro", value: atRiskProjects, fill: "hsl(var(--chart-4))" },
  ]

  const riskSeverityData = [
    { name: "Critical", value: riskAlerts.filter((r) => r.severity === "critical").length },
    { name: "High", value: riskAlerts.filter((r) => r.severity === "high").length },
    { name: "Medium", value: riskAlerts.filter((r) => r.severity === "medium").length },
    { name: "Low", value: riskAlerts.filter((r) => r.severity === "low").length },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Nguy hiểm</Badge>
      case "high":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            Cao
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Trung bình
          </Badge>
        )
      default:
        return <Badge variant="secondary">Thấp</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-green-600">Đúng tiến độ</Badge>
      case "at-risk":
        return <Badge variant="destructive">Có rủi ro</Badge>
      default:
        return <Badge variant="secondary">Chậm</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Phân tích & Cảnh báo Rủi ro</h2>
        <p className="text-muted-foreground mt-2">Theo dõi hiệu suất dự án và các rủi ro tiềm ẩn</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng dự án</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đúng tiến độ</p>
                <p className="text-2xl font-bold text-green-600">{onTrackProjects}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Có rủi ro</p>
                <p className="text-2xl font-bold text-orange-600">{atRiskProjects}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiến độ trung bình</p>
                <p className="text-2xl font-bold">{avgProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sử dụng ngân sách</p>
                <p className="text-2xl font-bold">{budgetUtilization}%</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="risks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="risks">Cảnh báo Rủi ro</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất Dự án</TabsTrigger>
          <TabsTrigger value="trends">Xu hướng</TabsTrigger>
        </TabsList>

        {/* Risk Alerts Tab */}
        <TabsContent value="risks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Risk List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-semibold">Danh sách Rủi ro ({riskAlerts.length})</h3>
              {riskAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{alert.projectName}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">Tác động:</p>
                        <p className="font-medium">{alert.impact}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Xác suất:</p>
                        <p className="font-medium">{alert.probability}%</p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-background rounded text-xs">
                      <p className="text-muted-foreground mb-1">Giải pháp:</p>
                      <p>{alert.mitigation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Risk Summary Chart */}
            <div>
              <h3 className="font-semibold mb-4">Phân bố Rủi ro</h3>
              <ChartContainer
                config={{
                  critical: { label: "Nguy hiểm", color: "hsl(var(--destructive))" },
                  high: { label: "Cao", color: "hsl(0, 84%, 60%)" },
                  medium: { label: "Trung bình", color: "hsl(45, 93%, 47%)" },
                  low: { label: "Thấp", color: "hsl(var(--chart-1))" },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartComponent>
                    <Pie
                      data={riskSeverityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill="hsl(var(--destructive))" />
                      <Cell fill="hsl(0, 84%, 60%)" />
                      <Cell fill="hsl(45, 93%, 47%)" />
                      <Cell fill="hsl(var(--chart-1))" />
                    </Pie>
                    <Tooltip />
                  </PieChartComponent>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="space-y-4">
            {projectMetrics.map((project) => (
              <Card key={project.projectId}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{project.projectName}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.daysRemaining} ngày còn lại • {project.teamSize} thành viên
                      </p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="space-y-3">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Tiến độ</span>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    {/* Budget */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Ngân sách</span>
                        <span className="text-sm text-muted-foreground">
                          {(project.budgetUsed / 1000000).toFixed(1)}M / {(project.budgetTotal / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <Progress value={(project.budgetUsed / project.budgetTotal) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Progress Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Xu hướng Tiến độ</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    progress: { label: "Tiến độ (%)", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--chart-1))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Budget Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Xu hướng Chi phí</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    spent: { label: "Chi phí (VND)", color: "hsl(var(--chart-2))" },
                    budget: { label: "Ngân sách (VND)", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="spent" fill="hsl(var(--chart-2))" />
                      <Bar dataKey="budget" fill="hsl(var(--chart-3))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Project Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Phân bố Trạng thái Dự án</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  "Đúng tiến độ": { label: "Đúng tiến độ", color: "hsl(var(--chart-1))" },
                  "Có rủi ro": { label: "Có rủi ro", color: "hsl(var(--chart-4))" },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartComponent>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChartComponent>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

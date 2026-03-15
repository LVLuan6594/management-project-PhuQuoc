"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, Pause, TrendingDown, Calendar } from "lucide-react"
import projectsData from "@/data/projects.json"

const projectStats = [
  { name: "Đang triển khai", value: 0, color: "var(--color-chart-1)" },
  { name: "Hoàn thành", value: 0, color: "var(--color-chart-2)" },
  { name: "Tạm dừng", value: 0, color: "var(--color-chart-3)" },
  { name: "Chậm tiến độ", value: 0, color: "var(--color-chart-4)" },
]

const progressData = [
  { month: "T1", progress: 45 },
  { month: "T2", progress: 52 },
  { month: "T3", progress: 58 },
  { month: "T4", progress: 65 },
  { month: "T5", progress: 72 },
  { month: "T6", progress: 78 },
]

const fieldData = [
  { name: "Giao thông", value: 15 },
  { name: "Giáo dục", value: 12 },
  { name: "Công nghiệp", value: 10 },
  { name: "Nông nghiệp", value: 8 },
  { name: "Khác", value: 5 },
]

const delayedProjects = [
  { name: "Dự án quảng trường biển", delay: 25, daysLate: 15 },
  { name: "Dự án khu resort 5 sao", delay: 20, daysLate: 12 },
  { name: "Dự án hạ tầng giao thông", delay: 18, daysLate: 10 },
  { name: "Dự án sân golf 18 hố", delay: 15, daysLate: 8 },
  { name: "Dự án du lịch sinh thái", delay: 12, daysLate: 5 },
]

export default function Dashboard() {
  // Calculate stats from projects data
  const stats = useMemo(() => {
    const total = projectsData.length
    const inProgress = projectsData.filter(p => p.status === "Đang triển khai").length
    const completed = projectsData.filter(p => p.status === "Hoàn thành").length
    const delayed = projectsData.filter(p => p.status === "Chậm tiến độ").length
    const paused = projectsData.filter(p => p.status === "Tạm dừng").length
    
    // Create dynamic projectStats
    const dynamicProjectStats = [
      { name: "Đang triển khai", value: inProgress, color: "var(--color-chart-1)" },
      { name: "Hoàn thành", value: completed, color: "var(--color-chart-2)" },
      { name: "Tạm dừng", value: paused, color: "var(--color-chart-3)" },
      { name: "Chậm tiến độ", value: delayed, color: "var(--color-chart-4)" },
    ]
    
    // Calculate average progress
    const avgProgress = Math.round(
      projectsData.reduce((sum, p) => sum + p.progress, 0) / total
    )
    
    // Calculate on-time delivery rate (completed projects)
    const onTimeRate = completed > 0 ? Math.round((completed / total) * 100) : 0
    
    // Get delayed projects sorted by progress
    const delayedProjectsList = projectsData
      .filter(p => p.status === "Chậm tiến độ")
      .sort((a, b) => a.progress - b.progress)
    
    // Calculate days late (rough estimate based on progress vs timeline)
    const delayedWithDays = delayedProjectsList.map(p => ({
      name: p.name,
      delay: Math.max(10, 100 - p.progress),
      daysLate: Math.round((100 - p.progress) / 5),
      progress: p.progress
    }))
    
    return {
      total,
      inProgress,
      completed,
      delayed,
      paused,
      avgProgress,
      onTimeRate,
      projectStats: dynamicProjectStats,
      delayedProjects: delayedWithDays
    }
  }, [])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Thống kê</h1>
        <p className="text-muted-foreground">Tổng quan tình hình dự án đang triển khai</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng dự án</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <FileText className="text-secondary-foreground" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang triển khai</p>
                <p className="text-3xl font-bold text-accent">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <Clock className="text-secondary-foreground" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="text-3xl font-bold text-primary">{stats.completed}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <CheckCircle className="text-secondary-foreground" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cảnh báo</p>
                <p className="text-3xl font-bold text-destructive">{stats.delayed + stats.paused}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <AlertCircle className="text-secondary-foreground" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">% Hoàn thành bình quân</p>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-bold text-primary">{stats.avgProgress}%</p>
                <div className="flex-1">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${stats.avgProgress}%` }}></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Trung bình tất cả dự án đang triển khai</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">On-time Delivery Rate</p>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-bold text-accent">{stats.onTimeRate}%</p>
                <div className="flex-1">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-accent rounded-full h-2" style={{ width: `${stats.onTimeRate}%` }}></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stats.completed}/{stats.total} dự án hoàn thành đúng hạn</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Tỷ lệ dự án chậm</p>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-bold text-destructive">{Math.round((stats.delayed / stats.total) * 100)}%</p>
                <div className="flex-1">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-destructive rounded-full h-2" style={{ width: Math.round((stats.delayed / stats.total) * 100) }}></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stats.delayed} dự án đang chậm tiến độ</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Trạng thái dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.projectStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.projectStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Tiến độ theo tháng</CardTitle>
            <CardDescription>Tỷ lệ hoàn thành trung bình</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-primary)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Dự án theo lĩnh vực</CardTitle>
            <CardDescription>Phân bố theo ngành</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="text-destructive" size={20} />
              {stats.delayed > 0 ? `Top ${stats.delayedProjects.length} Dự án chậm tiến độ` : "Không có dự án chậm"}
            </CardTitle>
            <CardDescription>Các dự án cần hỗ trợ ngay</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.delayed > 0 ? (
              <div className="space-y-3">
                {stats.delayedProjects.map((project, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-destructive bg-destructive/20 px-2 py-1 rounded">#{index + 1}</span>
                        <p className="font-medium text-foreground truncate">{project.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Chậm {project.daysLate} ngày (Tiến độ: {project.progress}%)</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-destructive">{project.delay}%</div>
                      <div className="w-12 bg-secondary rounded-full h-2 mt-1">
                        <div className="bg-destructive rounded-full h-2" style={{ width: `${project.delay}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-center">✅ Tất cả dự án đang tiến hành đúng kế hoạch</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="12" y1="11" x2="12" y2="17"></line>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  )
}

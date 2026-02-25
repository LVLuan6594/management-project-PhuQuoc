"use client"

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
import { AlertCircle, CheckCircle, Clock, Pause } from "lucide-react"

const projectStats = [
  { name: "Đang triển khai", value: 24, color: "var(--color-chart-1)" },
  { name: "Hoàn thành", value: 18, color: "var(--color-chart-2)" },
  { name: "Tạm dừng", value: 5, color: "var(--color-chart-3)" },
  { name: "Chậm tiến độ", value: 3, color: "var(--color-chart-4)" },
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

export default function Dashboard() {
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
                <p className="text-3xl font-bold text-primary">50</p>
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
                <p className="text-3xl font-bold text-accent">24</p>
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
                <p className="text-3xl font-bold text-primary">18</p>
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
                <p className="text-3xl font-bold text-destructive">8</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <AlertCircle className="text-secondary-foreground" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Trạng thái dự án</CardTitle>
            <CardDescription>Phân bố theo tình trạng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStats.map((entry, index) => (
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
            <CardTitle>Cảnh báo nhanh</CardTitle>
            <CardDescription>Các dự án cần chú ý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                <AlertCircle className="text-secondary-foreground mt-1" size={20} />
                <div>
                  <p className="font-medium text-foreground">Dự án A quá hạn</p>
                  <p className="text-sm text-muted-foreground">Chậm 15 ngày so với kế hoạch</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                <Clock className="text-secondary-foreground mt-1" size={20} />
                <div>
                  <p className="font-medium text-foreground">Dự án B chưa báo cáo</p>
                  <p className="text-sm text-muted-foreground">Chưa cập nhật tiến độ 5 ngày</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                <Pause className="text-secondary-foreground mt-1" size={20} />
                <div>
                  <p className="font-medium text-foreground">Dự án C tạm dừng</p>
                  <p className="text-sm text-muted-foreground">Chờ phê duyệt bổ sung vốn</p>
                </div>
              </div>
            </div>
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

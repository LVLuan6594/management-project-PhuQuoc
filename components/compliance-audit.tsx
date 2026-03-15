"use client"

import { useState } from "react"
import { CheckCircle2, Circle, AlertCircle, FileText, User, Clock, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ComplianceItem {
  id: string
  category: string
  requirement: string
  description: string
  status: "completed" | "pending" | "overdue"
  dueDate: Date
  completedDate?: Date
  assignee: string
  evidence: string
  notes: string
}

interface AuditLog {
  id: string
  timestamp: Date
  user: string
  action: string
  projectId: number
  projectName: string
  documentName: string
  changeDetails: string
  status: "created" | "modified" | "deleted" | "approved"
}

export default function ComplianceAudit() {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: "c1",
      category: "Pháp lý",
      requirement: "Quyết định đầu tư",
      description: "Phê duyệt quyết định đầu tư từ cơ quan có thẩm quyền",
      status: "completed",
      dueDate: new Date("2024-01-15"),
      completedDate: new Date("2024-01-10"),
      assignee: "Nguyễn Văn A",
      evidence: "Quyết định_2024.pdf",
      notes: "Đã phê duyệt bởi Sở Kế hoạch Đầu tư",
    },
    {
      id: "c2",
      category: "Pháp lý",
      requirement: "Nghị định thực hiện",
      description: "Chuẩn bị và phê duyệt nghị định thực hiện dự án",
      status: "completed",
      dueDate: new Date("2024-02-20"),
      completedDate: new Date("2024-02-18"),
      assignee: "Trần Thị B",
      evidence: "Nghị_định_2024.pdf",
      notes: "Hoàn thành đúng hạn",
    },
    {
      id: "c3",
      category: "Môi trường",
      requirement: "Đánh giá tác động môi trường",
      description: "Hoàn thành báo cáo đánh giá tác động môi trường",
      status: "pending",
      dueDate: new Date("2024-03-30"),
      assignee: "Lê Văn C",
      evidence: "",
      notes: "Đang chờ phê duyệt từ Sở Tài nguyên Môi trường",
    },
    {
      id: "c4",
      category: "Tài chính",
      requirement: "Phê duyệt dự toán",
      description: "Phê duyệt dự toán chi phí dự án",
      status: "pending",
      dueDate: new Date("2024-04-15"),
      assignee: "Phạm Văn D",
      evidence: "",
      notes: "Chờ xác nhận từ Sở Tài chính",
    },
    {
      id: "c5",
      category: "Kỹ thuật",
      requirement: "Phê duyệt thiết kế",
      description: "Phê duyệt bản thiết kế chi tiết dự án",
      status: "overdue",
      dueDate: new Date("2024-03-01"),
      assignee: "Hoàng Văn E",
      evidence: "",
      notes: "Quá hạn 15 ngày, cần xử lý khẩn cấp",
    },
    {
      id: "c6",
      category: "Xã hội",
      requirement: "Tư vấn cộng đồng",
      description: "Tổ chức tư vấn ý kiến cộng đồng",
      status: "pending",
      dueDate: new Date("2024-05-10"),
      assignee: "Võ Thị F",
      evidence: "",
      notes: "Lên kế hoạch tổ chức",
    },
  ])

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "a1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: "Nguyễn Văn A",
      action: "Tạo mới",
      projectId: 1,
      projectName: "Khu du lịch Bãi Dài",
      documentName: "Quyết định đầu tư",
      changeDetails: "Tạo tài liệu quyết định đầu tư",
      status: "created",
    },
    {
      id: "a2",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      user: "Trần Thị B",
      action: "Chỉnh sửa",
      projectId: 1,
      projectName: "Khu du lịch Bãi Dài",
      documentName: "Quyết định đầu tư",
      changeDetails: "Cập nhật thông tin ngân sách từ 10M lên 12M",
      status: "modified",
    },
    {
      id: "a3",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: "Lê Văn C",
      action: "Phê duyệt",
      projectId: 1,
      projectName: "Khu du lịch Bãi Dài",
      documentName: "Quyết định đầu tư",
      changeDetails: "Phê duyệt tài liệu",
      status: "approved",
    },
    {
      id: "a4",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      user: "Phạm Văn D",
      action: "Tạo mới",
      projectId: 2,
      projectName: "Trung tâm Hội chợ",
      documentName: "Dự toán chi phí",
      changeDetails: "Tạo tài liệu dự toán chi phí",
      status: "created",
    },
    {
      id: "a5",
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
      user: "Hoàng Văn E",
      action: "Chỉnh sửa",
      projectId: 2,
      projectName: "Trung tâm Hội chợ",
      documentName: "Dự toán chi phí",
      changeDetails: "Cập nhật chi phí nhân công",
      status: "modified",
    },
  ])

  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Calculate compliance statistics
  const completedCount = complianceItems.filter((item) => item.status === "completed").length
  const pendingCount = complianceItems.filter((item) => item.status === "pending").length
  const overdueCount = complianceItems.filter((item) => item.status === "overdue").length
  const complianceRate = Math.round((completedCount / complianceItems.length) * 100)

  // Filter compliance items
  const filteredCompliance = complianceItems.filter((item) => {
    const matchCategory = filterCategory === "all" || item.category === filterCategory
    const matchStatus = filterStatus === "all" || item.status === filterStatus
    const matchSearch =
      item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchStatus && matchSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-sky-600" />
      case "pending":
        return <Circle className="w-5 h-5 text-yellow-600" />
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Circle className="w-5 h-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-sky-600">Hoàn thành</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Chờ xử lý
          </Badge>
        )
      case "overdue":
        return <Badge variant="destructive">Quá hạn</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "Tạo mới":
        return <Badge className="bg-blue-600">Tạo mới</Badge>
      case "Chỉnh sửa":
        return <Badge className="bg-purple-600">Chỉnh sửa</Badge>
      case "Phê duyệt":
        return <Badge className="bg-sky-600">Phê duyệt</Badge>
      case "Xóa":
        return <Badge variant="destructive">Xóa</Badge>
      default:
        return <Badge variant="secondary">{action}</Badge>
    }
  }

  const toggleCompliance = (id: string) => {
    setComplianceItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === "completed" ? "pending" : "completed"
          return {
            ...item,
            status: newStatus,
            completedDate: newStatus === "completed" ? new Date() : undefined,
          }
        }
        return item
      }),
    )
  }

  const exportAuditReport = () => {
    const report = auditLogs
      .map(
        (log) =>
          `${log.timestamp.toLocaleString("vi-VN")} | ${log.user} | ${log.action} | ${log.projectName} | ${log.documentName} | ${log.changeDetails}`,
      )
      .join("\n")

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(report))
    element.setAttribute("download", `audit-trail-${new Date().toISOString().split("T")[0]}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Tuân thủ Pháp lý & Lịch sử Thay đổi</h2>
        <p className="text-muted-foreground mt-2">Quản lý danh sách kiểm tra tuân thủ và theo dõi lịch sử tài liệu</p>
      </div>

      {/* Compliance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng yêu cầu</p>
                <p className="text-2xl font-bold">{complianceItems.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="text-2xl font-bold text-sky-600">{completedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-sky-600/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Circle className="w-8 h-8 text-yellow-600/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quá hạn</p>
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Rate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Tỷ lệ Tuân thủ</span>
            <span className="text-2xl font-bold text-sky-600">{complianceRate}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div className="bg-sky-600 h-3 rounded-full transition-all" style={{ width: `${complianceRate}%` }}></div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checklist">Danh sách Kiểm tra ({complianceItems.length})</TabsTrigger>
          <TabsTrigger value="audit">Lịch sử Thay đổi ({auditLogs.length})</TabsTrigger>
        </TabsList>

        {/* Compliance Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Tìm kiếm yêu cầu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="Pháp lý">Pháp lý</SelectItem>
                <SelectItem value="Môi trường">Môi trường</SelectItem>
                <SelectItem value="Tài chính">Tài chính</SelectItem>
                <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                <SelectItem value="Xã hội">Xã hội</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Compliance Items */}
          <ScrollArea className="h-[600px] rounded-lg border p-4">
            <div className="space-y-3">
              {filteredCompliance.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Không tìm thấy yêu cầu</p>
                </div>
              ) : (
                filteredCompliance.map((item) => (
                  <Card key={item.id} className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={item.status === "completed"}
                          onCheckedChange={() => toggleCompliance(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{item.requirement}</h4>
                            {getStatusBadge(item.status)}
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                            <div>
                              <p className="text-muted-foreground">Người phụ trách</p>
                              <p className="font-medium">{item.assignee}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Hạn chót</p>
                              <p className="font-medium">{item.dueDate.toLocaleDateString("vi-VN")}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Bằng chứng</p>
                              <p className="font-medium">{item.evidence || "Chưa có"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Ghi chú</p>
                              <p className="font-medium text-xs">{item.notes}</p>
                            </div>
                          </div>

                          {item.completedDate && (
                            <p className="text-xs text-sky-600">
                              Hoàn thành: {item.completedDate.toLocaleDateString("vi-VN")}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={exportAuditReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>

          <ScrollArea className="h-[600px] rounded-lg border p-4">
            <div className="space-y-3">
              {auditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Không có lịch sử thay đổi</p>
                </div>
              ) : (
                auditLogs.map((log) => (
                  <Card key={log.id} className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getActionBadge(log.action)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{log.documentName}</h4>
                            <span className="text-xs text-muted-foreground">
                              {log.timestamp.toLocaleString("vi-VN")}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-2">
                            <div>
                              <p className="text-muted-foreground text-xs">Người thực hiện</p>
                              <p className="font-medium flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {log.user}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Dự án</p>
                              <p className="font-medium">{log.projectName}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Hành động</p>
                              <p className="font-medium">{log.action}</p>
                            </div>
                          </div>

                          <div className="p-2 bg-secondary/30 rounded text-sm">
                            <p className="text-muted-foreground text-xs mb-1">Chi tiết thay đổi:</p>
                            <p>{log.changeDetails}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Compliance Guidelines Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hướng dẫn Tuân thủ</CardTitle>
          <CardDescription>Các yêu cầu pháp lý chính cho dự án</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="font-semibold text-sm mb-1">Pháp lý</p>
              <p className="text-xs text-muted-foreground">Quyết định đầu tư, Nghị định, Thông tư liên quan</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="font-semibold text-sm mb-1">Môi trường</p>
              <p className="text-xs text-muted-foreground">Đánh giá tác động môi trường, Báo cáo môi trường</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="font-semibold text-sm mb-1">Tài chính</p>
              <p className="text-xs text-muted-foreground">Dự toán, Quyết toán, Kiểm toán tài chính</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="font-semibold text-sm mb-1">Kỹ thuật</p>
              <p className="text-xs text-muted-foreground">Thiết kế, Bản vẽ, Tiêu chuẩn kỹ thuật</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

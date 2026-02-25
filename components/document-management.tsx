"use client"

import { FileText, Upload, Download, Trash2, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockDocuments = [
  {
    id: 1,
    name: "Quyết định phê duyệt dự án",
    type: "PDF",
    uploadDate: "2024-01-15",
    size: "2.4 MB",
    project: "Dự án Cảng Phú Quốc",
  },
  {
    id: 2,
    name: "Bản vẽ thiết kế",
    type: "DWG",
    uploadDate: "2024-02-20",
    size: "15.8 MB",
    project: "Dự án Cảng Phú Quốc",
  },
  {
    id: 3,
    name: "Hợp đồng thi công",
    type: "DOCX",
    uploadDate: "2024-03-10",
    size: "1.2 MB",
    project: "Dự án Sân bay Phú Quốc",
  },
]

const mockTimeline = [
  { phase: "Giai đoạn 1: Chuẩn bị", progress: 100, status: "Hoàn thành" },
  { phase: "Giai đoạn 2: Thi công cơ bản", progress: 75, status: "Đang triển khai" },
  { phase: "Giai đoạn 3: Hoàn thiện", progress: 40, status: "Đang triển khai" },
  { phase: "Giai đoạn 4: Bàn giao", progress: 0, status: "Chưa bắt đầu" },
]

export default function DocumentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Hồ sơ & Tiến độ</h1>
        <p className="text-muted-foreground">Quản lý tài liệu và theo dõi tiến độ dự án</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tài liệu dự án</CardTitle>
                  <CardDescription>Quản lý hồ sơ và tài liệu</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <Upload size={18} />
                  Tải lên
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-background rounded">
                        <FileText className="text-primary" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.project} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Download size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Tiến độ thực hiện</CardTitle>
            <CardDescription>Các giai đoạn dự án</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTimeline.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{item.phase}</p>
                    <span className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Nhật ký hoạt động</CardTitle>
          <CardDescription>Lịch sử cập nhật dự án</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Cập nhật tiến độ", user: "Nguyễn Văn A", time: "2 giờ trước" },
              { action: "Tải lên tài liệu mới", user: "Trần Thị B", time: "5 giờ trước" },
              { action: "Phê duyệt hồ sơ", user: "Lê Văn C", time: "1 ngày trước" },
            ].map((log, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                <Calendar className="text-primary mt-1" size={18} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.user} • {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Bell, X, AlertCircle, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "deadline" | "budget" | "approval" | "compliance"
  title: string
  description: string
  projectId: number
  projectName: string
  severity: "high" | "medium" | "low"
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface ReminderSchedule {
  id: string
  projectId: number
  projectName: string
  type: "deadline" | "budget" | "approval"
  daysUntil: number
  enabled: boolean
  frequency: "once" | "daily" | "weekly"
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [reminders, setReminders] = useState<ReminderSchedule[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Initialize mock notifications and reminders
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "deadline",
        title: "Dự án sắp hết hạn",
        description: "Dự án 'Khu du lịch Bãi Dài' sẽ hết hạn trong 3 ngày",
        projectId: 1,
        projectName: "Khu du lịch Bãi Dài",
        severity: "high",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: "2",
        type: "budget",
        title: "Cảnh báo vượt ngân sách",
        description: "Chi phí dự án 'Trung tâm Hội chợ' đã vượt 85% ngân sách",
        projectId: 2,
        projectName: "Trung tâm Hội chợ",
        severity: "high",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: "3",
        type: "approval",
        title: "Chờ phê duyệt tài liệu",
        description: "Tài liệu 'Quyết định đầu tư' của dự án 'Cảng Hàng không' chờ phê duyệt",
        projectId: 3,
        projectName: "Cảng Hàng không",
        severity: "medium",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: "4",
        type: "compliance",
        title: "Kiểm tra tuân thủ pháp lý",
        description: "Dự án 'Khu công nghiệp' cần hoàn thành danh sách kiểm tra pháp lý",
        projectId: 4,
        projectName: "Khu công nghiệp",
        severity: "medium",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "5",
        type: "deadline",
        title: "Nhắc nhở: Báo cáo tiến độ",
        description: "Báo cáo tiến độ hàng tuần của dự án 'Trung tâm Y tế' đến hạn hôm nay",
        projectId: 5,
        projectName: "Trung tâm Y tế",
        severity: "low",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: true,
      },
    ]

    const mockReminders: ReminderSchedule[] = [
      {
        id: "r1",
        projectId: 1,
        projectName: "Khu du lịch Bãi Dài",
        type: "deadline",
        daysUntil: 3,
        enabled: true,
        frequency: "daily",
      },
      {
        id: "r2",
        projectId: 2,
        projectName: "Trung tâm Hội chợ",
        type: "budget",
        daysUntil: 7,
        enabled: true,
        frequency: "weekly",
      },
      {
        id: "r3",
        projectId: 3,
        projectName: "Cảng Hàng không",
        type: "approval",
        daysUntil: 5,
        enabled: true,
        frequency: "daily",
      },
    ]

    setNotifications(mockNotifications)
    setReminders(mockReminders)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const toggleReminder = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      case "medium":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>
      case "medium":
        return <Badge variant="outline">Trung bình</Badge>
      default:
        return <Badge variant="secondary">Thấp</Badge>
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Clock className="w-5 h-5" />
      case "budget":
        return <AlertTriangle className="w-5 h-5" />
      case "approval":
        return <CheckCircle className="w-5 h-5" />
      case "compliance":
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Bell Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trung tâm Thông báo</h2>
        <div className="relative">
          <Button variant="outline" size="icon" onClick={() => setShowPanel(!showPanel)} className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Thông báo ({notifications.length})</TabsTrigger>
          <TabsTrigger value="reminders">Nhắc nhở ({reminders.length})</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{unreadCount} thông báo chưa đọc</p>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>

          <ScrollArea className="h-[600px] rounded-lg border p-4">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Không có thông báo</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-colors ${
                      !notification.read ? "bg-secondary/50 border-primary/30" : "bg-card"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            {getSeverityBadge(notification.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{notification.projectName}</span>
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp.toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4">
          <p className="text-sm text-muted-foreground">Quản lý các nhắc nhở tự động cho dự án</p>

          <ScrollArea className="h-[600px] rounded-lg border p-4">
            <div className="space-y-3">
              {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Không có nhắc nhở</p>
                </div>
              ) : (
                reminders.map((reminder) => (
                  <Card key={reminder.id} className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{reminder.projectName}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Loại:{" "}
                            {reminder.type === "deadline"
                              ? "Hạn chót"
                              : reminder.type === "budget"
                                ? "Ngân sách"
                                : "Phê duyệt"}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Còn {reminder.daysUntil} ngày</span>
                            <span>
                              Tần suất:{" "}
                              {reminder.frequency === "once"
                                ? "Một lần"
                                : reminder.frequency === "daily"
                                  ? "Hàng ngày"
                                  : "Hàng tuần"}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant={reminder.enabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleReminder(reminder.id)}
                        >
                          {reminder.enabled ? "Bật" : "Tắt"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Notification Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cài đặt Thông báo</CardTitle>
          <CardDescription>Tùy chỉnh cách bạn nhận thông báo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="text-sm font-medium">Thông báo hạn chót</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="text-sm font-medium">Cảnh báo ngân sách</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="text-sm font-medium">Yêu cầu phê duyệt</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="text-sm font-medium">Kiểm tra tuân thủ</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

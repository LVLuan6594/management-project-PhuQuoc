"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  FileText,
  Map,
  Users,
  Menu,
  X,
  MapPin,
  File,
  Bell,
  BarChart3,
  CheckSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Dashboard from "@/components/dashboard"
import ProjectManagement from "@/components/project-management"
import DocumentManagement from "@/components/document-management"
import UserManagement from "@/components/user-management"
import GISMap from "@/components/gis-map"
import ProjectDetails from "@/components/project-details"
import DocumentUpload from "@/components/document-upload"
import NotificationsCenter from "@/components/notifications-center"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import ComplianceAudit from "@/components/compliance-audit"
import ChatbotAssistant from "@/components/chatbot-assistant"

const generateDefaultWorkflowStages = () => {
  return Array.from({ length: 16 }, (_, index) => ({
    id: index + 1,
    name: `Tiến trình ${index + 1}`,
    subProcesses: [],
  }))
}

export default function Home() {
  const [activeModule, setActiveModule] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const modules = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Quản lý Dự án", icon: FileText },
    { id: "documents", label: "Hồ sơ & Tiến độ", icon: Map },
    // { id: "map", label: "Bản đồ GIS", icon: MapPin },
    { id: "upload", label: "Tải tài liệu", icon: File },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "analytics", label: "Phân tích", icon: BarChart3 },
    { id: "compliance", label: "Tuân thủ", icon: CheckSquare },
    { id: "users", label: "Người dùng", icon: Users },
  ]

  const renderModule = () => {
    if (selectedProjectId !== null) {
      return (
        <ProjectDetails
          projectId={selectedProjectId}
          onBack={() => {
            setSelectedProjectId(null)
            setActiveModule("projects")
          }}
        />
      )
    }

    switch (activeModule) {
      case "dashboard":
        return <Dashboard />
      case "projects":
        return <ProjectManagement onSelectProject={setSelectedProjectId} />
      case "documents":
        return <DocumentManagement />
      case "map":
        return <GISMap onSelectProject={setSelectedProjectId} />
      case "upload":
        return <DocumentUpload />
      case "notifications":
        return <NotificationsCenter />
      case "analytics":
        return <AnalyticsDashboard />
      case "compliance":
        return <ComplianceAudit />
      case "users":
        return <UserManagement />
      default:
        return <Dashboard />
    }
  }

  const handleNavigateToProject = (projectId: number) => {
    setSelectedProjectId(projectId)
    setActiveModule("projects")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold text-sidebar-primary">UBND Phú Quốc</h1>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sidebar-foreground"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeModule === module.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{module.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen && (
            <div className="text-xs text-sidebar-foreground/60">
              <p>Phần mềm Quản lý Dự án</p>
              <p>Đặc khu Phú Quốc</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderModule()}</div>
      </main>

      <ChatbotAssistant onNavigateToProject={handleNavigateToProject} />
    </div>
  )
}

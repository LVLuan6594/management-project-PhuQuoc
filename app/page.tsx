"use client"

import { useMemo, useState } from "react"
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
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
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

const parseIntSafe = (value: string | null) => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeModule = useMemo(() => searchParams.get("module") ?? "dashboard", [searchParams])
  const selectedProjectId = useMemo(
    () => parseIntSafe(searchParams.get("projectId")),
    [searchParams]
  )

  const setRoute = (module: string, projectId: number | null = null) => {
    const params = new URLSearchParams()
    params.set("module", module)
    if (projectId !== null) params.set("projectId", String(projectId))

    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  const modules = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Quản lý Dự án", icon: FileText },
    // { id: "documents", label: "Hồ sơ & Tiến độ", icon: Map },
    { id: "map", label: "Bản đồ GIS", icon: MapPin },
    // { id: "upload", label: "Tải tài liệu", icon: File },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "analytics", label: "Phân tích", icon: BarChart3 },
    // { id: "compliance", label: "Tuân thủ", icon: CheckSquare },
    { id: "users", label: "Người dùng", icon: Users },
  ]

  const renderModule = () => {
    if (selectedProjectId !== null) {
      return (
        <ProjectDetails
          key={`project-${selectedProjectId}`}
          projectId={selectedProjectId}
          onBack={() => setRoute("projects", null)}
        />
      )
    }

    switch (activeModule) {
      case "dashboard":
        return <Dashboard key="dashboard" />
      case "projects":
        return <ProjectManagement key="projects" onSelectProject={(id) => setRoute("projects", id)} />
      case "documents":
        return <DocumentManagement key="documents" />
      case "map":
        return <GISMap key="map" onSelectProject={(id) => setRoute("map", id)} />
      case "upload":
        return <DocumentUpload key="upload" />
      case "notifications":
        return <NotificationsCenter key="notifications" />
      case "analytics":
        return <AnalyticsDashboard key="analytics" />
      case "compliance":
        return <ComplianceAudit key="compliance" />
      case "users":
        return <UserManagement key="users" />
      default:
        return <Dashboard key="dashboard" />
    }
  }

  const handleNavigateToProject = (projectId: number) => {
    setRoute("projects", projectId)
  }

  return (
    <div className="flex h-screen bg-background">
      <Navbar />
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold text-sidebar-primary">UBND Đặc khu Phú Quốc</h1>}
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
                onClick={() => setRoute(module.id)}
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

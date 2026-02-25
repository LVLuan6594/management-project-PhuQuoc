"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Shield, Check, X, Lock, Eye, Pencil, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "Admin",
    department: "Ban Quản lý",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "Cán bộ quản lý",
    department: "Phòng Dự án",
    status: "Hoạt động",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "Người dân",
    department: "Công khai",
    status: "Hoạt động",
  },
]

const roles = [
  {
    name: "Admin",
    description: "Quản lý toàn bộ hệ thống",
    permissions: ["view_all", "create_project", "edit_project", "delete_project", "manage_users", "manage_roles"],
  },
  {
    name: "Cán bộ quản lý",
    description: "Xem/sửa/xóa dự án thuộc phạm vi",
    permissions: ["view_all", "create_project", "edit_project", "view_reports"],
  },
  {
    name: "Người dân",
    description: "Chỉ xem các dự án công khai",
    permissions: ["view_public"],
  },
]

const allPermissions = [
  { id: "view_all", label: "Xem tất cả dự án", icon: Eye },
  { id: "view_public", label: "Xem dự án công khai", icon: Eye },
  { id: "create_project", label: "Tạo dự án mới", icon: Plus },
  { id: "edit_project", label: "Chỉnh sửa dự án", icon: Pencil },
  { id: "delete_project", label: "Xóa dự án", icon: Trash },
  { id: "manage_users", label: "Quản lý người dùng", icon: Shield },
  { id: "manage_roles", label: "Quản lý vai trò", icon: Lock },
  { id: "view_reports", label: "Xem báo cáo", icon: Eye },
]

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Người dân", department: "" })

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([
        ...users,
        {
          id: users.length + 1,
          ...newUser,
          status: "Hoạt động",
        },
      ])
      setNewUser({ name: "", email: "", role: "Người dân", department: "" })
      setIsAddUserOpen(false)
    }
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý Người dùng</h1>
          <p className="text-muted-foreground">Phân quyền truy cập và quản lý tài khoản</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus size={20} />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Thêm người dùng mới</DialogTitle>
              <DialogDescription>Nhập thông tin người dùng mới vào hệ thống</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Họ và tên</label>
                <Input
                  placeholder="Nhập họ và tên"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  placeholder="Nhập email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Vai trò</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phòng ban</label>
                <Input
                  placeholder="Nhập phòng ban"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="mt-1 bg-background border-border"
                />
              </div>
              <Button onClick={handleAddUser} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Thêm người dùng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="roles">Vai trò & Quyền</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>Quản lý tài khoản và quyền truy cập ({users.length} người dùng)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-background rounded text-foreground">{user.role}</span>
                        <span className="text-xs px-2 py-1 bg-primary/10 rounded text-primary">{user.department}</span>
                        <span className="text-xs px-2 py-1 bg-accent/10 rounded text-accent">{user.status}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="border-border bg-transparent">
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border bg-transparent"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roles List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Vai trò</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role.name}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedRole.name === role.name
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80 text-foreground"
                      }`}
                    >
                      <p className="font-medium text-sm">{role.name}</p>
                      <p className="text-xs opacity-80">{role.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permission Matrix */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Ma trận quyền hạn
                  </CardTitle>
                  <CardDescription>Quyền của vai trò "{selectedRole.name}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allPermissions.map((permission) => {
                      const PermissionIcon = permission.icon
                      const hasPermission = selectedRole.permissions.includes(permission.id)
                      return (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <PermissionIcon size={18} className="text-primary" />
                            <span className="text-sm font-medium text-foreground">{permission.label}</span>
                          </div>
                          {hasPermission ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full">
                              <Check size={16} className="text-primary" />
                              <span className="text-xs font-medium text-primary">Có</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                              <X size={16} className="text-muted-foreground" />
                              <span className="text-xs font-medium text-muted-foreground">Không</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Role Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Tóm tắt vai trò</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div key={role.name} className="p-4 bg-secondary rounded-lg">
                    <p className="font-medium text-foreground mb-2">{role.name}</p>
                    <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-primary" />
                      <span className="text-xs font-medium text-primary">{role.permissions.length} quyền</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

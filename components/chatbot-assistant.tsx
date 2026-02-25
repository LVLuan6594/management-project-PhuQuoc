"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
  projectLink?: { projectId: number; projectName: string }
  followUps?: string[]
}

interface ChatbotAssistantProps {
  onNavigateToProject: (projectId: number) => void
}

export default function ChatbotAssistant({ onNavigateToProject }: ChatbotAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: 'Xin chào 👋 Tôi là trợ lý ảo! Bạn có thể hỏi tôi về các dự án. Ví dụ: "Cho tôi biết về dự án Cảng" hoặc "Tìm dự án PQ001".',
      followUps: ["Danh sách tất cả dự án", "Tiến độ dự án Cảng", "Dự án nào đã hoàn thành?"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const projectDatabase = [
    { id: 1, name: "Dự án Cảng", code: "PQ001", status: "Đang thực hiện", progress: 65 },
    { id: 2, name: "Dự án Sân bay", code: "PQ002", status: "Đang thực hiện", progress: 45 },
    { id: 3, name: "Dự án Khách sạn", code: "PQ003", status: "Hoàn thành", progress: 100 },
    { id: 4, name: "Dự án Đường cao tốc", code: "PQ004", status: "Chuẩn bị", progress: 20 },
    { id: 5, name: "Dự án Khu công nghiệp", code: "PQ005", status: "Đang thực hiện", progress: 55 },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = (msg?: string) => {
    const messageText = msg || inputValue
    if (!messageText.trim()) return

    const userMessage: Message = { id: Date.now().toString(), type: "user", text: messageText }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      let botResponse: Message
      const input = messageText.toLowerCase()
      let foundProject = projectDatabase.find(
        (p) => input.includes(p.name.toLowerCase()) || input.includes(p.code.toLowerCase()),
      )

      if (foundProject) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: `📁 Dự án: ${foundProject.name}\nMã hồ sơ: ${foundProject.code}\nTrạng thái: ${foundProject.status}\nTiến độ: ${foundProject.progress}%\n\nBạn muốn xem chi tiết dự án này không?`,
          projectLink: { projectId: foundProject.id, projectName: foundProject.name },
          followUps: ["Hiển thị danh sách khác", "Dự án nào đang thực hiện?", "Tìm dự án PQ003"],
        }
      } else if (input.includes("danh sách") || input.includes("tất cả")) {
        const projectList = projectDatabase.map((p) => `• ${p.name} (${p.code})`).join("\n")
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: `📋 Danh sách các dự án:\n${projectList}\n\nBạn muốn xem chi tiết dự án nào?`,
          followUps: ["Tiến độ dự án Cảng", "Dự án đã hoàn thành", "Tìm PQ002"],
        }
      } else if (input.includes("hoàn thành")) {
        const completed = projectDatabase.filter((p) => p.status === "Hoàn thành")
        const list = completed.map((p) => `• ${p.name} (${p.code})`).join("\n")
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: `✅ Dự án đã hoàn thành:\n${list}`,
          followUps: ["Xem dự án Đường cao tốc", "Danh sách tất cả dự án"],
        }
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: "🤔 Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi ví dụ: “Danh sách dự án”, “Tiến độ dự án Sân bay”, hoặc “Tìm PQ003”.",
          followUps: ["Danh sách tất cả dự án", "Tìm dự án PQ003", "Dự án nào hoàn thành?"],
        }
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, botResponse])
    }, 1200)
  }

  const handleProjectClick = (projectId: number) => {
    onNavigateToProject(projectId)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {/* <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
      >
        <Bot size={24} />
      </Button> */}
{/* Floating Bot Button with Animation */}
    <motion.button
      onClick={() => setIsOpen(!isOpen)}
      className="rounded-full w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-[0_0_15px_rgba(99,102,241,0.7)] flex items-center justify-center"
      animate={{
        y: [0, -3, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.5,
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.5 },
      }}
    >
      <Bot size={26} className="drop-shadow-md" />
    </motion.button>

      {/* Chat Window with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-20 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col ${
              isExpanded ? "w-[480px] h-[560px]" : "w-96 h-96"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <h3 className="font-semibold text-sm">Trợ lý AI Quản lý Dự án</h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-white hover:bg-green-700"
                >
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-700"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>

                    {message.projectLink && (
                      <Button
                        onClick={() => handleProjectClick(message.projectLink!.projectId)}
                        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                      >
                        Xem chi tiết: {message.projectLink.projectName}
                      </Button>
                    )}

                    {message.followUps && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.followUps.map((q, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="text-xs border-gray-300"
                            onClick={() => handleSendMessage(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-500 text-sm">
                    <span className="animate-pulse">Đang tra cứu thông tin...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3 bg-white flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button onClick={() => handleSendMessage()} size="icon" className="bg-green-500 hover:bg-green-600 text-white">
                <Send size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

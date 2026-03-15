export interface Project {
  id: number
  name: string
  code: string
  status: string
  progress: number
  location: string
  investor: string
  startDate: string
  endDate: string
  description?: string
  contractor?: string
  budget?: string
  processSteps?: Array<{ step: number; title: string; status: string; notes?: string }>
  currentStep?: number
}

import projectsData from "../data/projects.json"

export const mockProjects: Project[] = projectsData as Project[]

const STORAGE_KEY = "project-management.projects"

const parseStoredProjects = (value: string): Project[] => {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // ignore
  }
  return mockProjects
}

export const loadProjects = (): Project[] => {
  if (typeof window === "undefined") return mockProjects
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return mockProjects
  return parseStoredProjects(stored)
}

export const saveProjects = (projects: Project[]) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch {
    // ignore write errors
  }
}
export const getProjectById = (id?: number) => loadProjects().find((p) => p.id === id)
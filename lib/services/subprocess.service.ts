/**
 * SubProcess API Service
 * This service handles all API calls related to sub-processes
 * 
 * TODO: Replace API_BASE_URL with actual backend URL
 * TODO: Add authentication headers when backend is ready
 */

import { BaseApiService } from "./base-api.service"

export interface SubProcess {
  id: string | number
  stageId: number
  name: string
  content: string
  progressReport: string
  executionTime: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSubProcessRequest {
  stageId: number
  name: string
  content: string
  progressReport?: string
  executionTime?: string
}

export interface UpdateSubProcessRequest {
  name?: string
  content?: string
  progressReport?: string
  executionTime?: string
}

class SubProcessService extends BaseApiService {
  /**
   * Get all sub-processes for a specific stage
   * @param stageId - The ID of the workflow stage
   * @returns Promise with array of sub-processes
   */
  async getSubProcessesByStage(stageId: number): Promise<SubProcess[]> {
    try {
      return await this.request<SubProcess[]>(`/stages/${stageId}/subprocesses`, "GET")
    } catch (error) {
      console.error('Error fetching sub-processes:', error)
      throw error
    }
  }

  /**
   * Create a new sub-process for a stage
   * @param data - The sub-process data to create
   * @returns Promise with the created sub-process
   */
  async createSubProcess(data: CreateSubProcessRequest): Promise<SubProcess> {
    try {
      return await this.request<SubProcess>("/subprocesses", "POST", data)
    } catch (error) {
      console.error('Error creating sub-process:', error)
      throw error
    }
  }

  /**
   * Update an existing sub-process
   * @param subProcessId - The ID of the sub-process to update
   * @param data - The data to update
   * @returns Promise with the updated sub-process
   */
  async updateSubProcess(subProcessId: string | number, data: UpdateSubProcessRequest): Promise<SubProcess> {
    try {
      return await this.request<SubProcess>(`/subprocesses/${subProcessId}`, "PUT", data)
    } catch (error) {
      console.error('Error updating sub-process:', error)
      throw error
    }
  }

  /**
   * Delete a sub-process
   * @param subProcessId - The ID of the sub-process to delete
   * @returns Promise that resolves when deletion is complete
   */
  async deleteSubProcess(subProcessId: string | number): Promise<void> {
    try {
      await this.request<void>(`/subprocesses/${subProcessId}`, "DELETE")
    } catch (error) {
      console.error('Error deleting sub-process:', error)
      throw error
    }
  }
}

export const subProcessService = new SubProcessService()

/**
 * Stage API Service
 * This service handles all API calls related to workflow stages
 * 
 * TODO: Replace API_BASE_URL with actual backend URL
 * TODO: Add authentication headers when backend is ready
 */

import { BaseApiService } from "./base-api.service"

export interface Stage {
  id: number
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  progress: number
  startDate?: string
  completedDate?: string
  projectId: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateStageRequest {
  projectId: number
  name: string
  description: string
  status?: 'pending' | 'in-progress' | 'completed'
  progress?: number
}

export interface UpdateStageRequest {
  name?: string
  description?: string
  status?: 'pending' | 'in-progress' | 'completed'
  progress?: number
  startDate?: string
  completedDate?: string
}

class StageService extends BaseApiService {
  /**
   * Get all stages for a specific project
   * @param projectId - The ID of the project
   * @returns Promise with array of stages
   */
  async getStagesByProject(projectId: number): Promise<Stage[]> {
    try {
      return await this.request<Stage[]>(`/projects/${projectId}/stages`, "GET")
    } catch (error) {
      console.error('Error fetching stages:', error)
      throw error
    }
  }

  /**
   * Get a single stage by ID
   * @param stageId - The ID of the stage
   * @returns Promise with the stage data
   */
  async getStageById(stageId: number): Promise<Stage> {
    try {
      return await this.request<Stage>(`/stages/${stageId}`, "GET")
    } catch (error) {
      console.error('Error fetching stage:', error)
      throw error
    }
  }

  /**
   * Create a new stage
   * @param data - The stage data to create
   * @returns Promise with the created stage
   */
  async createStage(data: CreateStageRequest): Promise<Stage> {
    try {
      return await this.request<Stage>("/stages", "POST", data)
    } catch (error) {
      console.error('Error creating stage:', error)
      throw error
    }
  }

  /**
   * Update an existing stage
   * @param stageId - The ID of the stage to update
   * @param data - The data to update
   * @returns Promise with the updated stage
   */
  async updateStage(stageId: number, data: UpdateStageRequest): Promise<Stage> {
    try {
      return await this.request<Stage>(`/stages/${stageId}`, "PUT", data)
    } catch (error) {
      console.error('Error updating stage:', error)
      throw error
    }
  }

  /**
   * Delete a stage
   * @param stageId - The ID of the stage to delete
   * @returns Promise that resolves when deletion is complete
   */
  async deleteStage(stageId: number): Promise<void> {
    try {
      await this.request<void>(`/stages/${stageId}`, "DELETE")
    } catch (error) {
      console.error('Error deleting stage:', error)
      throw error
    }
  }

  /**
   * Bulk update stages (for reordering or batch updates)
   * @param stageIds - Array of stage IDs to update
   * @param data - The data to update for all stages
   * @returns Promise with the updated stages
   */
  async bulkUpdateStages(stageIds: number[], data: Partial<UpdateStageRequest>): Promise<Stage[]> {
    try {
      return await this.request<Stage[]>("/stages/bulk-update", "PUT", { stageIds, data })
    } catch (error) {
      console.error('Error bulk updating stages:', error)
      throw error
    }
  }
}

export const stageService = new StageService()

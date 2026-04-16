import BaseAPI from "./base";
import type { IApiResponse } from "@/types/api/types";
import type { IGoal, IGoalData } from "@/types/goal/types";

class GoalAPI extends BaseAPI {
  async fetchAll({currentMonth, currentYear}: {currentMonth: number, currentYear: number}): Promise<IApiResponse<IGoal[]>> {
    return this.makeRequest<IGoal[]>("/goal", {
      method: "GET",
      params: {month: currentMonth, year: currentYear}
    });
  }

  async create(goalData: IGoalData): Promise<IApiResponse<IGoal>> {
    return this.makeRequest<IGoal>("/goal", {
      method: "POST",
      data: goalData,
    });
  }

  async update(
    goalId: string,
    updates: Partial<IGoalData>,
  ): Promise<IApiResponse<IGoal>> {
    return this.makeRequest<IGoal>(`/goal/${goalId}`, {
      method: "PATCH",
      data: updates,
    });
  }

  async allocate(goalId: string, amount: number): Promise<IApiResponse<IGoal>> {
    return this.makeRequest<IGoal>(`/goal/${goalId}/allocate`, {
      method: "POST",
      data: { amount },
    });
  }

  async deallocate(
    goalId: string,
    amount: number,
  ): Promise<IApiResponse<IGoal>> {
    return this.makeRequest<IGoal>(`/goal/${goalId}/deallocate`, {
      method: "POST",
      data: { amount },
    });
  }

  async delete(goalId: string): Promise<IApiResponse<string>> {
    return this.makeRequest<string>(`/goal/${goalId}`, {
      method: "DELETE",
    });
  }
}

export const goalAPI = new GoalAPI();
export default goalAPI;

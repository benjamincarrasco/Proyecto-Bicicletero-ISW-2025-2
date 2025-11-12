"use strict";
import { getDashboardDataService } from "../services/dashboard.service.js";
import { handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";


export async function getDashboard(req, res) {
  try {
    const [dashboardData, error] = await getDashboardDataService();

    if (error) {
      return handleErrorServer(res, 500, error);
    }

    handleSuccess(res, 200, "Dashboard data retrieved successfully", dashboardData);
  } catch (error) {
    console.error("Error in getDashboard:", error);
    handleErrorServer(res, 500, error.message);
  }
}

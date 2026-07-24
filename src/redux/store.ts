import { configureStore } from "@reduxjs/toolkit";
import departmentsReducer from "@/features/admin/departments/departmentsSlice";
import employeesReducer from "@/features/admin/employees/employeesSlice";
import managersReducer from "@/features/admin/managers/managersSlice";
import performanceReducer from "@/features/admin/performance/performanceSlice";
import recruitmentReducer from "@/features/admin/recruitment/recruitmentSlice";
import aiInsightsReducer from "@/store/aiInsights/aiInsightsSlice";
import settingsReducer from "@/store/settings/settingsSlice";
import sidebarReducer from "@/store/sidebar/sidebarSlice";
import employeeHierarchyReducer from "@/store/employeeHierarchy/employeeHierarchySlice";
import aiBrainReducer from "@/store/aiBrain/aiBrainSlice";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentsReducer,
    managers: managersReducer,
    performance: performanceReducer,
    recruitment: recruitmentReducer,
    aiInsights: aiInsightsReducer,
    settings: settingsReducer,
    sidebar: sidebarReducer,
    employeeHierarchy: employeeHierarchyReducer,
    aiBrain: aiBrainReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

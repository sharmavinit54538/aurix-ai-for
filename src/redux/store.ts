import { configureStore } from "@reduxjs/toolkit";
import departmentsReducer from "@/features/admin/departments/departmentsSlice";
import employeesReducer from "@/features/admin/employees/employeesSlice";
import managersReducer from "@/features/admin/managers/managersSlice";
import performanceReducer from "@/features/admin/performance/performanceSlice";
import recruitmentReducer from "@/features/admin/recruitment/recruitmentSlice";
import aiInsightsReducer from "@/store/aiInsights/aiInsightsSlice";
import complianceReducer from "@/store/compliance/complianceSlice";
import meetingIntelligenceReducer from "@/store/meetingIntelligence/meetingIntelligenceSlice";
import policyAssistantReducer from "@/store/policyAssistant/policyAssistantSlice";
import employeeHealthReducer from "@/store/employeeHealth/employeeHealthSlice";
import performanceCoachReducer from "@/store/performanceCoach/performanceCoachSlice";
import leaveAssistantReducer from "@/store/leaveAssistant/leaveAssistantSlice";
import recruiterReducer from "@/store/recruiter/recruiterSlice";
import workforceInsightsReducer from "@/store/workforceInsights/workforceInsightsSlice";
import profileReducer from "@/store/profile/profileSlice";
import settingsReducer from "@/store/settings/settingsSlice";
import sidebarReducer from "@/store/sidebar/sidebarSlice";
import employeeHierarchyReducer from "@/store/employeeHierarchy/employeeHierarchySlice";

import aiHubReducer from "@/store/aiHub/aiHubSlice";
import analyticsReducer from "@/store/analytics/analyticsSlice";
import { settingsApi, settingsApiErrorLogger } from "./settingsApi";

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentsReducer,
    managers: managersReducer,
    performance: performanceReducer,
    recruitment: recruitmentReducer,
    aiInsights: aiInsightsReducer,
    compliance: complianceReducer,
    meetingIntelligence: meetingIntelligenceReducer,
    policyAssistant: policyAssistantReducer,
    employeeHealth: employeeHealthReducer,
    performanceCoach: performanceCoachReducer,
    leaveAssistant: leaveAssistantReducer,
    aiRecruiter: recruiterReducer,
    workforceInsights: workforceInsightsReducer,
    settings: settingsReducer,
    profile: profileReducer,
    sidebar: sidebarReducer,
    employeeHierarchy: employeeHierarchyReducer,
    aiHub: aiHubReducer,
    analytics: analyticsReducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(settingsApi.middleware, settingsApiErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

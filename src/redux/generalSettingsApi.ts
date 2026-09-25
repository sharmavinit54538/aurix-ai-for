import { settingsApi } from "./settingsApi";
import { aurix } from "@/lib/aurix-store";
import type {
  ApiResponse,
  AuditLogParams,
  AuditLogResponse,
  BillingData,
  CompanySettings,
  CreateRolePayload,
  GeneralSettings,
  HrSettings,
  IntegrationItem,
  MfaDisablePayload,
  MfaEnablePayload,
  MfaEnableResponse,
  MfaStatusResponse,
  MfaVerifyPayload,
  MfaVerifyResponse,
  NotificationSettings,
  PermissionItem,
  ProfileData,
  ProfileSettings,
  Role,
  SecuritySettings,
  SettingsSummary,
  UpdateProfilePayload,
  UpdateRolePayload,
} from "./settingsApiTypes";

export const generalSettingsApi = settingsApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Summary ──────────────────────────────────────────────────────────
    getSettingsSummary: builder.query<ApiResponse<SettingsSummary>, void>({
      query: () => "/settings/summary",
      providesTags: ["SettingsSummary"],
    }),

    // ── General Settings ─────────────────────────────────────────────────
    getGeneralSettings: builder.query<ApiResponse<GeneralSettings>, void>({
      query: () => "/settings/general",
      providesTags: ["GeneralSettings"],
    }),
    updateGeneralSettings: builder.mutation<ApiResponse<GeneralSettings>, Partial<GeneralSettings>>(
      {
        query: (body) => ({
          url: "/settings/general",
          method: "PUT",
          body,
        }),
        invalidatesTags: ["GeneralSettings", "SettingsSummary"],
      },
    ),

    // ── Company Settings ─────────────────────────────────────────────────
    getCompanySettings: builder.query<ApiResponse<CompanySettings>, void>({
      query: () => "/settings/company",
      providesTags: ["CompanySettings"],
    }),
    updateCompanySettings: builder.mutation<ApiResponse<CompanySettings>, Partial<CompanySettings>>(
      {
        query: (body) => ({
          url: "/settings/company",
          method: "PUT",
          body,
        }),
        invalidatesTags: ["CompanySettings", "SettingsSummary"],
      },
    ),
    createCompanySettings: builder.mutation<ApiResponse<CompanySettings>, Partial<CompanySettings>>(
      {
        query: (body) => ({
          url: "/settings/company",
          method: "POST",
          body,
        }),
        invalidatesTags: ["CompanySettings", "SettingsSummary"],
      },
    ),
    patchCompanySettings: builder.mutation<ApiResponse<CompanySettings>, Partial<CompanySettings>>({
      query: (body) => ({
        url: "/settings/company",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CompanySettings", "SettingsSummary"],
    }),

    // ── Roles ────────────────────────────────────────────────────────────
    getRoles: builder.query<ApiResponse<Role[]>, void>({
      query: () => "/settings/roles",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Role" as const, id })),
              { type: "Role" as const, id: "LIST" },
            ]
          : [{ type: "Role" as const, id: "LIST" }],
    }),
    createRole: builder.mutation<ApiResponse<Role>, CreateRolePayload>({
      query: (body) => ({
        url: "/settings/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
    updateRole: builder.mutation<ApiResponse<Role>, UpdateRolePayload>({
      query: ({ id, data }) => ({
        url: `/settings/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),
    deleteRole: builder.mutation<ApiResponse<{ message?: string }>, string | number>({
      query: (roleId) => ({
        url: `/settings/roles/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),

    // ── Permissions ──────────────────────────────────────────────────────
    getPermissions: builder.query<ApiResponse<PermissionItem[]>, void>({
      query: () => "/settings/permissions",
      providesTags: ["Permission"],
    }),

    // ── Audit Logs ───────────────────────────────────────────────────────
    getAuditLogs: builder.query<ApiResponse<AuditLogResponse>, AuditLogParams | void>({
      query: (params) => ({
        url: "/settings/audit-logs",
        params: params || undefined,
      }),
      providesTags: ["AuditLog"],
    }),

    // ── Billing Settings ─────────────────────────────────────────────────
    getBillingSettings: builder.query<ApiResponse<BillingData>, void>({
      query: () => "/settings/billing",
      providesTags: ["Billing"],
    }),
    updateBillingSettings: builder.mutation<ApiResponse<BillingData>, Partial<BillingData>>({
      query: (body) => ({
        url: "/settings/billing",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Billing"],
    }),

    // ── Security Settings ────────────────────────────────────────────────
    getSecuritySettings: builder.query<ApiResponse<SecuritySettings>, void>({
      query: () => "/settings/security",
      providesTags: ["SecuritySettings"],
    }),
    updateSecuritySettings: builder.mutation<
      ApiResponse<SecuritySettings>,
      Partial<SecuritySettings>
    >({
      query: (body) => ({
        url: "/settings/security",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SecuritySettings"],
    }),

    // ── Notification Settings ────────────────────────────────────────────
    getNotificationSettings: builder.query<ApiResponse<NotificationSettings>, void>({
      query: () => "/settings/notifications",
      providesTags: ["NotificationSettings"],
    }),
    updateNotificationSettings: builder.mutation<
      ApiResponse<NotificationSettings>,
      Partial<NotificationSettings>
    >({
      query: (body) => ({
        url: "/settings/notifications",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["NotificationSettings"],
    }),

    // ── Integration Settings ─────────────────────────────────────────────
    getIntegrationSettings: builder.query<ApiResponse<IntegrationItem[]>, void>({
      query: () => "/settings/integrations",
      providesTags: ["IntegrationSettings"],
    }),
    updateIntegrationSettings: builder.mutation<
      ApiResponse<IntegrationItem[]>,
      Partial<IntegrationItem> | { integrations: IntegrationItem[] }
    >({
      query: (body) => ({
        url: "/settings/integrations",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["IntegrationSettings"],
    }),

    // ── Profile Settings ─────────────────────────────────────────────────
    getProfile: builder.query<ApiResponse<ProfileSettings>, void>({
      query: () => "/settings/profile",
      providesTags: ["Profile", "ProfileSettings"],
    }),
    getProfileSettings: builder.query<ApiResponse<ProfileSettings>, void>({
      query: () => "/settings/profile",
      providesTags: ["Profile", "ProfileSettings"],
    }),
    updateProfile: builder.mutation<ApiResponse<ProfileData>, UpdateProfilePayload>({
      query: (body) => {
        const { fullName, email, phone, designation, department, bio } = body;
        const cleanPayload: UpdateProfilePayload = {};
        if (fullName !== undefined) cleanPayload.fullName = fullName;
        if (email !== undefined) cleanPayload.email = email;
        if (phone !== undefined) cleanPayload.phone = phone;
        if (designation !== undefined) cleanPayload.designation = designation;
        if (department !== undefined) cleanPayload.department = department;
        if (bio !== undefined) cleanPayload.bio = bio;

        return {
          url: "/settings/profile",
          method: "PUT",
          body: cleanPayload,
        };
      },
      invalidatesTags: ["Profile", "ProfileSettings"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          const updatedName = arg.fullName || response?.data?.fullName;
          const updatedEmail = arg.email || response?.data?.email;
          const updatedPhone = arg.phone || response?.data?.phone;

          if (updatedName || updatedEmail || updatedPhone) {
            const ws = aurix.get();
            aurix.set({
              user: ws.user
                ? {
                    ...ws.user,
                    fullName: updatedName || ws.user.fullName,
                    email: updatedEmail || ws.user.email,
                    phone: updatedPhone || ws.user.phone,
                  }
                : {
                    id: "usr_current",
                    fullName: updatedName || "User",
                    email: updatedEmail || "",
                    phone: updatedPhone || "",
                    role: "super_admin",
                    companyId: "workspace",
                    emailVerified: true,
                    onboardingComplete: true,
                    createdAt: new Date().toISOString(),
                  },
            });
          }

          if (response?.data) {
            dispatch(
              settingsApi.util.updateQueryData("getProfile" as never, undefined as never, (draft: any) => {
                if (draft?.data) {
                  Object.assign(draft.data, response.data);
                }
              })
            );
            dispatch(
              settingsApi.util.updateQueryData("getProfileSettings" as never, undefined as never, (draft: any) => {
                if (draft?.data) {
                  Object.assign(draft.data, response.data);
                }
              })
            );
          }
        } catch {
          // Handled by error logger and invalidation
        }
      },
    }),
    updateProfileSettings: builder.mutation<ApiResponse<ProfileData>, UpdateProfilePayload>({
      query: (body) => {
        const { fullName, email, phone, designation, department, bio } = body;
        const cleanPayload: UpdateProfilePayload = {};
        if (fullName !== undefined) cleanPayload.fullName = fullName;
        if (email !== undefined) cleanPayload.email = email;
        if (phone !== undefined) cleanPayload.phone = phone;
        if (designation !== undefined) cleanPayload.designation = designation;
        if (department !== undefined) cleanPayload.department = department;
        if (bio !== undefined) cleanPayload.bio = bio;

        return {
          url: "/settings/profile",
          method: "PUT",
          body: cleanPayload,
        };
      },
      invalidatesTags: ["Profile", "ProfileSettings"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          const updatedName = arg.fullName || response?.data?.fullName;
          const updatedEmail = arg.email || response?.data?.email;
          const updatedPhone = arg.phone || response?.data?.phone;

          if (updatedName || updatedEmail || updatedPhone) {
            const ws = aurix.get();
            aurix.set({
              user: ws.user
                ? {
                    ...ws.user,
                    fullName: updatedName || ws.user.fullName,
                    email: updatedEmail || ws.user.email,
                    phone: updatedPhone || ws.user.phone,
                  }
                : {
                    id: "usr_current",
                    fullName: updatedName || "User",
                    email: updatedEmail || "",
                    phone: updatedPhone || "",
                    role: "super_admin",
                    companyId: "workspace",
                    emailVerified: true,
                    onboardingComplete: true,
                    createdAt: new Date().toISOString(),
                  },
            });
          }

          if (response?.data) {
            dispatch(
              settingsApi.util.updateQueryData("getProfile" as never, undefined as never, (draft: any) => {
                if (draft?.data) {
                  Object.assign(draft.data, response.data);
                }
              })
            );
            dispatch(
              settingsApi.util.updateQueryData("getProfileSettings" as never, undefined as never, (draft: any) => {
                if (draft?.data) {
                  Object.assign(draft.data, response.data);
                }
              })
            );
          }
        } catch {
          // Handled by error logger and invalidation
        }
      },
    }),

    // ── HR Settings ──────────────────────────────────────────────────────
    getHrSettings: builder.query<ApiResponse<HrSettings>, void>({
      query: () => "/settings/hr",
      providesTags: ["HrSettings"],
    }),
    updateHrSettings: builder.mutation<ApiResponse<HrSettings>, Partial<HrSettings>>({
      query: (body) => ({
        url: "/settings/hr",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["HrSettings"],
    }),
    createHrSettings: builder.mutation<ApiResponse<HrSettings>, Partial<HrSettings>>({
      query: (body) => ({
        url: "/settings/hr",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HrSettings"],
    }),

    // ── MFA Endpoints ────────────────────────────────────────────────────
    getMfaStatus: builder.query<ApiResponse<MfaStatusResponse>, void>({
      query: () => "/settings/mfa/status",
      providesTags: ["MfaStatus"],
    }),
    enableMfa: builder.mutation<ApiResponse<MfaEnableResponse>, MfaEnablePayload | void>({
      query: (body) => ({
        url: "/settings/mfa/enable",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: ["MfaStatus", "SecuritySettings"],
    }),
    disableMfa: builder.mutation<
      ApiResponse<{ success: boolean; message: string }>,
      MfaDisablePayload | void
    >({
      query: (body) => ({
        url: "/settings/mfa/disable",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: ["MfaStatus", "SecuritySettings"],
    }),
    verifyMfa: builder.mutation<ApiResponse<MfaVerifyResponse>, MfaVerifyPayload>({
      query: (body) => ({
        url: "/settings/mfa/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MfaStatus", "SecuritySettings"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSettingsSummaryQuery,
  useLazyGetSettingsSummaryQuery,
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useCreateCompanySettingsMutation,
  usePatchCompanySettingsMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useGetAuditLogsQuery,
  useLazyGetAuditLogsQuery,
  useGetBillingSettingsQuery,
  useUpdateBillingSettingsMutation,
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetIntegrationSettingsQuery,
  useUpdateIntegrationSettingsMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetProfileSettingsQuery,
  useUpdateProfileSettingsMutation,
  useGetHrSettingsQuery,
  useUpdateHrSettingsMutation,
  useCreateHrSettingsMutation,
  useGetMfaStatusQuery,
  useEnableMfaMutation,
  useDisableMfaMutation,
  useVerifyMfaMutation,
} = generalSettingsApi;

import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as useQueryClient, n as useMutation, r as useQuery, t as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { Ct as literalType, Dt as stringType, Et as recordType, Ot as unknownType, St as enumType, Tt as objectType, bt as arrayType, wt as numberType, xt as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notification-utils-1y-FPLpt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var NotificationPrioritySchema = enumType([
	"low",
	"normal",
	"high",
	"critical"
]);
var NotificationCategorySchema = enumType([
	"attendance",
	"leave",
	"payroll",
	"documents",
	"assets",
	"recruitment",
	"onboarding_exit",
	"approvals",
	"security",
	"system",
	"ai_insights"
]);
var NotificationModuleSchema = enumType([
	"core_hr",
	"workforce",
	"payroll",
	"recruitment",
	"security",
	"compliance",
	"system"
]);
var NotificationActorSchema = objectType({
	id: stringType(),
	name: stringType().optional(),
	avatarUrl: stringType().url().optional(),
	role: stringType().optional()
});
var NotificationEntitySchema = objectType({
	type: stringType(),
	id: stringType()
});
var NotificationSchema = objectType({
	id: stringType(),
	type: stringType(),
	category: NotificationCategorySchema,
	module: NotificationModuleSchema,
	priority: NotificationPrioritySchema,
	title: stringType().max(200),
	body: stringType().max(1e3),
	link: stringType().startsWith("/"),
	entity: NotificationEntitySchema.optional(),
	actor: NotificationActorSchema.optional(),
	metadata: recordType(unknownType()).optional(),
	dedupeKey: stringType().optional(),
	createdAt: stringType(),
	readAt: stringType().nullable().optional(),
	archivedAt: stringType().nullable().optional(),
	expiresAt: stringType().nullable().optional()
});
objectType({
	success: literalType(true),
	data: objectType({
		items: arrayType(NotificationSchema),
		nextCursor: stringType().nullable(),
		hasMore: booleanType(),
		totalUnread: numberType().int().nonnegative().optional()
	})
});
objectType({
	success: literalType(true),
	data: objectType({
		total: numberType().int().nonnegative(),
		byCategory: recordType(NotificationCategorySchema, numberType().int().nonnegative()).optional()
	})
});
function extractData(res, fallback) {
	const r = res;
	const body = r?.data !== void 0 && (r?.status !== void 0 || r?.headers !== void 0) ? r.data : res;
	if (body == null) return fallback;
	if (typeof body === "object") {
		const b = body;
		if ("data" in b && b.data !== void 0) return b.data;
		if ("result" in b && b.result !== void 0) return b.result;
	}
	return body ?? fallback;
}
function isNotFoundOrNetworkError(err) {
	if (axios.isAxiosError(err)) return !err.response || err.response.status === 404;
	return false;
}
var unreadCount404Breaker = false;
var hasLogged404Once = false;
function isUnreadCountCircuitBroken() {
	return unreadCount404Breaker;
}
var notificationsApi = {
	/**
	* GET /notifications
	* Cursor-paginated notifications with optional filtering.
	*/
	async getNotifications(params) {
		try {
			const data = extractData(await apiInstance.get("/notifications", { params }), {
				items: [],
				nextCursor: null,
				hasMore: false,
				totalUnread: 0
			});
			return {
				items: Array.isArray(data?.items) ? data.items : [],
				nextCursor: data?.nextCursor ?? null,
				hasMore: Boolean(data?.hasMore),
				totalUnread: typeof data?.totalUnread === "number" ? data.totalUnread : 0
			};
		} catch (err) {
			if (isNotFoundOrNetworkError(err)) return {
				items: [],
				nextCursor: null,
				hasMore: false,
				totalUnread: 0
			};
			throw err;
		}
	},
	/**
	* GET /notifications/unread-count
	* Total unread count and category breakdown.
	* If endpoint returns 404, trips session circuit breaker and throws 404.
	*/
	async getUnreadCount() {
		if (unreadCount404Breaker) {
			const err = /* @__PURE__ */ new Error("Unread count endpoint unavailable (404)");
			err.status = 404;
			throw err;
		}
		try {
			const data = extractData(await apiInstance.get("/notifications/unread-count"), {
				total: 0,
				byCategory: {}
			});
			return {
				total: typeof data?.total === "number" ? data.total : 0,
				byCategory: data?.byCategory || {}
			};
		} catch (err) {
			if (axios.isAxiosError(err) && err.response?.status === 404) {
				unreadCount404Breaker = true;
				if (!hasLogged404Once) hasLogged404Once = true;
				const notFoundErr = /* @__PURE__ */ new Error("Unread count endpoint unavailable (404)");
				notFoundErr.status = 404;
				throw notFoundErr;
			}
			throw err;
		}
	},
	/**
	* POST /notifications/{id}/read
	* Mark a single notification as read.
	*/
	async markRead(id) {
		try {
			return extractData(await apiInstance.post(`/notifications/${id}/read`), {
				id,
				readAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			if (isNotFoundOrNetworkError(err)) return {
				id,
				readAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			throw err;
		}
	},
	/**
	* POST /notifications/{id}/unread
	* Mark a single notification as unread.
	*/
	async markUnread(id) {
		try {
			return extractData(await apiInstance.post(`/notifications/${id}/unread`), {
				id,
				readAt: null
			});
		} catch (err) {
			if (isNotFoundOrNetworkError(err)) return {
				id,
				readAt: null
			};
			throw err;
		}
	},
	/**
	* POST /notifications/{id}/archive
	* Archive a single notification.
	*/
	async archive(id) {
		try {
			return extractData(await apiInstance.post(`/notifications/${id}/archive`), {
				id,
				archivedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			if (isNotFoundOrNetworkError(err)) return {
				id,
				archivedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			throw err;
		}
	},
	/**
	* POST /notifications/read
	* Bulk mark multiple notifications as read.
	*/
	async bulkMarkRead(ids) {
		try {
			return extractData(await apiInstance.post("/notifications/read", { ids }), {
				updatedCount: ids.length,
				readAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			if (isNotFoundOrNetworkError(err)) return {
				updatedCount: ids.length,
				readAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			throw err;
		}
	},
	/**
	* POST /notifications/read-all
	* Mark all notifications (or all in a category) as read.
	*/
	async markAllRead(category) {
		try {
			return extractData(await apiInstance.post("/notifications/read-all", category ? { category } : {}), {
				updatedCount: 0,
				readAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			if (isNotFoundOrNetworkError(err)) return {
				updatedCount: 0,
				readAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			throw err;
		}
	}
};
var notificationKeys = {
	all: (userId) => ["notifications", userId],
	lists: (userId) => [
		"notifications",
		userId,
		"list"
	],
	list: (userId, filters) => [
		"notifications",
		userId,
		"list",
		filters ?? {}
	],
	unreadCount: (userId) => [
		"notifications",
		userId,
		"unread-count"
	]
};
function updateItemInInfiniteData(oldData, id, updater) {
	if (!oldData) return oldData;
	return {
		...oldData,
		pages: oldData.pages.map((page) => ({
			...page,
			items: page.items.map((item) => item.id === id ? updater(item) : item).filter((item) => item !== null)
		}))
	};
}
function markAllInInfiniteData(oldData, category) {
	if (!oldData) return oldData;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return {
		...oldData,
		pages: oldData.pages.map((page) => ({
			...page,
			items: page.items.map((item) => {
				if (!category || item.category === category) return {
					...item,
					readAt: item.readAt ?? now
				};
				return item;
			}),
			totalUnread: category ? Math.max(0, (page.totalUnread ?? 0) - page.items.filter((i) => i.category === category && !i.readAt).length) : 0
		}))
	};
}
/**
* Cursor-paginated infinite notifications query.
*/
function useNotifications(filters) {
	const { user } = useAurix();
	const userId = user?.id || "anonymous";
	const query = useInfiniteQuery({
		queryKey: notificationKeys.list(userId, filters),
		initialPageParam: null,
		queryFn: async ({ pageParam }) => {
			return notificationsApi.getNotifications({
				...filters,
				cursor: pageParam
			});
		},
		getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : void 0,
		staleTime: 1e3 * 30
	});
	const items = (0, import_react.useMemo)(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
	const totalUnread = query.data?.pages[0]?.totalUnread ?? 0;
	return {
		...query,
		items,
		totalUnread
	};
}
/**
* Real-time unread count query.
* Polling no more often than every 60s, refetchIntervalInBackground: false.
* If 404 occurs, session circuit breaker stops polling and derives count from notifications list.
*/
function useUnreadCount() {
	const { user } = useAurix();
	const userId = user?.id || "anonymous";
	const queryClient = useQueryClient();
	const isCircuitBroken = isUnreadCountCircuitBroken();
	const query = useQuery({
		queryKey: notificationKeys.unreadCount(userId),
		queryFn: () => notificationsApi.getUnreadCount(),
		enabled: !isCircuitBroken,
		refetchInterval: isCircuitBroken ? false : 6e4,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: !isCircuitBroken,
		staleTime: 1e3 * 30,
		retry: (failureCount, error) => {
			if (error?.status === 404 || error?.response?.status === 404) return false;
			return failureCount < 2;
		}
	});
	const derivedFromList = (0, import_react.useMemo)(() => {
		const listQueries = queryClient.getQueriesData({ queryKey: notificationKeys.lists(userId) });
		let count = 0;
		const byCategory = {};
		for (const [, data] of listQueries) {
			if (!data?.pages) continue;
			for (const page of data.pages) {
				for (const item of page.items || []) if (!item.readAt && !item.archivedAt) {
					count++;
					if (item.category) byCategory[item.category] = (byCategory[item.category] || 0) + 1;
				}
				if (typeof page.totalUnread === "number" && page.totalUnread > count) count = page.totalUnread;
			}
			return {
				total: count,
				byCategory
			};
		}
		return {
			total: 0,
			byCategory
		};
	}, [
		queryClient,
		userId,
		query.data,
		query.isError,
		isCircuitBroken
	]);
	const effectiveTotal = isCircuitBroken || query.isError ? derivedFromList.total : query.data?.total ?? derivedFromList.total;
	const effectiveByCategory = isCircuitBroken || query.isError ? derivedFromList.byCategory : query.data?.byCategory ?? derivedFromList.byCategory;
	return {
		...query,
		unreadCount: effectiveTotal,
		byCategory: effectiveByCategory
	};
}
/**
* Optimistic mutation to mark a notification as read.
*/
function useMarkRead() {
	const queryClient = useQueryClient();
	const { user } = useAurix();
	const userId = user?.id || "anonymous";
	return useMutation({
		mutationFn: (id) => notificationsApi.markRead(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.all(userId) });
			const previousLists = queryClient.getQueriesData({ queryKey: notificationKeys.lists(userId) });
			const previousUnread = queryClient.getQueryData(notificationKeys.unreadCount(userId));
			queryClient.setQueriesData({ queryKey: notificationKeys.lists(userId) }, (old) => updateItemInInfiniteData(old, id, (item) => ({
				...item,
				readAt: item.readAt ?? (/* @__PURE__ */ new Date()).toISOString()
			})));
			queryClient.setQueryData(notificationKeys.unreadCount(userId), (old) => {
				if (!old) return old;
				return {
					...old,
					total: Math.max(0, old.total - 1)
				};
			});
			return {
				previousLists,
				previousUnread
			};
		},
		onError: (_err, _id, context) => {
			if (context?.previousLists) context.previousLists.forEach(([key, val]) => {
				queryClient.setQueryData(key, val);
			});
			if (context?.previousUnread) queryClient.setQueryData(notificationKeys.unreadCount(userId), context.previousUnread);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) });
		}
	});
}
/**
* Optimistic mutation to mark a notification as unread.
*/
function useMarkUnread() {
	const queryClient = useQueryClient();
	const { user } = useAurix();
	const userId = user?.id || "anonymous";
	return useMutation({
		mutationFn: (id) => notificationsApi.markUnread(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.all(userId) });
			const previousLists = queryClient.getQueriesData({ queryKey: notificationKeys.lists(userId) });
			const previousUnread = queryClient.getQueryData(notificationKeys.unreadCount(userId));
			queryClient.setQueriesData({ queryKey: notificationKeys.lists(userId) }, (old) => updateItemInInfiniteData(old, id, (item) => ({
				...item,
				readAt: null
			})));
			queryClient.setQueryData(notificationKeys.unreadCount(userId), (old) => {
				if (!old) return old;
				return {
					...old,
					total: old.total + 1
				};
			});
			return {
				previousLists,
				previousUnread
			};
		},
		onError: (_err, _id, context) => {
			if (context?.previousLists) context.previousLists.forEach(([key, val]) => {
				queryClient.setQueryData(key, val);
			});
			if (context?.previousUnread) queryClient.setQueryData(notificationKeys.unreadCount(userId), context.previousUnread);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) });
		}
	});
}
/**
* Optimistic mutation to mark all notifications (or all in a category) as read.
*/
function useMarkAllRead() {
	const queryClient = useQueryClient();
	const { user } = useAurix();
	const userId = user?.id || "anonymous";
	return useMutation({
		mutationFn: (category) => notificationsApi.markAllRead(category),
		onMutate: async (category) => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.all(userId) });
			const previousLists = queryClient.getQueriesData({ queryKey: notificationKeys.lists(userId) });
			const previousUnread = queryClient.getQueryData(notificationKeys.unreadCount(userId));
			queryClient.setQueriesData({ queryKey: notificationKeys.lists(userId) }, (old) => markAllInInfiniteData(old, category));
			queryClient.setQueryData(notificationKeys.unreadCount(userId), (old) => {
				if (!old) return old;
				if (category) {
					const catCount = old.byCategory?.[category] ?? 0;
					return {
						...old,
						total: Math.max(0, old.total - catCount),
						byCategory: {
							...old.byCategory,
							[category]: 0
						}
					};
				}
				return {
					total: 0,
					byCategory: {}
				};
			});
			return {
				previousLists,
				previousUnread
			};
		},
		onError: (_err, _cat, context) => {
			if (context?.previousLists) context.previousLists.forEach(([key, val]) => {
				queryClient.setQueryData(key, val);
			});
			if (context?.previousUnread) queryClient.setQueryData(notificationKeys.unreadCount(userId), context.previousUnread);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) });
		}
	});
}
/**
* Optimistic mutation to archive a notification.
*/
function useArchive() {
	const queryClient = useQueryClient();
	const { user } = useAurix();
	const userId = user?.id || "anonymous";
	return useMutation({
		mutationFn: (id) => notificationsApi.archive(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.all(userId) });
			const previousLists = queryClient.getQueriesData({ queryKey: notificationKeys.lists(userId) });
			const previousUnread = queryClient.getQueryData(notificationKeys.unreadCount(userId));
			let wasUnread = false;
			queryClient.setQueriesData({ queryKey: notificationKeys.lists(userId) }, (old) => updateItemInInfiniteData(old, id, (item) => {
				if (!item.readAt) wasUnread = true;
				return {
					...item,
					archivedAt: (/* @__PURE__ */ new Date()).toISOString()
				};
			}));
			if (wasUnread) queryClient.setQueryData(notificationKeys.unreadCount(userId), (old) => {
				if (!old) return old;
				return {
					...old,
					total: Math.max(0, old.total - 1)
				};
			});
			return {
				previousLists,
				previousUnread
			};
		},
		onError: (_err, _id, context) => {
			if (context?.previousLists) context.previousLists.forEach(([key, val]) => {
				queryClient.setQueryData(key, val);
			});
			if (context?.previousUnread) queryClient.setQueryData(notificationKeys.unreadCount(userId), context.previousUnread);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: notificationKeys.all(userId) });
		}
	});
}
/**
* Utility helpers for notification links, unread badge formatting, and timestamps.
*/
/**
* Validates that a link is strictly internal (starts with '/' but NOT '//')
* Prevents protocol-relative URL phishing and external open redirects.
*/
function isInternalSafeLink(link) {
	if (typeof link !== "string") return false;
	const trimmed = link.trim();
	return trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\");
}
/**
* Returns formatted unread badge text with 99+ cap.
* Returns null if count <= 0.
*/
function formatUnreadBadge(count) {
	if (!count || count <= 0) return null;
	if (count > 99) return "99+";
	return String(count);
}
/**
* Formats a timestamp into human-readable relative time (e.g. "5m ago", "2h ago", "yesterday").
*/
function formatRelativeTime(dateInput) {
	try {
		const timestamp = typeof dateInput === "number" ? dateInput : new Date(dateInput).getTime();
		if (isNaN(timestamp)) return "";
		const diffMs = Math.max(0, Date.now() - timestamp);
		const diffSec = Math.floor(diffMs / 1e3);
		const diffMin = Math.floor(diffSec / 60);
		const diffHour = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHour / 24);
		if (diffSec < 60) return "just now";
		if (diffMin < 60) return `${diffMin}m ago`;
		if (diffHour < 24) return `${diffHour}h ago`;
		if (diffDay === 1) return "yesterday";
		if (diffDay < 7) return `${diffDay}d ago`;
		return new Date(timestamp).toLocaleDateString(void 0, {
			month: "short",
			day: "numeric"
		});
	} catch {
		return "";
	}
}
//#endregion
export { useMarkAllRead as a, useNotifications as c, useArchive as i, useUnreadCount as l, formatUnreadBadge as n, useMarkRead as o, isInternalSafeLink as r, useMarkUnread as s, formatRelativeTime as t };

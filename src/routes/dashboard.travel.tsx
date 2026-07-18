import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plane, Plus, MapPin, Building2, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, SearchBox, StatCard, StatusBadge } from "@/components/hrms/Shared";
import type { TravelStatus } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiInstance from "@/api/apiInstance";
import { api } from "@/api/client";

export const Route = createFileRoute("/dashboard/travel")({
  head: () => ({ meta: [{ title: "Travel Requests — Aurix" }] }),
  component: TravelPage,
});

// ---------------- Type Envelopes ----------------
interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

interface TravelHistoryItem {
  stage: string;
  at: string;
  note?: string;
}

interface DbTravelRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  type: "domestic" | "international";
  purpose: string;
  destination: string;
  travel_date: string;
  return_date: string;
  budget: number;
  currency: string;
  status: TravelStatus;
  hotel?: string;
  transportation?: string;
  history: TravelHistoryItem[];
  created_at: string;
  updated_at: string;
}

interface DbTravelStats {
  total: number;
  pending: number;
  approved: number;
  budget: number;
}

// ---------------- V2 API custom request helper ----------------
const fetchV2 = async <T = unknown,>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: unknown,
  params?: unknown,
): Promise<ApiResponseEnvelope<T>> => {
  const v2Base = apiInstance.defaults.baseURL?.replace("/api/v1", "/api/v2") || "";
  const response = await apiInstance.request<ApiResponseEnvelope<T>>({
    method,
    url: `${v2Base}/${path.replace(/^\//, "")}`,
    data,
    params,
  });
  return response.data;
};

const STAGES: TravelStatus[] = [
  "draft",
  "manager-review",
  "hr-review",
  "finance-review",
  "approved",
  "rejected",
];

const STAGE_TONE: Record<TravelStatus, "muted" | "warning" | "info" | "success" | "danger"> = {
  draft: "muted",
  "manager-review": "warning",
  "hr-review": "warning",
  "finance-review": "info",
  approved: "success",
  rejected: "danger",
};

const NEXT_STAGE: Record<TravelStatus, TravelStatus | null> = {
  draft: "manager-review",
  "manager-review": "hr-review",
  "hr-review": "finance-review",
  "finance-review": "approved",
  approved: null,
  rejected: null,
};

function TravelPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TravelStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    employee_id: "",
    type: "domestic" as "domestic" | "international",
    purpose: "",
    destination: "",
    travel_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
    return_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
    hotel: "",
    transportation: "",
    budget: 0,
  });

  // Queries
  const travelQuery = useQuery<ApiResponseEnvelope<DbTravelRequest[]>>({
    queryKey: ["travel-requests-list", filter, query],
    queryFn: () =>
      fetchV2<DbTravelRequest[]>("/travel", "GET", undefined, {
        status: filter === "all" ? undefined : filter,
        search: query || undefined,
      }),
  });

  const statsQuery = useQuery<ApiResponseEnvelope<DbTravelStats>>({
    queryKey: ["travel-summary-stats"],
    queryFn: () => fetchV2<DbTravelStats>("/travel/stats", "GET"),
  });

  const employeesQuery = useQuery<
    ApiResponseEnvelope<{
      items: Array<{
        id: string;
        first_name?: string;
        last_name?: string;
        fullName?: string;
      }>;
    }>
  >({
    queryKey: ["travel-employee-options"],
    queryFn: () => api.get("employees?limit=200"),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: unknown) => fetchV2("/travel", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel-requests-list"] });
      queryClient.invalidateQueries({ queryKey: ["travel-summary-stats"] });
    },
  });

  const advanceMutation = useMutation({
    mutationFn: ({ id, stage, note }: { id: string; stage: string; note?: string }) =>
      fetchV2(`/travel/${id}/advance`, "POST", { stage, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel-requests-list"] });
      queryClient.invalidateQueries({ queryKey: ["travel-summary-stats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchV2(`/travel/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel-requests-list"] });
      queryClient.invalidateQueries({ queryKey: ["travel-summary-stats"] });
    },
  });

  const travelList = travelQuery.data?.data || [];
  const employees = employeesQuery.data?.data?.items || [];
  const stats = statsQuery.data?.data || {
    total: 0,
    pending: 0,
    approved: 0,
    budget: 0,
  };

  const handleRefresh = () => {
    travelQuery.refetch();
    statsQuery.refetch();
    employeesQuery.refetch();
  };

  function submit() {
    if (!draft.employee_id || !draft.destination) return;
    createMutation.mutate(
      {
        employee_id: draft.employee_id,
        type: draft.type,
        purpose: draft.purpose,
        destination: draft.destination,
        travel_date: draft.travel_date,
        return_date: draft.return_date,
        hotel: draft.hotel || undefined,
        transportation: draft.transportation || undefined,
        budget: Number(draft.budget),
        currency: "INR",
      },
      {
        onSuccess: () => {
          setOpen(false);
          setDraft({
            employee_id: "",
            type: "domestic",
            purpose: "",
            destination: "",
            travel_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
            return_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
            hotel: "",
            transportation: "",
            budget: 0,
          });
        },
      },
    );
  }

  return (
    <>
      <PageHeader
        title="Travel Requests"
        description="Domestic and international travel approvals."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={travelQuery.isFetching}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setDraft({
                  employee_id: employees[0]?.id || "",
                  type: "domestic",
                  purpose: "",
                  destination: "",
                  travel_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
                    .toISOString()
                    .slice(0, 10),
                  return_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10)
                    .toISOString()
                    .slice(0, 10),
                  hotel: "",
                  transportation: "",
                  budget: 0,
                });
                setOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> New request
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} icon={Plane} />
        <StatCard label="In review" value={stats.pending} icon={Building2} accent="warning" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="success" />
        <StatCard
          label="Budgeted"
          value={`₹${stats.budget.toLocaleString()}`}
          icon={Wallet}
          accent="brand"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search by employee, destination…"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as TravelStatus | "all")}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {travelQuery.isLoading ? (
        <TravelSkeleton />
      ) : travelQuery.isError ? (
        <TravelError onRetry={() => travelQuery.refetch()} />
      ) : travelList.length === 0 ? (
        <TravelEmpty />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {travelList.map((t) => {
            const next = NEXT_STAGE[t.status];
            return (
              <GlassCard key={t.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{t.employee_name}</h3>
                      <StatusBadge status={t.type} tone="muted" />
                      <StatusBadge status={t.status} tone={STAGE_TONE[t.status]} />
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {t.destination}
                    </div>
                    <p className="mt-2 text-sm">{t.purpose}</p>
                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
                      <div>Travel: {new Date(t.travel_date).toLocaleDateString()}</div>
                      <div>Return: {new Date(t.return_date).toLocaleDateString()}</div>
                      <div>Budget: ₹{t.budget.toLocaleString()}</div>
                      {t.hotel ? <div>Hotel: {t.hotel}</div> : null}
                      {t.transportation ? <div>Transport: {t.transportation}</div> : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {next ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            advanceMutation.mutate({
                              id: t.id,
                              stage: next,
                              note: `Advanced to ${next.replace(/-/g, " ")}`,
                            })
                          }
                          disabled={advanceMutation.isPending}
                        >
                          Advance → {next.replace(/-/g, " ")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            advanceMutation.mutate({
                              id: t.id,
                              stage: "rejected",
                              note: `Rejected at ${t.status.replace(/-/g, " ")}`,
                            })
                          }
                          disabled={advanceMutation.isPending}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        {t.status === "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMutation.mutate(t.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        )}
                        <span className="text-xs text-muted-foreground align-middle self-center">
                          Final
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-3">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Approval timeline
                  </div>
                  <ol className="flex flex-wrap gap-2 text-xs">
                    {t.history?.map((h, i) => (
                      <li
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-0.5"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--gradient-brand)" }}
                        />
                        <span className="capitalize">{h.stage.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">
                          · {new Date(h.at).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New travel request</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Employee</Label>
              <select
                value={draft.employee_id}
                onChange={(e) => setDraft({ ...draft, employee_id: e.target.value })}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => {
                  const name =
                    emp.fullName ||
                    `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
                    "Unknown Employee";
                  return (
                    <option key={emp.id} value={emp.id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <Label>Type</Label>
              <select
                value={draft.type}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    type: e.target.value as "domestic" | "international",
                  })
                }
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label>Purpose</Label>
              <Textarea
                value={draft.purpose}
                onChange={(e) => setDraft({ ...draft, purpose: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Destination</Label>
              <Input
                value={draft.destination}
                onChange={(e) => setDraft({ ...draft, destination: e.target.value })}
              />
            </div>
            <div>
              <Label>Travel date</Label>
              <Input
                type="date"
                value={draft.travel_date.slice(0, 10)}
                onChange={(e) => setDraft({ ...draft, travel_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Return date</Label>
              <Input
                type="date"
                value={draft.return_date.slice(0, 10)}
                onChange={(e) => setDraft({ ...draft, return_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Hotel</Label>
              <Input
                value={draft.hotel}
                onChange={(e) => setDraft({ ...draft, hotel: e.target.value })}
              />
            </div>
            <div>
              <Label>Transportation</Label>
              <Input
                value={draft.transportation}
                onChange={(e) => setDraft({ ...draft, transportation: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Budget (₹)</Label>
              <Input
                type="number"
                value={draft.budget}
                onChange={(e) => setDraft({ ...draft, budget: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={createMutation.isPending || !draft.employee_id || !draft.destination}
            >
              Submit for approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ---------------- Fallback Subcomponents ----------------
function TravelSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-48 rounded-xl border border-border bg-card/60 p-4 animate-pulse"
        />
      ))}
    </div>
  );
}

function TravelError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border bg-card/60">
      <AlertTriangle className="h-10 w-10 text-rose-500 mb-2 animate-bounce" />
      <h3 className="font-semibold text-foreground mb-1">Failed to load travel requests</h3>
      <p className="text-sm text-muted-foreground mb-4">There was a connection or server error.</p>
      <Button onClick={onRetry}>Retry Connection</Button>
    </div>
  );
}

function TravelEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card/60">
      <Plane className="h-12 w-12 text-muted-foreground stroke-[1.5] mb-2 opacity-50" />
      <h3 className="font-semibold text-foreground mb-1">No travel requests found</h3>
      <p className="text-sm text-muted-foreground">
        Any new travel requests submitted will appear here.
      </p>
    </div>
  );
}

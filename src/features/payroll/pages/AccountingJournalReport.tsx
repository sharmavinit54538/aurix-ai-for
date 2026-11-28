/**
 * Report 09 — Accounting Journal Export
 * Route: /dashboard/payroll/reports/accounting-journal
 *
 * Double-entry General Ledger export integrated with GET /api/v2/payroll/accounting-export
 * (and GET /api/v2/payroll/reports/accounting_export), verifying Total Debit == Total Credit,
 * highlighting unmapped GL accounts and unbalanced entries, and keeping reporting
 * strictly separate from actual GL posting.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Scale,
  ShieldAlert,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatCount, formatPaise } from "@/lib/format";
import { getHttpStatus, reportAnalyticsApi } from "../api/reportAnalyticsApi";
import {
  AnalyticsKpiCard,
  BackendUnavailableBanner,
  ChartsGrid,
  DrillDownBreadcrumbBar,
  ExportActions,
  KpiCardsGrid,
  ReportAccessGuard,
  ReportBarChart,
  ReportChartWrapper,
  ReportDataTable,
  ReportDonutChart,
  ReportFilterToolbar,
  ReportPageLayout,
  ReportTotalsReconciliationCard,
  type DataTableColumn,
} from "../components/ReportComponents";
import {
  useCompanyReportProfile,
  useFilterOptions,
  useReportExport,
  useReportFilters,
} from "../hooks/useReportAnalytics";
import {
  REPORT_REGISTRY,
  type AccountingExportResponse,
} from "../types/reports";
import type { ChartDataPoint, ReportReconciliationSummary } from "../types/reportAnalytics";

export default function AccountingJournalReport() {
  const registry = REPORT_REGISTRY.accounting_export;
  const {
    filters,
    draftFilters,
    updateDraftFilter,
    applyFilters,
    resetFilters,
    setPage,
    toggleSort,
  } = useReportFilters();

  const { options: filterOptions } = useFilterOptions();
  const companyProfile = useCompanyReportProfile();
  const { exporting, exportFormat, exportReport } = useReportExport();

  const [journal, setJournal] = useState<AccountingExportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const [selectedAccountCode, setSelectedAccountCode] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState(filters.search || "");

  const loadJournal = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBackendUnavailable(false);
    try {
      const res = await reportAnalyticsApi.getAccountingJournal(filters.periodId, {
        runId: filters.runId,
        department: filters.department,
        costCenter: filters.costCenter,
        financialYear: filters.financialYear,
      });
      setJournal(res);
      setLastRefreshedAt(new Date().toISOString());
    } catch (err) {
      const status = getHttpStatus(err);
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        setError("Accounting journal endpoint pending backend deployment");
      } else if (status === 403) {
        setError("You do not have permission to view accounting journal entries");
      } else {
        setError("Unable to Load Accounting Journal");
      }
      setJournal(null);
    } finally {
      setLoading(false);
    }
  }, [filters.periodId, filters.runId, filters.department, filters.costCenter, filters.financialYear]);

  useEffect(() => {
    void loadJournal();
  }, [loadJournal]);

  const entries = useMemo(
    () => (Array.isArray(journal?.entries) ? journal.entries : []),
    [journal?.entries]
  );

  // 8 KPIs
  const kpis = useMemo(() => {
    if (!journal) {
      return {
        totalEntries: null,
        totalDebitPaise: null,
        totalCreditPaise: null,
        diffPaise: null,
        postedEntries: null,
        pendingEntries: null,
        unmappedAccounts: null,
        balancedEntries: null,
      };
    }
    const diffPaise = journal.totalDebitPaise - journal.totalCreditPaise;
    const postedEntries =
      journal.postedCount ??
      entries.filter((e) => (e.postingStatus || "").toLowerCase() === "posted").length;
    const pendingEntries =
      journal.pendingCount ??
      entries.filter((e) => (e.postingStatus || "pending").toLowerCase() !== "posted").length;
    const unmappedAccounts =
      journal.unmappedCount ??
      entries.filter(
        (e) =>
          e.isMapped === false ||
          !e.accountCode ||
          e.accountCode.toUpperCase() === "UNMAPPED"
      ).length;
    const balancedEntries = journal.isBalanced ? entries.length : 0;

    return {
      totalEntries: entries.length,
      totalDebitPaise: journal.totalDebitPaise,
      totalCreditPaise: journal.totalCreditPaise,
      diffPaise,
      postedEntries,
      pendingEntries,
      unmappedAccounts,
      balancedEntries,
    };
  }, [journal, entries]);

  // 5 Charts
  const chartsData = useMemo(() => {
    // 1. Account-wise Debit & Credit
    const accMap = new Map<string, { debit: number; credit: number; code: string }>();
    for (const e of entries) {
      const key = `${e.accountCode} • ${e.accountName}`;
      const curr = accMap.get(key) || { debit: 0, credit: 0, code: e.accountCode };
      curr.debit += e.debitAmountPaise / 100;
      curr.credit += e.creditAmountPaise / 100;
      accMap.set(key, curr);
    }
    const accountDebitCredit: ChartDataPoint[] = Array.from(accMap.entries()).map(
      ([label, v]) => ({ label, debit: v.debit, credit: v.credit, accountCode: v.code })
    );

    // 2. Payroll Expense Distribution (debit lines)
    const expenseDist: ChartDataPoint[] = entries
      .filter((e) => e.debitAmountPaise > 0)
      .reduce((acc, e) => {
        const existing = acc.find((i) => i.label === e.accountName);
        if (existing) existing.value = Number(existing.value) + e.debitAmountPaise / 100;
        else acc.push({ label: e.accountName, value: e.debitAmountPaise / 100 });
        return acc;
      }, [] as ChartDataPoint[]);

    // 3. Department-wise Accounting Allocation
    const deptMap = new Map<string, number>();
    for (const e of entries) {
      if (e.debitAmountPaise > 0) {
        const dept = e.department || "Unassigned";
        deptMap.set(dept, (deptMap.get(dept) ?? 0) + e.debitAmountPaise / 100);
      }
    }
    const deptAllocation: ChartDataPoint[] = Array.from(deptMap.entries()).map(
      ([label, debit]) => ({ label, debit })
    );

    // 4. Payroll Liability Breakdown (credit lines)
    const liabilityDist: ChartDataPoint[] = entries
      .filter((e) => e.creditAmountPaise > 0)
      .reduce((acc, e) => {
        const existing = acc.find((i) => i.label === e.accountName);
        if (existing) existing.value = Number(existing.value) + e.creditAmountPaise / 100;
        else acc.push({ label: e.accountName, value: e.creditAmountPaise / 100 });
        return acc;
      }, [] as ChartDataPoint[]);

    // 5. Journal Status Distribution
    const statusMap = new Map<string, number>();
    for (const e of entries) {
      const st = e.postingStatus || "Pending";
      statusMap.set(st, (statusMap.get(st) ?? 0) + 1);
    }
    const statusDist: ChartDataPoint[] = Array.from(statusMap.entries()).map(([label, value]) => ({
      label,
      value,
    }));

    return { accountDebitCredit, expenseDist, deptAllocation, liabilityDist, statusDist };
  }, [entries]);

  const filteredRows = useMemo(() => {
    let list = entries.map((e) => ({
      ...e,
      journalDate: e.accountingDate,
      payrollPeriod: e.payrollPeriod || journal?.periodName || "—",
      runReference: e.payrollRunReference || e.payrollRunId || "—",
      ledgerType: e.accountType.replace(/_/g, " "),
      department: e.department || "—",
      costCenter: e.costCenter || "—",
      debitAmount: e.debitAmountPaise / 100,
      creditAmount: e.creditAmountPaise / 100,
      narration: e.referenceDescription,
      postingStatus: e.postingStatus || "Pending",
      accountingReference: e.accountingReference || "—",
    }));

    if (selectedAccountCode) {
      list = list.filter((r) => r.accountCode === selectedAccountCode);
    }
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.accountCode.toLowerCase().includes(q) ||
          r.accountName.toLowerCase().includes(q) ||
          r.narration.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }
    return list;
  }, [entries, journal?.periodName, selectedAccountCode, tableSearch]);

  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: "id", label: "Entry ID", defaultHidden: true },
      { key: "journalDate", label: "Journal Date", isDate: true, sortable: true },
      { key: "payrollPeriod", label: "Payroll Period" },
      { key: "runReference", label: "Run Ref" },
      {
        key: "accountCode",
        label: "Account Code",
        sortable: true,
        render: (val) => {
          const code = String(val || "UNMAPPED");
          const unmapped = code.toUpperCase() === "UNMAPPED";
          return (
            <span
              className={`font-mono font-semibold ${
                unmapped ? "text-amber-600 dark:text-amber-400" : "text-foreground"
              }`}
            >
              {code}
            </span>
          );
        },
      },
      { key: "accountName", label: "Account Name", sortable: true },
      {
        key: "ledgerType",
        label: "Ledger Type",
        render: (v) => <span className="capitalize">{String(v || "—")}</span>,
      },
      { key: "department", label: "Department", sortable: true },
      { key: "costCenter", label: "Cost Center" },
      { key: "debitAmount", label: "Debit (INR)", align: "right", isCurrency: true, sortable: true },
      { key: "creditAmount", label: "Credit (INR)", align: "right", isCurrency: true, sortable: true },
      { key: "narration", label: "Narration" },
      {
        key: "postingStatus",
        label: "Posting Status",
        render: (val) => {
          const st = String(val || "Pending");
          const isPosted = st.toLowerCase() === "posted";
          return (
            <Badge
              variant="outline"
              className={
                isPosted
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
              }
            >
              {st}
            </Badge>
          );
        },
      },
      { key: "accountingReference", label: "Accounting Ref", defaultHidden: true },
    ],
    []
  );

  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (!journal) return null;
    const diffPaise = journal.totalDebitPaise - journal.totalCreditPaise;
    return {
      title: "Double-Entry General Ledger Balance Verification",
      isBalanced: journal.isBalanced && diffPaise === 0,
      items: [
        { label: "Total Debit", value: formatPaise(journal.totalDebitPaise) },
        { label: "Total Credit", value: formatPaise(journal.totalCreditPaise) },
        {
          label: "Debit–Credit Difference",
          value: formatPaise(diffPaise),
          tone: diffPaise === 0 ? "success" : "danger",
        },
        {
          label: "Unmapped GL Accounts",
          value: formatCount(kpis.unmappedAccounts ?? 0),
          tone: (kpis.unmappedAccounts ?? 0) > 0 ? "warning" : "success",
        },
      ],
      discrepancyMessage:
        diffPaise !== 0
          ? `Unbalanced journal detected (${formatPaise(diffPaise)} difference). Resolve missing GL mappings before posting.`
          : (kpis.unmappedAccounts ?? 0) > 0
            ? `${kpis.unmappedAccounts} journal line(s) have unmapped GL account codes.`
            : "Read-only accounting export preview — reporting never posts duplicate GL entries.",
    };
  }, [journal, kpis.unmappedAccounts]);

  return (
    <ReportAccessGuard requiredPermission="payroll.reports">
      <ReportPageLayout
        title={registry.title}
        description={registry.description}
        periodLabel={journal?.periodName || `FY ${filters.financialYear}`}
        lastUpdated={lastRefreshedAt}
        companyName={companyProfile.name}
        companyLogoUrl={companyProfile.logoUrl}
        appliedFilters={filters}
        summaryTotals={reconciliationSummary?.items.map((i) => ({ label: i.label, value: i.value })) ?? []}
        actions={
          <ExportActions
            onExport={(fmt) => void exportReport("accounting_export", fmt, filters)}
            exporting={exporting}
            exportFormat={exportFormat}
            disabled={backendUnavailable}
          />
        }
      >
        <ReportFilterToolbar
          filters={draftFilters}
          filterOptions={filterOptions}
          supportedFilters={registry.supportedFilters}
          onFilterChange={updateDraftFilter}
          onApply={() => applyFilters()}
          onReset={resetFilters}
          onRefresh={() => void loadJournal()}
          loading={loading}
        />

        {backendUnavailable && (
          <BackendUnavailableBanner
            reportKey="accounting_export"
            endpoint="GET /api/v2/payroll/accounting-export"
          />
        )}

        {journal && !journal.isBalanced && (
          <Alert variant="destructive" className="rounded-xl">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">
              Unbalanced Double-Entry Journal Detected
            </AlertTitle>
            <AlertDescription className="text-xs">
              Total Debits ({formatPaise(journal.totalDebitPaise)}) do not equal Total Credits (
              {formatPaise(journal.totalCreditPaise)}). Difference:{" "}
              {formatPaise(journal.totalDebitPaise - journal.totalCreditPaise)}.
            </AlertDescription>
          </Alert>
        )}

        <DrillDownBreadcrumbBar
          selections={
            selectedAccountCode
              ? [{ key: "accountCode", label: "GL Account", value: selectedAccountCode }]
              : []
          }
          onRemove={() => setSelectedAccountCode(null)}
          onClearAll={() => setSelectedAccountCode(null)}
        />

        {/* Section C: 8 KPI Cards */}
        <KpiCardsGrid columns={4}>
          <AnalyticsKpiCard label="Total Journal Entries" value={kpis.totalEntries !== null ? formatCount(kpis.totalEntries) : "—"} icon={FileText} accent="brand" loading={loading} />
          <AnalyticsKpiCard label="Total Debit Amount" value={kpis.totalDebitPaise !== null ? formatPaise(kpis.totalDebitPaise) : "—"} icon={BookOpen} accent="success" loading={loading} />
          <AnalyticsKpiCard label="Total Credit Amount" value={kpis.totalCreditPaise !== null ? formatPaise(kpis.totalCreditPaise) : "—"} icon={BookOpen} accent="brand" loading={loading} />
          <AnalyticsKpiCard
            label="Debit–Credit Difference"
            value={kpis.diffPaise !== null ? formatPaise(kpis.diffPaise) : "—"}
            icon={Scale}
            accent={kpis.diffPaise === 0 ? "success" : "danger"}
            loading={loading}
          />
          <AnalyticsKpiCard label="Posted Journal Entries" value={kpis.postedEntries !== null ? formatCount(kpis.postedEntries) : "—"} icon={CheckCircle2} accent="success" loading={loading} />
          <AnalyticsKpiCard label="Pending Journal Entries" value={kpis.pendingEntries !== null ? formatCount(kpis.pendingEntries) : "—"} icon={Clock} accent="warning" loading={loading} />
          <AnalyticsKpiCard
            label="Unmapped Ledger Accounts"
            value={kpis.unmappedAccounts !== null ? formatCount(kpis.unmappedAccounts) : "—"}
            icon={AlertTriangle}
            accent={(kpis.unmappedAccounts ?? 0) > 0 ? "danger" : "success"}
            loading={loading}
          />
          <AnalyticsKpiCard label="Balanced Journal Entries" value={kpis.balancedEntries !== null ? formatCount(kpis.balancedEntries) : "—"} icon={Scale} accent="brand" loading={loading} />
        </KpiCardsGrid>

        {/* Section D: 5 Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Account-wise Debit & Credit Comparison"
            subtitle="Click a GL account bar to filter matching journal lines"
            loading={loading}
            empty={chartsData.accountDebitCredit.length === 0}
          >
            <ReportBarChart
              data={chartsData.accountDebitCredit}
              dataKeys={[
                { key: "debit", name: "Debit" },
                { key: "credit", name: "Credit" },
              ]}
              onBarClick={(pt) => {
                const code = String(pt.accountCode || "");
                if (code) {
                  setSelectedAccountCode((prev) => (prev === code ? null : code));
                }
              }}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Payroll Expense Distribution"
            subtitle="Salary & employer contribution expense accounts"
            loading={loading}
            empty={chartsData.expenseDist.length === 0}
          >
            <ReportDonutChart data={chartsData.expenseDist} />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department-wise Accounting Allocation"
            subtitle="Debit expense distribution across organizational departments"
            loading={loading}
            empty={chartsData.deptAllocation.length === 0}
          >
            <ReportBarChart
              data={chartsData.deptAllocation}
              dataKeys={[{ key: "debit", name: "Debit Allocation" }]}
              horizontal
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Payroll Liability Breakdown"
            subtitle="PF, ESI, TDS, PT, Salary Payable, and Loan Recovery credits"
            loading={loading}
            empty={chartsData.liabilityDist.length === 0}
          >
            <ReportDonutChart data={chartsData.liabilityDist} />
          </ReportChartWrapper>
        </ChartsGrid>

        <ReportChartWrapper
          title="Journal Status Distribution"
          subtitle="Posted vs pending journal line counts"
          loading={loading}
          empty={chartsData.statusDist.length === 0}
        >
          <ReportDonutChart data={chartsData.statusDist} formatType="number" height={240} />
        </ReportChartWrapper>

        {/* Section E: Table */}
        <ReportDataTable
          columns={columns}
          rows={filteredRows}
          totalRecords={filteredRows.length}
          page={filters.page ?? 1}
          limit={filters.limit ?? 25}
          loading={loading}
          error={error}
          sortBy={filters.sortBy}
          sortDir={filters.sortDir}
          onSort={toggleSort}
          onPageChange={setPage}
          searchValue={tableSearch}
          onSearchChange={setTableSearch}
          searchPlaceholder="Search GL code, account, narration..."
          onRowClick={(row) => {
            const code = String(row.accountCode || "");
            if (code) setSelectedAccountCode((prev) => (prev === code ? null : code));
          }}
          emptyMessage="No Accounting Journal Entries Available"
          emptyDescription="Authoritative GL journal lines appear once payroll is calculated and mapped to ledger accounts."
        />

        <ReportTotalsReconciliationCard summary={reconciliationSummary} />
      </ReportPageLayout>
    </ReportAccessGuard>
  );
}

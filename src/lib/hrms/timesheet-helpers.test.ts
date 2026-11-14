import test from "node:test";
import assert from "node:assert/strict";
import {
  extractTimesheetList,
  mapPendingApprovalRecords,
  mapTimesheetEntries,
  mapTimesheetHistoryRecords,
  normalizeTimesheetStatus,
} from "./timesheet-helpers";

test("normalizeTimesheetStatus handles undefined, non-strings, and casing safely", () => {
  assert.equal(normalizeTimesheetStatus(undefined), "draft");
  assert.equal(normalizeTimesheetStatus(null), "draft");
  assert.equal(normalizeTimesheetStatus(200), "draft");
  assert.equal(normalizeTimesheetStatus("PENDING"), "pending");
  assert.equal(normalizeTimesheetStatus(" Approved "), "approved");
  assert.equal(normalizeTimesheetStatus("REJECTED"), "rejected");
  assert.equal(normalizeTimesheetStatus("unknown_state"), "draft");
});

test("extractTimesheetList unwraps arrays, res.data arrays, res.data.items, and empty fallback objects without throwing", () => {
  assert.deepEqual(extractTimesheetList({ success: true, data: { items: [], total: 0 } }), []);
  assert.deepEqual(extractTimesheetList(null), []);
  assert.deepEqual(extractTimesheetList({ success: true, data: [{ id: "1" }] }), [{ id: "1" }]);
  assert.deepEqual(
    extractTimesheetList({ success: true, data: { items: [{ id: "2" }], total: 1 } }),
    [{ id: "2" }],
  );
  assert.deepEqual(extractTimesheetList([{ id: "3" }]), [{ id: "3" }]);
});

test("mapTimesheetHistoryRecords and mapPendingApprovalRecords tolerate missing entries/status", () => {
  const history = mapTimesheetHistoryRecords({
    success: true,
    data: {
      items: [
        {
          id: "ts-1",
          week_start_date: "2026-11-02",
          submitted_at: "2026-11-08T10:00:00Z",
          entries: [
            {
              project_id: "proj_operations",
              monday_hours: "8",
              tuesday_hours: 8,
              wednesday_hours: "8",
              thursday_hours: 8,
              friday_hours: 8,
              saturday_hours: 0,
              sunday_hours: 0,
            },
          ],
        },
      ],
    },
  });

  assert.equal(history.length, 1);
  assert.equal(history[0].status, "draft");
  assert.equal(history[0].totalHours, 40);

  const emptyHistory = mapTimesheetHistoryRecords({ success: true, data: { items: [], total: 0 } });
  assert.deepEqual(emptyHistory, []);

  const approvals = mapPendingApprovalRecords(
    {
      success: true,
      data: {
        items: [
          {
            id: "apr-1",
            employee: { fullName: "Marcus Sterling", department: "Engineering" },
            week_start_date: "2026-11-09",
            status: "PENDING",
            entries: [{ project_id: "proj_engineering", monday_hours: 8, description: "API work" }],
          },
        ],
      },
    },
    [{ id: "proj_engineering", name: "Engineering & Development" }],
  );

  assert.equal(approvals.length, 1);
  assert.equal(approvals[0].details[0].project, "Engineering & Development");
  assert.equal(approvals[0].totalHours, 8);
});

test("mapTimesheetEntries creates default row when empty and parses string/number hours safely", () => {
  let seq = 0;
  const fallback = mapTimesheetEntries(undefined, "proj_operations", () => `row_${++seq}`);
  assert.equal(fallback.length, 1);
  assert.equal(fallback[0].projectId, "proj_operations");
  assert.deepEqual(fallback[0].hours, [0, 0, 0, 0, 0, 0, 0]);

  const parsed = mapTimesheetEntries(
    [{ id: "e1", project_id: "proj_engineering", monday_hours: "7.5", description: "Build" }],
    "proj_operations",
    () => `row_${++seq}`,
  );
  assert.equal(parsed[0].hours[0], 7.5);
  assert.equal(parsed[0].hours[1], 0);
});

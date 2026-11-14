import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateExitClearanceSummary,
  computeLastWorkingDay,
  filterExitsForEmployee,
} from "./exit-helpers";
import type { ExitCase } from "./types";

const SAMPLE_EXITS: ExitCase[] = [
  {
    id: "ext-1",
    employee: "Ryan Cooper",
    employeeId: "EMP-2001",
    role: "Engineer",
    dept: "Engineering",
    manager: "Alex Vance",
    resignDate: "2026-10-30",
    lastWorkingDay: "2026-11-30",
    noticeDays: 30,
    reason: "Higher studies",
    stage: "Clearance Pending",
    isResignationApproved: true,
    assetsToReturn: [{ assetId: "a1", name: "Laptop", status: "Returned" }],
    clearances: [
      { dept: "IT", owner: "IT Admin", status: "Cleared" },
      { dept: "Finance", owner: "Finance", status: "Pending" },
    ],
    settlement: {
      baseSalaryEarned: 80000,
      leaveEncashment: 12000,
      bonusProrata: 0,
      incentives: 0,
      taxDeduction: 5000,
      recoveryAmount: 0,
      netPayable: 87000,
      paymentStatus: "Pending",
    },
    interview: { status: "Pending", rating: 0, feedback: "", attritionReason: "Higher studies" },
    deactivated: false,
    timeline: [],
  },
  {
    id: "ext-2",
    employee: "Kabir Mehta",
    employeeId: "EMP-3655",
    role: "Senior Software Engineer",
    dept: "Engineering",
    manager: "Alex Vance",
    resignDate: "2026-11-10",
    lastWorkingDay: "2026-12-10",
    noticeDays: 30,
    reason: "Relocation",
    stage: "Resignation Submitted",
    isResignationApproved: false,
    assetsToReturn: [],
    clearances: [{ dept: "HR", owner: "Elena", status: "Pending" }],
    settlement: {
      baseSalaryEarned: 0,
      leaveEncashment: 0,
      bonusProrata: 0,
      incentives: 0,
      taxDeduction: 0,
      recoveryAmount: 0,
      netPayable: 0,
      paymentStatus: "Pending",
    },
    interview: { status: "Pending", rating: 0, feedback: "", attritionReason: "Relocation" },
    deactivated: false,
    timeline: [],
  },
];

test("filterExitsForEmployee strictly isolates signed-in employee exit records", () => {
  const kabirExits = filterExitsForEmployee(SAMPLE_EXITS, "Kabir Mehta", "EMP-3655");
  assert.equal(kabirExits.length, 1);
  assert.equal(kabirExits[0].id, "ext-2");

  const anonymous = filterExitsForEmployee(SAMPLE_EXITS, "", "");
  assert.deepEqual(anonymous, []);
});

test("calculateExitClearanceSummary computes percentage across assets and department clearances", () => {
  const summary = calculateExitClearanceSummary(SAMPLE_EXITS[0]);
  assert.equal(summary.completedSteps, 2);
  assert.equal(summary.totalSteps, 3);
  assert.equal(summary.percentage, 67);
  assert.equal(calculateExitClearanceSummary(null).percentage, 0);
});

test("computeLastWorkingDay adds notice days accurately", () => {
  assert.equal(computeLastWorkingDay("2026-11-01", 30), "2026-12-01");
});

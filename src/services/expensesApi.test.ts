import test from "node:test";
import assert from "node:assert/strict";
import {
  filterExpensesByEmployeeId,
  filterExpensesForEmployee,
  mapExpenseFromBackend,
} from "../lib/hrms/expense-helpers";

test("mapExpenseFromBackend normalizes snake_case fields cleanly", () => {
  const mapped = mapExpenseFromBackend({
    id: "exp-1",
    employee_name: "Kabir Mehta",
    category: "TRAVEL",
    amount: 3850,
    currency: "INR",
    date: "2026-11-06",
    description: "Airport cab",
    status: "CHANGES_REQUESTED",
    manager_note: "Attach GST invoice",
  });

  assert.equal(mapped.id, "exp-1");
  assert.equal(mapped.employee, "Kabir Mehta");
  assert.equal(mapped.category, "travel");
  assert.equal(mapped.amount, 3850);
  assert.equal(mapped.status, "changes-requested");
  assert.equal(mapped.managerNote, "Attach GST invoice");
});

test("mapExpenseFromBackend unwraps nested employee summary and expense_date", () => {
  const mapped = mapExpenseFromBackend({
    id: "exp-2",
    employee_id: "emp-uuid-1",
    expense_date: "2026-11-12",
    category: "meals",
    amount: 950,
    currency: "INR",
    description: "Team lunch",
    status: "submitted",
    rejection_reason: "Need itemized receipt",
    employee: {
      id: "emp-uuid-1",
      employee_code: "EMP-101",
      name: "Vinit Sharma",
      department: "Engineering",
      designation: "CTO",
    },
  });

  assert.equal(mapped.employee, "Vinit Sharma");
  assert.equal(mapped.employeeId, "emp-uuid-1");
  assert.equal(mapped.employeeCode, "EMP-101");
  assert.equal(mapped.date, "2026-11-12");
  assert.equal(mapped.status, "pending");
  assert.equal(mapped.managerNote, "Need itemized receipt");
});

test("filterExpensesForEmployee isolates only the signed-in employee's claims", () => {
  const all = [
    mapExpenseFromBackend({ id: "1", employee_name: "Kabir Mehta", amount: 1200, status: "pending" }),
    mapExpenseFromBackend({ id: "2", employee_name: "Elena Rostova", amount: 18500, status: "paid" }),
    mapExpenseFromBackend({ id: "3", employee_name: "Marcus Sterling", amount: 14800, status: "pending" }),
    mapExpenseFromBackend({ id: "4", employee_name: "kabir mehta", amount: 9200, status: "paid" }),
  ];

  const kabirClaims = filterExpensesForEmployee(all, "Kabir Mehta");
  assert.deepEqual(
    kabirClaims.map((c) => c.id),
    ["1", "4"],
  );
  assert.equal(filterExpensesForEmployee(all, "").length, 0);
});

test("filterExpensesByEmployeeId keeps same-named employees isolated", () => {
  const all = [
    mapExpenseFromBackend({
      id: "exp-a",
      employee_id: "uuid-vinit-1",
      employee: { id: "uuid-vinit-1", employee_code: "EMP-1", name: "Vinit Sharma" },
      amount: 1000,
    }),
    mapExpenseFromBackend({
      id: "exp-b",
      employee_id: "uuid-vinit-2",
      employee: { id: "uuid-vinit-2", employee_code: "EMP-2", name: "Vinit Sharma" },
      amount: 2000,
    }),
  ];

  const vinit1Claims = filterExpensesByEmployeeId(all, "uuid-vinit-1");
  assert.deepEqual(
    vinit1Claims.map((c) => c.id),
    ["exp-a"],
  );
});

import test from "node:test";
import assert from "node:assert/strict";
import { filterExpensesForEmployee, mapExpenseFromBackend } from "../lib/hrms/expense-helpers";

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

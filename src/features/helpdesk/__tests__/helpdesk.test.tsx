import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { helpdeskApi, getHelpdeskErrorMessage } from "../helpdeskApi";
import { TicketTable } from "../components/TicketTable";
import {
  HelpdeskStatusBadge,
  HelpdeskPriorityBadge,
  HelpdeskSlaBadge,
} from "../components/HelpdeskBadges";
import {
  HelpdeskEmptyState,
  HelpdeskErrorState,
  HelpdeskAccessDeniedState,
} from "../components/HelpdeskStates";
import { HelpdeskMetricsGrid } from "../components/HelpdeskMetricsGrid";
import { KnowledgeBaseSection } from "../components/KnowledgeBaseSection";
import type { HelpdeskTicket, HelpdeskMetrics, HelpdeskFaq } from "../types";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe("OFC360 Helpdesk System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. helpdeskApi Client & Contract Integration", () => {
    it("fetches authenticated employee's tickets via GET /api/v1/helpdesk/tickets/my", async () => {
      const mockTickets: HelpdeskTicket[] = [
        {
          id: "tick-1",
          ticket_number: "HD-1001",
          title: "VPN connection dropping repeatedly",
          category: "it_software",
          priority: "high",
          status: "open",
          requester_id: "req-1",
          requester_name: "Alice Smith",
          created_at: "2026-10-01T10:00:00Z",
          updated_at: "2026-10-01T10:00:00Z",
          sla_status: "ON_TRACK",
        },
      ];

      server.use(
        http.get("*/api/v1/helpdesk/tickets/my", () => {
          return HttpResponse.json({ data: mockTickets });
        })
      );

      const res = await helpdeskApi.getMyTickets();
      expect(res).toHaveLength(1);
      expect(res[0].ticket_number).toBe("HD-1001");
      expect(res[0].title).toBe("VPN connection dropping repeatedly");
    });

    it("creates support ticket via POST /api/v1/helpdesk/tickets", async () => {
      server.use(
        http.post("*/api/v1/helpdesk/tickets", async ({ request }) => {
          const body = (await request.json()) as Record<string, unknown>;
          return HttpResponse.json({
            data: {
              id: "tick-new-123",
              ticket_number: "HD-1042",
              title: body.title,
              category: body.category,
              priority: body.priority,
              status: "open",
              requester_id: "req-1",
              created_at: "2026-10-04T09:00:00Z",
              updated_at: "2026-10-04T09:00:00Z",
            },
          });
        })
      );

      const ticket = await helpdeskApi.createTicket({
        title: "Keyboard key stuck on Dell laptop",
        description: "The spacebar is sticky and registering double spaces.",
        category: "it_hardware",
        priority: "medium",
      });

      expect(ticket.id).toBe("tick-new-123");
      expect(ticket.ticket_number).toBe("HD-1042");
      expect(ticket.title).toBe("Keyboard key stuck on Dell laptop");
      expect(ticket.category).toBe("it_hardware");
    });

    it("fetches single ticket and comments via GET /api/v1/helpdesk/tickets/{id} and comments", async () => {
      server.use(
        http.get("*/api/v1/helpdesk/tickets/tick-abc", () => {
          return HttpResponse.json({
            data: {
              id: "tick-abc",
              ticket_number: "HD-2000",
              title: "Payroll discrepancy October",
              category: "payroll",
              priority: "high",
              status: "in_progress",
              requester_id: "req-1",
              created_at: "2026-10-02T12:00:00Z",
              updated_at: "2026-10-03T14:00:00Z",
            },
          });
        }),
        http.get("*/api/v1/helpdesk/tickets/tick-abc/comments", () => {
          return HttpResponse.json([
            {
              id: "comm-1",
              ticket_id: "tick-abc",
              author_id: "agent-1",
              author_name: "HR Lead",
              content: "We are reviewing your tax deduction breakdown.",
              created_at: "2026-10-03T14:00:00Z",
            },
          ]);
        })
      );

      const ticket = await helpdeskApi.getTicketById("tick-abc");
      const comments = await helpdeskApi.getTicketComments("tick-abc");

      expect(ticket.ticket_number).toBe("HD-2000");
      expect(comments).toHaveLength(1);
      expect(comments[0].content).toContain("tax deduction breakdown");
    });

    it("adds reply comment to ticket via POST /comments", async () => {
      server.use(
        http.post("*/api/v1/helpdesk/tickets/tick-abc/comments", async ({ request }) => {
          const body = (await request.json()) as { content: string };
          return HttpResponse.json({
            data: {
              id: "comm-2",
              ticket_id: "tick-abc",
              author_id: "user-1",
              author_name: "Employee",
              content: body.content,
              created_at: "2026-10-04T09:30:00Z",
            },
          });
        })
      );

      const comment = await helpdeskApi.addTicketComment("tick-abc", {
        content: "Attached the payslip for reference.",
      });

      expect(comment.id).toBe("comm-2");
      expect(comment.content).toBe("Attached the payslip for reference.");
    });

    it("updates ticket status via PATCH /api/v1/helpdesk/tickets/{id}/status", async () => {
      server.use(
        http.patch("*/api/v1/helpdesk/tickets/tick-abc/status", async ({ request }) => {
          const body = (await request.json()) as { status: string };
          return HttpResponse.json({
            data: {
              id: "tick-abc",
              status: body.status,
            },
          });
        })
      );

      const updated = await helpdeskApi.updateTicketStatus("tick-abc", {
        status: "resolved",
      });

      expect(updated.status).toBe("resolved");
    });

    it("assigns ticket agent via PATCH /api/v1/helpdesk/tickets/{id}/assign", async () => {
      server.use(
        http.patch("*/api/v1/helpdesk/tickets/tick-abc/assign", async ({ request }) => {
          const body = (await request.json()) as { agent_id: string };
          return HttpResponse.json({
            data: {
              id: "tick-abc",
              assigned_agent_id: body.agent_id,
              assigned_agent_name: "Senior Support Specialist",
            },
          });
        })
      );

      const updated = await helpdeskApi.assignTicket("tick-abc", {
        agent_id: "agent-specialist-99",
      });

      expect(updated.assigned_agent_id).toBe("agent-specialist-99");
      expect(updated.assigned_agent_name).toBe("Senior Support Specialist");
    });

    it("adds agent internal note via POST /api/v1/helpdesk/tickets/{id}/internal-notes", async () => {
      server.use(
        http.post("*/api/v1/helpdesk/tickets/tick-abc/internal-notes", () => {
          return HttpResponse.json({ success: true, message: "Internal note saved" });
        })
      );

      const res = await helpdeskApi.addInternalNote("tick-abc", {
        note: "Diagnostic run showed router port 8080 timeout.",
      });

      expect(res.success).toBe(true);
    });

    it("fetches real Helpdesk metrics via GET /api/v1/helpdesk/admin/metrics", async () => {
      const mockMetrics: HelpdeskMetrics = {
        total_tickets: 42,
        open_tickets: 10,
        in_progress_tickets: 8,
        resolved_tickets: 24,
        sla_compliance_percentage: 92.5,
        avg_first_response_time_minutes: 15.2,
        avg_resolution_time_hours: 3.4,
        by_category: { it_hardware: 20, hr_policy: 12, payroll: 10 },
        by_priority: { low: 10, medium: 20, high: 10, urgent: 2 },
      };

      server.use(
        http.get("*/api/v1/helpdesk/admin/metrics", () => {
          return HttpResponse.json({ data: mockMetrics });
        })
      );

      const metrics = await helpdeskApi.getHelpdeskMetrics();
      expect(metrics.total_tickets).toBe(42);
      expect(metrics.sla_compliance_percentage).toBe(92.5);
      expect(metrics.open_tickets).toBe(10);
    });

    it("uploads ticket attachment file via multipart POST", async () => {
      server.use(
        http.post("*/api/v1/helpdesk/tickets/attachments/upload", () => {
          return HttpResponse.json({
            data: {
              url: "/uploads/helpdesk/screenshot-err-123.png",
              filename: "screenshot-err-123.png",
              size: 4096,
            },
          });
        })
      );

      const fakeFile = new File(["dummy data"], "screenshot.png", { type: "image/png" });
      const uploadRes = await helpdeskApi.uploadAttachment(fakeFile);
      expect(uploadRes.url).toBe("/uploads/helpdesk/screenshot-err-123.png");
    });
  });

  describe("2. UI State & Empty/Error Handling", () => {
    it("renders proper empty state when no tickets exist without fake data fallback", () => {
      render(
        <HelpdeskEmptyState
          title="No tickets found."
          description="You currently have no open or past support tickets."
        />
      );

      expect(screen.getByText("No tickets found.")).toBeDefined();
      expect(
        screen.getByText("You currently have no open or past support tickets.")
      ).toBeDefined();
    });

    it("renders genuine error state when backend API fails", () => {
      const handleRetry = vi.fn();
      render(
        <HelpdeskErrorState
          title="Unable to load tickets. Please try again."
          error="Network timeout on gateway"
          onRetry={handleRetry}
        />
      );

      expect(screen.getByText("Unable to load tickets. Please try again.")).toBeDefined();
      expect(screen.getByText("Network timeout on gateway")).toBeDefined();

      const retryBtn = screen.getByRole("button", { name: /retry/i });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it("renders Super Admin access prohibited message correctly", () => {
      render(
        <HelpdeskAccessDeniedState
          title="Super Admin Access Prohibited"
          description="Super Administrators do not have access to the Helpdesk module."
        />
      );

      expect(screen.getByText("Super Admin Access Prohibited")).toBeDefined();
      expect(
        screen.getByText("Super Administrators do not have access to the Helpdesk module.")
      ).toBeDefined();
    });
  });

  describe("3. Ticket Table & Filtering", () => {
    const sampleTickets: HelpdeskTicket[] = [
      {
        id: "t1",
        ticket_number: "HD-101",
        title: "Broken monitor cable",
        category: "it_hardware",
        priority: "medium",
        status: "open",
        requester_id: "u1",
        requester_name: "Bob",
        created_at: "2026-10-01T08:00:00Z",
        updated_at: "2026-10-01T08:00:00Z",
        sla_status: "ON_TRACK",
      },
      {
        id: "t2",
        ticket_number: "HD-102",
        title: "Leave balance discrepancy",
        category: "hr_policy",
        priority: "high",
        status: "in_progress",
        requester_id: "u2",
        requester_name: "Carol",
        created_at: "2026-10-02T09:00:00Z",
        updated_at: "2026-10-02T09:00:00Z",
        sla_status: "AT_RISK",
      },
    ];

    it("renders real tickets and handles selection", () => {
      const handleSelect = vi.fn();
      render(
        <TicketTable
          tickets={sampleTickets}
          onSelectTicket={handleSelect}
          showRequesterColumn={true}
        />
      );

      expect(screen.getByText("Broken monitor cable")).toBeDefined();
      expect(screen.getByText("Leave balance discrepancy")).toBeDefined();
      expect(screen.getByText("HD-101")).toBeDefined();
      expect(screen.getByText("HD-102")).toBeDefined();

      fireEvent.click(screen.getByText("Broken monitor cable"));
      expect(handleSelect).toHaveBeenCalledWith(sampleTickets[0]);
    });

    it("searches and filters tickets dynamically", () => {
      render(<TicketTable tickets={sampleTickets} onSelectTicket={vi.fn()} />);

      const searchInput = screen.getByPlaceholderText(
        "Search by ticket #, subject, or requester..."
      );
      fireEvent.change(searchInput, { target: { value: "cable" } });

      expect(screen.getByText("Broken monitor cable")).toBeDefined();
      expect(screen.queryByText("Leave balance discrepancy")).toBeNull();
    });

    it("filters by department correctly (HR vs IT)", () => {
      const { rerender } = render(
        <TicketTable
          tickets={sampleTickets}
          onSelectTicket={vi.fn()}
          filterDepartment="IT"
        />
      );

      expect(screen.getByText("Broken monitor cable")).toBeDefined();
      expect(screen.queryByText("Leave balance discrepancy")).toBeNull();

      rerender(
        <TicketTable
          tickets={sampleTickets}
          onSelectTicket={vi.fn()}
          filterDepartment="HR"
        />
      );

      expect(screen.queryByText("Broken monitor cable")).toBeNull();
      expect(screen.getByText("Leave balance discrepancy")).toBeDefined();
    });
  });

  describe("4. Metrics Grid Calculations", () => {
    it("displays live aggregated stats from backend metrics", () => {
      const metrics: HelpdeskMetrics = {
        total_tickets: 50,
        open_tickets: 12,
        in_progress_tickets: 6,
        resolved_tickets: 30,
        sla_compliance_percentage: 95.5,
        avg_first_response_time_minutes: 22.0,
        avg_resolution_time_hours: 4.5,
        by_category: { it_hardware: 30, hr_policy: 20 },
        by_priority: { high: 15, low: 35 },
      };

      render(<HelpdeskMetricsGrid metrics={metrics} />);

      expect(screen.getByText("50")).toBeDefined();
      expect(screen.getByText("12")).toBeDefined();
      expect(screen.getByText("95.5%")).toBeDefined();
      expect(screen.getByText("22.0m")).toBeDefined();
      expect(screen.getByText("4.5h")).toBeDefined();
    });
  });

  describe("5. Knowledge Base Section", () => {
    it("renders FAQs and handles feedback buttons", async () => {
      const mockFaqs: HelpdeskFaq[] = [
        {
          id: "faq-1",
          question: "How do I request a replacement charger?",
          answer: "Submit an IT Hardware ticket with your asset tag number.",
          category: "IT",
          helpful_count: 5,
          unhelpful_count: 1,
        },
      ];

      server.use(
        http.get("*/api/v1/helpdesk/faqs", () => {
          return HttpResponse.json(mockFaqs);
        })
      );

      render(<KnowledgeBaseSection canManage={true} />);

      await waitFor(() => {
        expect(screen.getByText("How do I request a replacement charger?")).toBeDefined();
      });

      // Expand accordion
      fireEvent.click(screen.getByText("How do I request a replacement charger?"));
      expect(
        screen.getByText("Submit an IT Hardware ticket with your asset tag number.")
      ).toBeDefined();

      // Vote helpful
      const helpfulBtn = screen.getByRole("button", { name: /yes \(5\)/i });
      fireEvent.click(helpfulBtn);

      await waitFor(() => {
        expect(screen.getByText("Yes (6)")).toBeDefined();
      });
    });
  });
});

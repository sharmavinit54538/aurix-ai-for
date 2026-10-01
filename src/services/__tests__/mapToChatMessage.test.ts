import { describe, it, expect } from "vitest";
import { mapToChatMessage } from "../aiHub.api";

describe("mapToChatMessage", () => {
  it("correctly maps a plain answer message", () => {
    const raw = {
      id: "msg-123",
      role: "assistant",
      answer: "The company headcount is currently 154 employees.",
      conversation_id: "conv-abc",
      timestamp: "2026-10-01T10:00:00.000Z",
    };

    const msg = mapToChatMessage(raw);

    expect(msg.id).toBe("msg-123");
    expect(msg.conversationId).toBe("conv-abc");
    expect(msg.sender).toBe("assistant");
    expect(msg.role).toBe("ai");
    expect(msg.content).toBe("The company headcount is currently 154 employees.");
    expect(msg.cardType).toBeUndefined();
    expect(msg.cardData).toBeUndefined();
    expect(msg.actionRequired).toBeUndefined();
    expect(msg.tables).toBeUndefined();
    expect(msg.charts).toBeUndefined();
  });

  it("retains tables without synthesizing a fake payroll card", () => {
    const tableData = [
      {
        title: "Department Breakdown",
        headers: ["Department", "Headcount", "Budget"],
        rows: [
          ["Engineering", "65", "$650,000"],
          ["Product", "20", "$220,000"],
          ["Marketing", "15", "$150,000"],
        ],
      },
    ];

    const raw = {
      message: "Here is the department breakdown table.",
      tables: tableData,
      conversationId: "conv-dept",
    };

    const msg = mapToChatMessage(raw);

    expect(msg.content).toBe("Here is the department breakdown table.");
    expect(msg.tables).toEqual(tableData);
    // CRITICAL: Must NOT synthesize a fake payroll cardType or cardData
    expect(msg.cardType).toBeUndefined();
    expect(msg.cardData).toBeUndefined();
  });

  it("correctly maps explicit cardType and cardData", () => {
    const raw = {
      id: "msg-candidate",
      content: "Found matching candidate for the Senior Frontend Engineer role.",
      cardType: "candidate",
      cardData: {
        name: "Aarav Mehta",
        appliedPosition: "Senior Frontend Engineer",
        yearsExperience: 6,
        atsScore: 94,
        summary: "Strong expertise in React, TypeScript, and state management.",
      },
    };

    const msg = mapToChatMessage(raw);

    expect(msg.cardType).toBe("candidate");
    expect(msg.cardData).toEqual({
      name: "Aarav Mehta",
      appliedPosition: "Senior Frontend Engineer",
      yearsExperience: 6,
      atsScore: 94,
      summary: "Strong expertise in React, TypeScript, and state management.",
    });
    expect(msg.content).toBe("Found matching candidate for the Senior Frontend Engineer role.");
  });

  it("correctly maps actionRequired payload", () => {
    const raw = {
      id: "msg-action",
      content: "I recommend moving the candidate to the technical interview stage.",
      actionRequired: {
        actionName: "Move Stage: Technical",
        description: "Advance Aarav Mehta from screening to technical round.",
        payload: {
          candidateId: "cand-789",
          stage: "technical",
        },
      },
    };

    const msg = mapToChatMessage(raw);

    expect(msg.actionRequired).toEqual({
      actionName: "Move Stage: Technical",
      description: "Advance Aarav Mehta from screening to technical round.",
      payload: {
        candidateId: "cand-789",
        stage: "technical",
      },
    });
  });

  it("handles embedded JSON blocks containing cardType and actionRequired", () => {
    const raw = {
      content:
        '```json\n{"cardType": "job", "cardData": {"title": "Full Stack Dev", "department": "Engineering"}}\n```\nHere is the job requisition.',
    };

    const msg = mapToChatMessage(raw);

    expect(msg.cardType).toBe("job");
    expect(msg.cardData).toEqual({
      title: "Full Stack Dev",
      department: "Engineering",
    });
    expect(msg.content).toBe("Here is the job requisition.");
  });
});

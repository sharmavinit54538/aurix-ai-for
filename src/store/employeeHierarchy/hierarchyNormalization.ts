import { z } from "zod";
import type { BackendHierarchyNode, ReportingChainDetails } from "./employeeHierarchyTypes";

const optionalText = z.string().nullable().optional();
const nodeSchema: z.ZodType<BackendHierarchyNode> = z.lazy(() => z.object({
  id: z.string().min(1),
  employee_id: optionalText,
  first_name: z.string(),
  last_name: z.string().nullish().transform(value => value ?? ""),
  designation: optionalText,
  department: optionalText,
  email: optionalText,
  role: optionalText,
  profile_photo_url: optionalText,
  reporting_to: optionalText,
  reporting_manager_name: optionalText,
  status: optionalText,
  branch: optionalText,
  shift: optionalText,
  employment_type: optionalText,
  employment_status: optionalText,
  joining_date: optionalText,
  date_of_birth: optionalText,
  ctc: z.union([z.string(), z.number()]).nullable().optional(),
  work_location_type: optionalText,
  skills: z.array(z.string()).nullish().transform(value => value ?? []),
  children: z.array(nodeSchema).nullish().transform(value => value ?? []),
}));

export class HierarchyResponseError extends Error {
  constructor() {
    super("The server returned invalid organizational data. Please retry or contact support.");
    this.name = "HierarchyResponseError";
  }
}

function unwrapResponse(response: unknown): unknown {
  if (response && typeof response === "object" && "success" in response && response.success === false) {
    throw new HierarchyResponseError();
  }
  return response && typeof response === "object" && "data" in response ? response.data : response;
}

export function normalizeHierarchy(response: unknown): BackendHierarchyNode[] {
  let data = unwrapResponse(response);
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if ("roots" in data) data = data.roots;
    else if ("items" in data) data = data.items;
  }
  const parsed = z.array(nodeSchema).safeParse(data);
  if (!parsed.success) throw new HierarchyResponseError();
  const seenIds = new Set<string>();
  const visit = (node: BackendHierarchyNode) => {
    if (seenIds.has(node.id)) throw new HierarchyResponseError();
    seenIds.add(node.id);
    node.children.forEach(visit);
  };
  parsed.data.forEach(visit);
  return parsed.data;
}

export function normalizeReportingDetails(response: unknown): ReportingChainDetails {
  const parsed = z.object({
    employee: nodeSchema,
    manager: nodeSchema.nullish().transform(value => value ?? null),
    direct_reports: z.array(nodeSchema).nullish().transform(value => value ?? []),
    reporting_chain: z.array(nodeSchema).nullish().transform(value => value ?? []),
    organization_level: z.number().int().nonnegative().nullish().transform(value => value ?? null),
  }).safeParse(unwrapResponse(response));
  if (!parsed.success) throw new HierarchyResponseError();
  return parsed.data;
}

export function flattenHierarchy(trees: BackendHierarchyNode[]): BackendHierarchyNode[] {
  return trees.flatMap(node => [node, ...flattenHierarchy(node.children)]);
}

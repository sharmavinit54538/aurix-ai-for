import { apiInstance } from "@/api";
import type { RecruitmentDataPayload } from "@/features/admin/recruitment/recruitmentTypes";
import type { Candidate, Interview, Job, Offer } from "@/features/admin/recruitment/types";
import {
  extractItems,
  mapCandidateToFrontend,
  mapInterviewToFrontend,
  mapJobToFrontend,
  mapOfferToFrontend,
} from "@/features/admin/recruitment/utils/apiMappers";

const INITIAL_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Staff AI Engineer",
    department: "AI Research",
    employmentType: "Full-time",
    experience: "5-8 yrs",
    skills: ["PyTorch", "LLMs", "Distributed Systems", "Python", "CUDA"],
    salaryMin: 3200000,
    salaryMax: 4800000,
    currency: "INR",
    vacancies: 2,
    location: "Bengaluru · Global HQ",
    workMode: "Hybrid",
    description:
      "Lead architecture and training of enterprise multi-agent reasoning models and low-latency inference pipelines.",
    responsibilities: [
      "Architect and optimize large-scale LLM inference and fine-tuning pipelines",
      "Collaborate with product and platform teams to ship enterprise AI copilots",
      "Mentor senior engineers and drive technical standards across AI Research",
    ],
    requirements: [
      "5+ years building production ML/AI systems at scale",
      "Deep proficiency in Python, PyTorch, and distributed training frameworks",
      "Track record of deploying high-throughput inference services",
    ],
    benefits: ["Comprehensive Health Cover", "ESOPs", "Flexible Hybrid Work", "Learning Budget"],
    hiringManager: "Marcus Sterling",
    recruiter: "Elena Rostova",
    status: "active",
    publishedAt: "2026-10-15T10:00:00Z",
    closingAt: "2026-12-15T10:00:00Z",
    applicants: 24,
  },
  {
    id: "job-2",
    title: "Distributed Systems Architect",
    department: "Engineering",
    employmentType: "Full-time",
    experience: "6-10 yrs",
    skills: ["Go", "Kubernetes", "PostgreSQL", "Kafka", "System Design"],
    salaryMin: 2800000,
    salaryMax: 4200000,
    currency: "INR",
    vacancies: 1,
    location: "Remote · Pan-India",
    workMode: "Remote",
    description:
      "Design fault-tolerant, multi-region microservices and event-driven data pipelines powering OFC360.",
    responsibilities: [
      "Own core platform reliability, scalability, and multi-tenant data isolation",
      "Lead architectural reviews and performance tuning across backend services",
    ],
    requirements: [
      "6+ years in backend & distributed systems engineering",
      "Strong expertise in Go/TypeScript, PostgreSQL, Redis, and Kafka",
    ],
    benefits: ["Remote-First Setup Allowance", "Health Insurance", "Performance Bonus"],
    hiringManager: "Alex Vance",
    recruiter: "Elena Rostova",
    status: "active",
    publishedAt: "2026-10-20T10:00:00Z",
    closingAt: "2026-12-20T10:00:00Z",
    applicants: 18,
  },
  {
    id: "job-3",
    title: "Senior Product Designer",
    department: "Product",
    employmentType: "Full-time",
    experience: "4-7 yrs",
    skills: ["Figma", "Design Systems", "UX Research", "Prototyping"],
    salaryMin: 2200000,
    salaryMax: 3200000,
    currency: "INR",
    vacancies: 1,
    location: "Mumbai · Corporate Hub",
    workMode: "Hybrid",
    description:
      "Craft intuitive, high-density enterprise workflows and design systems for next-generation HR and Payroll teams.",
    responsibilities: [
      "Own end-to-end product design from discovery to high-fidelity Figma prototypes",
      "Evolve the OFC360 design system and component tokens",
    ],
    requirements: [
      "4+ years designing B2B SaaS or enterprise web applications",
      "Mastery of Figma, interactive prototyping, and design systems",
    ],
    benefits: ["Health Insurance", "MacBook Pro M3 Max", "Hybrid Flexibility"],
    hiringManager: "Sarah Chen",
    recruiter: "Elena Rostova",
    status: "active",
    publishedAt: "2026-11-01T10:00:00Z",
    closingAt: "2026-12-31T10:00:00Z",
    applicants: 31,
  },
  {
    id: "job-4",
    title: "Enterprise Account Executive",
    department: "Sales",
    employmentType: "Full-time",
    experience: "3-6 yrs",
    skills: ["Enterprise SaaS", "Consultative Selling", "CRM", "Negotiation"],
    salaryMin: 1800000,
    salaryMax: 2800000,
    currency: "INR",
    vacancies: 2,
    location: "Bengaluru · Global HQ",
    workMode: "Onsite",
    description: "Drive enterprise revenue growth across mid-market and Fortune 500 accounts.",
    responsibilities: ["Manage full-cycle enterprise sales and executive demos"],
    requirements: ["3+ years B2B SaaS closing experience"],
    benefits: ["Uncapped Commission", "Health Insurance"],
    hiringManager: "Alex Vance",
    recruiter: "Elena Rostova",
    status: "draft",
    publishedAt: "2026-11-05T10:00:00Z",
    closingAt: "2026-12-30T10:00:00Z",
    applicants: 9,
  },
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "+91 98201 44510",
    location: "Bengaluru, India",
    jobId: "job-1",
    applicationId: "app-1",
    appliedPosition: "Senior Staff AI Engineer",
    stage: "interview",
    atsScore: 94,
    jobMatch: 92,
    source: "LinkedIn",
    tags: ["Top Tier", "LLM Specialist"],
    skills: ["PyTorch", "LLMs", "Python", "CUDA", "Kubernetes"],
    yearsExperience: 7,
    currentCompany: "DeepScale Labs",
    currentRole: "Lead ML Engineer",
    expectedSalary: 4200000,
    noticeDays: 30,
    resumeName: "Aarav_Sharma_Resume.pdf",
    summary:
      "Staff ML Engineer with 7 years of experience building low-latency transformer inference engines and multi-agent architectures.",
    experience: [
      {
        company: "DeepScale Labs",
        role: "Lead ML Engineer",
        start: "2022",
        end: "Present",
        highlights: ["Scaled inference cluster to 40k req/s with 35% lower GPU cost"],
      },
    ],
    education: [{ school: "IIT Bombay", degree: "B.Tech Computer Science", start: "2015", end: "2019" }],
    projects: [],
    certifications: ["AWS Machine Learning Specialty"],
    languages: ["English", "Hindi"],
    feedback: [
      {
        interviewer: "Marcus Sterling",
        round: "Technical Round",
        rating: 4.8,
        notes: "Exceptional depth in distributed PyTorch and KV-cache optimization.",
        date: "2026-11-08",
      },
    ],
    notes: [
      {
        id: "note-1",
        at: "2026-11-08T14:30:00Z",
        author: "Elena Rostova",
        text: "Strong culture fit, fast-tracking to final panel.",
      },
    ],
    documents: [{ name: "Aarav_Sharma_Resume.pdf", type: "pdf" }],
    timeline: [
      {
        id: "tl-1",
        at: "2026-11-02T10:00:00Z",
        kind: "stage",
        title: "Applied for Senior Staff AI Engineer",
        actor: "Aarav Sharma",
      },
      {
        id: "tl-2",
        at: "2026-11-06T15:20:00Z",
        kind: "interview",
        title: "Moved to Interview stage",
        actor: "Elena Rostova",
      },
    ],
    appliedAt: "2026-11-02T10:00:00Z",
    applications: [
      {
        id: "app-1",
        jobId: "job-1",
        stage: "interview",
        appliedPosition: "Senior Staff AI Engineer",
        appliedAt: "2026-11-02T10:00:00Z",
      },
    ],
  },
  {
    id: "cand-2",
    name: "Meera Krishnan",
    email: "meera.k@outlook.com",
    phone: "+91 98450 22319",
    location: "Bengaluru, India",
    jobId: "job-2",
    applicationId: "app-2",
    appliedPosition: "Distributed Systems Architect",
    stage: "offer",
    atsScore: 96,
    jobMatch: 95,
    source: "Referral",
    tags: ["Architect", "Immediate Joiner"],
    skills: ["Go", "Kubernetes", "PostgreSQL", "Kafka", "Rust"],
    yearsExperience: 8,
    currentCompany: "CloudScale FinTech",
    currentRole: "Principal Backend Engineer",
    expectedSalary: 3800000,
    noticeDays: 15,
    resumeName: "Meera_Krishnan_CV.pdf",
    summary:
      "Distributed systems architect specializing in high-throughput financial ledger engines and multi-region Kubernetes clusters.",
    experience: [],
    education: [{ school: "BITS Pilani", degree: "M.E. Software Systems", start: "2016", end: "2018" }],
    projects: [],
    certifications: ["CKA - Certified Kubernetes Administrator"],
    languages: ["English", "Tamil", "Hindi"],
    feedback: [],
    notes: [],
    documents: [{ name: "Meera_Krishnan_CV.pdf", type: "pdf" }],
    timeline: [
      {
        id: "tl-3",
        at: "2026-11-09T11:00:00Z",
        kind: "offer",
        title: "Offer extended for Distributed Systems Architect",
        actor: "Alex Vance",
      },
    ],
    appliedAt: "2026-10-25T09:00:00Z",
    applications: [
      {
        id: "app-2",
        jobId: "job-2",
        stage: "offer",
        appliedPosition: "Distributed Systems Architect",
        appliedAt: "2026-10-25T09:00:00Z",
      },
    ],
  },
  {
    id: "cand-3",
    name: "Rohan Deshmukh",
    email: "rohan.design@gmail.com",
    phone: "+91 98112 77890",
    location: "Mumbai, India",
    jobId: "job-3",
    applicationId: "app-3",
    appliedPosition: "Senior Product Designer",
    stage: "screening",
    atsScore: 88,
    jobMatch: 86,
    source: "Career Site",
    tags: ["Design Systems", "B2B SaaS"],
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    yearsExperience: 5,
    currentCompany: "PulseUX Studio",
    currentRole: "Senior Product Designer",
    expectedSalary: 2600000,
    noticeDays: 30,
    resumeName: "Rohan_Deshmukh_Portfolio.pdf",
    summary: "Product designer focused on complex enterprise workflows and accessible design systems.",
    experience: [],
    education: [{ school: "NID Ahmedabad", degree: "B.Des Interaction Design", start: "2017", end: "2021" }],
    projects: [],
    certifications: [],
    languages: ["English", "Marathi", "Hindi"],
    feedback: [],
    notes: [],
    documents: [{ name: "Rohan_Deshmukh_Portfolio.pdf", type: "pdf" }],
    timeline: [
      {
        id: "tl-4",
        at: "2026-11-05T16:45:00Z",
        kind: "stage",
        title: "Shortlisted in AI Resume Screening",
        actor: "OFC360 AI",
      },
    ],
    appliedAt: "2026-11-03T12:00:00Z",
    applications: [
      {
        id: "app-3",
        jobId: "job-3",
        stage: "screening",
        appliedPosition: "Senior Product Designer",
        appliedAt: "2026-11-03T12:00:00Z",
      },
    ],
  },
  {
    id: "cand-4",
    name: "Ananya Verma",
    email: "ananya.verma@gmail.com",
    phone: "+91 99001 55678",
    location: "Hyderabad, India",
    jobId: "job-1",
    applicationId: "app-4",
    appliedPosition: "Senior Staff AI Engineer",
    stage: "hired",
    atsScore: 97,
    jobMatch: 94,
    source: "LinkedIn",
    tags: ["Hired", "AI Research"],
    skills: ["PyTorch", "Transformers", "Python", "Ray"],
    yearsExperience: 6,
    currentCompany: "NeuralCore AI",
    currentRole: "Senior AI Scientist",
    expectedSalary: 3900000,
    noticeDays: 15,
    resumeName: "Ananya_Verma_Resume.pdf",
    summary: "AI Scientist experienced in RLHF and enterprise RAG evaluation pipelines.",
    experience: [],
    education: [{ school: "IIIT Hyderabad", degree: "M.Tech CS & AI", start: "2018", end: "2020" }],
    projects: [],
    certifications: [],
    languages: ["English", "Hindi"],
    feedback: [],
    notes: [],
    documents: [{ name: "Ananya_Verma_Resume.pdf", type: "pdf" }],
    timeline: [
      {
        id: "tl-5",
        at: "2026-11-10T17:00:00Z",
        kind: "stage",
        title: "Moved to Hired",
        actor: "Elena Rostova",
      },
    ],
    appliedAt: "2026-10-18T10:00:00Z",
    applications: [
      {
        id: "app-4",
        jobId: "job-1",
        stage: "hired",
        appliedPosition: "Senior Staff AI Engineer",
        appliedAt: "2026-10-18T10:00:00Z",
      },
    ],
  },
];

const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: "int-1",
    interviewId: "int-1",
    roundId: "rnd-1",
    scheduleId: "sch-1",
    applicationId: "app-1",
    candidateId: "cand-1",
    candidateName: "Aarav Sharma",
    candidateEmail: "aarav.sharma@gmail.com",
    jobId: "job-1",
    jobTitle: "Senior Staff AI Engineer",
    round: "System Architecture & LLM Round",
    interviewerId: "emp-3",
    interviewer: "Marcus Sterling",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    durationMins: 60,
    timezone: "Asia/Kolkata",
    mode: "ONLINE",
    meetingLink: "https://meet.ofc360.com/int-aarav-sharma",
    status: "scheduled",
    isOverdue: false,
    rating: 4.8,
    recommendation: "PASS",
    feedback: "Strong understanding of distributed inference and tensor parallelism.",
  },
  {
    id: "int-2",
    interviewId: "int-2",
    roundId: "rnd-2",
    scheduleId: "sch-2",
    applicationId: "app-3",
    candidateId: "cand-3",
    candidateName: "Rohan Deshmukh",
    candidateEmail: "rohan.design@gmail.com",
    jobId: "job-3",
    jobTitle: "Senior Product Designer",
    round: "Portfolio & Design Systems Critique",
    interviewerId: "emp-2",
    interviewer: "Sarah Chen",
    date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    durationMins: 45,
    timezone: "Asia/Kolkata",
    mode: "ONLINE",
    meetingLink: "https://meet.ofc360.com/int-rohan-deshmukh",
    status: "scheduled",
    isOverdue: false,
    rating: null,
    recommendation: null,
    feedback: null,
  },
];

const INITIAL_OFFERS: Offer[] = [
  {
    id: "off-1",
    applicationId: "app-2",
    candidateId: "cand-2",
    candidateName: "Meera Krishnan",
    jobId: "job-2",
    jobTitle: "Distributed Systems Architect",
    salary: 3800000,
    currency: "INR",
    joiningDate: "2026-12-01",
    benefits: ["Health Insurance", "ESOPs", "Remote Setup Allowance"],
    status: "sent",
    sentAt: "2026-11-09T11:00:00Z",
    approvals: [
      { stage: "Department Head", by: "Alex Vance", at: "2026-11-08T16:00:00Z", status: "approved" },
      { stage: "HR Operations", by: "Elena Rostova", at: "2026-11-09T10:30:00Z", status: "approved" },
    ],
  },
  {
    id: "off-2",
    applicationId: "app-4",
    candidateId: "cand-4",
    candidateName: "Ananya Verma",
    jobId: "job-1",
    jobTitle: "Senior Staff AI Engineer",
    salary: 3900000,
    currency: "INR",
    joiningDate: "2026-11-25",
    benefits: ["Health Insurance", "ESOPs", "Relocation Bonus"],
    status: "accepted",
    sentAt: "2026-11-04T11:00:00Z",
    respondedAt: "2026-11-07T15:00:00Z",
    approvals: [
      { stage: "Department Head", by: "Marcus Sterling", at: "2026-11-03T18:00:00Z", status: "approved" },
      { stage: "HR Operations", by: "Elena Rostova", at: "2026-11-04T10:00:00Z", status: "approved" },
    ],
  },
];

let requisitionsState = [
  {
    id: "WFR-101",
    department: "AI Research",
    title: "Senior Staff AI Engineer",
    role_title: "Senior Staff AI Engineer",
    headcount: 2,
    headcount_needed: 2,
    current_headcount: 8,
    planned_quarter: "Q4 2026",
    priority: "Critical",
    budget_min: 3200000,
    budget_max: 4800000,
    currency: "INR",
    skills: ["PyTorch", "LLMs", "CUDA", "Distributed Systems"],
    experience_level: "5-8 yrs (Senior)",
    justification: "Scaling core enterprise AI copilot and inference cluster throughput.",
    status: "approved",
    created_at: "2026-10-12",
  },
  {
    id: "WFR-102",
    department: "Engineering",
    title: "Distributed Systems Architect",
    role_title: "Distributed Systems Architect",
    headcount: 1,
    headcount_needed: 1,
    current_headcount: 22,
    planned_quarter: "Q4 2026",
    priority: "High",
    budget_min: 2800000,
    budget_max: 4200000,
    currency: "INR",
    skills: ["Go", "Kubernetes", "PostgreSQL", "Kafka"],
    experience_level: "6-10 yrs (Principal)",
    justification: "Multi-region database sharding and high-availability architecture.",
    status: "approved",
    created_at: "2026-10-18",
  },
  {
    id: "WFR-103",
    department: "Product",
    title: "Senior Product Designer",
    role_title: "Senior Product Designer",
    headcount: 1,
    headcount_needed: 1,
    current_headcount: 10,
    planned_quarter: "Q1 2027",
    priority: "Medium",
    budget_min: 2200000,
    budget_max: 3200000,
    currency: "INR",
    skills: ["Figma", "Design Systems", "UX Research"],
    experience_level: "4-7 yrs (Senior)",
    justification: "Dedicated design lead for Payroll & Global Compliance workflows.",
    status: "submitted",
    created_at: "2026-11-01",
  },
];

let jobsState: Job[] = [...INITIAL_JOBS];
let candidatesState: Candidate[] = [...INITIAL_CANDIDATES];
let interviewsState: Interview[] = [...INITIAL_INTERVIEWS];
let offersState: Offer[] = [...INITIAL_OFFERS];

export const recruitmentApi = {
  fetchRecruitmentDashboardData: async (): Promise<RecruitmentDataPayload> => {
    return {
      jobs: [...jobsState],
      candidates: [...candidatesState],
      interviews: [...interviewsState],
      offers: [...offersState],
    };
  },

  getPipeline: async () => {
    return [...candidatesState];
  },

  getJobs: async () => {
    return [...jobsState];
  },

  getCandidates: async () => {
    return [...candidatesState];
  },

  getRequisitions: async () => {
    return { items: requisitionsState, total: requisitionsState.length };
  },

  createRequisition: async (payload: Record<string, any>) => {
    const newReq = {
      id: `WFR-${Math.floor(104 + Math.random() * 890)}`,
      department: payload.department || "Engineering",
      title: payload.title || "Software Engineer",
      role_title: payload.title || "Software Engineer",
      headcount: Number(payload.headcount || 1),
      headcount_needed: Number(payload.headcount || 1),
      current_headcount: 10,
      planned_quarter: payload.planned_quarter || "Q1 2027",
      priority: payload.priority || "High",
      budget_min: Number(payload.budget_min || 1800000),
      budget_max: Number(payload.budget_max || 2800000),
      currency: payload.currency || "INR",
      skills: Array.isArray(payload.skills) ? payload.skills : [],
      experience_level: payload.experience_level || "3-5 yrs",
      justification: payload.justification || "",
      status: "submitted",
      created_at: new Date().toISOString().split("T")[0],
    };
    requisitionsState = [newReq, ...requisitionsState];
    return newReq;
  },

  approveRequisition: async (id: string) => {
    requisitionsState = requisitionsState.map((r) =>
      r.id === id ? { ...r, status: "approved" } : r,
    );
    return { success: true, id };
  },

  addCandidateNote: async (candidateId: string, note: string) => {
    return {
      id: `note-${Date.now()}`,
      candidateId,
      text: note,
      createdAt: new Date().toISOString(),
    };
  },

  generateJobDescription: async (payload: Record<string, any>) => {
    const title = payload.title || "Software Engineer";
    const dept = payload.department || "Engineering";
    const loc = payload.location || "Bengaluru · Global HQ";
    return {
      data: {
        description: `### About the ${title} Role\n\nWe are looking for a high-impact **${title}** to join our **${dept}** team in **${loc}**. You will design, build, and scale mission-critical systems that power modern enterprise operations.\n\n### Key Responsibilities\n- Architect, build, and maintain scalable modules with high reliability\n- Partner cross-functionally with Product, Design, and Operations leadership\n- Drive engineering excellence through code reviews, testing, and mentorship\n\n### Minimum Qualifications\n- Proven industry experience in ${dept} and modern software delivery\n- Strong analytical and problem-solving skills in fast-paced environments`,
        responsibilities: [
          `Lead end-to-end delivery of core ${dept} initiatives`,
          "Collaborate with cross-functional stakeholders on product roadmap execution",
          "Maintain high standards of quality, observability, and documentation",
        ],
        requirements: [
          `Relevant hands-on experience as a ${title} or similar role`,
          "Strong communication and collaborative problem-solving mindset",
        ],
        skills: Array.isArray(payload.skills) && payload.skills.length > 0
          ? payload.skills
          : ["System Design", "TypeScript", "Architecture", "Execution"],
      },
    };
  },

  modifyJobDescription: async (payload: {
    current_description: string;
    action: string;
    custom_instruction?: string;
  }) => {
    return {
      data: {
        description: payload.current_description,
      },
    };
  },

  publishJob: async (jobId: string, payload: Record<string, any>) => {
    return {
      success: true,
      jobId,
      publishedAt: new Date().toISOString(),
      ...payload,
    };
  },
};

export default recruitmentApi;

/**
 * Multi-industry AI Job Description Generator & Template Engine.
 * Supports Tech, HR, Sales, Marketing, Finance, Operations, Healthcare,
 * Design, Education, Legal, Customer Support, Administration, and General roles.
 */

export type JobDomain =
  | "hr"
  | "sales"
  | "marketing"
  | "finance"
  | "operations"
  | "support"
  | "healthcare"
  | "design"
  | "education"
  | "legal"
  | "admin"
  | "data"
  | "engineering"
  | "general";

export interface GenerateJdParams {
  title: string;
  department?: string;
  employmentType?: string;
  experience?: string;
  location?: string;
  workMode?: string;
  skills?: string[];
}

export interface SmartJdResult {
  title: string;
  department: string;
  summary: string;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  preferredSkills: string[];
  suggestedSkills: string[];
  benefits: string[];
  markdownDescription: string;
}

export function detectJobDomain(title: string, department?: string): JobDomain {
  const t = (title || "").toLowerCase();
  const d = (department || "").toLowerCase();

  // 1. HR
  if (
    d.includes("human resource") ||
    d.includes("hr") ||
    t.includes("hr ") ||
    t.includes("talent") ||
    t.includes("recruit") ||
    t.includes("people ops") ||
    t.includes("people partner") ||
    t.includes("human resources") ||
    t.includes("hrbp")
  ) {
    return "hr";
  }

  // 2. Sales
  if (
    d.includes("sales") ||
    d.includes("business dev") ||
    t.includes("sales") ||
    t.includes("bdr") ||
    t.includes("sdr") ||
    t.includes("account executive") ||
    t.includes("business development") ||
    t.includes("client acquisition") ||
    t.includes("revenue")
  ) {
    return "sales";
  }

  // 3. Marketing
  if (
    d.includes("marketing") ||
    d.includes("growth") ||
    t.includes("marketing") ||
    t.includes("growth") ||
    t.includes("seo") ||
    t.includes("sem") ||
    t.includes("social media") ||
    t.includes("brand") ||
    t.includes("content strategist") ||
    t.includes("copywriter") ||
    t.includes("pr ") ||
    t.includes("public relations")
  ) {
    return "marketing";
  }

  // 4. Finance & Accounting
  if (
    d.includes("finance") ||
    d.includes("accounting") ||
    t.includes("finance") ||
    t.includes("accountant") ||
    t.includes("audit") ||
    t.includes("controller") ||
    t.includes("tax") ||
    t.includes("payroll") ||
    t.includes("billing") ||
    t.includes("bookkeeper") ||
    t.includes("financial analyst")
  ) {
    return "finance";
  }

  // 5. Operations & Supply Chain
  if (
    d.includes("operations") ||
    t.includes("operations") ||
    t.includes("supply chain") ||
    t.includes("logistics") ||
    t.includes("procurement") ||
    t.includes("warehouse") ||
    t.includes("facilities manager") ||
    t.includes("inventory")
  ) {
    return "operations";
  }

  // 6. Customer Support & Success
  if (
    d.includes("customer support") ||
    d.includes("customer success") ||
    t.includes("customer support") ||
    t.includes("customer success") ||
    t.includes("helpdesk") ||
    t.includes("support specialist") ||
    t.includes("client service") ||
    t.includes("call center")
  ) {
    return "support";
  }

  // 7. Healthcare & Medical
  if (
    d.includes("health") ||
    d.includes("medical") ||
    t.includes("doctor") ||
    t.includes("nurse") ||
    t.includes("physician") ||
    t.includes("medical") ||
    t.includes("healthcare") ||
    t.includes("clinical") ||
    t.includes("pharmacist") ||
    t.includes("therapist") ||
    t.includes("patient")
  ) {
    return "healthcare";
  }

  // 8. Design & Creative
  if (
    d.includes("design") ||
    d.includes("creative") ||
    t.includes("design") ||
    t.includes("ui") ||
    t.includes("ux") ||
    t.includes("graphic") ||
    t.includes("animator") ||
    t.includes("creative director") ||
    t.includes("illustrator") ||
    t.includes("motion")
  ) {
    return "design";
  }

  // 9. Education & Teaching
  if (
    d.includes("education") ||
    d.includes("teaching") ||
    t.includes("teacher") ||
    t.includes("professor") ||
    t.includes("instructor") ||
    t.includes("trainer") ||
    t.includes("lecturer") ||
    t.includes("tutor") ||
    t.includes("curriculum") ||
    t.includes("faculty")
  ) {
    return "education";
  }

  // 10. Legal & Compliance
  if (
    d.includes("legal") ||
    d.includes("compliance") ||
    t.includes("legal") ||
    t.includes("lawyer") ||
    t.includes("counsel") ||
    t.includes("compliance") ||
    t.includes("paralegal") ||
    t.includes("attorney") ||
    t.includes("regulatory")
  ) {
    return "legal";
  }

  // 11. Administration
  if (
    d.includes("admin") ||
    t.includes("executive assistant") ||
    t.includes("office manager") ||
    t.includes("receptionist") ||
    t.includes("administrative") ||
    t.includes("clerk") ||
    t.includes("secretary")
  ) {
    return "admin";
  }

  // 12. Data & Analytics
  if (
    d.includes("data") ||
    d.includes("analytics") ||
    t.includes("data analyst") ||
    t.includes("data scientist") ||
    t.includes("data engineer") ||
    t.includes("bi analyst") ||
    t.includes("machine learning") ||
    t.includes("ai engineer")
  ) {
    return "data";
  }

  // 13. Engineering & IT / Tech
  if (
    d.includes("engineering") ||
    t.includes("engineer") ||
    t.includes("developer") ||
    t.includes("devops") ||
    t.includes("architect") ||
    t.includes("software") ||
    t.includes("frontend") ||
    t.includes("backend") ||
    t.includes("full stack") ||
    t.includes("programmer") ||
    t.includes("qa") ||
    t.includes("cloud")
  ) {
    return "engineering";
  }

  return "general";
}

/**
 * Returns dynamic suggested skills based on department.
 */
export function getDepartmentSkills(department?: string): string[] {
  const domain = detectJobDomain("", department);
  switch (domain) {
    case "hr":
      return [
        "Talent Acquisition",
        "Employee Relations",
        "HRIS",
        "Performance Management",
        "Labor Law Compliance",
        "Onboarding & Offboarding",
        "HR Analytics",
        "Compensation & Benefits",
      ];
    case "sales":
      return [
        "B2B Sales",
        "Lead Generation",
        "CRM (Salesforce/HubSpot)",
        "Pipeline Management",
        "Contract Negotiation",
        "Client Retention",
        "Solution Selling",
        "Revenue Forecasting",
      ];
    case "marketing":
      return [
        "Digital Marketing",
        "SEO / SEM",
        "Content Strategy",
        "Social Media Management",
        "Google Analytics",
        "Brand Strategy",
        "Copywriting",
        "Email Marketing",
      ];
    case "finance":
      return [
        "Financial Analysis",
        "Budgeting & Forecasting",
        "GAAP / IFRS",
        "Tax Compliance",
        "Auditing",
        "Accounts Payable / Receivable",
        "Advanced Excel",
        "ERP (SAP/NetSuite)",
      ];
    case "operations":
      return [
        "Process Optimization",
        "Supply Chain Management",
        "Vendor Management",
        "Logistics Planning",
        "Inventory Management",
        "SOP Development",
        "Project Management",
        "Quality Assurance",
      ];
    case "support":
      return [
        "Customer Success",
        "Ticketing Systems (Zendesk)",
        "Active Listening",
        "Conflict Resolution",
        "CSAT & NPS Tracking",
        "Technical Troubleshooting",
        "Client Onboarding",
        "Documentation",
      ];
    case "healthcare":
      return [
        "Patient Care",
        "Clinical Assessment",
        "Medical Terminology",
        "EHR Management",
        "Healthcare Compliance",
        "Patient Safety",
        "Treatment Planning",
        "Interdisciplinary Care",
      ];
    case "design":
      return [
        "UI/UX Design",
        "Figma",
        "Adobe Creative Suite",
        "User Research",
        "Wireframing & Prototyping",
        "Design Systems",
        "Typography",
        "Visual Storytelling",
      ];
    case "education":
      return [
        "Curriculum Design",
        "Classroom Management",
        "Instructional Delivery",
        "Student Assessment",
        "E-Learning Platforms",
        "Mentoring & Coaching",
        "Lesson Planning",
        "Educational Psychology",
      ];
    case "legal":
      return [
        "Contract Negotiation",
        "Regulatory Compliance",
        "Legal Research",
        "Risk Assessment",
        "Corporate Governance",
        "Policy Drafting",
        "Intellectual Property",
        "Due Diligence",
      ];
    case "admin":
      return [
        "Office Administration",
        "Calendar Management",
        "Travel Coordination",
        "Executive Support",
        "MS Office / Google Workspace",
        "Event Planning",
        "Records Management",
        "Vendor Relations",
      ];
    case "data":
      return [
        "Python",
        "SQL",
        "Data Modeling",
        "Machine Learning",
        "Tableau / Power BI",
        "Statistical Analysis",
        "BigQuery",
        "ETL Pipelines",
      ];
    case "engineering":
      return [
        "React",
        "TypeScript",
        "Node.js",
        "Python",
        "REST APIs",
        "PostgreSQL",
        "Docker",
        "AWS / Cloud",
        "System Design",
        "Git",
      ];
    default:
      return [
        "Communication",
        "Leadership",
        "Problem Solving",
        "Project Management",
        "Collaboration",
        "Strategic Planning",
        "Analytical Thinking",
        "Time Management",
      ];
  }
}

/**
 * Smart generator that builds domain-specific, tailored job descriptions.
 */
export function generateSmartJobDescription(params: GenerateJdParams): SmartJdResult {
  const title = (params.title || "Specialist").trim();
  const department = (params.department || "Operations").trim();
  const employmentType = params.employmentType || "Full-time";
  const experience = params.experience || "3-5 yrs (Mid-Level)";
  const location = params.location || "Remote";
  const workMode = params.workMode || "Remote";
  const domain = detectJobDomain(title, department);

  const isSenior =
    title.toLowerCase().includes("senior") ||
    title.toLowerCase().includes("lead") ||
    title.toLowerCase().includes("principal") ||
    title.toLowerCase().includes("director") ||
    title.toLowerCase().includes("head") ||
    title.toLowerCase().includes("manager");

  let summary = "";
  let aboutRole = "";
  let responsibilities: string[] = [];
  let requirements: string[] = [];
  let preferredSkills: string[] = [];
  let suggestedSkills: string[] = [];

  switch (domain) {
    case "hr":
      summary = `We are seeking an experienced and empathetic ${title} to join our Human Resources team. In this role, you will be instrumental in attracting top talent, cultivating an inclusive workplace culture, and driving key people operations programs.`;
      aboutRole = `As a ${title}, you will partner with department leaders to deliver high-impact human resource initiatives. You will champion employee engagement, streamline recruitment workflows, and ensure alignment with our organizational values and labor compliance standards.`;
      responsibilities = [
        `Manage the end-to-end recruitment and onboarding lifecycle for diverse organizational roles.`,
        `Serve as a trusted advisor to employees and leadership regarding people policies, growth, and team dynamics.`,
        `Develop and execute employee engagement initiatives, retention programs, and performance review cycles.`,
        `Ensure comprehensive adherence to employment laws, regulatory requirements, and internal HR guidelines.`,
        `Analyze people analytics and feedback surveys to continuously enhance company culture and workplace satisfaction.`,
      ];
      requirements = [
        `Bachelor's degree in Human Resources, Business Administration, or a related field (or equivalent practical experience).`,
        `Proven track record in human resources management or talent acquisition matching the ${experience} level.`,
        `Strong working knowledge of employment regulations, labor compliance, and HR best practices.`,
        `Excellent interpersonal, dispute-resolution, and cross-functional communication abilities.`,
        `Hands-on experience with modern HRIS and Applicant Tracking Systems (ATS).`,
      ];
      preferredSkills = [
        "SHRM-CP or PHR Certification",
        "Compensation & Benefits Design",
        "Diversity, Equity & Inclusion (DEI) Strategy",
        "Leadership Development",
      ];
      suggestedSkills = [
        "Talent Acquisition",
        "Employee Relations",
        "HRIS Management",
        "Performance Management",
        "Labor Law Compliance",
        "Onboarding Strategy",
      ];
      break;

    case "sales":
      summary = `We are looking for a goal-driven, relationship-focused ${title} to accelerate our business growth and sales pipeline. You will drive revenue, identify lucrative market opportunities, and establish trusted relationships with key prospective clients.`;
      aboutRole = `As our ${title}, you will take ownership of the sales pipeline, manage client discovery, and execute compelling product demonstrations. You will work closely with marketing and leadership to meet and exceed ambitious revenue milestones.`;
      responsibilities = [
        `Proactively generate, qualify, and advance outbound and inbound sales opportunities across target markets.`,
        `Conduct in-depth discovery sessions and deliver persuasive product demonstrations tailored to client pain points.`,
        `Negotiate contract terms, resolve objections, and successfully close agreements in alignment with pricing policies.`,
        `Maintain meticulous deal records and sales pipeline reporting in CRM systems to provide accurate sales forecasts.`,
        `Collaborate with customer success and product teams to facilitate smooth handoffs and maximize customer satisfaction.`,
      ];
      requirements = [
        `Demonstrated background in consultative sales, business development, or account management (${experience}).`,
        `Track record of consistently meeting or exceeding quarterly and annual revenue targets.`,
        `Outstanding presentation, negotiation, and written/verbal communication skills.`,
        `Experience utilizing modern CRM platforms (e.g., Salesforce, HubSpot) to manage sales pipelines.`,
        `Self-motivated attitude with high resilience and strong business acumen.`,
      ];
      preferredSkills = [
        "Enterprise Deal Closing",
        "Contract Negotiation",
        "Solution Selling Frameworks",
        "Sales Pipeline Forecasting",
      ];
      suggestedSkills = [
        "B2B Sales",
        "Lead Generation",
        "CRM (Salesforce/HubSpot)",
        "Pipeline Management",
        "Negotiation",
        "Client Acquisition",
      ];
      break;

    case "marketing":
      summary = `We are seeking an innovative and analytical ${title} to spearhead our marketing initiatives. In this role, you will build brand presence, craft high-converting campaigns, and engage target audiences across omnichannel platforms.`;
      aboutRole = `As a ${title}, you will design and implement comprehensive marketing programs that drive user acquisition, brand affinity, and measurable business growth. You will leverage data insights and creative storytelling to optimize our marketing funnel.`;
      responsibilities = [
        `Plan, execute, and optimize multi-channel marketing campaigns across digital, social, and direct channels.`,
        `Develop captivating content, campaign messaging, and visual storytelling that resonates with our core customer segments.`,
        `Analyze marketing metrics, traffic conversion rates, and ROI to continuously refine strategies and budget allocation.`,
        `Collaborate with product, sales, and design teams to align campaign calendars with upcoming launches and business priorities.`,
        `Oversee brand consistency across all customer touchpoints, marketing collateral, and external communications.`,
      ];
      requirements = [
        `Bachelor's degree in Marketing, Communications, or related discipline (or equivalent practical experience).`,
        `Proven track record of orchestrating impactful marketing campaigns corresponding to ${experience}.`,
        `Strong analytical skills with proficiency in web analytics tools (e.g., Google Analytics, search console).`,
        `Exceptional written communication, content curation, and creative direction skills.`,
        `Familiarity with marketing automation platforms and campaign management workflows.`,
      ];
      preferredSkills = [
        "SEO / SEM Optimization",
        "Growth Marketing & CRO",
        "Brand Storytelling",
        "Performance Advertising",
      ];
      suggestedSkills = [
        "Digital Marketing",
        "SEO/SEM",
        "Content Strategy",
        "Social Media Management",
        "Campaign Analytics",
        "Brand Strategy",
      ];
      break;

    case "finance":
      summary = `We are looking for a detail-oriented and analytical ${title} to strengthen our financial operations. In this role, you will manage budgeting, accounting compliance, financial modeling, and strategic reporting to support business scale.`;
      aboutRole = `As our ${title}, you will maintain the integrity of our financial books, prepare insightful variance reports, and ensure compliance with regulatory standards. Your fiscal stewardship will guide strategic leadership decisions.`;
      responsibilities = [
        `Oversee daily financial accounting, reconciliations, and general ledger maintenance in compliance with standards.`,
        `Prepare periodic financial statements, budget forecasts, and cash flow projections for executive leadership.`,
        `Conduct financial variance analyses to identify cost efficiencies and revenue optimization opportunities.`,
        `Coordinate external audits, ensure local/international tax compliance, and oversee regulatory filings.`,
        `Implement robust internal financial controls and streamline accounting workflows using ERP systems.`,
      ];
      requirements = [
        `Degree in Finance, Accounting, Economics, or related field (CPA / CA / CFA qualification highly regarded).`,
        `Solid experience in financial reporting, corporate accounting, or fiscal analysis (${experience}).`,
        `In-depth familiarity with recognized accounting principles (GAAP / IFRS) and statutory compliance.`,
        `Advanced proficiency in financial modeling and spreadsheets (Excel / Google Sheets).`,
        `Hands-on experience with modern accounting ERP platforms (e.g., SAP, NetSuite, QuickBooks).`,
      ];
      preferredSkills = [
        "GAAP / IFRS Compliance",
        "Financial Modeling & Forecasting",
        "Corporate Tax Strategy",
        "ERP System Implementation",
      ];
      suggestedSkills = [
        "Financial Analysis",
        "Budgeting & Forecasting",
        "Auditing",
        "Tax Compliance",
        "General Ledger",
        "Advanced Excel",
      ];
      break;

    case "operations":
      summary = `We are seeking an organized and resourceful ${title} to optimize our day-to-day operations. In this role, you will enhance operational workflows, ensure smooth service delivery, and maintain top organizational efficiency.`;
      aboutRole = `As a ${title}, you will analyze operational bottlenecks, oversee vendor relationships, and implement standard operating procedures (SOPs). You will bridge cross-functional teams to ensure seamless execution.`;
      responsibilities = [
        `Supervise core operational workflows and identify continuous improvement opportunities across business units.`,
        `Develop, implement, and maintain scalable Standard Operating Procedures (SOPs) and quality benchmarks.`,
        `Manage key vendor agreements, procurement needs, and resource allocation to ensure optimal cost efficiency.`,
        `Track operational KPIs, deliver regular performance reports, and resolve escalations promptly.`,
        `Collaborate with department heads to support company-wide initiatives and facilitate smooth transitions.`,
      ];
      requirements = [
        `Bachelor's degree in Business Operations, Management, or equivalent operational experience.`,
        `Demonstrated background in process management, logistics, or operations matching ${experience}.`,
        `Strong analytical problem-solving abilities with experience optimizing complex workflows.`,
        `Excellent organizational, cross-functional coordination, and time-management capabilities.`,
        `Proficiency with project management and workflow tracking software.`,
      ];
      preferredSkills = [
        "Six Sigma / Lean Methodologies",
        "Vendor & Contract Management",
        "Logistics & Supply Chain",
        "Workflow Automation",
      ];
      suggestedSkills = [
        "Process Optimization",
        "Vendor Management",
        "SOP Development",
        "Project Management",
        "Resource Allocation",
        "Operational Excellence",
      ];
      break;

    case "support":
      summary = `We are looking for a dedicated and empathetic ${title} to champion our customer support experience. You will be the voice of our company, resolving inquiries promptly and ensuring every customer has an exceptional interaction.`;
      aboutRole = `As a ${title}, you will handle inbound customer communications, diagnose issues methodically, and advocate for user satisfaction. You will identify recurring feedback and collaborate with internal teams to enhance our service quality.`;
      responsibilities = [
        `Respond to and resolve customer inquiries via chat, email, and ticketing channels within defined SLAs.`,
        `Investigate, troubleshoot, and document customer issues with empathy and technical precision.`,
        `Contribute to internal knowledge bases, user FAQs, and troubleshooting guides to empower self-service.`,
        `Gather customer feedback, track CSAT and NPS metrics, and report product enhancement ideas to teams.`,
        `Maintain a courteous, professional, and supportive communication style in all customer engagements.`,
      ];
      requirements = [
        `Proven experience in customer service, helpdesk support, or client success (${experience}).`,
        `Outstanding written and verbal communication skills with strong active listening capabilities.`,
        `Demonstrated ability to remain calm, professional, and solution-focused under high-pressure scenarios.`,
        `Familiarity with helpdesk and ticketing platforms (e.g., Zendesk, Freshdesk, Intercom).`,
        `Quick learner with strong technical aptitude and problem-solving mindset.`,
      ];
      preferredSkills = [
        "CSAT & NPS Optimization",
        "Ticketing System Administration",
        "Customer De-escalation Techniques",
        "Knowledge Base Authoring",
      ];
      suggestedSkills = [
        "Customer Support",
        "Problem Solving",
        "Active Listening",
        "Ticketing Systems (Zendesk)",
        "Customer Retention",
        "Conflict Resolution",
      ];
      break;

    case "healthcare":
      summary = `We are seeking a compassionate, skilled ${title} to join our healthcare team. In this role, you will provide exemplary care, uphold stringent clinical standards, and prioritize patient well-being at all times.`;
      aboutRole = `As a ${title}, you will deliver high-quality, patient-centric healthcare services while coordinating with medical specialists. You will maintain thorough clinical documentation and ensure compliance with healthcare ethics and regulations.`;
      responsibilities = [
        `Deliver high-quality clinical assessments, patient care, and personalized health recommendations.`,
        `Maintain precise, confidential electronic health records (EHR) in compliance with regulatory privacy laws.`,
        `Collaborate effectively with interdisciplinary medical personnel to coordinate cohesive treatment plans.`,
        `Educate patients and family members regarding medical procedures, recovery plans, and preventive health.`,
        `Adhere strictly to infection control protocols, clinical safety guidelines, and standard hospital/clinic policies.`,
      ];
      requirements = [
        `Accredited degree or diploma in Nursing, Medicine, or relevant healthcare discipline.`,
        `Active and valid professional medical/nursing license or certification in good standing.`,
        `Relevant clinical experience corresponding to the ${experience} level.`,
        `Strong dedication to compassionate, patient-centered care and medical ethics.`,
        `Current Basic Life Support (BLS) or relevant clinical certifications where required.`,
      ];
      preferredSkills = [
        "Electronic Health Records (EHR)",
        "Clinical Patient Assessment",
        "Patient Safety Protocols",
        "Interdisciplinary Care Coordination",
      ];
      suggestedSkills = [
        "Patient Care",
        "Clinical Assessment",
        "Medical Terminology",
        "EHR Management",
        "Healthcare Compliance",
        "Patient Safety",
      ];
      break;

    case "design":
      summary = `We are looking for a creative and detail-driven ${title} to craft compelling visual and user experiences. You will transform complex user needs into elegant, intuitive, and cohesive designs across our product ecosystem.`;
      aboutRole = `As our ${title}, you will lead design thinking, construct interactive prototypes, and maintain a unified design system. You will collaborate closely with product managers and stakeholders to bring concepts to life.`;
      responsibilities = [
        `Conduct user research, journey mapping, and usability testing to uncover actionable customer insights.`,
        `Create wireframes, interactive user flows, and high-fidelity prototypes that balance aesthetics with usability.`,
        `Maintain, evolve, and document component libraries and cross-platform design systems in Figma.`,
        `Collaborate with cross-functional teams to ensure design fidelity and seamless implementation.`,
        `Present design rationales and product vision clearly to stakeholders and executive leadership.`,
      ];
      requirements = [
        `Degree in Design, Human-Computer Interaction (HCI), Fine Arts, or equivalent practical design portfolio.`,
        `Demonstrated experience in product design, visual arts, or UI/UX design matching ${experience}.`,
        `Mastery of modern design tooling, specifically Figma, design tokens, and prototyping features.`,
        `Strong portfolio demonstrating end-to-end design thinking, typography, layout, and user-centric problem solving.`,
        `Excellent collaboration and feedback-receptive mindset.`,
      ];
      preferredSkills = [
        "Design System Architecture",
        "Usability Testing & User Research",
        "Motion Design & Micro-interactions",
        "Accessibility (WCAG) Standards",
      ];
      suggestedSkills = [
        "UI/UX Design",
        "Figma",
        "Wireframing & Prototyping",
        "User Research",
        "Design Systems",
        "Visual Design",
      ];
      break;

    case "education":
      summary = `We are seeking an engaging, passionate ${title} to deliver high-quality instruction and mentorship. You will inspire learners, develop comprehensive curricula, and foster an environment of continuous intellectual growth.`;
      aboutRole = `As a ${title}, you will facilitate interactive learning experiences, assess student comprehension, and tailor educational materials to diverse learning styles. You will contribute to our mission of academic and professional excellence.`;
      responsibilities = [
        `Develop comprehensive lesson plans, instructional modules, and interactive learning activities.`,
        `Facilitate engaging instructional sessions, seminars, or workshops both in-person and virtually.`,
        `Assess student progress through assignments, constructive feedback, and objective evaluations.`,
        `Maintain accurate academic records, attendance logs, and student performance metrics.`,
        `Collaborate with educational peers to update curricula and integrate modern pedagogical techniques.`,
      ];
      requirements = [
        `Bachelor's or Master's degree in Education, Academic Discipline, or related field.`,
        `Proven experience in instructional delivery, curriculum design, or corporate training (${experience}).`,
        `Valid teaching credential or relevant professional educator certification where applicable.`,
        `Exceptional communication, presentation, and classroom/workshop management abilities.`,
        `Familiarity with Learning Management Systems (LMS) and modern e-learning tools.`,
      ];
      preferredSkills = [
        "Curriculum & Instructional Design",
        "Interactive Workshop Facilitation",
        "Learning Management Systems (LMS)",
        "Student Mentorship & Coaching",
      ];
      suggestedSkills = [
        "Instructional Delivery",
        "Curriculum Design",
        "Classroom Management",
        "Student Assessment",
        "Mentoring",
        "E-Learning Tools",
      ];
      break;

    case "legal":
      summary = `We are seeking a diligent and knowledgeable ${title} to safeguard our organization's legal and regulatory interests. You will oversee contract governance, provide legal counsel, and ensure adherence to statutory mandates.`;
      aboutRole = `As our ${title}, you will advise internal leadership on legal risk mitigation, review commercial agreements, and monitor regulatory landscapes. You will ensure ethical and compliant operations across all business practices.`;
      responsibilities = [
        `Draft, review, and negotiate commercial agreements, vendor contracts, and partnership documents.`,
        `Provide timely, practical legal counsel to executive leadership across varied corporate matters.`,
        `Monitor statutory changes and ensure organizational compliance with applicable corporate and labor laws.`,
        `Implement risk mitigation strategies, internal compliance policies, and governance protocols.`,
        `Coordinate with external legal counsel and manage regulatory filings or inquiries.`,
      ];
      requirements = [
        `Degree in Law (LL.B, J.D., or equivalent) from an accredited law school.`,
        `Active bar admission or professional legal license in good standing.`,
        `Substantial corporate legal, compliance, or regulatory experience corresponding to ${experience}.`,
        `Outstanding legal research, contract drafting, and analytical negotiation skills.`,
        `High ethical standards and sound business judgment.`,
      ];
      preferredSkills = [
        "Commercial Contract Negotiation",
        "Regulatory & Corporate Governance",
        "Intellectual Property Law",
        "Risk Mitigation Frameworks",
      ];
      suggestedSkills = [
        "Contract Negotiation",
        "Legal Research",
        "Regulatory Compliance",
        "Policy Drafting",
        "Risk Management",
        "Corporate Governance",
      ];
      break;

    case "admin":
      summary = `We are looking for an organized and proactive ${title} to ensure seamless administrative execution. In this role, you will coordinate schedules, manage office resources, and provide critical support to leadership.`;
      aboutRole = `As our ${title}, you will be the organizational backbone of the team, managing communications, events, and operational logistics. Your attention to detail will keep the office functioning smoothly and efficiently.`;
      responsibilities = [
        `Manage executive calendars, schedule meetings, coordinate travel logistics, and prepare agendas.`,
        `Serve as the primary point of contact for office inquiries, correspondence, and external visitors.`,
        `Maintain office supplies inventory, coordinate facility maintenance, and liaise with building vendors.`,
        `Prepare meeting minutes, organize filing systems, and draft executive summaries as required.`,
        `Assist in organizing corporate events, team offsites, and internal employee celebrations.`,
      ];
      requirements = [
        `Proven experience in office administration, executive assistance, or clerical management (${experience}).`,
        `Proficiency in office productivity tools (Microsoft Office Suite, Google Workspace).`,
        `Superior organizational and multitasking skills with sharp attention to detail.`,
        `Discretion in handling confidential company information and sensitive communications.`,
        `Friendly, professional demeanor with stellar written and verbal communication.`,
      ];
      preferredSkills = [
        "Executive Calendar Coordination",
        "Event & Meeting Planning",
        "Vendor & Facility Relations",
        "Records Management",
      ];
      suggestedSkills = [
        "Office Administration",
        "Calendar Management",
        "Travel Coordination",
        "Executive Support",
        "Communication",
        "Organization",
      ];
      break;

    case "data":
      summary = `We are seeking a data-driven, analytical ${title} to translate complex datasets into actionable business intelligence. You will build robust data models, evaluate metrics, and empower leadership with predictive insights.`;
      aboutRole = `As a ${title}, you will analyze key operational and commercial metrics, build interactive dashboards, and design data pipelines. Your analytical rigor will steer company strategy and product optimization.`;
      responsibilities = [
        `Extract, clean, and analyze large datasets from relational databases and cloud data warehouses.`,
        `Design, build, and maintain interactive business intelligence dashboards and automated reports.`,
        `Collaborate with stakeholders to identify key performance metrics and translate business questions into data models.`,
        `Perform statistical analysis, exploratory data discovery, and hypothesis testing to uncover trends.`,
        `Ensure data accuracy, governance, and documentation across reporting repositories.`,
      ];
      requirements = [
        `Bachelor's degree in Data Science, Statistics, Mathematics, Computer Science, or quantitative field.`,
        `Hands-on experience in data analysis, business intelligence, or data modeling matching ${experience}.`,
        `Proficiency in SQL and scripting languages (such as Python or R) for data manipulation.`,
        `Experience with modern data visualization tools (e.g., Tableau, Power BI, Looker).`,
        `Strong analytical problem-solving and consultative storytelling abilities.`,
      ];
      preferredSkills = [
        "Advanced SQL & Data Modeling",
        "Machine Learning Fundamentals",
        "Cloud Warehouses (BigQuery / Snowflake)",
        "ETL Pipeline Development",
      ];
      suggestedSkills = [
        "Python",
        "SQL",
        "Data Modeling",
        "Tableau / Power BI",
        "Statistical Analysis",
        "Business Intelligence",
      ];
      break;

    case "engineering":
      summary = `We are seeking a talented and versatile ${title} to build robust, scalable, and mission-critical systems. You will collaborate with engineering peers to craft high-quality software solutions that deliver direct user value.`;
      aboutRole = `As a ${title}, you will contribute to technical architecture, write clean and maintainable code, and optimize system reliability. You will work within an agile team committed to continuous delivery and technical excellence.`;
      responsibilities = [
        `Design, develop, and maintain clean, testable, and scalable software applications.`,
        `Collaborate with product managers and designers to transform feature specifications into robust technical designs.`,
        `Participate actively in code reviews, technical architecture discussions, and engineering standards evolution.`,
        `Identify system bottlenecks, optimize query performance, and ensure top application reliability.`,
        `Implement automated unit, integration, and end-to-end tests to guarantee high code quality.`,
      ];
      requirements = [
        `Bachelor's degree in Computer Science, Software Engineering, or equivalent practical industry experience.`,
        `Proven track record of building production-grade software applications matching ${experience}.`,
        `Proficiency in modern programming languages, frameworks, and modern development tooling.`,
        `Firm grasp of data structures, algorithms, API design (REST/GraphQL), and database systems.`,
        `Experience with version control (Git), automated testing, and CI/CD pipelines.`,
      ];
      preferredSkills = [
        "System Architecture & Distributed Systems",
        "Cloud Infrastructure (AWS/GCP/Azure)",
        "CI/CD Pipeline Automation",
        "Database Performance Optimization",
      ];
      suggestedSkills = [
        "Full-Stack Development",
        "REST APIs",
        "Database Design",
        "Cloud Platforms",
        "Automated Testing",
        "Git",
      ];
      break;

    default:
      summary = `We are looking for a dedicated and skilled ${title} to join our ${department} team. In this role, you will contribute directly to our operational goals, collaborate across teams, and drive key departmental initiatives.`;
      aboutRole = `As our ${title}, you will take ownership of vital responsibilities, solve complex challenges, and contribute to a high-performing workplace. Your expertise will be key to achieving our collective business objectives.`;
      responsibilities = [
        `Execute key departmental projects and day-to-day operations with high attention to quality and timeliness.`,
        `Collaborate with cross-functional colleagues to streamline processes and resolve organizational challenges.`,
        `Prepare periodic reports, evaluate outcomes, and recommend operational improvements.`,
        `Maintain active communication with internal and external stakeholders to support seamless collaboration.`,
        `Uphold company standards, quality benchmarks, and ethical guidelines across all initiatives.`,
      ];
      requirements = [
        `Bachelor's degree in a relevant discipline or equivalent practical professional experience.`,
        `Demonstrated professional experience in a related role corresponding to the ${experience} level.`,
        `Strong analytical, organizational, and interpersonal communication capabilities.`,
        `Proven ability to manage multiple priorities effectively and adapt to evolving priorities.`,
        `Proficiency with modern productivity tools and departmental software.`,
      ];
      preferredSkills = [
        "Cross-functional Leadership",
        "Process Optimization",
        "Strategic Problem Solving",
        "Project Management",
      ];
      suggestedSkills = [
        "Communication",
        "Leadership",
        "Problem Solving",
        "Project Management",
        "Collaboration",
        "Time Management",
      ];
      break;
  }

  // Adjust for senior roles
  if (isSenior) {
    responsibilities.unshift(
      `Mentor and guide team members, fostering professional growth and high performance.`
    );
    requirements.unshift(
      `Demonstrated leadership capabilities with experience guiding initiatives and mentoring peers.`
    );
  }

  // Incorporate custom user skills if provided
  if (params.skills && params.skills.length > 0) {
    requirements.push(
      `Hands-on familiarity with key tools/skills: ${params.skills.join(", ")}.`
    );
  }

  const benefits = [
    "Competitive salary package with periodic performance reviews",
    "Comprehensive health, medical, and accidental insurance coverage",
    `${workMode} work flexibility with modern setup allowance`,
    "Annual paid time off, public holidays, and paid parental leave",
    "Continuous learning, certification, and conference sponsorship budget",
    "Wellness programs, mental health support, and team celebration events",
  ];

  // Assemble clean, attractive Markdown
  const markdownDescription = [
    `### About The Role`,
    summary,
    "",
    aboutRole,
    "",
    `### Key Responsibilities`,
    ...responsibilities.map((r) => `- ${r}`),
    "",
    `### Qualifications & Requirements`,
    ...requirements.map((req) => `- ${req}`),
    "",
    `### What We Offer & Benefits`,
    ...benefits.map((b) => `- ${b}`),
  ].join("\n");

  return {
    title,
    department,
    summary,
    aboutRole,
    responsibilities,
    requirements,
    preferredSkills,
    suggestedSkills:
      params.skills && params.skills.length > 0 ? params.skills : suggestedSkills,
    benefits,
    markdownDescription,
  };
}

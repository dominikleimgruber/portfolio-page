export type Job = {
  company: string;
  role: string;
  period: string;
  place: string;
  points: { label: string; text: string }[];
};

export type SkillGroup = {
  title: string;
  tiers: { label: string; items: string[] }[];
};

export type Education = {
  title: string;
  period: string;
  school: string;
  points: string[];
};

export type Language = {
  name: string;
  description: string;
};

export const jobs: Job[] = [
  {
    company: "Swisscom Schweiz AG",
    role: "DevOps / Platform Engineer",
    period: "October 2023 – present",
    place: "Zürich, ZH",
    points: [
      {
        label: "AWS platform engineering.",
        text: "Development and operation of Swisscom's central AWS platform, a large-scale multi-account environment.",
      },
      {
        label: "Infrastructure as code.",
        text: "Infrastructure automation with Terraform and AWS CDK; reusable modules that standardise the provisioning of new environments.",
      },
      {
        label: "Serverless & platform features.",
        text: "Platform functionality built on Lambda, Step Functions, DynamoDB, EventBridge and many further services.",
      },
      {
        label: "AI-assisted engineering.",
        text: "Agentic coding workflows and internal platform services connected through MCP servers; reusable agent skills that automate recurring operations and development tasks.",
      },
      {
        label: "Cloud architecture & governance.",
        text: "Co-design of the target architecture for new platform services, contributing security and compliance requirements.",
      },
    ],
  },
  {
    company: "Infoguard AG",
    role: "Cyber Security Analyst",
    period: "July 2021 – September 2023",
    place: "Baar, ZG",
    points: [
      {
        label: "",
        text: "Analysis and triage of security incidents in the SOC using cyber defence sensors.",
      },
      {
        label: "",
        text: "Development and tuning of cyber defence use cases and sensors, reducing false positives.",
      },
      {
        label: "",
        text: "Vulnerability assessment and client advisory on prioritisation and remediation.",
      },
      {
        label: "",
        text: "Extension of internal correlation and automation tooling in Python.",
      },
    ],
  },
  {
    company: "Supertrends AG",
    role: "Software Developer",
    period: "November 2020 – April 2021",
    place: "Baar, ZG",
    points: [
      {
        label: "",
        text: "Further development of the company's internal WordPress application.",
      },
      {
        label: "",
        text: "Co-development of the backend application in Elixir.",
      },
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Cloud & platform",
    tiers: [
      {
        label: "Excellent",
        items: [
          "AWS (Serverless, IAM, Landing Zone)",
          "Terraform",
          "AWS CDK",
          "Docker",
          "Git / CI-CD",
        ],
      },
      { label: "Good", items: ["Kubernetes", "Linux / UNIX"] },
    ],
  },
  {
    title: "AI & automation",
    tiers: [
      {
        label: "",
        items: [
          "Agentic coding workflows",
          "MCP (Model Context Protocol)",
          "Custom agent skills",
          "Prompt engineering",
          "LLM-assisted process automation",
        ],
      },
    ],
  },
  {
    title: "Software development",
    tiers: [
      { label: "Excellent", items: ["Python", "Java", "TypeScript / JavaScript"] },
      { label: "Good", items: ["Shell", "C#"] },
    ],
  },
  {
    title: "Frameworks & libraries",
    tiers: [{ label: "", items: ["Spring Boot", "React", "Vue.js"] }],
  },
  {
    title: "Security",
    tiers: [
      {
        label: "",
        items: [
          "Incident response & SOC analysis",
          "Vulnerability management",
          "Cloud security & governance",
        ],
      },
    ],
  },
];

export const education: Education[] = [
  {
    title: "BSc Computer Science",
    period: "September 2019 – January 2023",
    school: "Hochschule Luzern",
    points: [
      "Focus on IT operations & security and application development; Dean's List member.",
      "Bachelor thesis: software-assisted governance assurance in Swisscom's Kubernetes clusters.",
    ],
  },
  {
    title: "Berufsmaturität",
    period: "August 2018 – July 2019",
    school: "BBZ Olten",
    points: [
      "Full-time, focus on engineering, architecture and life sciences — final grade 5.6.",
    ],
  },
  {
    title: "Informatiker EFZ",
    period: "August 2014 – July 2018",
    school: "Avanade Schweiz GmbH",
    points: ["Systems engineering specialisation — final grade 5.5."],
  },
];

export const languages: Language[] = [
  { name: "German", description: "Native language" },
  {
    name: "English",
    description: "Business fluent — daily working language in international teams",
  },
];

// Editable placeholder content. Replace names, titles, and bios with real data.

export const SITE = {
  name: "Kirinyaga Health Care Workers Welfare",
  short: "KHCWW",
  tagline: "Care · Support · Unity",
  description:
    "A welfare association uniting health care workers across Kirinyaga County through emergency support, member welfare, and professional solidarity.",
  email: "info@khcww.or.ke",
  phone: "+254 700 000 000",
  emergency: "+254 711 000 000",
  address: "Kerugoya, Kirinyaga County, Kenya",
  socials: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    youtube: "#",
  },
};

export interface Leader {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export const EXECUTIVE: Leader[] = [
  { name: "Dr. [Chairperson Name]", role: "Chairperson", bio: "Leads the welfare association and represents members at county and national level.", initials: "CP" },
  { name: "[Vice Chair Name]", role: "Vice Chairperson", bio: "Supports the chairperson and oversees committee coordination.", initials: "VC" },
  { name: "[Secretary Name]", role: "Secretary General", bio: "Custodian of records, communications, and meeting minutes.", initials: "SG" },
  { name: "[Treasurer Name]", role: "Treasurer", bio: "Manages member contributions, accounts and financial reporting.", initials: "TR" },
];

export const WELFARE_COMMITTEE: Leader[] = [
  { name: "[Coordinator Name]", role: "Welfare Coordinator", bio: "Coordinates emergency welfare response and member support.", initials: "WC" },
  { name: "[Member Name]", role: "Committee Member", bio: "Reviews and approves welfare requests.", initials: "M1" },
  { name: "[Member Name]", role: "Committee Member", bio: "Liaises with health institutions across the county.", initials: "M2" },
];

export interface Team {
  slug: string;
  name: string;
  short: string;
  leader: string;
  members: string[];
  activities: string[];
}

export const TEAMS: Team[] = [
  {
    slug: "welfare",
    name: "Welfare Team",
    short: "Emergency support activities for members in distress, bereavement and medical need.",
    leader: "[Team Lead Name]",
    members: ["[Member 1]", "[Member 2]", "[Member 3]", "[Member 4]"],
    activities: [
      "Bereavement support coordination",
      "Hospital visits and medical aid",
      "Emergency response fund disbursement",
    ],
  },
  {
    slug: "finance",
    name: "Finance Team",
    short: "Contribution management, accounting and transparent financial reporting.",
    leader: "[Team Lead Name]",
    members: ["[Member 1]", "[Member 2]", "[Member 3]"],
    activities: [
      "Monthly contribution reconciliation",
      "Quarterly financial reports",
      "Audit preparation and compliance",
    ],
  },
  {
    slug: "membership",
    name: "Membership Team",
    short: "Recruitment, onboarding and member records across all health institutions.",
    leader: "[Team Lead Name]",
    members: ["[Member 1]", "[Member 2]"],
    activities: [
      "New member recruitment drives",
      "Onboarding orientation",
      "Member directory maintenance",
    ],
  },
  {
    slug: "events",
    name: "Events Team",
    short: "Planning and execution of welfare functions, AGMs and member gatherings.",
    leader: "[Team Lead Name]",
    members: ["[Member 1]", "[Member 2]", "[Member 3]"],
    activities: [
      "Annual general meeting",
      "Health workers' day celebrations",
      "Member retreats and trainings",
    ],
  },
  {
    slug: "communications",
    name: "Communications Team",
    short: "News, announcements, and public-facing communication for the association.",
    leader: "[Team Lead Name]",
    members: ["[Member 1]", "[Member 2]"],
    activities: [
      "Website and social media updates",
      "SMS bulletins to members",
      "Press releases",
    ],
  },
  {
    slug: "youth-mentorship",
    name: "Youth & Mentorship Team",
    short: "Programs for young healthcare workers and structured mentorship pairs.",
    leader: "[Team Lead Name]",
    members: ["[Member 1]", "[Member 2]", "[Member 3]"],
    activities: [
      "Mentorship pairing program",
      "Career development workshops",
      "Young professionals' network",
    ],
  },
];

export const OBJECTIVES = [
  "Promote the welfare and well-being of all health care workers in Kirinyaga County.",
  "Provide emergency financial and moral support to members and their immediate families.",
  "Foster unity, professionalism, and collective bargaining among members.",
  "Advance continuous professional development and mentorship programs.",
  "Engage county and national stakeholders on issues affecting health workers.",
];

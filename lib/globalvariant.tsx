import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";

export const aka = ["Ponlawat Paraban", "Plutopon"];

export const menuItems: { label: string; ariaLabel: string; link: string; }[] = [
  // { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Showcase', ariaLabel: 'Showcase my projects', link: '/' },
  { label: 'Resume', ariaLabel: 'View my resume', link: '/resume' },
  // { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

export const whitelist_footer = [
  "/",
  "/resume",
  "/projects",
]

export const contactUrls = [
  {
    name: "Resume",
    icon: <FaFileAlt className="w-6 h-6" />,
    url: "https://plutopon.me/get-my-resume",
    hideFromSidebar: true,
  },
  {
    name: "Email",
    icon: <FaEnvelope className="w-6 h-6" />,
    url: "mailto:ponlawat.prb@gmail.com",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin className="w-6 h-6" />,
    url: "https://www.linkedin.com/in/plutopon/",
  },
  {
    name: "GitHub",
    icon: <FaGithub className="w-6 h-6" />,
    url: "https://github.com/ponlawatp",
  },
];

export const projects = [
  {
    title: "Planriean",
    description: "A digital academic scheduling tool and study planner designed to help university students organize their classes, simulate timetables, and track important deadlines.",
    url: "https://www.planriean.com/",
    logo: "https://planriean.com/assets/images/logo/planriean_logo_bg.png",
    tags: ["React", "Next.js", "TypeScript", "Node.js", "Python"],
  },
  {
    title: "Rabbit Rewards (website)",
    description: "A digital loyalty program linked to the Rabbit Card and BTS Skytrain, allowing users to earn points from daily commutes and retail purchases to redeem for free trips and partner promotions.",
    url: "https://rewards.rabbit.co.th/",
    logo: "https://rewards.rabbit.co.th/rabbit.png",
    tags: ["React", "Next.js", "TypeScript", "Node.js"],
  },
  {
    title: "MAETHONGBAIAMATA",
    description: "A comprehensive digital platform for a legacy gold shop, offering modernized financial services such as gold micro-savings (Aom Thong), 0% installment plans, and online interest payments for consignment.",
    url: "https://www.maethongbaigold.com/",
    logo: "https://www.maethongbaigold.com/mtbamt_gold_logo.png",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    title: "DDC Go!",
    description: "A computer rental web platform where users can top up credits, select specific machines, and choose their rental duration. It includes an admin system to manage the website's appearance, machine quantity, and overall data.",
    url: "https://goddc.co/",
    logo: "https://api.goddc.co/uploads/images/73cb0590-523c-40ed-b0d3-192b8e450687.png",
    tags: ["React", "Next.js", "Elysia", "TypeScript"],
  },
  {
    title: "Open Data - Urbanally",
    description: "An ASEAN-wide centralized data hub providing comprehensive urban environment overviews, open geodata for urban design, and interactive visualizations to support civic initiatives like the 15-Minute City.",
    url: "https://open-data.urbanally.org/",
    logo: "https://open-data.urbanally.org/favicon.ico",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    title: "Sonic Bangkok - Urbanally Project",
    description: "A cultural preservation project that maps the auditory identity of Bangkok's historic districts, featuring an open-source sound data repository, immersive exhibitions, and original music curated from local communities.",
    url: "https://open-data.urbanally.org/projects/Sonic-Pranakorn",
    logo: "https://open-data.urbanally.org/favicon.ico",
    tags: ["React", "Next.js", "TypeScript"],
  },
];

export const experience_data = [
  {
    date: "Jul 2024 - Mar 2026", // [cite: 14]
    experience_type: "Part-time", // [cite: 12]
    title: "Full-stack Developer", // [cite: 12]
    company: "Sodality Company Limited", // [cite: 12]
    description: [
      "Complex API Orchestration: Expertly integrated intricate RESTful APIs based on predefined technical designs from Miro and Figma, ensuring accurate data flow and state management for large-scale enterprise features.", // [cite: 15]
      "High-Performance UI Implementation: Developed and maintained responsive web interfaces using Next.js and Tailwind CSS, transforming high-fidelity designs into pixel-perfect, performant React components.", // [cite: 16]
      "State Management & UI Frameworks: Leveraged Zustand for efficient global state management and utilized Ant Design (Antd) to build standardized, enterprise-grade admin dashboards and user portals.", // [cite: 17]
      "BFF (Backend for Frontend) Development: Engineered BFF layers to streamline data delivery between complex backend microservices and the frontend, improving application load times and security.", // [cite: 18]
      "Agile & Collaborative Design: Actively collaborated with cross-functional teams using Figma and Jira to iterate on user flows and technical requirements, delivering features ahead of schedule." // [cite: 19]
    ],
  },
  {
    date: "Feb 2023 - Mar 2025", // [cite: 21]
    experience_type: "Freelance", // [cite: 20]
    title: "Selected Projects & Freelance", // [cite: 20]
    description: [
      "Rabbit Rewards Website (Enterprise): Architected and developed the entire web platform using Next.js 13, implementing a custom Cache Management system with Redis to enhance performance and handle high-traffic rewards redemption.", // [cite: 22]
      "Planriean (Personal Project): Developed a course scheduling platform for MSU students, optimizing the enrollment experience through high-performance data filtering.", // [cite: 23]
      "Morya E-commerce (PCAMPUS STUDIO): Built an E-commerce and POS Admin dashboard, implementing a robust Design System and complex API integrations." // [cite: 24]
    ],
  }
];

export const education_data = [
  {
    title: "Bachelor's degree in Computer Science", // [cite: 26]
    institution: "Mahasarakham University", // [cite: 25]
    year: "2021 - 2025", // [cite: 28]
    description: "", // [cite: 26]
  },
];

export const introduce_data = {
  description: "Full-stack Developer and UX/UI Designer specializing in Next.js, React, and Tailwind CSS.\n\nI build scalable, end-to-end web applications — driving the entire product lifecycle from technical design and UX/UI to complex API orchestration for high-traffic enterprise systems."
};
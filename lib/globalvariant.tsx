import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";

export const aka = ["Ponlawat Paraban", "Plutopon"];

export const menuItems: { label: string; ariaLabel: string; link: string; }[] = [
  // { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Showcase', ariaLabel: 'Showcase my projects', link: '/projects' },
  { label: 'Resume', ariaLabel: 'View my resume', link: '/resume' },
  // { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

export const contactUrls = [
  {
    name: "Resume",
    icon: <FaFileAlt className="w-6 h-6" />,
    url: "/Ponlawat_Paraban_Resume.pdf",
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
    description: "I led the development of a cutting-edge AI-powered financial tool that revolutionized the way users interact with their money.",
    url: "https://www.planriean.com",
    logo: "https://planriean.com/assets/images/logo/planriean_logo_bg.png",
    tags: ["React", "Next.js", "TypeScript", "Node.js", "Python"],
  },
  {
    title: "MAETHONGBAIAMATA",
    description: "I led the development of a cutting-edge AI-powered financial tool that revolutionized the way users interact with their money.",
    url: "https://www.planriean.com",
    logo: "https://www.maethongbaigold.com/mtbamt_gold_logo.png",
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
    description: "Graduated with a GPA of 3.31.", // [cite: 26]
  },
];

export const introduce_data = {
  description: "Full-stack Developer and UX/UI Designer specializing in Next.js, React, and Tailwind CSS.\n\nI build scalable, end-to-end web applications — driving the entire product lifecycle from technical design and UX/UI to complex API orchestration for high-traffic enterprise systems."
};
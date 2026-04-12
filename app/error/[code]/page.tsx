import ErrorView from "@/components/ErrorView";
import { Metadata } from "next";

export function generateStaticParams() {
  return [
    { code: "401" },
    { code: "403" },
    { code: "404" },
    { code: "500" },
    { code: "502" },
    { code: "503" },
    { code: "504" },
  ];
}

interface ErrorPageProps {
  params: {
    code: string;
  };
}

const errorDetails: Record<string, { title: string; message: string }> = {
  "401": { title: "Unauthorized", message: "You are not authorized to access this resource." },
  "403": { title: "Forbidden", message: "You don't have permission to access this page." },
  "404": { title: "Not Found", message: "Let's find something else." },
  "500": { title: "Server Error", message: "Something went wrong on our end." },
  "502": { title: "Bad Gateway", message: "The server is temporarily down. Please try again later." },
  "503": { title: "Service Unavailable", message: "The server is currently unable to handle the request." },
  "504": { title: "Gateway Timeout", message: "The server took too long to respond." },
};

export async function generateMetadata({ params }: ErrorPageProps): Promise<Metadata> {
  const code = params.code;
  const details = errorDetails[code] || errorDetails["500"];
  return {
    title: `${code} ${details.title} | Plutopon`,
  };
}

export default function ErrorPage({ params }: ErrorPageProps) {
  const code = params.code;
  const details = errorDetails[code] || { 
    title: "Error", 
    message: "An unexpected error occurred." 
  };

  return (
    <ErrorView 
      statusCode={code} 
      title={details.title} 
      message={details.message} 
    />
  );
}

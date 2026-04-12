"use client"
import ErrorView from "@/components/ErrorView";

export default function NotFound() {
  return (
    <ErrorView 
      statusCode="404" 
      title="Not Found" 
      message="Let's find something else" 
    />
  );
}
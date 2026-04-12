"use client"

import { useEffect } from 'react'
import ErrorView from '@/components/ErrorView'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  // Simple logic to extract a potential status code or title from the error
  const isForbidden = error.message?.toLowerCase().includes('forbidden') || error.message?.includes('403')
  const isUnauthorized = error.message?.toLowerCase().includes('unauthorized') || error.message?.includes('401')
  const isNotFound = error.message?.toLowerCase().includes('not found') || error.message?.includes('404')

  let statusCode = "500"
  let title = "Application Error"
  let message = error.message || "An unexpected error occurred"

  if (isForbidden) {
    statusCode = "403"
    title = "Forbidden"
  } else if (isUnauthorized) {
    statusCode = "401"
    title = "Unauthorized"
  } else if (isNotFound) {
    statusCode = "404"
    title = "Not Found"
  }

  return (
    <ErrorView 
      statusCode={statusCode} 
      title={title} 
      message={message}
      reset={reset} 
    />
  )
}

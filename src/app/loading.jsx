import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <Spinner color="success" />
    </main>
  )
}

import { Spinner } from "@heroui/react";

export default function Loading() {

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-gray-50 px-4 py-16 transition-colors duration-300 dark:bg-slate-900 sm:px-6 lg:px-8">

      <div className="flex flex-col items-center gap-4 rounded-2xl px-8 py-8 shadow-sm transition-colors duration-300 ">
        <Spinner
          color="success"
          size="lg"
        />
      </div>
    </main>
  )
}
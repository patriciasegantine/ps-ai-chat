import Link from "next/link";
import { ArrowLeft, FileX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(39,39,42,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,39,42,0.28)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-zinc-800" />

      <section className="relative flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-8 flex size-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black">
          <FileX className="size-7 text-zinc-300" aria-hidden="true" />
        </div>

        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
          Error 404
        </p>

        <h1 className="text-4xl font-semibold text-zinc-50 sm:text-6xl">
          Page not found
        </h1>

        <p className="mt-5 max-w-md text-balance text-sm leading-6 text-zinc-400 sm:text-base">
          The page you are looking for does not exist, moved, or is hiding
          somewhere outside this chat.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-700 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>

        <div className="mt-10 flex items-center gap-2 text-xs text-zinc-600">
          <Home className="size-3.5" aria-hidden="true" />
          <span>ftr-ai-sdk</span>
        </div>
      </section>
    </main>
  );
}

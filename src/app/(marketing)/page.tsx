import Link from "next/link";
import { Search, Zap, MessageCircle, ArrowRight } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-[#EDEAE4] bg-[#FAFAF8]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span
            className="text-xl font-semibold text-[#1C1917] tracking-tight font-display"
          >
            ApplyFlow
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors shadow-sm"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#EDEAE4] bg-[#F5F3EF] px-4 py-1.5 text-sm text-[#57534E]">
          <span className="h-2 w-2 rounded-full bg-[#0D9488]" />
          AI-powered job search, now available
        </div>

        <h1
          className="font-display mb-6 text-6xl font-semibold leading-[1.05] tracking-tight text-[#1C1917] lg:text-7xl"
        >
          Get hired
          <br />
          <span className="text-[#0D9488]">on autopilot.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-xl leading-relaxed text-[#57534E]">
          Upload your CV. Paste a job URL. Your AI agent handles the rest —
          tailored CV, cover letter, and ready-to-send email in 60 seconds.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-8 py-3.5 text-base font-medium text-white hover:bg-[#0F766E] transition-colors shadow-md shadow-[#0D9488]/20"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-[#EDEAE4] bg-white px-8 py-3.5 text-base font-medium text-[#57534E] hover:bg-[#F5F3EF] hover:text-[#1C1917] transition-colors"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-5 text-sm text-[#A8A29E]">
          No credit card required · Cancel anytime
        </p>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-[#EDEAE4]" />
      </div>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2
            className="font-display mb-3 text-4xl font-semibold text-[#1C1917]"
          >
            Everything you need to land the job
          </h2>
          <p className="text-lg text-[#57534E]">
            From discovery to offer, Atlas handles the heavy lifting.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-2xl border border-[#EDEAE4] bg-white p-8 shadow-sm hover:shadow-md hover:border-[#CCFBF1] transition-all duration-200">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#CCFBF1]">
              <Search className="h-6 w-6 text-[#0D9488]" />
            </div>
            <h3
              className="font-display mb-2 text-xl font-semibold text-[#1C1917]"
            >
              Job Discovery
            </h3>
            <p className="leading-relaxed text-[#57534E]">
              Atlas scans thousands of job boards daily and surfaces roles that
              match your skills, experience, and target salary — no more endless
              scrolling.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-[#EDEAE4] bg-white p-8 shadow-sm hover:shadow-md hover:border-[#CCFBF1] transition-all duration-200">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#CCFBF1]">
              <Zap className="h-6 w-6 text-[#0D9488]" />
            </div>
            <h3
              className="font-display mb-2 text-xl font-semibold text-[#1C1917]"
            >
              Smart Applications
            </h3>
            <p className="leading-relaxed text-[#57534E]">
              Paste a job URL and get a tailored CV, cover letter, and
              ready-to-send email — all grounded in your real experience, never
              fabricated.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border border-[#EDEAE4] bg-white p-8 shadow-sm hover:shadow-md hover:border-[#CCFBF1] transition-all duration-200">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#CCFBF1]">
              <MessageCircle className="h-6 w-6 text-[#0D9488]" />
            </div>
            <h3
              className="font-display mb-2 text-xl font-semibold text-[#1C1917]"
            >
              Interview Prep
            </h3>
            <p className="leading-relaxed text-[#57534E]">
              Get role-specific interview questions, model answers based on your
              background, and real-time coaching so you walk in confident every
              time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl bg-[#1C1917] px-10 py-16 text-center">
          <h2
            className="font-display mb-4 text-4xl font-semibold text-white"
          >
            Your next job is one click away.
          </h2>
          <p className="mb-8 text-lg text-[#A8A29E]">
            Join thousands of job seekers who've automated their search with
            ApplyFlow.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-8 py-3.5 text-base font-medium text-white hover:bg-[#0F766E] transition-colors"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EDEAE4] bg-[#F5F3EF]">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-[#A8A29E]">
          © {new Date().getFullYear()} ApplyFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

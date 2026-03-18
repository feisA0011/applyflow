import { Bot, Send, TrendingUp, MessageSquare, ArrowRight, Inbox } from "lucide-react";

const stats = [
  {
    label: "Applications Sent",
    value: "0",
    icon: Send,
    sub: "Get started below",
  },
  {
    label: "Response Rate",
    value: "0%",
    icon: TrendingUp,
    sub: "Industry avg ~8%",
  },
  {
    label: "Interviews",
    value: "0",
    icon: MessageSquare,
    sub: "None scheduled",
  },
  {
    label: "Active Agent",
    value: "Atlas",
    icon: Bot,
    sub: "Ready to work",
    highlight: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-[#A8A29E] mb-0.5">
          Good morning
        </p>
        <h1
          className="font-display text-3xl font-semibold text-[#1C1917]"
        >
          Welcome back, Jane 👋
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, sub, highlight }) => (
          <div
            key={label}
            className={`rounded-2xl border p-5 transition-shadow hover:shadow-md ${
              highlight
                ? "border-[#CCFBF1] bg-[#CCFBF1]/30"
                : "border-[#EDEAE4] bg-white"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  highlight ? "bg-[#0D9488]/10" : "bg-[#F5F3EF]"
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 ${
                    highlight ? "text-[#0D9488]" : "text-[#57534E]"
                  }`}
                />
              </div>
            </div>
            <p
              className={`text-2xl font-semibold font-display ${
                highlight ? "text-[#0D9488]" : "text-[#1C1917]"
              }`}
            >
              {value}
            </p>
            <p className="mt-0.5 text-sm font-medium text-[#57534E]">
              {label}
            </p>
            <p className="mt-0.5 text-xs text-[#A8A29E]">{sub}</p>
          </div>
        ))}
      </div>

      {/* Two-col row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Quick Apply */}
        <div className="lg:col-span-3 rounded-2xl border border-[#EDEAE4] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0D9488]">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display text-lg font-semibold text-[#1C1917]">
              Quick Apply
            </h2>
          </div>
          <p className="mb-5 text-sm text-[#57534E]">
            Paste a job URL and Atlas will tailor your CV, write a cover letter,
            and draft an outreach email — in under 60 seconds.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://jobs.company.com/role/senior-engineer"
              className="flex-1 rounded-xl border border-[#EDEAE4] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 transition-all"
            />
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors shadow-sm whitespace-nowrap"
            >
              Apply Now
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-3 text-xs text-[#A8A29E]">
            Supports LinkedIn, Greenhouse, Lever, Workday, and more
          </p>
        </div>

        {/* Agent status */}
        <div className="lg:col-span-2 rounded-2xl border border-[#EDEAE4] bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-[#1C1917] mb-4">
            Your Agent
          </h2>
          <div className="flex flex-col items-center text-center py-4">
            <div className="relative mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D9488]">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400" />
              </span>
            </div>
            <p className="font-display text-xl font-semibold text-[#1C1917]">
              Atlas
            </p>
            <p className="mt-1 text-sm text-[#57534E]">Active &amp; ready</p>
            <div className="mt-4 w-full rounded-xl bg-[#F5F3EF] px-4 py-2.5 text-xs text-[#57534E] text-left">
              ✓ CV parsed &nbsp;·&nbsp; ✗ First application pending
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="rounded-2xl border border-[#EDEAE4] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EDEAE4] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-[#1C1917]">
            Recent Applications
          </h2>
          <button
            type="button"
            className="text-sm font-medium text-[#0D9488] hover:text-[#0F766E] transition-colors"
          >
            View all
          </button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3EF]">
            <Inbox className="h-7 w-7 text-[#A8A29E]" />
          </div>
          <p className="font-display text-base font-semibold text-[#1C1917]">
            No applications yet
          </p>
          <p className="mt-1 max-w-xs text-sm text-[#57534E]">
            Use Quick Apply above to send your first application. Atlas will
            track every response for you.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-[#EDEAE4] bg-[#F5F3EF] px-4 py-2 text-sm font-medium text-[#57534E] hover:bg-[#EDEAE4] transition-colors"
          >
            Browse jobs
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}


import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Check,
  Zap,
  Droplets,
  Waves,
  TrafficCone,
  Trash2,
  TreePine,
  Construction,
  FileText,
  Navigation,
  Search,
  CircleAlert,
  Lightbulb,
  Sparkles,
  Bot,
  MessageCircleQuestion,
  Send,
} from "lucide-react";

const categories = [
  { label: "Electricity", desc: "Power outages, damaged poles and exposed wiring.", icon: Zap },
  { label: "Water", desc: "Leaks, burst pipes and interruptions to supply.", icon: Droplets },
  { label: "Sewer", desc: "Blocked drains, overflows and sanitation concerns.", icon: Waves },
  { label: "Roads", desc: "Potholes, damaged surfaces and unsafe roadways.", icon: Construction },
  { label: "Traffic Lights", desc: "Broken signals and dangerous intersections.", icon: TrafficCone },
  { label: "Illegal Dumping", desc: "Waste left in streets, parks or public spaces.", icon: Trash2 },
  { label: "Fallen Trees", desc: "Trees or branches blocking roads and walkways.", icon: TreePine },
  { label: "Other", desc: "Any other public infrastructure concern.", icon: MapPin },
];

function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#FF6C16]/30 bg-white dark:bg-[#181513] text-stone-900 dark:text-stone-100 transition-colors duration-300">

      {/* ── 1. HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative border-b border-stone-200 dark:border-stone-800/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-community.jpg" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-white/80 dark:bg-[#181513]/80 backdrop-blur-none"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-10 lg:py-12 grid lg:grid-cols-[1.02fr_0.98fr] gap-8 lg:gap-12 items-center min-h-[calc(100vh-4.5rem)]">

          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-stone-400 mb-4">
              <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
              Built for every community
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-[#F7F5F1] leading-[1.1] mb-5">
              Report infrastructure problems.{" "}
              <span className="text-[#FF6C16]">Improve your community.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 mb-8 max-w-xl leading-relaxed">
              PIRS helps citizens report public infrastructure problems, share their location, and keep track of their reports.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/report"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#FF6C16] px-6 text-base font-medium text-[#F7F5F1] shadow-sm hover:bg-[#EA6A0C] transition-colors"
              >
                Report an Issue
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/knowledge"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#241F1C] px-6 text-base font-medium text-stone-900 dark:text-[#F7F5F1] shadow-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                Explore Knowledge
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#10B981]" /> Add a location
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#10B981]" /> Include photos
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#10B981]" /> Track progress
              </span>
            </div>
          </div>

          <div className="relative pb-8 w-full max-w-xl mx-auto lg:mx-0">
            <div className="absolute left-[8%] top-[12%] h-[74%] w-px bg-stone-200 dark:bg-stone-800"></div>
            <div className="absolute left-[8%] top-[12%] h-px w-[78%] bg-stone-200 dark:bg-stone-800"></div>

            <div className="relative ml-[6%] mr-[2%] mt-8 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-[#241F1C] shadow-xl dark:shadow-2xl dark:shadow-black/50">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700/80 px-5 py-4 bg-stone-50/50 dark:bg-[#181513]/50">
                <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-[#F7F5F1]">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                  New infrastructure report
                </div>
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Step 2 of 3
                </span>
              </div>

              <div className="grid min-h-[20rem] md:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-stone-100 dark:border-stone-700/80 p-5 md:border-b-0 md:border-r">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FF6C16] mb-6">
                    Issue details
                  </p>

                  <div className="flex items-center gap-3 rounded-md border border-[#FF6C16]/30 bg-orange-50 dark:bg-orange-900/10 p-3 mb-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#FF6C16] text-[#F7F5F1]">
                      <Construction size={20} />
                    </span>

                    <span>
                      <strong className="block text-sm text-stone-900 dark:text-[#F7F5F1]">
                        Roads
                      </strong>
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        Pothole or road damage
                      </span>
                    </span>
                  </div>

                  <div className="space-y-3 mb-7">
                    <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-700"></div>
                    <div className="h-2 w-4/5 rounded-full bg-stone-100 dark:bg-stone-700"></div>
                    <div className="h-2 w-3/5 rounded-full bg-stone-100 dark:bg-stone-700"></div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981]">
                    <Check size={16} /> Photo attached
                  </div>
                </div>

                <div className="relative min-h-[16rem] overflow-hidden bg-stone-50 dark:bg-[#181513] p-4 flex items-end justify-center">
                  <div
                    className="absolute inset-0 opacity-20 dark:opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  ></div>

                  <div className="absolute left-[53%] top-[43%] -translate-x-1/2 -translate-y-1/2">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white dark:border-[#241F1C] bg-[#10B981] text-[#F7F5F1] shadow-lg">
                      <MapPin size={24} />
                    </span>
                  </div>

                  <div className="relative w-full flex items-center gap-2 rounded-md border border-[#10B981]/25 bg-white dark:bg-[#241F1C] p-3 shadow-sm z-10">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981]">
                      <Check size={16} />
                    </span>

                    <span>
                      <strong className="block text-xs text-stone-900 dark:text-[#F7F5F1]">
                        Location confirmed
                      </strong>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        Ready to submit
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 right-0 flex items-center gap-3 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] px-4 py-3 shadow-lg z-20">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-50 dark:bg-orange-900/20 text-[#FF6C16]">
                <Send size={16} className="-ml-0.5" />
              </span>

              <span className="text-xs">
                <strong className="block text-stone-900 dark:text-[#F7F5F1]">
                  Clear information
                </strong>
                <span className="text-stone-500 dark:text-stone-400">
                  helps describe the issue
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK CATEGORY SECTION ─────────────────────────────────── */}
      <section className="py-12 lg:py-10 bg-stone-50/50 dark:bg-[#1D160E]/50 border-b border-stone-200 dark:border-stone-800/80">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6C16] mb-3">
              Start a report
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-[#F7F5F1] mb-4">
              What needs attention?
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              Choose the type of infrastructure problem you want to report.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-200 dark:bg-stone-800">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={`/report?category=${encodeURIComponent(cat.label)}`}
                className="group relative flex flex-col min-h-[14rem] bg-white dark:bg-[#241F1C] p-6 transition-colors hover:bg-orange-50/50 dark:hover:bg-stone-800 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6C16]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#181513] text-[#FF6C16] transition-transform group-hover:-translate-y-1 shadow-sm">
                  <cat.icon size={20} />
                </span>

                <h3 className="mt-8 text-xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {cat.label}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
                  {cat.desc}
                </p>

                <span className="mt-6 flex items-center gap-2 text-sm font-bold text-[#FF6C16] opacity-0 transition-opacity group-hover:opacity-100">
                  Report this issue <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HOW PIRS WORKS ─────────────────────────────────────────── */}
      <section className="relative py-12 lg:py-10 text-[#F7F5F1] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/road-damaged.jpg" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#181513]/80 backdrop-blur-none"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center mb-24">
            <div className="lg:pr-16">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#FF6C16] mb-3">
                A clear process
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                How PIRS works
              </h2>
            </div>

            <p className="max-w-sm text-[15px] text-stone-400 leading-relaxed lg:justify-self-end pt-4 lg:pt-0">
              Three straightforward steps help turn what you see into a clear,
              trackable report.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-10 hidden h-px bg-stone-800/80 md:block"></div>

            <div className="grid gap-x-16 gap-y-12 md:grid-cols-3">
              <article className="relative">
                <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-stone-700/60 bg-[#181513] text-[#FF6C16]">
                  <FileText size={24} strokeWidth={1.5} />
                </span>
                <p className="mt-8 text-xs font-bold text-[#FF6C16]">01</p>
                <h3 className="mt-2 text-[22px] font-bold text-[#F7F5F1]">
                  Report
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400 max-w-[90%]">
                  Describe the infrastructure problem and provide useful
                  information.
                </p>
              </article>

              <article className="relative">
                <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-stone-700/60 bg-[#181513] text-[#FF6C16]">
                  <Navigation size={24} strokeWidth={1.5} />
                </span>
                <p className="mt-8 text-xs font-bold text-[#FF6C16]">02</p>
                <h3 className="mt-2 text-[22px] font-bold text-[#F7F5F1]">
                  Locate
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400 max-w-[90%]">
                  Share the location so the problem can be understood and acted
                  upon.
                </p>
              </article>

              <article className="relative">
                <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-stone-700/60 bg-[#181513] text-[#FF6C16]">
                  <Search size={24} strokeWidth={1.5} />
                </span>
                <p className="mt-8 text-xs font-bold text-[#FF6C16]">03</p>
                <h3 className="mt-2 text-[22px] font-bold text-[#F7F5F1]">
                  Track
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-400 max-w-[90%]">
                  Return to PIRS to monitor submitted reports.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. WHY PIRS / COMMUNITY IMPACT ────────────────────────────── */}
      <section className="py-12 lg:py-10 bg-white dark:bg-[#181513] border-b border-stone-200 dark:border-stone-800/80">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end mb-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF6C16] mb-3">
                Community impact
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-[#F7F5F1] max-w-xl leading-tight">
                Small reports can make a visible difference.
              </h2>
            </div>

            <p className="max-w-lg text-lg text-stone-600 dark:text-stone-400 lg:justify-self-end">
              Good public information starts with people documenting what they
              see—clearly, locally and responsibly.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-[#241F1C] p-8 shadow-sm">
              <div className="flex items-start justify-between mb-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981]">
                  <CircleAlert size={20} />
                </span>
                <span className="font-mono text-xs font-bold text-stone-400 dark:text-stone-500">
                  01
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 dark:text-[#F7F5F1] mb-3">
                Make Problems Visible
              </h3>

              <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">
                Give citizens a way to document infrastructure problems.
              </p>
            </article>

            <article className="rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-[#241F1C] p-8 shadow-sm">
              <div className="flex items-start justify-between mb-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981]">
                  <Lightbulb size={20} />
                </span>
                <span className="font-mono text-xs font-bold text-stone-400 dark:text-stone-500">
                  02
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 dark:text-[#F7F5F1] mb-3">
                Provide Better Information
              </h3>

              <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">
                Reports can include descriptions, locations and photos.
              </p>
            </article>

            <article className="rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-[#241F1C] p-8 shadow-sm">
              <div className="flex items-start justify-between mb-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981]">
                  <Check size={20} />
                </span>
                <span className="font-mono text-xs font-bold text-stone-400 dark:text-stone-500">
                  03
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 dark:text-[#F7F5F1] mb-3">
                Track Your Reports
              </h3>

              <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">
                Citizens can monitor their submitted reports.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── 5. KNOWLEDGE + AI ─────────────────────────────────────────── */}
      <section className="relative py-12 lg:py-10 border-b border-stone-200 dark:border-stone-800/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/ai-citizen.jpg" alt="" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-stone-50/80 dark:bg-[#1D160E]/80 backdrop-blur-none"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

          <div className="max-w-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6C16] mb-3">
              Knowledge + AI
            </p>

            <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-[#F7F5F1] mb-6">
              Not sure what to do?
            </h2>

            <p className="text-lg text-stone-600 dark:text-stone-400 mb-8">
              Explore infrastructure guidance or ask the PIRS AI Assistant for
              help understanding how to report a problem.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/knowledge"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#FF6C16] px-8 text-sm font-medium text-[#F7F5F1] shadow-sm hover:bg-[#EA6A0C] transition-colors"
              >
                Explore Knowledge
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/knowledge?assistant=open"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#241F1C] px-8 text-sm font-medium text-stone-900 dark:text-[#F7F5F1] shadow-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                Ask the AI Assistant
                <Sparkles size={16} />
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-[#241F1C] shadow-xl dark:shadow-2xl dark:shadow-black/50">
            <div className="flex items-center gap-3 border-b border-stone-100 dark:border-stone-700/80 px-5 py-4 bg-stone-50/50 dark:bg-[#181513]/50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#FF6C16] text-[#F7F5F1]">
                <Bot size={20} />
              </span>

              <span>
                <strong className="block text-sm text-stone-900 dark:text-[#F7F5F1]">
                  PIRS AI Assistant
                </strong>
                <span className="flex items-center gap-1.5 text-xs text-[#10B981]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
                  Ready to help
                </span>
              </span>
            </div>

            <div className="p-5 sm:p-7">
              <div className="max-w-[86%] rounded-lg rounded-tl-none bg-stone-100 dark:bg-stone-800 p-4 text-sm leading-6 text-stone-900 dark:text-stone-100">
                Hello. What would you like to know about reporting an
                infrastructure problem?
              </div>

              <p className="mt-8 mb-3 text-xs font-bold uppercase tracking-widest text-stone-500">
                Try asking
              </p>

              <div className="space-y-2">
                <Link
                  to="/knowledge?assistant=open"
                  className="group flex items-center justify-between gap-4 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#181513] px-4 py-3 text-sm font-medium transition-colors hover:border-[#FF6C16]/40 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                >
                  <span className="flex min-w-0 items-center gap-3 text-stone-700 dark:text-stone-300">
                    <MessageCircleQuestion size={16} className="shrink-0 text-[#FF6C16]" />
                    How do I report a water problem?
                  </span>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-stone-400 transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/knowledge?assistant=open"
                  className="group flex items-center justify-between gap-4 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#181513] px-4 py-3 text-sm font-medium transition-colors hover:border-[#FF6C16]/40 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                >
                  <span className="flex min-w-0 items-center gap-3 text-stone-700 dark:text-stone-300">
                    <MessageCircleQuestion size={16} className="shrink-0 text-[#FF6C16]" />
                    Who handles electricity faults?
                  </span>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-stone-400 transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/knowledge?assistant=open"
                  className="group flex items-center justify-between gap-4 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#181513] px-4 py-3 text-sm font-medium transition-colors hover:border-[#FF6C16]/40 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                >
                  <span className="flex min-w-0 items-center gap-3 text-stone-700 dark:text-stone-300">
                    <MessageCircleQuestion size={16} className="shrink-0 text-[#FF6C16]" />
                    What information should I provide?
                  </span>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-stone-400 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/repair-progress.jpg" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#FF6C16]/80 backdrop-blur-none"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-10 lg:py-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center text-[#F7F5F1]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#F7F5F1]/75 mb-4">
              Your report is a useful first step
            </p>

            <h2 className="text-2xl font-extrabold sm:text-3xl tracking-tight mb-4">
              See an infrastructure problem?
            </h2>

            <p className="max-w-2xl text-base leading-7 text-[#F7F5F1]/90">
              Report it through PIRS and help make infrastructure problems
              easier to identify and track.
            </p>
          </div>

          <Link
            to="/report"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-stone-900 px-8 text-base font-medium text-[#F7F5F1] shadow-sm hover:bg-stone-800 transition-colors whitespace-nowrap"
          >
            Report an Issue
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;


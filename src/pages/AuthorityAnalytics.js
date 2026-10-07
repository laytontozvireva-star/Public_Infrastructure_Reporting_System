import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  FileText,
  Loader2,
  TrendingUp,
  Activity,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { calculatePriority } from "../services/priority";

const CATEGORIES = [
  "Electricity",
  "Water",
  "Sewer",
  "Roads",
  "Traffic Lights",
  "Illegal Dumping",
  "Fallen Trees",
  "Other",
];

function AuthorityAnalytics() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error(fetchError);
        setError("Unable to load analytics data.");
      } else {
        setReports(data || []);
      }

      setLoading(false);
    }

    loadReports();
  }, []);

  const analytics = useMemo(() => {
    const total = reports.length;

    const pending = reports.filter(
      (report) => report.status === "Pending"
    ).length;

    const inProgress = reports.filter(
      (report) => report.status === "In Progress"
    ).length;

    const completed = reports.filter(
      (report) => report.status === "Completed"
    ).length;

    const priorities = reports.map((report) => ({
      ...report,
      priority: calculatePriority(report),
    }));

    const highPriority = priorities.filter(
      (report) => report.priority.level === "High"
    ).length;

    const mediumPriority = priorities.filter(
      (report) => report.priority.level === "Medium"
    ).length;

    const lowPriority = priorities.filter(
      (report) => report.priority.level === "Low"
    ).length;

    const unresolvedHighPriority = priorities.filter(
      (report) =>
        report.priority.level === "High" &&
        report.status !== "Completed"
    ).length;

    const resolutionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    const completedWithDates = reports.filter(
      (report) =>
        report.status === "Completed" &&
        report.created_at &&
        report.completed_at
    );

    let averageResolutionDays = 0;

    if (completedWithDates.length > 0) {
      const totalResolutionTime = completedWithDates.reduce(
        (sum, report) => {
          const created = new Date(report.created_at);
          const completedDate = new Date(report.completed_at);

          const difference =
            completedDate.getTime() - created.getTime();

          return sum + difference;
        },
        0
      );

      averageResolutionDays =
        totalResolutionTime /
        completedWithDates.length /
        (1000 * 60 * 60 * 24);

      averageResolutionDays =
        Math.round(averageResolutionDays * 10) / 10;
    }

    const categoryCounts = CATEGORIES.map((category) => ({
      category,
      count: reports.filter(
        (report) => report.category === category
      ).length,
    }));

    const mostReportedCategory =
      categoryCounts.length > 0
        ? [...categoryCounts].sort(
            (a, b) => b.count - a.count
          )[0]
        : null;

    return {
      total,
      pending,
      inProgress,
      completed,
      highPriority,
      mediumPriority,
      lowPriority,
      unresolvedHighPriority,
      resolutionRate,
      averageResolutionDays,
      categoryCounts,
      mostReportedCategory,
    };
  }, [reports]);

  const maxCategoryCount = Math.max(
    ...analytics.categoryCounts.map((item) => item.count),
    1
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#181513] flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#181513] px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#181513] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-[#FF6C16]/10 p-2">
              <BarChart3
                size={24}
                className="text-[#FF6C16]"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#F7F5F1]">
              Infrastructure Analytics
            </h1>
          </div>

          <p className="max-w-3xl text-sm sm:text-base text-stone-600 dark:text-stone-400">
            Monitor infrastructure reports, resolution performance,
            priority issues, and the most frequently reported
            infrastructure problems.
          </p>
        </div>

        {/* TOP STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">

          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Total Reports
                </p>

                <p className="mt-2 text-3xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {analytics.total}
                </p>
              </div>

              <FileText
                size={28}
                className="text-stone-400"
              />
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {analytics.completed}
                </p>
              </div>

              <CheckCircle2
                size={28}
                className="text-stone-400"
              />
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Resolution Rate
                </p>

                <p className="mt-2 text-3xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {analytics.resolutionRate}%
                </p>
              </div>

              <TrendingUp
                size={28}
                className="text-stone-400"
              />
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Avg. Resolution
                </p>

                <p className="mt-2 text-3xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {analytics.averageResolutionDays}
                </p>

                <p className="text-xs text-stone-500 dark:text-stone-400">
                  days
                </p>
              </div>

              <Clock3
                size={28}
                className="text-stone-400"
              />
            </div>
          </div>

        </div>

        {/* STATUS + PRIORITY */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">

          {/* STATUS */}
          <section className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Activity
                size={20}
                className="text-[#FF6C16]"
              />

              <h2 className="text-lg font-semibold text-stone-900 dark:text-[#F7F5F1]">
                Report Status
              </h2>
            </div>

            <div className="space-y-4">

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600 dark:text-stone-400">
                    Pending
                  </span>

                  <span className="font-semibold text-stone-900 dark:text-[#F7F5F1]">
                    {analytics.pending}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800">
                  <div
                    className="h-2 rounded-full bg-stone-400"
                    style={{
                      width: `${
                        analytics.total
                          ? (analytics.pending /
                              analytics.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600 dark:text-stone-400">
                    In Progress
                  </span>

                  <span className="font-semibold text-stone-900 dark:text-[#F7F5F1]">
                    {analytics.inProgress}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800">
                  <div
                    className="h-2 rounded-full bg-stone-500"
                    style={{
                      width: `${
                        analytics.total
                          ? (analytics.inProgress /
                              analytics.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600 dark:text-stone-400">
                    Completed
                  </span>

                  <span className="font-semibold text-stone-900 dark:text-[#F7F5F1]">
                    {analytics.completed}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800">
                  <div
                    className="h-2 rounded-full bg-stone-700 dark:bg-stone-300"
                    style={{
                      width: `${
                        analytics.total
                          ? (analytics.completed /
                              analytics.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* PRIORITY */}
          <section className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle
                size={20}
                className="text-[#FF6C16]"
              />

              <h2 className="text-lg font-semibold text-stone-900 dark:text-[#F7F5F1]">
                Smart Priority
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-lg border border-stone-200 dark:border-stone-700 p-4 text-center">
                <p className="text-2xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {analytics.highPriority}
                </p>

                <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                  High
                </p>
              </div>

              <div className="rounded-lg border border-stone-200 dark:border-stone-700 p-4 text-center">
                <p className="text-2xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {analytics.mediumPriority}
                </p>

                <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                  Medium
                </p>
              </div>

              <div className="rounded-lg border border-stone-200 dark:border-stone-700 p-4 text-center">
                <p className="text-2xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {analytics.lowPriority}
                </p>

                <p className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                  Low
                </p>
              </div>

            </div>

            <div className="mt-5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-[#F7F5F1]">
                    Urgent unresolved issues
                  </p>

                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    High-priority reports that still need attention.
                  </p>
                </div>

                <span className="text-2xl font-bold text-stone-900 dark:text-[#F7F5F1]">
                  {analytics.unresolvedHighPriority}
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* CATEGORY ANALYSIS */}
        <section className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-6 shadow-sm mb-8">

          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3
                  size={20}
                  className="text-[#FF6C16]"
                />

                <h2 className="text-lg font-semibold text-stone-900 dark:text-[#F7F5F1]">
                  Reports by Category
                </h2>
              </div>

              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Understand which infrastructure problems are being
                reported most frequently.
              </p>
            </div>

            {analytics.mostReportedCategory &&
              analytics.mostReportedCategory.count > 0 && (
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Most reported
                  </p>

                  <p className="text-sm font-semibold text-stone-900 dark:text-[#F7F5F1]">
                    {analytics.mostReportedCategory.category}
                  </p>
                </div>
              )}
          </div>

          <div className="space-y-4">
            {analytics.categoryCounts.map((item) => (
              <div key={item.category}>

                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="text-sm text-stone-700 dark:text-stone-300">
                    {item.category}
                  </span>

                  <span className="text-sm font-semibold text-stone-900 dark:text-[#F7F5F1]">
                    {item.count}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-[#FF6C16]"
                    style={{
                      width: `${
                        (item.count / maxCategoryCount) *
                        100
                      }%`,
                    }}
                  />
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* INSIGHT */}
        <section className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-6 shadow-sm">

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-[#FF6C16]/10 p-2">
              <TrendingUp
                size={22}
                className="text-[#FF6C16]"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-[#F7F5F1]">
                Infrastructure Intelligence
              </h2>

              <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                PIRS transforms citizen reports into actionable
                infrastructure intelligence. Authorities can use
                report volume, priority levels, and resolution
                performance to understand where infrastructure
                problems are occurring and where attention is most
                urgently needed.
              </p>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}

export default AuthorityAnalytics;
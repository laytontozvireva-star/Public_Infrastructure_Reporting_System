import { useEffect, useMemo, useState } from "react";
import { calculatePriority } from "../services/priority";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = ["All", "Pending", "In Progress", "Completed"];

const CATEGORY_OPTIONS = [
  "All",
  "Electricity",
  "Water",
  "Sewer",
  "Roads",
  "Traffic Lights",
  "Illegal Dumping",
  "Fallen Trees",
  "Other",
];

const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];

const statusStyles = {
  Pending: {
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  "In Progress": {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  Completed: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
};

function AuthorityDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [selectedReport, setSelectedReport] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadReports(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    const { data, error: fetchError } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setReports([]);
    } else {
      const reportsWithPriority = (data || []).map((report) => ({
        ...report,
        priority: calculatePriority(report),
      }));

      setReports(reportsWithPriority);
    }

    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    loadReports();
  }, [user, authLoading]);

  async function updateStatus(reportId, newStatus) {
  setUpdatingId(reportId);
  setError("");

  const completedAt =
    newStatus === "Completed"
      ? new Date().toISOString()
      : null;

  const { data, error: updateError } = await supabase
    .from("reports")
    .update({
      status: newStatus,
      completed_at: completedAt,
    })
    .eq("id", reportId)
    .select()
    .single();

  if (updateError) {
    setError(updateError.message);
  } else {
    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? {
              ...report,
              ...(data || {}),
            }
          : report
      )
    );

    setSelectedReport((current) =>
      current && current.id === reportId
        ? {
            ...current,
            ...(data || {}),
          }
        : current
    );
  }

  setUpdatingId(null);
}

const stats = useMemo(() => {
  const total = reports.length;

  const pending = reports.filter(
    (r) => r.status === "Pending"
  ).length;

  const inProgress = reports.filter(
    (r) => r.status === "In Progress"
  ).length;

  const completed = reports.filter(
    (r) => r.status === "Completed"
  ).length;

  const highPriority = reports.filter(
    (r) => r.priority?.level === "High"
  ).length;

  const mediumPriority = reports.filter(
    (r) => r.priority?.level === "Medium"
  ).length;

  const lowPriority = reports.filter(
    (r) => r.priority?.level === "Low"
  ).length;

  const unresolvedHighPriority = reports.filter(
    (r) =>
      r.priority?.level === "High" &&
      r.status !== "Completed"
  ).length;

  const resolutionRate =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  const completedReportsWithTime = reports.filter(
    (r) => r.created_at && r.completed_at
  );

  let averageResolutionDays = 0;

  if (completedReportsWithTime.length > 0) {
    const totalResolutionTime =
      completedReportsWithTime.reduce((totalTime, report) => {
        const createdTime = new Date(
          report.created_at
        ).getTime();

        const completedTime = new Date(
          report.completed_at
        ).getTime();

        return totalTime + (completedTime - createdTime);
      }, 0);

    averageResolutionDays =
      totalResolutionTime /
      completedReportsWithTime.length /
      (1000 * 60 * 60 * 24);

    averageResolutionDays =
      Math.round(averageResolutionDays * 10) / 10;
  }

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
  };
}, [reports]);

  const filteredReports = useMemo(() => {
  const filtered = reports.filter((report) => {
    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      report.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      report.priority?.level === priorityFilter;

    return (
      matchesStatus &&
      matchesCategory &&
      matchesPriority
    );
  });

  return filtered.sort(
    (a, b) =>
      (b.priority?.score || 0) -
      (a.priority?.score || 0)
  );
}, [
  reports,
  statusFilter,
  categoryFilter,
  priorityFilter,
]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#181411] flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading authority dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#181411] flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-orange-500" />

          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Authority Access Required
          </h1>

          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Please log in with an authority account to access
            this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#181411]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-orange-500" />

              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                Authority Portal
              </span>
            </div>

            <h1 className="text-3xl font-black text-stone-900 dark:text-stone-100 sm:text-4xl">
              Infrastructure Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">
              Monitor, prioritize and manage infrastructure
              reports submitted by citizens.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadReports(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-700 dark:bg-[#241F1C] dark:text-stone-200 dark:hover:bg-[#302925]"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Main Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-[#241F1C]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Total Reports
                </p>

                <p className="mt-2 text-3xl font-black text-stone-900 dark:text-stone-100">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-[#241F1C]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-black text-orange-600">
                  {stats.pending}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-[#241F1C]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-black text-amber-600">
                  {stats.inProgress}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300">
                <TriangleAlert className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-[#241F1C]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-600">
                  {stats.completed}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-[#241F1C]">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-stone-500">
        Resolution Rate
      </p>

      <p className="mt-2 text-3xl font-black text-blue-600">
        {stats.resolutionRate}%
      </p>
    </div>

    <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
      <CheckCircle2 className="h-6 w-6" />
    </div>
  </div>

  <p className="mt-2 text-xs text-stone-500">
    Reports successfully completed
  </p>
</div>

        {/* Priority Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/20">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              High Priority
            </p>

            <p className="mt-2 text-3xl font-black text-red-700 dark:text-red-300">
              {stats.highPriority}
            </p>

            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Requires urgent attention
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900 dark:bg-orange-950/20">
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              Medium Priority
            </p>

            <p className="mt-2 text-3xl font-black text-orange-700 dark:text-orange-300">
              {stats.mediumPriority}
            </p>

            <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
              Needs attention
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/20">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              Low Priority
            </p>

            <p className="mt-2 text-3xl font-black text-green-700 dark:text-green-300">
              {stats.lowPriority}
            </p>

            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              Routine attention
            </p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900 dark:bg-[#241F1C]">

            {/* Performance */}
<div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-[#241F1C]">
  <div className="mb-4">
    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
      Performance
    </h2>

    <p className="mt-1 text-sm text-stone-500">
      How quickly infrastructure reports are being resolved.
    </p>
  </div>

  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-medium text-stone-500">
        Average Resolution Time
      </p>

      <p className="mt-1 text-3xl font-black text-blue-600">
        {stats.averageResolutionDays}{" "}
        <span className="text-base font-semibold text-stone-500">
          days
        </span>
      </p>
    </div>

    <div className="max-w-md text-sm leading-6 text-stone-500">
      Based on reports that have both a submission time and
      a completion time.
    </div>
  </div>
</div>

  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-red-700 dark:text-red-300">
        Urgent Unresolved
      </p>

      <p className="mt-2 text-3xl font-black text-red-700 dark:text-red-300">
        {stats.unresolvedHighPriority}
      </p>
    </div>

    <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-300">
      <TriangleAlert className="h-6 w-6" />
    </div>
  </div>

  <p className="mt-2 text-xs text-stone-500">
    High-priority reports still requiring action
  </p>
</div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-[#241F1C]">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Filters
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Narrow reports by status, category or priority.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-orange-500 dark:border-stone-700 dark:bg-[#181411] dark:text-stone-100"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">
                Category
              </label>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-orange-500 dark:border-stone-700 dark:bg-[#181411] dark:text-stone-100"
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-orange-500 dark:border-stone-700 dark:bg-[#181411] dark:text-stone-100"
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reports */}
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-[#241F1C]">
          <div className="border-b border-stone-200 p-5 dark:border-stone-700">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Infrastructure Reports
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Showing {filteredReports.length} of{" "}
                  {reports.length} reports
                </p>
              </div>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-10 text-center">
              <XCircle className="mx-auto mb-3 h-10 w-10 text-stone-400" />

              <h3 className="font-bold text-stone-900 dark:text-stone-100">
                No reports found
              </h3>

              <p className="mt-1 text-sm text-stone-500">
                Try changing your filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-stone-700">
              {filteredReports.map((report) => {
                const status =
                  statusStyles[report.status] ||
                  statusStyles.Pending;

                return (
                  <div
                    key={report.id}
                    className="p-5 transition hover:bg-stone-50 dark:hover:bg-[#2b2521]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      {/* Report Information */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                            {report.category}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            {report.status || "Pending"}
                          </span>

                          {report.priority && (
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                                report.priority.level === "High"
                                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                                  : report.priority.level ===
                                    "Medium"
                                  ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300"
                                  : "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                              }`}
                            >
                              {report.priority.level === "High"
                                ? "🔴 HIGH"
                                : report.priority.level ===
                                  "Medium"
                                ? "🟠 MEDIUM"
                                : "🟢 LOW"}{" "}
                              · {report.priority.score}/100
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                          {report.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                          {report.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />

                            {report.created_at
                              ? new Date(
                                  report.created_at
                                ).toLocaleString()
                              : "Unknown date"}
                          </span>

                          {report.latitude !== null &&
                            report.latitude !== undefined &&
                            report.longitude !== null &&
                            report.longitude !== undefined && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />

                                GPS available
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReport(report)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-[#181411] dark:text-stone-200 dark:hover:bg-[#302925]"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>

                        <select
                          value={report.status || "Pending"}
                          onChange={(e) =>
                            updateStatus(
                              report.id,
                              e.target.value
                            )
                          }
                          disabled={
                            updatingId === report.id
                          }
                          className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 outline-none focus:border-orange-500 disabled:opacity-60 dark:border-stone-700 dark:bg-[#181411] dark:text-stone-200"
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Completed">
                            Completed
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* View Report Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-[#241F1C]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-[#241F1C]">
              <div className="pr-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    {selectedReport.category}
                  </span>

                  {selectedReport.priority && (
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        selectedReport.priority.level === "High"
                          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                          : selectedReport.priority.level ===
                            "Medium"
                          ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300"
                          : "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                      }`}
                    >
                      {selectedReport.priority.level} Priority
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
                  {selectedReport.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                aria-label="Close"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 p-6">

              {/* Photo */}
              {selectedReport.photo_url && (
                <img
                  src={selectedReport.photo_url}
                  alt="Report evidence"
                  className="max-h-80 w-full rounded-xl border border-stone-200 object-cover dark:border-stone-700"
                />
              )}

              {/* Smart Priority */}
              {selectedReport.priority && (
                <div
                  className={`rounded-xl border p-5 ${
                    selectedReport.priority.level === "High"
                      ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                      : selectedReport.priority.level ===
                        "Medium"
                      ? "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30"
                      : "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        PIRS Smart Priority
                      </p>

                      <p
                        className={`mt-1 text-lg font-bold ${
                          selectedReport.priority.level ===
                          "High"
                            ? "text-red-700 dark:text-red-300"
                            : selectedReport.priority.level ===
                              "Medium"
                            ? "text-orange-700 dark:text-orange-300"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {selectedReport.priority.level ===
                        "High"
                          ? "🔴 High Priority"
                          : selectedReport.priority.level ===
                            "Medium"
                          ? "🟠 Medium Priority"
                          : "🟢 Low Priority"}
                      </p>

                      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                        Based on category impact, severity,
                        evidence and report age.
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-3xl font-black text-stone-900 dark:text-stone-100">
                        {selectedReport.priority.score}
                        <span className="text-sm font-semibold text-stone-500">
                          /100
                        </span>
                      </p>

                      <p className="text-xs text-stone-500">
                        Priority Score
                      </p>
                    </div>
                  </div>

                  {/* Priority Breakdown */}
<div className="mt-5">
  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
    Why this report received this score
  </p>

  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    <div className="rounded-lg bg-white/70 p-3 dark:bg-black/10">
      <p className="text-xs text-stone-500">
        Category Impact
      </p>

      <p className="mt-1 text-lg font-black text-stone-900 dark:text-stone-100">
        +{selectedReport.priority.breakdown.category}
      </p>
    </div>

    <div className="rounded-lg bg-white/70 p-3 dark:bg-black/10">
      <p className="text-xs text-stone-500">
        Severity
      </p>

      <p className="mt-1 text-lg font-black text-stone-900 dark:text-stone-100">
        +{selectedReport.priority.breakdown.severity}
      </p>
    </div>

    <div className="rounded-lg bg-white/70 p-3 dark:bg-black/10">
      <p className="text-xs text-stone-500">
        Evidence
      </p>

      <p className="mt-1 text-lg font-black text-stone-900 dark:text-stone-100">
        +{selectedReport.priority.breakdown.evidence}
      </p>
    </div>

    <div className="rounded-lg bg-white/70 p-3 dark:bg-black/10">
      <p className="text-xs text-stone-500">
        Report Age
      </p>

      <p className="mt-1 text-lg font-black text-stone-900 dark:text-stone-100">
        +{selectedReport.priority.breakdown.age}
      </p>
    </div>
  </div>
</div>
                </div>
              )}

              {/* Description */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                  Description
                </p>

                <p className="leading-7 text-stone-700 dark:text-stone-300">
                  {selectedReport.description}
                </p>
              </div>

              {/* Report Details */}
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Category */}
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-[#181411]">
                  <p className="text-xs font-semibold text-stone-500">
                    Category
                  </p>

                  <p className="mt-1 font-bold text-stone-900 dark:text-stone-100">
                    {selectedReport.category}
                  </p>
                </div>

                {/* Status */}
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-[#181411]">
                  <p className="text-xs font-semibold text-stone-500">
                    Status
                  </p>

                  <p className="mt-1 font-bold text-stone-900 dark:text-stone-100">
                    {selectedReport.status || "Pending"}
                  </p>
                </div>

                {/* Reported */}
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-[#181411]">
                  <p className="text-xs font-semibold text-stone-500">
                    Reported
                  </p>

                  <p className="mt-1 font-bold text-stone-900 dark:text-stone-100">
                    {selectedReport.created_at
                      ? new Date(
                          selectedReport.created_at
                        ).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                {/* Location */}
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-[#181411]">
                  <p className="text-xs font-semibold text-stone-500">
                    Location
                  </p>

                  {selectedReport.latitude !== null &&
                  selectedReport.latitude !== undefined &&
                  selectedReport.longitude !== null &&
                  selectedReport.longitude !== undefined ? (
                    <p className="mt-1 font-bold text-stone-900 dark:text-stone-100">
                      GPS coordinates available
                    </p>
                  ) : (
                    <p className="mt-1 font-bold text-stone-500">
                      No GPS location
                    </p>
                  )}
                </div>
              </div>

              {/* Google Maps */}
              {selectedReport.latitude !== null &&
                selectedReport.latitude !== undefined &&
                selectedReport.longitude !== null &&
                selectedReport.longitude !== undefined && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    <MapPin className="h-5 w-5" />
                    Open Location in Google Maps
                  </a>
                )}

              {/* Status Actions */}
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
                  Update Report Status
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedReport.id,
                        "Pending"
                      )
                    }
                    disabled={
                      updatingId === selectedReport.id
                    }
                    className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100 disabled:opacity-50 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300"
                  >
                    Pending
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedReport.id,
                        "In Progress"
                      )
                    }
                    disabled={
                      updatingId === selectedReport.id
                    }
                    className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
                  >
                    In Progress
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedReport.id,
                        "Completed"
                      )
                    }
                    disabled={
                      updatingId === selectedReport.id
                    }
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                  >
                    Completed
                  </button>
                </div>
              </div>

              {updatingId === selectedReport.id && (
                <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating report...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorityDashboard;
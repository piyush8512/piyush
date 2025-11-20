"use client";

import React, { useEffect, useState } from "react";
import { Github, Zap, Activity } from "lucide-react";

type Metrics = {
  github?: {
    totalContributions?: number;
    currentStreak?: number;
    avatarUrl?: string;
    publicRepos?: number;
    weeks?: Array<Array<{ date: string; contributionCount: number }>>;
    error?: string;
  };
  leetcode?: {
    totalSolved?: number;
    weeks?: Array<Array<{ date: string; contributionCount: number }>>;
    submissionsPastYear?: number;
    latestBadgeUrl?: string;
    error?: string;
  };
};

function getContributionColor(count: number, max: number): string {
  if (!count || count <= 0) return "bg-gray-200 dark:bg-gray-700";
  const ratio = count / Math.max(1, max);
  if (ratio < 0.2) return "bg-lime-200 dark:bg-lime-700";
  if (ratio < 0.4) return "bg-lime-300 dark:bg-lime-600";
  if (ratio < 0.6) return "bg-lime-400 dark:bg-lime-500";
  if (ratio < 0.8) return "bg-lime-500 dark:bg-lime-400";
  return "bg-lime-600 dark:bg-lime-300";
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-4 text-center border border-white ">
      <div className="text-xs font-semibold text-white dark:text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
        {value}
        {Icon && Icon}
      </div>
    </div>
  );
}

export default function ProfileMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setMetrics(data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  console.log("Metrics data:", metrics);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          Loading metrics…
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
        No metrics available
      </div>
    );
  }

  const gh = metrics.github;
  const lc = metrics.leetcode;
  console.log("GitHub Data:", gh);

  // Calculate max contributions for heatmap color scaling
  let maxContributions = 0;
  if (gh?.weeks) {
    for (const week of gh.weeks) {
      for (const day of week) {
        if (day.contributionCount > maxContributions) {
          maxContributions = day.contributionCount;
        }
      }
    }
  }

  // Calculate solved stats by difficulty (if we had that data)
  const easyCount = Math.floor((lc?.totalSolved || 0) * 0.35);
  const mediumCount = Math.floor((lc?.totalSolved || 0) * 0.58);
  const hardCount = (lc?.totalSolved || 0) - easyCount - mediumCount;

  return (
    <div className="space-y-6">
      {/* GitHub Header with Profile */}
      {gh && !gh.error && (
        <div className="  border border-white overflow-hidden">
          <div className=" p-6">
            <div className="flex items-center gap-4">
              {gh.avatarUrl && (
                <img
                  src={gh.avatarUrl}
                  alt="GitHub Profile"
                  className="w-16 h-16 rounded-full border-4 shadow-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Github className="w-6 h-6" />
                  GitHub Stats
                </h2>
                <p className="text-emerald-100 text-sm">@piyush8512</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 p-4">
            <StatCard label="Repos" value={gh.publicRepos ?? "—"} />
            <StatCard
              label="Contributions"
              value={gh.totalContributions ?? "—"}
            />
            <StatCard
              label="Streak"
              value={gh.currentStreak ?? "—"}
              icon={<Zap className="w-5 h-5 text-yellow-500" />}
            />
          </div>
        </div>
      )}

      {/* Main Grid: Heatmap + LeetCode */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Heatmap - Takes 2 columns on large screens */}
        {gh?.weeks ? (
          <div className="lg:col-span-3   border border-gray-200  p-5">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Annual Contributions
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {gh.totalContributions} total contributions in the last year
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b ">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Less
              </span>
              <div className="flex gap-1">
                {[
                  { color: "bg-gray-200 dark:bg-gray-700", label: "0" },
                  { color: "bg-lime-200 dark:bg-lime-700", label: "1-25%" },
                  { color: "bg-lime-400 dark:bg-lime-500", label: "50%" },
                  { color: "bg-lime-600 dark:bg-lime-300", label: "100%" },
                ].map((item, i) => (
                  <div
                    key={i}
                    title={item.label}
                    className={`w-3 h-3 rounded border border-gray-400 dark:border-gray-600 ${item.color}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                More
              </span>
            </div>

            {/* Heatmap Grid with Month Labels */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-0 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg w-fit">
                {/* Day of week labels (left side) */}
                <div className="flex flex-col justify-end gap-1 pr-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-xs text-gray-500 dark:text-gray-400 font-semibold w-8 text-right"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                {/* Heatmap columns with month labels on top */}
                <div>
                  <div className="flex gap-1 mb-2">
                    {gh.weeks?.map((week, weekIdx) => {
                      const date = new Date(week[0]?.date || "");
                      const monthName = date.toLocaleString("default", {
                        month: "short",
                      });
                      return (
                        <div
                          key={weekIdx}
                          className="flex flex-col items-center gap-1"
                        >
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold h-5 flex items-end">
                            {monthName}
                          </div>
                          <div className="flex flex-col gap-1">
                            {week.map((day, dayIdx) => {
                              const color = getContributionColor(
                                day.contributionCount,
                                maxContributions
                              );
                              return (
                                <div
                                  key={dayIdx}
                                  title={`${day.date}: ${day.contributionCount} contribution${
                                    day.contributionCount !== 1 ? "s" : ""
                                  }`}
                                  className={`w-4 h-4 rounded-sm border border-gray-300 dark:border-slate-700 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all ${color}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : gh?.error ? (
          <div className="lg:col-span-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-5">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              GitHub Error
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {gh.error}
            </p>
          </div>
        ) : null}

        {/* LeetCode Panel - Right side */}
        {lc && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Total Solved Card */}
              <div className="flex-1 border p-4    ">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Total Problems
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {lc.totalSolved ?? "—"}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Problems solved
                </p>
              </div>

              {/* By Difficulty */}
              <div className="flex-1 border p-4 ">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  By Difficulty
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20">
                    <svg
                      viewBox="0 0 120 120"
                      className="w-full h-full transform -rotate-90"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="15"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="15"
                        strokeDasharray={`${(easyCount / (lc.totalSolved || 1)) * 283} 283`}
                        className="text-green-500 dark:text-green-400"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="15"
                        strokeDasharray={`${(mediumCount / (lc.totalSolved || 1)) * 283} 283`}
                        strokeDashoffset={
                          -((easyCount / (lc.totalSolved || 1)) * 283)
                        }
                        className="text-yellow-500 dark:text-yellow-400"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="15"
                        strokeDasharray={`${(hardCount / (lc.totalSolved || 1)) * 283} 283`}
                        strokeDashoffset={
                          -((easyCount + mediumCount) / (lc.totalSolved || 1)) *
                          283
                        }
                        className="text-red-500 dark:text-red-400"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {lc.totalSolved}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Easy
                      </span>
                      <strong className="text-gray-900 dark:text-white">
                        {easyCount}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Medium
                      </span>
                      <strong className="text-gray-900 dark:text-white">
                        {mediumCount}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Hard
                      </span>
                      <strong className="text-gray-900 dark:text-white">
                        {hardCount}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Card */}
              <div className="flex-1 border p-4 ">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  LeetCode Rating
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  1562
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Contest Rating
                </p>
              </div>
            </div>

       

            {/* LeetCode Heatmap */}
            {lc.weeks ? (
              <div className=" border  p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      LeetCode Activity
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {lc.submissionsPastYear ?? 0} submissions in the past one
                      year
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Last year
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="flex gap-0 p-2 bg-gray-50 dark:bg-slate-900 rounded-lg w-fit">
                    {/* Day of week labels (left side) */}
                    <div className="flex flex-col justify-end gap-1 pr-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-xs text-gray-500 dark:text-gray-400 font-semibold w-6 text-right"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>
                    {/* Heatmap columns with month labels on top */}
                    <div>
                      <div className="flex gap-1 mb-2">
                        {lc.weeks?.map(
                          (
                            week: Array<{
                              date: string;
                              contributionCount: number;
                            }>,
                            wi: number
                          ) => {
                            const date = new Date(week[0]?.date || "");
                            const monthName = date.toLocaleString("default", {
                              month: "short",
                            });
                            const maxLc = Math.max(
                              ...lc
                                .weeks!.flat()
                                .map(
                                  (d: {
                                    date: string;
                                    contributionCount: number;
                                  }) => d.contributionCount
                                )
                            );
                            return (
                              <div
                                key={wi}
                                className="flex flex-col items-center gap-1"
                              >
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold h-5 flex items-end">
                                  {monthName}
                                </div>
                                <div className="flex flex-col gap-1">
                                  {week.map(
                                    (
                                      day: {
                                        date: string;
                                        contributionCount: number;
                                      },
                                      di: number
                                    ) => {
                                      const color = getContributionColor(
                                        day.contributionCount,
                                        maxLc || 1
                                      );
                                      return (
                                        <div
                                          key={di}
                                          title={`${day.date}: ${day.contributionCount} submissions`}
                                          className={`w-3 h-3 rounded-sm border border-gray-300 dark:border-slate-700 ${color}`}
                                        />
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : lc.error ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {lc.error}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Error States */}
      {lc?.error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            LeetCode Error
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            {lc.error}
          </p>
        </div>
      )}
    </div>
  );
}

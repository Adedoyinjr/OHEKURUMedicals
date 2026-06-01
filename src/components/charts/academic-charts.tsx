"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import type { CourseResult } from "@/types/academic"

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
)

type AcademicChartsProps = {
  gpaTrend: { label: string; gpa: number }[]
  results: CourseResult[]
}

function useIsDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    const updateMode = () => setIsDarkMode(root.classList.contains("dark"))

    updateMode()

    const observer = new MutationObserver(updateMode)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return isDarkMode
}

export function AcademicCharts({ gpaTrend, results }: AcademicChartsProps) {
  const isDarkMode = useIsDarkMode()
  const gradedResults = results.filter((result) => result.grade)
  const passCount = gradedResults.filter((result) => result.grade !== "F").length
  const failCount = gradedResults.length - passCount
  const chartTheme = isDarkMode
    ? {
        axis: "rgba(226, 232, 240, 0.78)",
        grid: "rgba(148, 163, 184, 0.16)",
        primary: "#2dd4bf",
        primaryFill: "rgba(45, 212, 191, 0.18)",
        accent: "#c084fc",
        secondary: "#fbbf24",
        destructive: "#f87171",
      }
    : {
        axis: "rgba(71, 85, 105, 0.9)",
        grid: "rgba(148, 163, 184, 0.25)",
        primary: "#0f766e",
        primaryFill: "rgba(15, 118, 110, 0.14)",
        accent: "#7c3aed",
        secondary: "#f59e0b",
        destructive: "#dc2626",
      }

  const lineOptions = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { intersect: false, mode: "index" },
      },
      scales: {
        y: {
          min: 0,
          max: 5,
          grid: { color: chartTheme.grid },
          ticks: { color: chartTheme.axis },
        },
        x: {
          grid: { display: false },
          ticks: { color: chartTheme.axis },
        },
      },
    }),
    [chartTheme.axis, chartTheme.grid],
  )

  const barOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: chartTheme.grid },
          ticks: { color: chartTheme.axis },
        },
        x: {
          grid: { display: false },
          ticks: { color: chartTheme.axis },
        },
      },
    }),
    [chartTheme.axis, chartTheme.grid],
  )

  const doughnutOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            color: chartTheme.axis,
            usePointStyle: true,
          },
        },
      },
    }),
    [chartTheme.axis],
  )

  const lineData = {
    labels: gpaTrend.map((point) => point.label),
    datasets: [
      {
        data: gpaTrend.map((point) => point.gpa),
        borderColor: chartTheme.primary,
        backgroundColor: chartTheme.primaryFill,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: chartTheme.primary,
      },
    ],
  }

  const barData = {
    labels: results.map((result) => result.courseCode),
    datasets: [
      {
        data: results.map((result) => result.score),
        backgroundColor: [
          chartTheme.primary,
          chartTheme.accent,
          chartTheme.secondary,
          chartTheme.destructive,
        ],
        borderRadius: 6,
      },
    ],
  }

  const doughnutData = {
    labels: ["Passed", "Failed"],
    datasets: [
      {
        data: [passCount, failCount],
        backgroundColor: [chartTheme.primary, chartTheme.destructive],
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div className="min-w-0 overflow-hidden rounded-lg border bg-card p-4 sm:p-5">
        <h2 className="text-base font-semibold">GPA Trend</h2>
        <div className="mt-4 h-48 w-full sm:h-56 md:h-64">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-lg border bg-card p-4 sm:p-5">
        <h2 className="text-base font-semibold">Semester Performance</h2>
        <div className="mt-4 h-48 w-full sm:h-56 md:h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="min-w-0 overflow-hidden rounded-lg border bg-card p-4 sm:p-5 md:col-span-2 xl:col-span-1">
        <h2 className="text-base font-semibold">Pass/Fail Ratio</h2>
        <div className="mt-4 h-48 w-full sm:h-56 md:h-64">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  )
}

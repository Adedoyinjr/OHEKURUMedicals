"use client"

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

const lineOptions: ChartOptions<"line"> = {
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
      grid: { color: "rgba(148, 163, 184, 0.25)" },
    },
    x: {
      grid: { display: false },
    },
  },
}

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      grid: { color: "rgba(148, 163, 184, 0.25)" },
    },
    x: {
      grid: { display: false },
    },
  },
}

const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
        usePointStyle: true,
      },
    },
  },
}

export function AcademicCharts({ gpaTrend, results }: AcademicChartsProps) {
  const gradedResults = results.filter((result) => result.grade)
  const passCount = gradedResults.filter((result) => result.grade !== "F").length
  const failCount = gradedResults.length - passCount

  const lineData = {
    labels: gpaTrend.map((point) => point.label),
    datasets: [
      {
        data: gpaTrend.map((point) => point.gpa),
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.14)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#0f766e",
      },
    ],
  }

  const barData = {
    labels: results.map((result) => result.courseCode),
    datasets: [
      {
        data: results.map((result) => result.score),
        backgroundColor: ["#0f766e", "#7c3aed", "#f59e0b", "#dc2626"],
        borderRadius: 6,
      },
    ],
  }

  const doughnutData = {
    labels: ["Passed", "Failed"],
    datasets: [
      {
        data: [passCount, failCount],
        backgroundColor: ["#0f766e", "#dc2626"],
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-base font-semibold">GPA Trend</h2>
        <div className="mt-4 h-64">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-base font-semibold">Semester Performance</h2>
        <div className="mt-4 h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-base font-semibold">Pass/Fail Ratio</h2>
        <div className="mt-4 h-64">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  )
}

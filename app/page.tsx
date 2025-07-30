"use client"

import { useState } from "react"
import { DollarSign, TrendingDown, TrendingUp, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { subMonths, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/components/currency-toggle"
import { useLanguage } from "@/components/language-toggle"

// Mock data for dashboard - same structure as v5
const mockDashboardData = {
  totalIncome: 6000,
  totalExpenses: 2500,
  netIncome: 3500,
  avgMonthlySpending: 2100,
  monthlyData: [
    { month: "Jan", income: 5000, expenses: 2200 },
    { month: "Feb", income: 5200, expenses: 1800 },
    { month: "Mar", income: 4800, expenses: 2400 },
    { month: "Apr", income: 5500, expenses: 2100 },
    { month: "May", income: 6000, expenses: 2500 },
    { month: "Jun", income: 5800, expenses: 2300 },
  ],
  expenseCategories: [
    { name: "Food & Dining", value: 800, percentage: 32 },
    { name: "Transportation", value: 450, percentage: 18 },
    { name: "Bills & Utilities", value: 600, percentage: 24 },
    { name: "Shopping", value: 350, percentage: 14 },
    { name: "Entertainment", value: 300, percentage: 12 },
  ],
  monthlyTrends: [
    { month: "Jan", amount: 2200 },
    { month: "Feb", amount: 1800 },
    { month: "Mar", amount: 2400 },
    { month: "Apr", amount: 2100 },
    { month: "May", amount: 2500 },
    { month: "Jun", amount: 2300 },
  ],
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(subMonths(new Date(), 5)),
    to: endOfMonth(new Date()),
  })

  const { formatAmount } = useCurrency()
  const { t } = useLanguage()

  // Use mock data instead of API calls
  const data = mockDashboardData

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.totalIncome")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-mustard" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mustard">{formatAmount(data.totalIncome)}</div>
              <p className="text-xs text-muted-foreground">+12% {t("dashboard.fromLastPeriod")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.totalExpenses")}</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(data.totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">+8% {t("dashboard.fromLastPeriod")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.netIncome")}</CardTitle>
              <DollarSign className="h-4 w-4 text-mustard" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", data.netIncome >= 0 ? "text-mustard" : "text-destructive")}>
                {formatAmount(data.netIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.netIncome >= 0 ? t("dashboard.profit") : t("dashboard.loss")} {t("dashboard.thisPeriod")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.avgMonthlySpending")}</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(data.avgMonthlySpending)}</div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.basedOnMonths", { count: data.monthlyData.length })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.incomeVsExpenses")}</CardTitle>
              <CardDescription>{t("charts.monthlyComparison")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  income: {
                    label: t("addTransaction.income"),
                    color: "hsl(var(--mustard))",
                  },
                  expenses: {
                    label: t("dashboard.totalExpenses"),
                    color: "hsl(var(--destructive))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="income" fill="var(--color-income)" />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("charts.mostCommonExpenses")}</CardTitle>
              <CardDescription>{t("charts.breakdownByCategory")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: t("addTransaction.amount"),
                  },
                }}
                className="h-[300px]"
              >
                <RechartsPieChart>
                  <Pie
                    data={data.expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-mustard font-bold">{formatAmount(data.value)}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.monthlySpendingTrend")}</CardTitle>
            <CardDescription>{t("charts.trackSpendingPatterns")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: t("addTransaction.amount"),
                  color: "hsl(var(--mustard))",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-amount)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-amount)", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

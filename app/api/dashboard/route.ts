import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const userId = "user-123" // Replace with actual user ID from auth

    // Base query
    let query = supabase.from("transactions").select("*").eq("user_id", userId)

    if (startDate) query = query.gte("date", startDate)
    if (endDate) query = query.lte("date", endDate)

    const { data: transactions, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate dashboard metrics
    const income = transactions.filter((t) => t.type === "income")
    const expenses = transactions.filter((t) => t.type === "expense")

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
    const netIncome = totalIncome - totalExpenses

    // Group by month for charts
    const monthlyData = transactions.reduce(
      (acc, transaction) => {
        const month = new Date(transaction.date).toLocaleDateString("en-US", { month: "short" })
        if (!acc[month]) {
          acc[month] = { month, income: 0, expenses: 0 }
        }
        if (transaction.type === "income") {
          acc[month].income += transaction.amount
        } else {
          acc[month].expenses += transaction.amount
        }
        return acc
      },
      {} as Record<string, any>,
    )

    // Group expenses by category
    const expenseCategories = expenses.reduce(
      (acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0
        }
        acc[transaction.category] += transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const expenseCategoriesArray = Object.entries(expenseCategories).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalExpenses) * 100),
    }))

    const dashboardData = {
      totalIncome,
      totalExpenses,
      netIncome,
      avgMonthlySpending: Math.round(totalExpenses / Math.max(Object.keys(monthlyData).length, 1)),
      monthlyData: Object.values(monthlyData),
      expenseCategories: expenseCategoriesArray,
      monthlyTrends: Object.values(monthlyData).map((item: any) => ({
        month: item.month,
        amount: item.expenses,
      })),
      recentTransactions: transactions.slice(0, 10),
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

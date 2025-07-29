export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
  isRecurring: boolean
  recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"
  recurringEndDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface TransactionInput {
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
  isRecurring: boolean
  recurringFrequency?: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly"
  recurringEndDate?: string
  notes?: string
}

export interface DashboardData {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  avgMonthlySpending: number
  monthlyData: Array<{
    month: string
    income: number
    expenses: number
  }>
  expenseCategories: Array<{
    name: string
    value: number
    percentage: number
  }>
  monthlyTrends: Array<{
    month: string
    amount: number
  }>
  recentTransactions: Transaction[]
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

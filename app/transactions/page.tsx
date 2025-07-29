"use client"

import { useState, useMemo } from "react"
import {
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCurrency, CurrencyToggle } from "@/components/currency-toggle"
import { useLanguage, LanguageToggle } from "@/components/language-toggle"

// Mock transaction data - using the same structure as the working v5 code
const mockTransactions = [
  {
    id: "1",
    type: "income" as const,
    amount: 5000,
    description: "Monthly Salary",
    category: "Salary",
    date: new Date("2024-01-15"),
    isRecurring: true,
    recurringFrequency: "monthly" as const,
    notes: "Software Engineer Salary",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    type: "expense" as const,
    amount: 1200,
    description: "Rent Payment",
    category: "Bills & Utilities",
    date: new Date("2024-01-01"),
    isRecurring: true,
    recurringFrequency: "monthly" as const,
    notes: "Apartment rent",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    type: "expense" as const,
    amount: 85.5,
    description: "Grocery Shopping",
    category: "Food & Dining",
    date: new Date("2024-01-20"),
    isRecurring: false,
    notes: "Weekly groceries at supermarket",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "4",
    type: "income" as const,
    amount: 800,
    description: "Freelance Project",
    category: "Freelance",
    date: new Date("2024-01-18"),
    isRecurring: false,
    notes: "Website development project",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "5",
    type: "expense" as const,
    amount: 45.0,
    description: "Gas Station",
    category: "Transportation",
    date: new Date("2024-01-22"),
    isRecurring: false,
    notes: "Fuel for car",
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "6",
    type: "expense" as const,
    amount: 120.0,
    description: "Internet Bill",
    category: "Bills & Utilities",
    date: new Date("2024-01-10"),
    isRecurring: true,
    recurringFrequency: "monthly" as const,
    notes: "Monthly internet subscription",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "7",
    type: "income" as const,
    amount: 200,
    description: "Investment Dividend",
    category: "Investment",
    date: new Date("2024-01-25"),
    isRecurring: false,
    notes: "Quarterly dividend payment",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "8",
    type: "expense" as const,
    amount: 75.3,
    description: "Restaurant Dinner",
    category: "Food & Dining",
    date: new Date("2024-01-19"),
    isRecurring: false,
    notes: "Dinner with friends",
    createdAt: new Date("2024-01-19"),
  },
]

export default function TransactionsPage() {
  const { formatAmount } = useCurrency()
  const { t } = useLanguage()

  // State for transactions
  const [transactions, setTransactions] = useState(mockTransactions)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [sortBy, setSortBy] = useState<"date" | "amount" | "description">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(transactions.map((t) => t.category))]
    return uniqueCategories.sort()
  }, [transactions])

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      // Search filter
      if (
        searchTerm &&
        !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Type filter
      if (typeFilter !== "all" && transaction.type !== typeFilter) {
        return false
      }

      // Category filter
      if (categoryFilter !== "all" && transaction.category !== categoryFilter) {
        return false
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const transactionDate = startOfDay(transaction.date)
        if (dateRange.from && dateRange.to) {
          if (
            !isWithinInterval(transactionDate, {
              start: startOfDay(dateRange.from),
              end: endOfDay(dateRange.to),
            })
          ) {
            return false
          }
        } else if (dateRange.from) {
          if (transactionDate < startOfDay(dateRange.from)) {
            return false
          }
        } else if (dateRange.to) {
          if (transactionDate > endOfDay(dateRange.to)) {
            return false
          }
        }
      }

      return true
    })

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = a.date.getTime() - b.date.getTime()
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "description":
          comparison = a.description.localeCompare(b.description)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [transactions, searchTerm, typeFilter, categoryFilter, dateRange, sortBy, sortOrder])

  // Calculate summary stats
  const summary = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netAmount: income - expenses,
      transactionCount: filteredTransactions.length,
    }
  }, [filteredTransactions])

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setCategoryFilter("all")
    setDateRange({})
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-8 h-8 bg-mustard rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t("transactions.title")}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/add-transaction">
              <Button className="bg-mustard hover:bg-mustard-dark text-black">
                <DollarSign className="w-4 h-4 mr-2" />
                {t("header.addTransaction")}
              </Button>
            </Link>
            <LanguageToggle />
            <CurrencyToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.totalIncome")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-mustard" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mustard">{formatAmount(summary.totalIncome)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.totalExpenses")}</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatAmount(summary.totalExpenses)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("transactions.netAmount")}</CardTitle>
              <DollarSign className="h-4 w-4 text-mustard" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", summary.netAmount >= 0 ? "text-mustard" : "text-destructive")}>
                {formatAmount(summary.netAmount)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("transactions.transactions")}</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.transactionCount}</div>
              <p className="text-xs text-muted-foreground">
                {summary.transactionCount === transactions.length ? "All transactions" : "Filtered results"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>{t("transactions.filtersSearch")}</span>
            </CardTitle>
            <CardDescription>{t("transactions.filterDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">{t("transactions.search")}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Label>{t("transactions.type")}</Label>
                <Select
                  value={typeFilter}
                  onValueChange={(value: "all" | "income" | "expense") => setTypeFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("transactions.allTypes")}</SelectItem>
                    <SelectItem value="income">{t("addTransaction.income")}</SelectItem>
                    <SelectItem value="expense">{t("addTransaction.expense")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>{t("transactions.category")}</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("transactions.allCategories")}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label>{t("transactions.sortBy")}</Label>
                <div className="flex space-x-2">
                  <Select value={sortBy} onValueChange={(value: "date" | "amount" | "description") => setSortBy(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">{t("transactions.date")}</SelectItem>
                      <SelectItem value="amount">{t("addTransaction.amount")}</SelectItem>
                      <SelectItem value="description">{t("addTransaction.description")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="space-y-2">
                <Label>{t("transactions.dateRange")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[280px] justify-start text-left font-normal bg-transparent">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button variant="outline" onClick={clearFilters} className="mt-6 bg-transparent">
                {t("transactions.clearFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>{t("transactions.transactions")}</CardTitle>
            <CardDescription>
              {t("transactions.showingResults", {
                filtered: filteredTransactions.length,
                total: transactions.length,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">{t("transactions.noTransactions")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {transactions.length === 0 ? t("transactions.noTransactionsYet") : t("transactions.adjustFilters")}
                </p>
                <Link href="/add-transaction">
                  <Button className="bg-mustard hover:bg-mustard-dark text-black">
                    {t("transactions.addFirstTransaction")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          transaction.type === "income" ? "bg-mustard/20" : "bg-destructive/20",
                        )}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className={cn("w-5 h-5", "text-mustard")} />
                        ) : (
                          <TrendingDown className={cn("w-5 h-5", "text-destructive")} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium truncate">{transaction.description}</h3>
                          {transaction.isRecurring && (
                            <Badge variant="secondary" className="text-xs">
                              {t("transactions.recurring")}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{format(transaction.date, "MMM dd, yyyy")}</span>
                          {transaction.notes && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[200px]">{transaction.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-bold text-lg",
                            transaction.type === "income" ? "text-mustard" : "text-foreground",
                          )}
                        >
                          {transaction.type === "expense" && "-"}
                          {formatAmount(transaction.amount)}
                        </div>
                        {transaction.isRecurring && (
                          <div className="text-xs text-muted-foreground capitalize">
                            {transaction.recurringFrequency}
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            {t("transactions.edit")}
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t("transactions.delete")}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t("transactions.deleteTransaction")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("transactions.deleteConfirmation", { description: transaction.description })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t("addTransaction.cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {t("transactions.delete")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

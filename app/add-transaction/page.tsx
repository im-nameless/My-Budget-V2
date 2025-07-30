"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Calendar, DollarSign, Repeat, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCurrency } from "@/components/currency-toggle"
import { useLanguage } from "@/components/language-toggle"
import { useTransactions } from "@/hooks/useTransactions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddTransaction() {
  const router = useRouter()
  const { currency } = useCurrency()
  const { t } = useLanguage()
  const { createTransaction } = useTransactions()

  const [transactionType, setTransactionType] = useState<"income" | "expense">("income")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("")
  const [recurringEndDate, setRecurringEndDate] = useState<Date>()
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const expenseCategories = [
    t("category.foodDining"),
    t("category.transportation"),
    t("category.shopping"),
    t("category.entertainment"),
    t("category.billsUtilities"),
    t("category.healthcare"),
    t("category.education"),
    t("category.travel"),
    t("category.insurance"),
    t("category.other"),
  ]

  const incomeCategories = [
    t("category.salary"),
    t("category.freelance"),
    t("category.business"),
    t("category.investment"),
    t("category.rental"),
    t("category.other"),
  ]

  const recurringFrequencies = [
    { value: "weekly", label: t("frequency.weekly") },
    { value: "biweekly", label: t("frequency.biweekly") },
    { value: "monthly", label: t("frequency.monthly") },
    { value: "quarterly", label: t("frequency.quarterly") },
    { value: "yearly", label: t("frequency.yearly") },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const transaction = {
        type: transactionType,
        amount: Number.parseFloat(amount),
        description,
        category,
        date: date.toISOString(),
        isRecurring,
        recurringFrequency: isRecurring ? (recurringFrequency as any) : undefined,
        recurringEndDate: isRecurring && recurringEndDate ? recurringEndDate.toISOString() : undefined,
        notes,
      }

      await createTransaction(transaction)

      const successMessage = transactionType === "income" ? t("success.incomeAdded") : t("success.expenseAdded")
      const recurringText = isRecurring ? ` ${t("success.recurringAdded")}` : ""

      // Show success message (you could use a toast library here)
      alert(`${successMessage}${recurringText}`)

      // Redirect back to dashboard
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transaction")
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = transactionType === "income" ? incomeCategories : expenseCategories

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-8 max-w-2xl mx-auto">
        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-mustard" />
              <span>{t("addTransaction.newTransaction")}</span>
            </CardTitle>
            <CardDescription>{t("addTransaction.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type Tabs */}
              <Tabs
                value={transactionType}
                onValueChange={(value) => setTransactionType(value as "income" | "expense")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="income" className="data-[state=active]:bg-mustard data-[state=active]:text-black">
                    {t("addTransaction.income")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="expense"
                    className="data-[state=active]:bg-destructive data-[state=active]:text-white"
                  >
                    {t("addTransaction.expense")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="income" className="space-y-4 mt-6">
                  <div className="p-4 bg-mustard/10 rounded-lg border border-mustard/20">
                    <p className="text-sm text-mustard font-medium">💰 {t("addTransaction.addingIncome")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("addTransaction.recordMoneyIn")}</p>
                  </div>
                </TabsContent>

                <TabsContent value="expense" className="space-y-4 mt-6">
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">💸 {t("addTransaction.addingExpense")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("addTransaction.recordMoneyOut")}</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">{t("addTransaction.amount")} *</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-mono font-bold">
                    {currency.symbol}
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t("addTransaction.description")} *</Label>
                <Input
                  id="description"
                  placeholder={
                    transactionType === "income"
                      ? t("addTransaction.monthlySalary")
                      : t("addTransaction.groceryShopping")
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">{t("addTransaction.category")} *</Label>
                <Select value={category} onValueChange={setCategory} required disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("addTransaction.selectCategory", {
                        type:
                          transactionType === "income"
                            ? t("addTransaction.income").toLowerCase()
                            : t("addTransaction.expense").toLowerCase(),
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>{t("addTransaction.date")} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      disabled={isSubmitting}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>{t("addTransaction.pickDate")}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Recurring Transaction */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="recurring" className="flex items-center space-x-2">
                      <Repeat className="w-4 h-4" />
                      <span>{t("addTransaction.recurringTransaction")}</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {transactionType === "income"
                        ? t("addTransaction.recurringIncomeDesc")
                        : t("addTransaction.recurringExpenseDesc")}
                    </p>
                  </div>
                  <Switch
                    id="recurring"
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                    disabled={isSubmitting}
                  />
                </div>

                {isRecurring && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">{t("addTransaction.frequency")} *</Label>
                      <Select
                        value={recurringFrequency}
                        onValueChange={setRecurringFrequency}
                        required
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("addTransaction.howOftenRepeat")} />
                        </SelectTrigger>
                        <SelectContent>
                          {recurringFrequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("addTransaction.endDate")}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !recurringEndDate && "text-muted-foreground",
                            )}
                            disabled={isSubmitting}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {recurringEndDate ? (
                              format(recurringEndDate, "PPP")
                            ) : (
                              <span>{t("addTransaction.noEndDate")}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={recurringEndDate}
                            onSelect={setRecurringEndDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">{t("addTransaction.endDateDesc")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">{t("addTransaction.notes")}</Label>
                <Textarea
                  id="notes"
                  placeholder={t("addTransaction.notesPlaceholder")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  className={cn(
                    "flex-1",
                    transactionType === "income"
                      ? "bg-mustard hover:bg-mustard-dark text-black"
                      : "bg-destructive hover:bg-destructive/90 text-white",
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  {transactionType === "income" ? t("addTransaction.addIncome") : t("addTransaction.addExpense")}
                  {isRecurring && ` ${t("addTransaction.recurring")}`}
                </Button>
                <Link href="/">
                  <Button type="button" variant="outline" disabled={isSubmitting}>
                    {t("addTransaction.cancel")}
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

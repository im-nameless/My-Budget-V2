"use client"

import * as React from "react"
import { DollarSign, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface Currency {
  code: string
  symbol: string
  name: string
  flag: string
}

const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
]

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amount: number) => string
}

const CurrencyContext = React.createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = React.useState<Currency>(currencies[0]) // Default to USD
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const savedCurrency = localStorage.getItem("currency")
    if (savedCurrency) {
      const parsedCurrency = JSON.parse(savedCurrency)
      setCurrencyState(parsedCurrency)
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("currency", JSON.stringify(newCurrency))
  }

  const formatAmount = (amount: number): string => {
    if (!mounted) return `$${amount.toLocaleString()}`

    // Special formatting for different currencies
    switch (currency.code) {
      case "BRL":
        return `R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case "EUR":
        return `€${amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case "GBP":
        return `£${amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case "JPY":
      case "CNY":
        return `¥${amount.toLocaleString("ja-JP", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      case "INR":
        return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      default:
        return `${currency.symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = React.useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled className="min-w-[100px] bg-transparent">
        <DollarSign className="h-4 w-4 mr-2" />
        USD
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-[100px] bg-transparent">
          <span className="mr-2">{currency.flag}</span>
          <span className="font-mono font-bold">{currency.symbol}</span>
          <span className="ml-1 text-xs">{currency.code}</span>
          <ChevronDown className="h-3 w-3 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr)}
            className={`cursor-pointer ${currency.code === curr.code ? "bg-mustard/10" : ""}`}
          >
            <span className="mr-3">{curr.flag}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{curr.name}</span>
                <span className="font-mono font-bold text-mustard">{curr.symbol}</span>
              </div>
              <div className="text-xs text-muted-foreground">{curr.code}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

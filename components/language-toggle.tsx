"use client"

import * as React from "react"
import { Languages, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
]

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

// Translation dictionaries
const translations = {
  en: {
    // Header
    "app.title": "ExpenseTracker",
    "header.addTransaction": "Add Transaction",
    "header.pickDateRange": "Pick a date range",

    // Dashboard
    "dashboard.totalIncome": "Total Income",
    "dashboard.totalExpenses": "Total Expenses",
    "dashboard.netIncome": "Net Income",
    "dashboard.avgMonthlySpending": "Avg Monthly Spending",
    "dashboard.profit": "Profit",
    "dashboard.loss": "Loss",
    "dashboard.thisPeriod": "this period",
    "dashboard.basedOnMonths": "Based on {count} months",
    "dashboard.fromLastPeriod": "from last period",
    "dashboard.title": "Dashboard",

    // Charts
    "charts.incomeVsExpenses": "Income vs Expenses",
    "charts.monthlyComparison": "Monthly comparison over time",
    "charts.mostCommonExpenses": "Most Common Expenses",
    "charts.breakdownByCategory": "Breakdown by category",
    "charts.monthlySpendingTrend": "Monthly Spending Trend",
    "charts.trackSpendingPatterns": "Track your spending patterns over time",
    "charts.expenseCategoriesBreakdown": "Expense Categories Breakdown",
    "charts.detailedView": "Detailed view of your spending categories",

    // Categories
    "category.foodDining": "Food & Dining",
    "category.transportation": "Transportation",
    "category.shopping": "Shopping",
    "category.entertainment": "Entertainment",
    "category.billsUtilities": "Bills & Utilities",
    "category.healthcare": "Healthcare",
    "category.education": "Education",
    "category.travel": "Travel",
    "category.insurance": "Insurance",
    "category.other": "Other",
    "category.salary": "Salary",
    "category.freelance": "Freelance",
    "category.business": "Business",
    "category.investment": "Investment",
    "category.rental": "Rental",

    // Add Transaction Page
    "addTransaction.title": "Add Transaction",
    "addTransaction.newTransaction": "New Transaction",
    "addTransaction.description":
      "Add a new income or expense entry. Set it as recurring for regular transactions like salary or mortgage.",
    "addTransaction.income": "Income",
    "addTransaction.expense": "Expense",
    "addTransaction.addingIncome": "Adding Income",
    "addTransaction.recordMoneyIn": "Record money coming into your account",
    "addTransaction.addingExpense": "Adding Expense",
    "addTransaction.recordMoneyOut": "Record money going out of your account",
    "addTransaction.amount": "Amount",
    "addTransaction.category": "Category",
    "addTransaction.date": "Date",
    "addTransaction.pickDate": "Pick a date",
    "addTransaction.recurringTransaction": "Recurring Transaction",
    "addTransaction.recurringIncomeDesc": "Set up for regular income like salary or freelance payments",
    "addTransaction.recurringExpenseDesc": "Set up for regular expenses like rent, mortgage, or subscriptions",
    "addTransaction.frequency": "Frequency",
    "addTransaction.howOftenRepeat": "How often does this repeat?",
    "addTransaction.endDate": "End Date (Optional)",
    "addTransaction.noEndDate": "No end date",
    "addTransaction.endDateDesc": "Leave empty for indefinite recurring transactions",
    "addTransaction.notes": "Notes (Optional)",
    "addTransaction.notesPlaceholder": "Add any additional notes or details...",
    "addTransaction.addIncome": "Add Income",
    "addTransaction.addExpense": "Add Expense",
    "addTransaction.recurring": "(Recurring)",
    "addTransaction.cancel": "Cancel",
    "addTransaction.selectCategory": "Select {type} category",
    "addTransaction.monthlySalary": "e.g., Monthly Salary",
    "addTransaction.groceryShopping": "e.g., Grocery Shopping",

    // Frequencies
    "frequency.weekly": "Weekly",
    "frequency.biweekly": "Bi-weekly",
    "frequency.monthly": "Monthly",
    "frequency.quarterly": "Quarterly",
    "frequency.yearly": "Yearly",

    // Tips
    "tips.quickTips": "Quick Tips",
    "tips.recurringTransactions": "Recurring Transactions",
    "tips.recurringDesc": "Perfect for salary, rent, mortgage, subscriptions, and other regular payments",
    "tips.categories": "Categories",
    "tips.categoriesDesc": "Choose the right category to get better insights in your dashboard",
    "tips.notes": "Notes",
    "tips.notesDesc": "Add details like payment method, location, or any other relevant information",

    // Success messages
    "success.incomeAdded": "Income added successfully!",
    "success.expenseAdded": "Expense added successfully!",
    "success.recurringAdded": "(Recurring) added successfully!",

    // Months
    "month.jan": "Jan",
    "month.feb": "Feb",
    "month.mar": "Mar",
    "month.apr": "Apr",
    "month.may": "May",
    "month.jun": "Jun",
    "month.jul": "Jul",
    "month.aug": "Aug",
    "month.sep": "Sep",
    "month.oct": "Oct",
    "month.nov": "Nov",
    "month.dec": "Dec",

    // Transactions page
    "transactions.title": "Transaction History",
    "transactions.viewAll": "View All",
    "transactions.netAmount": "Net Amount",
    "transactions.transactions": "Transactions",
    "transactions.filtersSearch": "Filters & Search",
    "transactions.filterDescription": "Filter and search your transactions",
    "transactions.search": "Search",
    "transactions.type": "Type",
    "transactions.category": "Category",
    "transactions.sortBy": "Sort By",
    "transactions.dateRange": "Date Range",
    "transactions.allTypes": "All Types",
    "transactions.allCategories": "All Categories",
    "transactions.date": "Date",
    "transactions.clearFilters": "Clear Filters",
    "transactions.showingResults": "Showing {filtered} of {total} transactions",
    "transactions.noTransactions": "No transactions found",
    "transactions.noTransactionsYet": "You haven't added any transactions yet.",
    "transactions.adjustFilters": "Try adjusting your filters to see more results.",
    "transactions.addFirstTransaction": "Add Your First Transaction",
    "transactions.edit": "Edit",
    "transactions.delete": "Delete",
    "transactions.deleteTransaction": "Delete Transaction",
    "transactions.deleteConfirmation": 'Are you sure you want to delete "{description}"? This action cannot be undone.',
    "transactions.recurring": "Recurring",

    // Login page
    "login.welcome": "Welcome Back",
    "login.signInToContinue": "Sign in to your account to continue",
    "login.email": "Email",
    "login.emailPlaceholder": "Enter your email",
    "login.password": "Password",
    "login.passwordPlaceholder": "Enter your password",
    "login.signIn": "Sign In",
    "login.signingIn": "Signing In...",
    "login.invalidCredentials": "Invalid email or password",
    "login.loginError": "An error occurred during login",
    "login.fillAllFields": "Please fill in all fields",
    "login.demoCredentials": "Demo Credentials",
    "login.dontHaveAccount": "Don't have an account?",
    "login.createAccount": "Create Account",

    // Register page
    "register.createAccount": "Create Account",
    "register.createAccountDescription": "Create a new account to get started",
    "register.fullName": "Full Name",
    "register.namePlaceholder": "Enter your full name",
    "register.phone": "Phone",
    "register.phonePlaceholder": "Enter your phone",
    "register.birthdate": "Birthdate",
    "register.birthdatePlaceholder": "Select your birthdate",
    "register.email": "Email",
    "register.emailPlaceholder": "Enter your email",
    "register.password": "Password",
    "register.passwordPlaceholder": "Create a password",
    "register.confirmPassword": "Confirm Password",
    "register.confirmPasswordPlaceholder": "Confirm your password",
    "register.creatingAccount": "Creating Account...",
    "register.alreadyHaveAccount": "Already have an account?",
    "register.signIn": "Sign In",
    "register.backToLogin": "Back to Login",
    "register.passwordRequirements": "Password Requirements",
    "register.passwordMinLengthReq": "At least 6 characters",
    "register.passwordMatchReq": "Passwords must match",
    "register.passwordSpecialCharacters": "The password must contain at least one special character, one number, and one uppercase letter",
    "register.nameRequired": "Name is required",
    "register.nameMinLength": "Name must be at least 2 characters",
    "register.emailRequired": "Email is required",
    "register.emailInvalid": "Please enter a valid email",
    "register.passwordRequired": "Password is required",
    "register.passwordMinLength": "Password must be at least 6 characters",
    "register.confirmPasswordRequired": "Please confirm your password",
    "register.passwordMismatch": "Passwords do not match",
    "register.registrationError": "An error occurred during registration",

    // Sidebar
    "sidebar.preferences": "Preferences",
    "sidebar.language": "Language",
    "sidebar.currency": "Currency",
    "sidebar.theme": "Theme",
    "sidebar.logout": "Logout",

    // Profile page
    "profile.title": "Profile Settings",
    "profile.description": "Manage your account settings and preferences",
    "profile.profilePicture": "Profile Picture",
    "profile.pictureDescription": "Upload a profile picture to personalize your account",
    "profile.changePicture": "Change Picture",
    "profile.pictureRequirements": "JPG, PNG or GIF. Max size 5MB.",
    "profile.personalInfo": "Personal Information",
    "profile.personalInfoDescription": "Update your personal details",
    "profile.fullName": "Full Name",
    "profile.namePlaceholder": "Enter your full name",
    "profile.emailAddress": "Email Address",
    "profile.emailPlaceholder": "Enter your email address",
    "profile.memberSince": "Member Since",
    "profile.saveChanges": "Save Changes",
    "profile.updating": "Updating...",
    "profile.profileUpdated": "Profile updated successfully!",
    "profile.pictureUpdated": "Profile picture updated successfully!",
    "profile.updateError": "Failed to update profile",
    "profile.uploadError": "Failed to upload image",
    "profile.invalidFileType": "Please select a valid image file",
    "profile.fileTooLarge": "File size must be less than 5MB",
    "profile.accountStats": "Account Statistics",
    "profile.accountStatsDescription": "Overview of your account activity",
    "profile.totalTransactions": "Total Transactions",
    "profile.monthsActive": "Months Active",
    "profile.currentBalance": "Current Balance",
  },
  pt: {
    // Header
    "app.title": "ControleDespesas",
    "header.addTransaction": "Adicionar Transação",
    "header.pickDateRange": "Selecione um período",

    // Dashboard
    "dashboard.totalIncome": "Receita Total",
    "dashboard.totalExpenses": "Despesas Totais",
    "dashboard.netIncome": "Receita Líquida",
    "dashboard.avgMonthlySpending": "Gasto Médio Mensal",
    "dashboard.profit": "Lucro",
    "dashboard.loss": "Prejuízo",
    "dashboard.thisPeriod": "neste período",
    "dashboard.basedOnMonths": "Baseado em {count} meses",
    "dashboard.fromLastPeriod": "do período anterior",
    "dashboard.title": "Início",

    // Charts
    "charts.incomeVsExpenses": "Receita vs Despesas",
    "charts.monthlyComparison": "Comparação mensal ao longo do tempo",
    "charts.mostCommonExpenses": "Despesas Mais Comuns",
    "charts.breakdownByCategory": "Divisão por categoria",
    "charts.monthlySpendingTrend": "Tendência de Gastos Mensais",
    "charts.trackSpendingPatterns": "Acompanhe seus padrões de gastos ao longo do tempo",
    "charts.expenseCategoriesBreakdown": "Detalhamento das Categorias de Despesas",
    "charts.detailedView": "Visão detalhada das suas categorias de gastos",

    // Categories
    "category.foodDining": "Alimentação",
    "category.transportation": "Transporte",
    "category.shopping": "Compras",
    "category.entertainment": "Entretenimento",
    "category.billsUtilities": "Contas e Utilidades",
    "category.healthcare": "Saúde",
    "category.education": "Educação",
    "category.travel": "Viagem",
    "category.insurance": "Seguro",
    "category.other": "Outros",
    "category.salary": "Salário",
    "category.freelance": "Freelance",
    "category.business": "Negócios",
    "category.investment": "Investimento",
    "category.rental": "Aluguel",

    // Add Transaction Page
    "addTransaction.title": "Adicionar Transação",
    "addTransaction.newTransaction": "Nova Transação",
    "addTransaction.description":
      "Adicione uma nova entrada de receita ou despesa. Configure como recorrente para transações regulares como salário ou financiamento.",
    "addTransaction.income": "Receita",
    "addTransaction.expense": "Despesa",
    "addTransaction.addingIncome": "Adicionando Receita",
    "addTransaction.recordMoneyIn": "Registre dinheiro entrando na sua conta",
    "addTransaction.addingExpense": "Adicionando Despesa",
    "addTransaction.recordMoneyOut": "Registre dinheiro saindo da sua conta",
    "addTransaction.amount": "Valor",
    "addTransaction.category": "Categoria",
    "addTransaction.date": "Data",
    "addTransaction.pickDate": "Escolha uma data",
    "addTransaction.recurringTransaction": "Transação Recorrente",
    "addTransaction.recurringIncomeDesc": "Configure para receitas regulares como salário ou pagamentos freelance",
    "addTransaction.recurringExpenseDesc":
      "Configure para despesas regulares como aluguel, financiamento ou assinaturas",
    "addTransaction.frequency": "Frequência",
    "addTransaction.howOftenRepeat": "Com que frequência isso se repete?",
    "addTransaction.endDate": "Data Final (Opcional)",
    "addTransaction.noEndDate": "Sem data final",
    "addTransaction.endDateDesc": "Deixe vazio para transações recorrentes indefinidas",
    "addTransaction.notes": "Observações (Opcional)",
    "addTransaction.notesPlaceholder": "Adicione observações ou detalhes adicionais...",
    "addTransaction.addIncome": "Adicionar Receita",
    "addTransaction.addExpense": "Adicionar Despesa",
    "addTransaction.recurring": "(Recorrente)",
    "addTransaction.cancel": "Cancelar",
    "addTransaction.selectCategory": "Selecione categoria de {type}",
    "addTransaction.monthlySalary": "ex: Salário Mensal",
    "addTransaction.groceryShopping": "ex: Compras do Supermercado",

    // Frequencies
    "frequency.weekly": "Semanal",
    "frequency.biweekly": "Quinzenal",
    "frequency.monthly": "Mensal",
    "frequency.quarterly": "Trimestral",
    "frequency.yearly": "Anual",

    // Tips
    "tips.quickTips": "Dicas Rápidas",
    "tips.recurringTransactions": "Transações Recorrentes",
    "tips.recurringDesc": "Perfeito para salário, aluguel, financiamento, assinaturas e outros pagamentos regulares",
    "tips.categories": "Categorias",
    "tips.categoriesDesc": "Escolha a categoria correta para obter melhores insights no seu painel",
    "tips.notes": "Observações",
    "tips.notesDesc": "Adicione detalhes como método de pagamento, local ou qualquer outra informação relevante",

    // Success messages
    "success.incomeAdded": "Receita adicionada com sucesso!",
    "success.expenseAdded": "Despesa adicionada com sucesso!",
    "success.recurringAdded": "(Recorrente) adicionada com sucesso!",

    // Months
    "month.jan": "Jan",
    "month.feb": "Fev",
    "month.mar": "Mar",
    "month.apr": "Abr",
    "month.may": "Mai",
    "month.jun": "Jun",
    "month.jul": "Jul",
    "month.aug": "Ago",
    "month.sep": "Set",
    "month.oct": "Out",
    "month.nov": "Nov",
    "month.dec": "Dez",

    // Transactions page
    "transactions.title": "Histórico de Transações",
    "transactions.viewAll": "Ver Todas",
    "transactions.netAmount": "Valor Líquido",
    "transactions.transactions": "Transações",
    "transactions.filtersSearch": "Filtros e Busca",
    "transactions.filterDescription": "Filtre e pesquise suas transações",
    "transactions.search": "Buscar",
    "transactions.type": "Tipo",
    "transactions.category": "Categoria",
    "transactions.sortBy": "Ordenar Por",
    "transactions.dateRange": "Período",
    "transactions.allTypes": "Todos os Tipos",
    "transactions.allCategories": "Todas as Categorias",
    "transactions.date": "Data",
    "transactions.clearFilters": "Limpar Filtros",
    "transactions.showingResults": "Mostrando {filtered} de {total} transações",
    "transactions.noTransactions": "Nenhuma transação encontrada",
    "transactions.noTransactionsYet": "Você ainda não adicionou nenhuma transação.",
    "transactions.adjustFilters": "Tente ajustar seus filtros para ver mais resultados.",
    "transactions.addFirstTransaction": "Adicionar Sua Primeira Transação",
    "transactions.edit": "Editar",
    "transactions.delete": "Excluir",
    "transactions.deleteTransaction": "Excluir Transação",
    "transactions.deleteConfirmation":
      'Tem certeza que deseja excluir "{description}"? Esta ação não pode ser desfeita.',
    "transactions.recurring": "Recorrente",

    // Login page
    "login.welcome": "Bem-vindo de Volta",
    "login.signInToContinue": "Entre na sua conta para continuar",
    "login.email": "Email",
    "login.emailPlaceholder": "Digite seu email",
    "login.password": "Senha",
    "login.passwordPlaceholder": "Digite sua senha",
    "login.signIn": "Entrar",
    "login.signingIn": "Entrando...",
    "login.invalidCredentials": "Email ou senha inválidos",
    "login.loginError": "Ocorreu um erro durante o login",
    "login.fillAllFields": "Por favor preencha todos os campos",
    "login.demoCredentials": "Credenciais de Demo",
    "login.dontHaveAccount": "Não tem uma conta?",
    "login.createAccount": "Criar Conta",

    // Register page
    "register.createAccount": "Criar Conta",
    "register.createAccountDescription": "Crie uma nova conta para começar",
    "register.fullName": "Nome Completo",
    "register.namePlaceholder": "Digite seu nome completo",
    "register.phone": "Telefone",
    "register.phonePlaceholder": "Digite seu telefone",
    "register.birthdate": "Data de Nascimento",
    "register.birthdatePlaceholder": "Selecione sua data de nascimento",
    "register.email": "Email",
    "register.emailPlaceholder": "Digite seu email",
    "register.password": "Senha",
    "register.passwordPlaceholder": "Crie uma senha",
    "register.confirmPassword": "Confirmar Senha",
    "register.confirmPasswordPlaceholder": "Confirme sua senha",
    "register.creatingAccount": "Criando Conta...",
    "register.alreadyHaveAccount": "Já tem uma conta?",
    "register.signIn": "Entrar",
    "register.backToLogin": "Voltar ao Login",
    "register.passwordRequirements": "Requisitos da Senha",
    "register.passwordMinLengthReq": "Pelo menos 6 caracteres",
    "register.passwordMatchReq": "As senhas devem coincidir",
    "register.passwordSpecialCharacters": "A senha deve conter pelo menos um caractere especial, um número e uma letra maiúscula",
    "register.nameRequired": "Nome é obrigatório",
    "register.nameMinLength": "Nome deve ter pelo menos 2 caracteres",
    "register.emailRequired": "Email é obrigatório",
    "register.emailInvalid": "Por favor digite um email válido",
    "register.passwordRequired": "Senha é obrigatória",
    "register.passwordMinLength": "Senha deve ter pelo menos 6 caracteres",
    "register.confirmPasswordRequired": "Por favor confirme sua senha",
    "register.passwordMismatch": "As senhas não coincidem",
    "register.registrationError": "Ocorreu um erro durante o registro",

    // Sidebar
    "sidebar.preferences": "Preferências",
    "sidebar.language": "Idioma",
    "sidebar.currency": "Moeda",
    "sidebar.theme": "Tema",
    "sidebar.logout": "Sair",

    // Profile page
    "profile.title": "Configurações do Perfil",
    "profile.description": "Gerencie as configurações e preferências da sua conta",
    "profile.profilePicture": "Foto do Perfil",
    "profile.pictureDescription": "Envie uma foto de perfil para personalizar sua conta",
    "profile.changePicture": "Alterar Foto",
    "profile.pictureRequirements": "JPG, PNG ou GIF. Tamanho máximo 5MB.",
    "profile.personalInfo": "Informações Pessoais",
    "profile.personalInfoDescription": "Atualize seus dados pessoais",
    "profile.fullName": "Nome Completo",
    "profile.namePlaceholder": "Digite seu nome completo",
    "profile.emailAddress": "Endereço de Email",
    "profile.emailPlaceholder": "Digite seu endereço de email",
    "profile.memberSince": "Membro Desde",
    "profile.saveChanges": "Salvar Alterações",
    "profile.updating": "Atualizando...",
    "profile.profileUpdated": "Perfil atualizado com sucesso!",
    "profile.pictureUpdated": "Foto do perfil atualizada com sucesso!",
    "profile.updateError": "Falha ao atualizar perfil",
    "profile.uploadError": "Falha ao enviar imagem",
    "profile.invalidFileType": "Por favor selecione um arquivo de imagem válido",
    "profile.fileTooLarge": "O tamanho do arquivo deve ser menor que 5MB",
    "profile.accountStats": "Estatísticas da Conta",
    "profile.accountStatsDescription": "Visão geral da atividade da sua conta",
    "profile.totalTransactions": "Total de Transações",
    "profile.monthsActive": "Meses Ativo",
    "profile.currentBalance": "Saldo Atual",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>(languages[0]) // Default to English
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      const parsedLanguage = JSON.parse(savedLanguage)
      setLanguageState(parsedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", JSON.stringify(newLanguage))
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!mounted) return key

    const translationObj = translations[language.code as keyof typeof translations]
    const translation = translationObj?.[key as keyof typeof translationObj] || key

    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(`{${paramKey}}`, String(paramValue))
      }, translation)
    }

    return translation
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled className="min-w-[100px] bg-transparent">
        <Languages className="h-4 w-4 mr-2" />
        EN
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-[100px] bg-transparent">
          <span className="mr-2">{language.flag}</span>
          <span className="font-medium">{language.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang)}
            className={`cursor-pointer ${language.code === lang.code ? "bg-mustard/10" : ""}`}
          >
            <span className="mr-3">{lang.flag}</span>
            <div className="flex-1">
              <div className="font-medium">{lang.nativeName}</div>
              <div className="text-xs text-muted-foreground">{lang.name}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

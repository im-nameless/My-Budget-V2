import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Example using Supabase (you can replace with any database)
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const TransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  description: z.string().min(1),
  category: z.string().min(1),
  date: z.string(),
  isRecurring: z.boolean(),
  recurringFrequency: z.enum(["weekly", "biweekly", "monthly", "quarterly", "yearly"]).optional(),
  recurringEndDate: z.string().optional(),
  notes: z.string().optional(),
})

// GET /api/transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const category = searchParams.get("category")
    const type = searchParams.get("type")

    let query = supabase.from("transactions").select("*").order("date", { ascending: false })

    if (startDate) {
      query = query.gte("date", startDate)
    }
    if (endDate) {
      query = query.lte("date", endDate)
    }
    if (category) {
      query = query.eq("category", category)
    }
    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/transactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = TransactionSchema.parse(body)

    // Add user ID (you'd get this from authentication)
    const userId = "user-123" // Replace with actual user ID from auth

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          ...validatedData,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function POST(req: Request) {
  const { title } = await req.json()

  const { error } = await supabase.from('tasks').insert({
    title,
    status: 'todo',
  })

  if (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'

export async function POST(req: Request) {
  const { taskId, newStatus } = await req.json()

  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', taskId)

  if (error) {
    console.error('Move task error:', error)
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

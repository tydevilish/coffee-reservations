import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET all tables
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('name');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a table
export async function POST(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('tables')
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a table
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const { data, error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a table
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET all menu items (with optional category filter)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('menu_items')
      .select('*')
      .order('category')
      .order('name');

    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a menu item
export async function POST(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('menu_items')
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a menu item
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const { data, error } = await supabase
      .from('menu_items')
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

// DELETE a menu item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

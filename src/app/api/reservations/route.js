import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET reservations (with optional filters)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const phone = searchParams.get('phone');
    const status = searchParams.get('status');
    const time_slot = searchParams.get('time_slot');

    let query = supabase
      .from('reservations')
      .select('*, tables(name, seats, zone)')
      .order('created_at', { ascending: false });

    if (date) query = query.eq('date', date);
    if (phone) query = query.eq('phone', phone);
    if (status) query = query.eq('status', status);
    if (time_slot) query = query.eq('time_slot', time_slot);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a reservation
export async function POST(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        ...body,
        status: 'pending',
      }])
      .select('*, tables(name, seats, zone)')
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH update reservation status
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const { data, error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', id)
      .select('*, tables(name, seats, zone)')
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

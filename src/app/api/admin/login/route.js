import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Simple password check (in production, use bcrypt)
    if (admin.password_hash !== password) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

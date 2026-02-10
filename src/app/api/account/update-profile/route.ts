import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyHCaptcha } from '@/lib/hcaptcha';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { captchaToken, updates } = await req.json();

        // 1. Verify hCaptcha
        const isCaptchaValid = await verifyHCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return NextResponse.json({ error: 'Invalid or missing Captcha' }, { status: 400 });
        }

        // 2. Verify Authentication via Authorization Header (Bearer Token)
        // Since client might not be using cookies, we rely on the access token sent by client
        const authHeader = req.headers.get('Authorization');
        let user = null;

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            // Use a standard client to verify the token
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() { return [] },
                        setAll() { }
                    }
                }
            );
            const { data: { user: verifiedUser }, error } = await supabase.auth.getUser(token);
            if (!error) user = verifiedUser;
        }

        if (!user) {
            // Fallback to cookies if available (unlikely in this setup but good practice)
            const cookieStore = await cookies();
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() { return cookieStore.getAll() },
                        setAll(cookiesToSet) {
                            try {
                                cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                            } catch {
                                // The `setAll` method was called from a Server Component.
                                // This can be ignored if you have middleware refreshing
                                // user sessions.
                            }
                        }
                    }
                }
            );
            const { data: { user: cookieUser } } = await supabase.auth.getUser();
            user = cookieUser;
        }

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 3. Update Profile (Using Admin to bypass RLS limitations if any, scoped to user.id)
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Database update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, profile: data });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

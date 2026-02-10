import { NextResponse } from 'next/server';
import { verifyHCaptcha } from '@/lib/hcaptcha';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        const isValid = await verifyHCaptcha(token);

        if (isValid) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Captcha verification failed' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('hCaptcha Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

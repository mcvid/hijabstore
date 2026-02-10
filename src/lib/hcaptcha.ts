export async function verifyHCaptcha(token: string) {
    const secret = process.env.HCAPTCHA_SECRET_KEY;

    if (!secret) {
        console.warn("HCAPTCHA_SECRET_KEY not set. Skipping verification.");
        return true;
    }

    const verifyUrl = `https://api.hcaptcha.com/siteverify`;
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    try {
        const response = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('hCaptcha Verification Error:', error);
        return false;
    }
}

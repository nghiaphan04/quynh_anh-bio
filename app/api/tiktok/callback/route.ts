/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/?error=' + error, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = "https://quynh-anh-bio.vercel.app/api/tiktok/callback";

  try {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const text = await response.text();
    console.log("TikTok Token Exchange Raw Response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (_e) {
      console.error("Failed to parse TikTok response as JSON:", text);
      return NextResponse.json({ 
        error: 'TikTok API returned non-JSON response', 
        details: text.substring(0, 200),
        status: response.status 
      }, { status: 500 });
    }

    if (data.access_token) {
      // Store token in a cookie for the session
      const cookieStore = await cookies();
      cookieStore.set('tiktok_access_token', data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: data.expires_in,
      });

      // Redirect back to admin with success flag
      return new NextResponse(
        `<html><body><script>window.opener.postMessage({ type: 'TIKTOK_AUTH_SUCCESS' }, '*'); window.close();</script></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    } else {
      console.error('TikTok Token Error:', data);
      return NextResponse.json({ error: 'Failed to exchange token', details: data }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Callback Error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}

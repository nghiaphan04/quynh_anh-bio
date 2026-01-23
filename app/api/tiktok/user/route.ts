import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated with TikTok' }, { status: 401 });
  }

  try {
    const fields = 'open_id,union_id,avatar_url,display_name,bio_description,follower_count,following_count,likes_count';
    const response = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=${fields}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log("TikTok User Info Response:", JSON.stringify(data, null, 2));

    if (data.data && data.data.user) {
      const user = data.data.user;
      return NextResponse.json({
        username: user.display_name,
        bio: user.bio_description,
        followerCount: formatCount(user.follower_count),
        followingCount: formatCount(user.following_count),
        heartCount: formatCount(user.likes_count),
      });
    } else {
      return NextResponse.json({ error: 'Failed to fetch user info', details: data }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}

function formatCount(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

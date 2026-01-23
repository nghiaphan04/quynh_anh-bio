/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('tiktok_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated with TikTok' }, { status: 401 });
  }

  try {
    // 1. Fetch User Profile Info
    const profileFields = [
      'open_id',
      'union_id',
      'avatar_url',
      'avatar_url_100',
      'avatar_large_url',
      'display_name',
      'bio_description',
      'profile_deep_link',
      'is_verified',
      'username',
      'follower_count',
      'following_count',
      'likes_count',
      'video_count'
    ].join(',');
    
    const profileResponse = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=${profileFields}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const profileText = await profileResponse.text();
    console.log("TikTok User Info Raw Response:", profileText);

    let profileData;
    try {
      profileData = JSON.parse(profileText);
    } catch (e) {
      console.error("Failed to parse TikTok user info as JSON:", profileText);
      return NextResponse.json({ 
        error: 'TikTok API returned non-JSON response for profile', 
        details: profileText.substring(0, 200),
        status: profileResponse.status 
      }, { status: 500 });
    }

    // 2. Fetch Video List
    let videoLinks: string[] = [];
    let detailedVideos: any[] = [];
    try {
      const videoFields = 'id,create_time,cover_image_url,share_url,video_description,duration,title,view_count,like_count';
      const videoResponse = await fetch(`https://open.tiktokapis.com/v2/video/list/?fields=${videoFields}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_count: 20
        })
      });

      const videoText = await videoResponse.text();
      console.log("TikTok Video List Raw Response:", videoText);

      const videoData = JSON.parse(videoText);
      if (videoData.data && videoData.data.videos) {
        detailedVideos = videoData.data.videos;
        console.log("Detailed Videos Data:", JSON.stringify(detailedVideos, null, 2));
        videoLinks = detailedVideos.map((v: any) => v.share_url).filter(Boolean);
      }
    } catch (error) {
      console.error("Failed to fetch TikTok videos:", error);
      // Don't fail the whole request if only videos fail
    }

    if (profileData.data && profileData.data.user) {
      const user = profileData.data.user;
      const finalData = {
        username: user.display_name,
        bio: user.bio_description,
        followerCount: formatCount(user.follower_count),
        followingCount: formatCount(user.following_count),
        heartCount: formatCount(user.likes_count),
        videoLinks: videoLinks,
        rawVideos: detailedVideos // Including raw data in the response for the user to see in logs
      };
      
      console.log("Final Merged TikTok Data:", JSON.stringify(finalData, null, 2));
      return NextResponse.json(finalData);
    } else {
      return NextResponse.json({ error: 'Failed to fetch user info', details: profileData }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Internal API Error:", err);
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

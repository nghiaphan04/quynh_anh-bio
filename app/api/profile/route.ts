/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    
    if (!profile) {
      // Return default structure if no profile exists
      return NextResponse.json({
        bio: "",
        followerCount: "0",
        followingCount: "0",
        heartCount: "0",
        videoLinks: [],
        customLinks: [],
        followLink: "",
        messageLink: "",
        addFriendLink: "",
        shareLink: "",
        pinnedVideos: []
      });
    }
    
    return NextResponse.json(profile);
  } catch (_) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();

  // Strict Admin Check
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await req.json();
    const { 
      bio, followerCount, followingCount, heartCount, videoLinks, customLinks,
      uniqueId, username, bioLink, followLink, messageLink, addFriendLink, shareLink, pinnedVideos
    } = body;
    
    // Check if a profile exists to decide on update vs create logic
    // Since we only want one main profile, we can fetch the first one.
    const existingProfile = await prisma.profile.findFirst();

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: { 
          bio, followerCount, followingCount, heartCount, videoLinks, customLinks,
          uniqueId, username, bioLink, followLink, messageLink, addFriendLink, shareLink, pinnedVideos
        } as any,
      });
    } else {
      profile = await prisma.profile.create({
        data: { 
          bio, followerCount, followingCount, heartCount, videoLinks, customLinks,
          uniqueId, username, bioLink, followLink, messageLink, addFriendLink, shareLink, pinnedVideos
        } as any,
      });
    }
    
    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to update profile', details: error.message }, { status: 500 });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import ProfileHeader from "@/components/ProfileHeader";
import ProfileTabs from "@/components/ProfileTabs";
import prisma from "@/lib/prisma";
import { SignedOut, SignInButton } from "@clerk/nextjs";

async function getProfile() {
  const profile = await prisma.profile.findFirst() as any;
  
  if (!profile) {
    return {
      bio: "Welcome to my TikTok world! ✨",
      followerCount: "0",
      followingCount: "0",
      heartCount: "0",
      videoLinks: [],
      customLinks: [],
      uniqueId: "hanadan_yoko",
      username: "tsutsu.yoko",
      bioLink: "",
      followLink: "",
      messageLink: "",
      addFriendLink: "",
      shareLink: "",
      pinnedVideos: [],
      rawVideos: []
    };
  }

  return {
    bio: profile.bio || "",
    followerCount: profile.followerCount || "0",
    followingCount: profile.followingCount || "0",
    heartCount: profile.heartCount || "0",
    videoLinks: profile.videoLinks || [],
    customLinks: (profile.customLinks as { label: string; url: string }[]) || [],
    uniqueId: profile.uniqueId || "hanadan_yoko",
    username: profile.username || "tsutsu.yoko",
    bioLink: profile.bioLink || "",
    followLink: profile.followLink || "",
    messageLink: profile.messageLink || "",
    addFriendLink: profile.addFriendLink || "",
    shareLink: profile.shareLink || "",
    pinnedVideos: profile.pinnedVideos || [],
    
    // New Fields
    openId: profile.openId,
    unionId: profile.unionId,
    avatarUrl: profile.avatarUrl,
    avatarUrl100: profile.avatarUrl100,
    avatarLargeUrl: profile.avatarLargeUrl,
    isVerified: profile.isVerified || false,
    videoCount: profile.videoCount || 0,
    profileDeepLink: profile.profileDeepLink,
    rawVideos: (profile.rawVideos as any[]) || []
  };
}

export default async function Home() {
  const data = await getProfile();

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col md:flex-row max-w-[100vw] overflow-x-hidden">
      {/* Admin Header / Sticky Entry */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-bold hover:bg-primary/90 transition-all">
              Log in
            </button>
          </SignInButton>
        </SignedOut>

      </div>

      {/* Main Content: Single Column */}
      <div className="flex-1 w-full min-h-screen">
        <div className="max-w-6xl mx-auto pb-20">
          <ProfileHeader 
            bio={data.bio}
            followerCount={data.followerCount}
            followingCount={data.followingCount}
            heartCount={data.heartCount}
            uniqueId={data.uniqueId}
            username={data.username}
            bioLink={data.bioLink}
            followLink={data.followLink}
            messageLink={data.messageLink}
            addFriendLink={data.addFriendLink}
            shareLink={data.shareLink}
            avatarUrl={data.avatarUrl}
            avatarLargeUrl={data.avatarLargeUrl}
            isVerified={data.isVerified}
            allData={data}
          />
          
          <ProfileTabs 
            videoLinks={data.videoLinks}
            customLinks={data.customLinks}
            pinnedVideos={data.pinnedVideos}
            rawVideos={data.rawVideos || []}
          />
        </div>
      </div>
    </main>
  );
}

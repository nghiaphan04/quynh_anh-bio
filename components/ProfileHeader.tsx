'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import { Share2, UserPlus, Link as LinkIcon } from "lucide-react";

const ActionButton = ({ href, children, className }: { href: string; children: React.ReactNode; className: string }) => {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <button className={className}>
      {children}
    </button>
  );
};

interface ProfileHeaderProps {
  bio: string;
  followerCount: string;
  followingCount: string;
  heartCount: string;
  uniqueId: string;
  username: string;
  bioLink: string;
  followLink: string;
  messageLink: string;
  addFriendLink: string;
  shareLink: string;
}

export default function ProfileHeader({ 
  bio, followerCount, followingCount, heartCount,
  uniqueId, username, bioLink, followLink, messageLink, addFriendLink, shareLink
}: Readonly<ProfileHeaderProps>) {

  return (
    <div className="relative flex flex-col gap-5 p-4 md:p-0 md:pt-8 max-w-[800px] mx-auto">
      <div className="fixed top-4 right-4 z-50">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-2 md:gap-6">
        {/* Avatar Section */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative shrink-0"
        >
          <div className="w-[130px] h-[130px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden border border-primary/20 mt-4">
             <Avatar className="w-full h-full">
              <AvatarImage src="/avt_1080_1080.jpeg" alt="Profile" className="object-cover" />
              <AvatarFallback className="bg-muted text-foreground text-3xl md:text-5xl font-bold">
                QA
              </AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        {/* Info & Actions Section */}
        <div className="flex-1 space-y-3 md:space-y-4 pt-1 md:pt-2 w-full">
          <div className="space-y-1">
            <h1 className="text-[20px] leading-[26px] md:text-[32px] md:leading-[38px] font-bold flex flex-col md:flex-row items-center gap-1 md:gap-2 justify-center md:justify-start">
              {uniqueId}
              <span className="text-sm md:text-lg font-normal text-muted-foreground flex items-center gap-1">
                 {username}
              </span>
            </h1>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <ActionButton href={followLink} className="h-[44px] md:h-[36px] flex-1 md:flex-none md:min-w-[208px] px-4 bg-primary text-primary-foreground font-semibold rounded-[4px] hover:bg-primary/90 transition-colors flex items-center justify-center">
              Follow
            </ActionButton>
            <ActionButton href={messageLink} className="h-[44px] md:h-[36px] flex-1 md:flex-none md:min-w-[136px] px-4 bg-muted text-muted-foreground font-semibold rounded-[4px] hover:bg-muted/80 transition-colors flex items-center justify-center">
              Tin nhắn
            </ActionButton>
            <ActionButton href={addFriendLink} className="h-[44px] w-[44px] md:h-[36px] md:w-[36px] flex items-center justify-center bg-muted rounded-[4px] hover:bg-muted/80 transition-colors">
              <UserPlus className="w-5 h-5 text-muted-foreground" />
            </ActionButton>
            <ActionButton href={shareLink} className="h-[44px] w-[44px] md:h-[36px] md:w-[36px] flex items-center justify-center text-muted-foreground bg-muted md:bg-transparent hover:bg-muted/80 md:hover:bg-primary/10 rounded-[4px] transition-colors cursor-pointer md:-ml-1">
               <Share2 className="w-6 h-6" />
            </ActionButton>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-[15px] md:text-[16px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground max-w-[50px] truncate">{followingCount}</span>
              <span className="text-muted-foreground font-light text-sm md:text-base">Đã follow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground max-w-[50px] truncate">{followerCount}</span>
              <span className="text-muted-foreground font-light text-sm md:text-base">Follower</span>
            </div>
            <div className="w-full md:w-auto flex justify-center md:justify-start items-center gap-1.5">
              <span className="font-bold text-foreground max-w-[60px] truncate">{heartCount}</span>
              <span className="text-muted-foreground font-light text-sm md:text-base">Lượt thích</span>
            </div>
          </div>

          <div className="space-y-1 text-sm md:text-base whitespace-pre-wrap leading-5 md:leading-6">
            <p>
              {bio || "Welcome to my TikTok world! ✨"}
            </p>
            {bioLink && (
                <div className="flex items-center justify-center md:justify-start gap-1 text-primary hover:underline cursor-pointer font-medium mt-1">
                  <LinkIcon className="w-4 h-4 -rotate-45" />
                  <a href={bioLink} target="_blank" rel="noopener noreferrer" className="truncate max-w-[200px] md:max-w-[450px]">
                    {bioLink.replace(/^https?:\/\//, '')}
                  </a>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

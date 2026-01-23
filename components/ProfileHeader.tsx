/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Share2, UserPlus, Link as LinkIcon, Settings } from "lucide-react";
import AdminPanel from "./AdminPanel";
import { useUser, UserButton } from "@clerk/nextjs";

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
  avatarUrl?: string;
  avatarLargeUrl?: string;
  isVerified?: boolean;
  allData?: any; // To pass back to AdminPanel
}

export default function ProfileHeader({ 
  bio, followerCount, followingCount, heartCount,
  uniqueId, username, bioLink, followLink, messageLink, addFriendLink, shareLink,
  avatarUrl, avatarLargeUrl, isVerified, allData
}: Readonly<ProfileHeaderProps>) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'ADMIN';
  
  return (
    <div className="relative flex flex-col gap-5 p-4 md:p-0 md:pt-8 w-full mx-auto">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {isAdmin && (
          <AdminPanel initialData={allData}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white shadow-sm border border-black/5 transition-all cursor-pointer backdrop-blur-sm">
              <Settings className="w-4 h-4 text-foreground/80" />
            </button>
          </AdminPanel>
        )}
        <UserButton />
      </div>
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-2 md:gap-6">
        {/* Avatar Section */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative shrink-0"
        >
          <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] mt-4 relative">
             <div className="w-full h-full rounded-full overflow-hidden">
               <Avatar className="w-full h-full">
                <AvatarImage src={avatarLargeUrl || avatarUrl || "/avt_1080_1080.jpeg"} alt="Profile" className="object-cover" />
                <AvatarFallback className="bg-muted text-foreground text-3xl font-bold">
                  {uniqueId?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
             </div>
            

          </div>
        </motion.div>

        {/* Info & Actions Section */}
        <div className="flex-1 space-y-2 md:space-y-2 pt-1 md:pt-2 w-full">
          <div className="space-y-1">
            <h1 className="text-[20px] leading-[26px] md:text-[32px] md:leading-[38px] font-bold flex flex-col md:flex-row items-center md:gap-2 justify-center md:justify-start">
              <span className="flex items-center gap-1.5 cursor-pointer">
                {username} 
                {isVerified && (
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]">
                    <circle cx="24" cy="24" r="20" fill="#20D5EC"/>
                    <path d="M14 24L21 31L34 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
               <span className="text-sm md:text-xl md:font-bold font-normal flex items-center gap-1 mt-1 md:mt-2">
                  <span className="md:hidden">@</span>{uniqueId}
                </span>
              
            </h1>
          </div>

          <div className="flex flex-col md:flex-col-reverse gap-1 md:gap-2">
            <div className="flex items-center justify-center md:justify-start gap-0 md:gap-6 mb-2 md:my-0 py-1">
              <div className="flex flex-col md:flex-row items-center gap-0 md:gap-1.5 cursor-pointer hover:opacity-80 transition-opacity px-4 md:px-0">
                <span className="font-bold text-foreground max-w-[50px] truncate leading-none md:leading-normal">{followingCount}</span>
                <span className="text-muted-foreground font-light text-[13px] md:text-base leading-tight">Đã follow</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-0 md:gap-1.5 cursor-pointer hover:opacity-80 transition-opacity px-4 md:px-0 border-l border-r border-border/60 md:border-0 border-gray-300 dark:border-gray-800">
                <span className="font-bold text-foreground max-w-[50px] truncate leading-none md:leading-normal">{followerCount}</span>
                <span className="text-muted-foreground font-light text-[13px] md:text-base leading-tight">Follower</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-0 md:gap-1.5 cursor-pointer hover:opacity-80 transition-opacity px-4 md:px-0 ">
                <span className="font-bold text-foreground max-w-[60px] truncate leading-none md:leading-normal">{heartCount}</span>
                <span className="text-muted-foreground font-light text-[13px] md:text-base leading-tight">Lượt thích</span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2">
              <ActionButton href={followLink} className="h-[44px] md:h-[36px] flex-1 md:flex-none md:min-w-[208px] px-4 bg-primary text-primary-foreground font-semibold rounded-[5px] hover:bg-primary/90 transition-colors flex items-center justify-center">
                Follow
              </ActionButton>
              <ActionButton href={messageLink} className="h-[44px] md:h-[36px] flex-1 md:flex-none md:min-w-[136px] px-4 bg-muted text-black font-semibold rounded-[5px] hover:bg-muted/80 transition-colors flex items-center justify-center">
                Tin nhắn
              </ActionButton>
              <ActionButton href={addFriendLink} className="h-[44px] w-[44px] md:h-[36px] md:w-[36px] flex items-center justify-center bg-muted rounded-[5px] hover:bg-muted/80 transition-colors">
                <UserPlus className="w-5 h-5 text-black" />
              </ActionButton>
              <ActionButton href={shareLink} className="h-[44px] w-[44px] md:h-[36px] md:w-[36px] flex items-center justify-center text-black bg-muted md:bg-transparent hover:bg-muted/80 md:hover:bg-primary/10 rounded-[5px] transition-colors cursor-pointer md:-ml-1">
                 <Share2 className="w-6 h-6" />
              </ActionButton>
            </div>
          </div>

          <div className="space-y-1 text-sm md:text-base whitespace-pre-wrap leading-5 md:leading-6">
            <p>
              {bio || "Welcome to my TikTok world! "}
            </p>
            {bioLink && (
                <div className="flex items-center justify-center md:justify-start gap-1 text-primary hover:underline cursor-pointer font-medium mt-1">
                  <LinkIcon className="w-4 h-4" />
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

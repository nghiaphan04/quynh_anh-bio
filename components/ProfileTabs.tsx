/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import VideoGrid from "@/components/VideoGrid";

import CustomLinks from "@/components/CustomLinks";
import { cn } from "@/lib/utils";
import { Heart, AlignJustify } from 'lucide-react';

interface ProfileTabsProps {
  videoLinks: string[];
  customLinks: { label: string; url: string }[];
  pinnedVideos: string[];
  rawVideos: any[];
}

export default function ProfileTabs({ videoLinks, customLinks, pinnedVideos, rawVideos }: Readonly<ProfileTabsProps>) {
  const [activeTab, setActiveTab] = useState<'videos' | 'stories'>('videos');

  return (
    <div className="w-full max-w-[800px] mx-auto mt-2 text-foreground">
      {/* Tab Navigation */}
      <div className="flex border-b border-border relative">
        <div className="flex flex-1">
          <button 
            onClick={() => setActiveTab('videos')}
            className={cn(
              "h-[44px] px-6 text-[18px] font-semibold flex items-center gap-2 cursor-pointer transition-colors relative opacity-50 hover:opacity-100 flex-1 justify-center md:justify-start md:flex-none",
              activeTab === 'videos' && "opacity-100 text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[150px] after:h-[2px] after:bg-primary after:content-['']" 
            )}
          >
            <AlignJustify className="w-5 h-5" />
            <span className="text-sm md:text-lg">Video</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('stories')}
            className={cn(
              "h-[44px] px-6 text-[18px] font-semibold flex items-center gap-2 cursor-pointer transition-colors relative opacity-50 hover:opacity-100 flex-1 justify-center md:justify-start md:flex-none",
              activeTab === 'stories' && "opacity-100 text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[150px] after:h-[2px] after:bg-primary after:content-['']"
            )}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            <span className="hidden md:inline">Link truyện</span>
            <span className="md:hidden">Link truyện</span>
          </button>
        </div>

        {/* Desktop Sort Filters - In Header */}
        {activeTab === 'videos' && (
          <div className="hidden md:flex bg-secondary rounded-[4px] p-0.5 h-[32px] items-center absolute right-0 bottom-1.5">
              <button className="px-3 text-[13px] font-semibold text-foreground bg-background h-full rounded-[2px] shadow-sm">Mới nhất</button>
              <button className="px-3 text-[13px] font-semibold text-muted-foreground hover:text-primary transition-colors">Thịnh hành</button>
              <button className="px-3 text-[13px] font-semibold text-muted-foreground hover:text-primary transition-colors">Cũ nhất</button>
          </div>
        )}
      </div>

      {/* Mobile Sort Filters below tabs - Only show for videos tab */}
      {activeTab === 'videos' && (
        <div className="flex md:hidden justify-center mt-2 mb-2 px-1">
          <div className="flex bg-secondary rounded-[4px] p-0.5 h-[32px] items-center border border-border">
              <button className="px-3 text-[13px] font-semibold text-foreground bg-background h-full rounded-[2px] shadow-sm">Mới nhất</button>
              <button className="px-3 text-[13px] font-semibold text-muted-foreground hover:text-primary transition-colors">Thịnh hành</button>
              <button className="px-3 text-[13px] font-semibold text-muted-foreground hover:text-primary transition-colors">Cũ nhất</button>
          </div>
        </div>
      )}

      <div className="min-h-[300px] mt-4">
        {activeTab === 'videos' && (
          <VideoGrid 
            videoLinks={videoLinks} 
            pinnedVideos={pinnedVideos} 
            rawVideos={rawVideos} 
          />
        )}
        
        {activeTab === 'stories' && (
          <div className="space-y-4">
              {customLinks && customLinks.length > 0 ? (
                 <div className="p-4 rounded-lg bg-[#121212] mb-6">
                    <p className="text-center text-sm text-[#A1A1AA] mb-4 uppercase tracking-widest text-[11px] font-bold">❤️ Link truyện (Custom Links)</p>
                    <CustomLinks links={customLinks} />
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <div className="w-[72px] h-[72px] mb-4 flex items-center justify-center bg-muted/10 rounded-full">
                       <Heart className="w-10 h-10 opacity-50" />
                    </div>
                    <p className="text-lg font-bold text-foreground mb-1">Chưa có link truyện nào</p>
                    <p className="text-sm">Các link truyện sẽ xuất hiện ở đây</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
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

// Helper component for Typewriter effect
const TypewriterText = ({ text, speed = 80 }: { text: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className="text-[11px] font-bold text-muted-foreground mt-2">{displayText}</span>;
};

export default function ProfileTabs({ videoLinks, customLinks, pinnedVideos, rawVideos }: Readonly<ProfileTabsProps>) {
  const [activeTab, setActiveTab] = useState<'videos' | 'stories'>('videos');
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (tab: 'videos' | 'stories') => {
    if (tab === activeTab) return;
    
    if (tab === 'stories') {
      setIsLoading(true);
      setActiveTab(tab);
      setTimeout(() => setIsLoading(false), 6500); 
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="w-full mx-auto mt-4 text-foreground">
      {/* Tab Navigation */}
      <div className="flex border-b border-black/20 relative">
        <div className="flex flex-1">
          <button 
            onClick={() => handleTabChange('videos')}
            className={cn(
              "h-[44px] px-6 text-[18px] font-semibold flex items-center gap-2 cursor-pointer transition-colors relative opacity-50 hover:opacity-100 flex-1 justify-center md:justify-start md:flex-none",
              activeTab === 'videos' && "opacity-100 text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[120px] after:h-[2px] after:bg-primary after:content-['']" 
            )}
          >
            <AlignJustify className="w-5 h-5" />
            <span className="text-sm md:text-lg">Video</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('stories')}
            className={cn(
              "h-[44px] px-6 text-[18px] font-semibold flex items-center gap-2 cursor-pointer transition-colors relative opacity-50 hover:opacity-100 flex-1 justify-center md:justify-start md:flex-none",
              activeTab === 'stories' && "opacity-100 text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[120px] after:h-[2px] after:bg-primary after:content-['']"
            )}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            <span className="text-sm md:text-lg">Link truyện</span>
          
          </button>
        </div>
      </div>


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
                 <div className="p-4 rounded-lg bg-card mb-6 border border-border">
                    <p className="text-center text-sm text-primary mb-4 uppercase tracking-widest text-[14px] font-bold">Link truyện đây nha 👇👇👇</p>
                    {
                      isLoading ? (
                        <div className="w-full flex flex-col items-center justify-center py-10">
                           <div className="relative w-16 h-16">
                             <Image 
                               src="https://media.tenor.com/hW_mTYy_zS4AAAAi/gojo-satoru.gif" 
                               alt="Loading..." 
                               fill
                               className="object-contain"
                               unoptimized
                             />
                           </div>
                           <TypewriterText text="... Con vợ chờ anh tí nhé! .." />
                        </div>
                      ) : (
                        <CustomLinks links={customLinks} />
                      )
                    }
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">  
                    <div className="relative w-16 h-16 mb-2">
                       <Image 
                         src="https://media.tenor.com/pEDQL3XJxdsAAAAj/cat-cute.gif" 
                         alt="Loading..." 
                         fill
                         className="object-contain"
                         unoptimized
                       /> 
                    </div>
                    <p className="text-lg font-bold text-foreground mb-1">Chưa có link truyện nào</p>
                    <p className="text-sm">Thêm link cho tao đi con lon admin:))</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

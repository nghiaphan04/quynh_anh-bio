/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface VideoGridProps {
  videoLinks: string[];
  pinnedVideos?: string[];
  rawVideos?: any[];
}

export default function VideoGrid({ videoLinks, pinnedVideos = [], rawVideos = [] }: Readonly<VideoGridProps>) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  };

  // Use rawVideos if available, otherwise fallback to videoLinks (legacy)
  const displayVideos = rawVideos && rawVideos.length > 0 
    ? rawVideos 
    : videoLinks.map(link => ({ share_url: link, id: link, cover_image_url: null, view_count: 0 }));

  if (!displayVideos || displayVideos.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20 flex-1">
        <p>Chưa có video nào.</p>
      </div>
    );
  }

  const formatViews = (count: number) => {
    if (!count) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid mt-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-0.5"
      >
        {displayVideos.map((video, index) => {
          const isPinned = pinnedVideos?.includes(video.share_url);
          const coverImage = video.cover_image_url;
          const viewCount = video.view_count;

          return (
            <motion.div 
              key={video.id || index} 
              variants={item} 
              className="relative aspect-[3/4] group overflow-hidden cursor-pointer bg-muted/30 border border-border/50 rounded-sm"
              onClick={() => window.open(video.share_url, '_blank')}
            >
              {/* Cover Image */}
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={coverImage} 
                  alt={video.title || "TikTok video"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <Play className="w-8 h-8 text-primary/20" />
                </div>
              )}

              {/* Pinned Badge */}
              {isPinned && (
                 <div className="absolute top-1 left-1 px-1 py-0.5 bg-[#FE2C55] rounded-[2px] z-10">
                   <span className="text-[10px] font-bold text-white leading-none">Đã ghim</span>
                 </div>
              )}

              {/* View Count Overlay */}
              <div className="absolute bottom-1 left-1 flex items-center gap-0.5 z-10 text-white drop-shadow-md">
                <Play className="w-4 h-4 fill-transparent " />
                <span className="text-[15px] font-semibold ms-1">{formatViews(viewCount)}</span>
              </div>

              {/* Hover Darken Effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </motion.div>
          );
        })}
      </motion.div>
  );
}

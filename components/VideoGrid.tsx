import { motion } from "framer-motion";


interface VideoGridProps {
  videoLinks: string[];
  pinnedVideos?: string[];
}

export default function VideoGrid({ videoLinks, pinnedVideos = [] }: Readonly<VideoGridProps>) {
  const getVideoId = (url: string) => {
    try {
      if (url.includes('/video/')) {
        return url.split('/video/')[1].split('?')[0];
      }
      return url; 
    } catch (_) {
      return null;
    }
  };

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

  if (!videoLinks || videoLinks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20 flex-1">
        <p>Chưa có video nào.</p>
      </div>
    );
  }

  return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid mt-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3"
      >
        {videoLinks.map((link, index) => {
          const videoId = getVideoId(link);
          if (!videoId) return null;
          
          const isPinned = pinnedVideos?.includes(link);

          return (
            <motion.div 
              key={videoId} 
              variants={item} 
              className="relative aspect-[3/4] group overflow-hidden rounded-md bg-black"
            >
              {isPinned && (
                 <div className="absolute top-2 left-2 px-1.5 bg-[#FE2C55] rounded-[2px] z-10 pointer-events-none">
                   <span className="text-[12px] text-white leading-none">Đã ghim</span>
                 </div>
              )}
              <iframe
                src={`https://www.tiktok.com/player/v1/${videoId}?music_info=0&description=0&autoplay=0&rel=0&controls=1&play_button=1&progress_bar=0&volume_control=0&fullscreen_button=0&timestamp=0`}
                title={`TikTok video ${videoId}`}
                className="w-full h-full absolute inset-0 text-white  origin-center"
                style={{ border: 0 }}
                scrolling="no"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                referrerPolicy="origin"
              />
            </motion.div>
          );
        })}
      </motion.div>
  );
}

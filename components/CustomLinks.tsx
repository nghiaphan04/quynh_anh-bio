'use client';

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface CustomLink {
  label: string;
  url: string;
}

interface CustomLinksProps {
  links: CustomLink[];
}

export default function CustomLinks({ links }: CustomLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full items-start p-2">
      <div className="space-y-3 w-full">
        {links.map((link, index) => (
          <motion.div
            key={index}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col items-start pt-3 transition-all duration-300 w-full"
          >
      
            <span className="font-medium text-foreground transition-colors text-base">
              {index + 1}. {link.label}
            </span>
            <div className="flex items-center gap-2">
              
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 underline mt-1  hover:text-blue-600 transition-colors break-all"
              >
                {link.url}
              </a>
            </div>
            
            
          </motion.div>
        ))}
      </div>
    </div>
  );
}

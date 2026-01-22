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
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold text-primary mb-2">My Links</h2>
      <div className="space-y-3">
        {links.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <span className="font-medium text-white group-hover:text-primary transition-colors">
              {link.label}
            </span>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

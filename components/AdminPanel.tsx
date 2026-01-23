'use client';

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Settings, Link as LinkIcon, Save, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CustomLink {
  label: string;
  url: string;
}

interface ProfileData {
  bio: string;
  followerCount: string;
  followingCount: string;
  heartCount: string;
  videoLinks: string[];
  customLinks: CustomLink[];
  uniqueId: string;
  username: string;
  bioLink: string;
  followLink: string;
  messageLink: string;
  addFriendLink: string;
  shareLink: string;
  pinnedVideos: string[];
}

export default function AdminPanel({ initialData }: Readonly<{ initialData?: ProfileData }>) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ProfileData>({
    bio: "",
    followerCount: "",
    followingCount: "",
    heartCount: "",
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
    ...initialData
  });
  const [newLink, setNewLink] = useState("");
  const [newCustomLabel, setNewCustomLabel] = useState("");
  const [newCustomUrl, setNewCustomUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  if (!isSignedIn) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Lưu thay đổi thành công!");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error("Có lỗi xảy ra khi lưu! (API Error)");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu!");
    } finally {
      setIsSaving(false);
    }
  };

  const syncFromTikTok = () => {
    const clientKey = "sbawjkr6yntwtr4ljy"; // Keeping it secure via env is better but for sandbox test this is fine or we can use another route to get the auth URL
    const redirectUri = encodeURIComponent("https://quynh-anh-bio.vercel.app/api/tiktok/callback");
    const scope = "user.info.basic,user.info.profile,user.info.stats,video.list";
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;
    
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(authUrl, 'TikTok Login', `width=${width},height=${height},left=${left},top=${top}`);

    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'TIKTOK_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        toast.info("Đã xác thực, đang lấy dữ liệu...");
        
        try {
          const res = await fetch('/api/tiktok/user');
          const tiktokData = await res.json();
          console.log("TikTok Data from API:", tiktokData);
          
          if (tiktokData.error) {
            toast.error("Lỗi lấy dữ liệu: " + tiktokData.error);
            return;
          }

          setData(prev => ({
            ...prev,
            username: tiktokData.username || prev.username,
            bio: tiktokData.bio || prev.bio,
            followerCount: tiktokData.followerCount || prev.followerCount,
            followingCount: tiktokData.followingCount || prev.followingCount,
            heartCount: tiktokData.heartCount || prev.heartCount,
            videoLinks: tiktokData.videoLinks?.length > 0 ? tiktokData.videoLinks : prev.videoLinks
          }));
          
          toast.success("Đã đồng bộ dữ liệu từ TikTok!");
        } catch (err) {
          toast.error("Lỗi đồng bộ dữ liệu");
        }
      }
    };

    window.addEventListener('message', handleMessage);
  };

  const addVideo = () => {
    if (newLink) {
      setData(prev => ({ ...prev, videoLinks: [...prev.videoLinks, newLink] }));
      setNewLink("");
    }
  };

  const removeVideo = (index: number) => {
    setData(prev => ({
      ...prev,
      videoLinks: prev.videoLinks.filter((_, i) => i !== index),
      pinnedVideos: prev.pinnedVideos.filter(v => v !== prev.videoLinks[index]) // Remove from pinned if deleted
    }));
  };
  
  const togglePinVideo = (link: string) => {
    setData(prev => {
        const isPinned = prev.pinnedVideos.includes(link);
        if (isPinned) {
            return { ...prev, pinnedVideos: prev.pinnedVideos.filter(v => v !== link) };
        } else {
             // Limit to 3 pinned videos if desired, or allow more. TikTok usually pins top 3.
             if (prev.pinnedVideos.length >= 3) return prev; 
             return { ...prev, pinnedVideos: [...prev.pinnedVideos, link] };
        }
    });
  };

  const addCustomLink = () => {
    if (newCustomLabel && newCustomUrl) {
      setData(prev => ({
        ...prev,
        customLinks: [...(prev.customLinks || []), { label: newCustomLabel, url: newCustomUrl }]
      }));
      setNewCustomLabel("");
      setNewCustomUrl("");
    }
  };

  const removeCustomLink = (index: number) => {
    setData(prev => ({
      ...prev,
      customLinks: prev.customLinks.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed bottom-6 right-6 z-50 group">
        <motion.div
           animate={{ scale: [1, 1.05, 1] }}
           transition={{ repeat: Infinity, duration: 2 }}
        >
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 text-white gap-2 pl-4 pr-6 h-14"
            >
              <Settings className="w-5 h-5 animate-spin-slow" />
              <span>Chế độ Edit</span>
            </Button>
          </DialogTrigger>
        </motion.div>
      </div>

      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogTitle className="sr-only">Admin Dashboard</DialogTitle>
        <Tabs defaultValue="info" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6 py-4">
            <div className="flex justify-between items-center mb-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-primary border-primary/20 hover:bg-primary/10"
                    onClick={syncFromTikTok}
                >
                    <RefreshCw className="w-4 h-4" />
                    Đồng bộ từ TikTok Sandbox
                </Button>
            </div>
            {/* Info and Identity */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unique ID (@username)</Label>
                    <Input 
                      value={data.uniqueId}
                      onChange={(e) => setData({...data, uniqueId: e.target.value})} 
                      placeholder="hanadan_yoko"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username (Display Name)</Label>
                    <Input 
                      value={data.username}
                      onChange={(e) => setData({...data, username: e.target.value})} 
                      placeholder="tsutsu.yoko"
                    />
                  </div>
              </div>

              <div className="space-y-2">
                <Label>Bio Link (hiển thị màu đỏ)</Label>
                <Input 
                  value={data.bioLink}
                  onChange={(e) => setData({...data, bioLink: e.target.value})} 
                  placeholder="Link bên dưới bio"
                />
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea 
                  value={data.bio}
                  onChange={(e) => setData({...data, bio: e.target.value})} 
                  placeholder="Nhập bio..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Followers</Label>
                  <Input 
                    value={data.followerCount}
                    onChange={(e) => setData({...data, followerCount: e.target.value})}
                    placeholder="1.2M" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Following</Label>
                  <Input 
                    value={data.followingCount}
                    onChange={(e) => setData({...data, followingCount: e.target.value})}
                    placeholder="100" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Likes</Label>
                  <Input 
                    value={data.heartCount}
                    onChange={(e) => setData({...data, heartCount: e.target.value})}
                    placeholder="20M" 
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6 py-4">
             <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Cấu hình link cho các nút actions.</p>
                <div className="space-y-2">
                  <Label>Follow Button Link</Label>
                  <Input 
                    value={data.followLink}
                    onChange={(e) => setData({...data, followLink: e.target.value})} 
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Button Link</Label>
                  <Input 
                    value={data.messageLink}
                    onChange={(e) => setData({...data, messageLink: e.target.value})} 
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Add Friend Button Link</Label>
                  <Input 
                    value={data.addFriendLink}
                    onChange={(e) => setData({...data, addFriendLink: e.target.value})} 
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Share Button Link</Label>
                  <Input 
                    value={data.shareLink}
                    onChange={(e) => setData({...data, shareLink: e.target.value})} 
                    placeholder="https://..."
                  />
                </div>
             </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6 py-4">
            {/* Videos tab content */}
            <div className="flex gap-2">
              <Input 
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Dán link TikTok vào đây..."
                onKeyDown={(e) => e.key === 'Enter' && addVideo()}
              />
              <Button onClick={addVideo} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {data.videoLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-muted rounded-lg group">
                  <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="text-xs truncate flex-1 font-mono w-0">{link}</div>
                  <div className="flex items-center gap-1">
                     <Button
                        variant={data.pinnedVideos.includes(link) ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-[10px]"
                        onClick={() => togglePinVideo(link)}
                     >
                        {data.pinnedVideos.includes(link) ? "Unpin" : "Pin"}
                     </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeVideo(i)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                  </div>
                </div>
              ))}
              {data.videoLinks.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Chưa có video nào
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">Pin tối đa 3 video.</p>
          </TabsContent>

          <TabsContent value="links" className="space-y-6 py-4">
            {/* Custom Links tab content */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input 
                  value={newCustomLabel}
                  onChange={(e) => setNewCustomLabel(e.target.value)}
                  placeholder="Nhãn (VD: Instagram)"
                />
                <Input 
                  value={newCustomUrl}
                  onChange={(e) => setNewCustomUrl(e.target.value)}
                  placeholder="Đường dẫn (https://...)"
                />
              </div>
              <Button onClick={addCustomLink} className="w-full gap-2">
                <Plus className="w-4 h-4" /> Thêm Link
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {data.customLinks?.map((link, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-muted rounded-lg group">
                  <div className="flex-1 min-w-0 grid gap-0.5">
                    <p className="text-sm font-medium truncate">{link.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                    onClick={() => removeCustomLink(i)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {(!data.customLinks || data.customLinks.length === 0) && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Chưa có link tùy chỉnh nào
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-border mt-2">
          <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto gap-2">
            {isSaving ? "Đang lưu..." : <><Save className="w-4 h-4" /> Lưu thay đổi</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
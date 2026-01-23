/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
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
  
  // New Fields
  openId?: string;
  unionId?: string;
  avatarUrl?: string;
  avatarUrl100?: string;
  avatarLargeUrl?: string;
  isVerified?: boolean;
  videoCount?: number;
  profileDeepLink?: string;
  rawVideos?: any[];
}

export default function AdminPanel({ initialData, children }: Readonly<{ initialData?: ProfileData; children: React.ReactNode }>) {
  const { user, isSignedIn } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'ADMIN';
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
  const [newCustomLabel, setNewCustomLabel] = useState("");
  const [newCustomUrl, setNewCustomUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  if (!isSignedIn || !isAdmin) return null;

  const handleSave = async (manualData?: ProfileData) => {
    setIsSaving(manualData ? false : true); // If it's from sync, we handle state differently
    const dataToSave = manualData || data;
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      if (res.ok) {
        toast.success("Đã đồng bộ và lưu dữ liệu thành công!");
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
    
    window.open(authUrl, 'TikTok Login', `width=${width},height=${height},left=${left},top=${top}`);

    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'TIKTOK_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        setIsSyncing(true);
        toast.info("Đã xác thực, đang lấy dữ liệu...");
        
        try {
          const res = await fetch('/api/tiktok/user');
          const tiktokData = await res.json();
          
          if (tiktokData.error) {
            toast.error("Lỗi lấy dữ liệu: " + tiktokData.error);
            setIsSyncing(false);
            return;
          }

          const updatedData: ProfileData = {
            ...data,
            username: tiktokData.username || data.username,
            uniqueId: tiktokData.uniqueId || data.uniqueId,
            bio: tiktokData.bio || data.bio,
            followerCount: tiktokData.followerCount || data.followerCount,
            followingCount: tiktokData.followingCount || data.followingCount,
            heartCount: tiktokData.heartCount || data.heartCount,
            videoLinks: tiktokData.videoLinks?.length > 0 ? tiktokData.videoLinks : data.videoLinks,
            
            // Sync new fields
            openId: tiktokData.openId,
            unionId: tiktokData.unionId,
            avatarUrl: tiktokData.avatarUrl,
            avatarUrl100: tiktokData.avatarUrl100,
            avatarLargeUrl: tiktokData.avatarLargeUrl,
            isVerified: tiktokData.isVerified,
            videoCount: tiktokData.videoCount,
            profileDeepLink: tiktokData.profileDeepLink,
            rawVideos: tiktokData.rawVideos
          };

          setData(updatedData);
          await handleSave(updatedData);
          
        } catch (error) {
          console.error("Sync Error:", error);
          toast.error("Lỗi đồng bộ dữ liệu");
        } finally {
          setIsSyncing(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogTitle className="sr-only">Admin Dashboard</DialogTitle>
        <Tabs defaultValue="sync" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sync">TikTok Sync</TabsTrigger>
            <TabsTrigger value="links">Custom Links</TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="space-y-6 py-12 flex flex-col items-center justify-center">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Đồng bộ hóa TikTok</h3>
              <p className="text-sm text-muted-foreground max-w-[300px]">
                Tự động cập nhật Bio, Tên hiển thị, Follower, Likes và Video từ tài khoản TikTok Sandbox của bạn.
              </p>
            </div>
            
            <Button 
                variant="default" 
                size="lg" 
                className="gap-3 bg-primary hover:bg-primary/90 text-white min-w-[240px] h-14 text-lg shadow-lg shadow-primary/20"
                onClick={syncFromTikTok}
                disabled={isSyncing}
            >
                <RefreshCw className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
            </Button>

            {isSyncing && (
              <p className="text-xs text-primary animate-pulse">
                Ứng dụng đang lấy dữ liệu và lưu vào database...
              </p>
            )}
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

        <div className="flex justify-end pt-4 border-t border-border mt-6">
          <Button onClick={() => handleSave()} disabled={isSaving} className="w-full sm:w-auto gap-2">
            {isSaving ? "Đang lưu..." : <><Save className="w-4 h-4" /> Lưu Custom Links</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
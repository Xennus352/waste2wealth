"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types";
import toast from "react-hot-toast";
import PostCardContainer from "@/components/pages/PostCardContainer";
import { LogoutButton } from "@/components/logout-button";
import CreateProductForm from "@/components/pages/CreateProductForm";
import MyOrders from "@/components/pages/MyOrders";

export default function Profile() {
  const [avatar, setAvatar] = useState<string>(
    "https://homebusinessmag.com/wp-content/uploads/2020/03/recycle-symbol-and-items-scaled-e1585005600616.jpg"
  );
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>();

  const user = useAuth();
  // TODO: MAKE PROFILE IMAGE UPDATABLE
  // const supabase = createClient();

  // const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const preview = URL.createObjectURL(file);
  //   setAvatar(preview);

  //   // sanitize file name: replace spaces with underscores
  //   const sanitizedFileName = file.name.replace(/\s+/g, "_");
  //   const fileName = `${user?.id}-${sanitizedFileName}`;

  //   // upload file with metadata to identify owner
  //   const { data, error } = await supabase.storage
  //     .from("avatars")
  //     .upload(fileName, file, {
  //       upsert: true,
  //       cacheControl: "3600",
  //       contentType: file.type,
  //       metadata: { owner: user?.id },
  //     });

  //   if (error) {
  //     console.error("Upload error:", error);
  //     return alert("Failed to upload avatar");
  //   }

  //   // get public URL
  //   const { publicUrl }: any = supabase.storage
  //     .from("avatars")
  //     .getPublicUrl(fileName);

  //   // update profile
  //   const { error: updateError } = await supabase
  //     .from("profiles")
  //     .update({ avatar_url: publicUrl })
  //     .eq("id", user?.id);

  //   if (updateError) {
  //     console.error("Profile update error:", updateError);
  //     return alert("Failed to update profile");
  //   }

  //   alert("Avatar updated!");
  // };

  const handleUpdateProfile = async () => {
    if (!user?.id) return toast.error("User not found");

    setLoading(true);
    try {
      await axios.post("/api/update-profile", {
        userId: user.id,
        display_name: displayName,
        phone,
        avatar_url: avatar,
        email,
      });

      // Update local state safely
      setUserProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          display_name: displayName,
          phone,
          email,
          avatar_url: avatar,
        };
      });

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async (userId: string) => {
    try {
      const response = await axios.get(`/api/user-profile/${userId}`);
      const data = response.data;
      return setUserProfile(data);
    } catch (error: any) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message
      );
      return null;
    }
  };
  // fetch current user
  useEffect(() => {
    getUserData(user?.id as string);
  }, [user?.id]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.display_name || "");
      setEmail(user?.email || "");
      setPhone(userProfile.phone || "");
      setAvatar(userProfile.avatar_url || avatar);
    }
  }, [userProfile]);
  return (
    <div className=" bg-eco-background p-4 md:p-8 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <Card className="">
          <CardHeader className="space-y-6">
            <CardTitle className="text-2xl font-bold text-eco-textDark">
              My Profile
            </CardTitle>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-28 h-28 ring-4  ring-eco-primaryLight">
                  <AvatarImage className="object-cover" src={avatar} />
                  <AvatarFallback className="bg-eco-primarySoft text-eco-textDark">
                    {userProfile ? (
                      <p className="text-center text-7xl">
                        {userProfile.display_name?.[0]}
                      </p>
                    ) : (
                      displayName.charAt(0)
                    )}
                  </AvatarFallback>
                </Avatar>
                {/* to update profile  */}
                {/* <label className="absolute bottom-0 right-0 bg-eco-primary text-white text-xs px-3 py-1 rounded-full cursor-pointer shadow-md hover:bg-eco-primaryLight transition">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label> */}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-eco-textDark">
                  {userProfile ? userProfile.display_name : displayName}
                </h2>
                <p className="text-sm text-eco-primary">{user && user.email}</p>

                {/* copyable user id  */}
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm text-eco-primary select-text cursor-pointer
                  hover:text-eco-primaryLight hover:underline transition"
                    onClick={() => {
                      if (user?.id) navigator.clipboard.writeText(user?.id);
                      toast.success("User ID copied to clipboard!");
                    }}
                  >
                    {user?.id}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <Separator className="bg-eco-primarySoft" />

          {/* EDITABLE INFO */}
          <div className="px-6 pt-6 pb-4 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="+95xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <div className="rounded-full text-red-600 hover:text-white hover:bg-red-700  transition-all duration-200">
                <LogoutButton />
              </div>
              <Button
                onClick={handleUpdateProfile}
                className="bg-eco-primary hover:bg-eco-primaryLight text-white rounded-xl px-8"
              >
                {loading ? "Updating.." : "Update Profile"}
              </Button>
            </div>
          </div>
          <Separator className="bg-eco-primarySoft" />

          <CardContent className="pt-6">
            {/* Tabs Section with animated active indicator */}
            {(() => {
              const tabs = ["posts", "sell", "orders"];
              const tabLabels: Record<string, string> = {
                posts: "My Posts",
                sell: "Sell Product",
                orders: "My Orders",
              };
              const [active, setActive] = useState<string>(tabs[0]);
              const activeIndex = tabs.indexOf(active);
              const indicatorWidth = 100 / tabs.length; // percent

              return (
                <div className="w-full">
                  <div className="relative">
                    {/* Tabs container */}
                    <div className="relative grid grid-cols-3 bg-eco-primarySoft rounded-xl p-1">
                      {/* Animated sliding indicator (behind the buttons) */}
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 h-[calc(100%-8px)] bg-eco-primary rounded-lg shadow-md"
                        style={{
                          width: `${indicatorWidth}%`,
                          left: `${activeIndex * indicatorWidth}%`,
                        }}
                        animate={{ left: `${activeIndex * indicatorWidth}%` }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 30,
                        }}
                      />

                      {/* Tab buttons (on top of the indicator) */}
                      {tabs.map((t) => (
                        <button
                          key={t}
                          onClick={() => setActive(t)}
                          className={
                            "relative z-10 py-2 px-3 text-sm font-medium rounded-md transition-all " +
                            (active === t
                              ? "text-white scale-105"
                              : "text-eco-textDark/90 hover:text-eco-textDark")
                          }
                          aria-pressed={active === t}
                        >
                          {tabLabels[t]}
                        </button>
                      ))}
                    </div>

                    {/* Tab contents */}
                    <div className="mt-4">
                      {active === "posts" && (
                        <div className="grid gap-4 place-content-center ">
                          <PostCardContainer currentUserPost={user?.id} />
                        </div>
                      )}

                      {active === "sell" && <CreateProductForm />}

                      {active === "orders" && (
                        <MyOrders userId={user?.id as string} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

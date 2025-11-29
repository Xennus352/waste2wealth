"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Like, PostData } from "@/types";
import Stack from "./Stack";
import { TimeFormatter } from "@/utils/timeFormatter";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { createClient } from "@/lib/supabase/client";

export function PostCard({ post }: { post?: PostData }) {
  const user = useAuth();
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [isLiked, setIsLiked] = useState(
    post?.likes?.some((like) => like.user_id === user?.id) || false
  );
  const router = useRouter();
  const supabase = createClient();

  // Initialize isLiked state on mount
  useEffect(() => {
    if (!user || !post?.likes) return;
    // Cast likes as Like[]
    const likes = post.likes as Like[];
    // Check if current user already liked
    const liked = likes.some((like) => like.user_id === user.id);
    setIsLiked(liked);
    setLikesCount(post.likes_count || likes.length);
  }, [post?.likes, post?.likes_count, user]);

  // Realtime subscription for likes
  useEffect(() => {
    if (!post?.id) return;

    const channel = supabase
      .channel(`likes_post_${post.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "likes",
          filter: `post_id=eq.${post.id}`,
        },
        (payload) => {
          setLikesCount((prev) => {
          if (payload.eventType === "INSERT") return prev + 1;
          if (payload.eventType === "DELETE") return Math.max(prev - 1, 0);
          return prev; // ignore UPDATE
        });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post?.id]);

  // Toggle like/unlike
  const toggleLike = async () => {
    if (!user || !post?.id) return;

    try {
      if (isLiked) {
        await axios.post("/api/unlike-post", {
          post_id: post.id,
          user_id: user.id,
        });
        setIsLiked(false);
      } else {
        await axios.post("/api/like-post", {
          post_id: post.id,
          user_id: user.id,
        });
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  if (!post) {
    return (
      <Card className="max-w-4xl mx-auto mb-6 shadow-md border-eco-primary-soft p-4">
        <div className="text-gray-500 text-center">No post data available.</div>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto mb-6 shadow-md border-eco-primary-soft p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT SIDE - MEDIA */}
        <div className="md:w-1/2 w-full flex items-center justify-center">
          {post.image_url && post.image_url.length > 0 ? (
            <Stack
              randomRotation={true}
              sensitivity={180}
              sendToBackOnClick={false}
              cardDimensions={{ width: 300, height: 210 }}
              cardsData={post.image_url.map((img, index) => ({
                id: index,
                img: img,
              }))}
            />
          ) : (
            <div className="text-sm text-gray-500">No image</div>
          )}
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="md:w-1/2 w-full flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center space-x-3 mb-2">
              <Avatar>
                <AvatarFallback className="bg-eco-primary-soft text-eco-text-dark">
                  {post ? (
                    <p className="text-3xl bg-eco-primarySoft w-full text-center">
                      {post.profiles?.display_name.charAt(0)}
                    </p>
                  ) : (
                    "U"
                  )}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold text-eco-text-dark">
                  {post ? post.profiles?.display_name : "Unknown"}
                </p>
                <p className="text-sm text-gray-500">
                  {TimeFormatter(post.updated_at)}
                </p>
              </div>
            </div>

            {/* Description */}
            <p
              className="text-eco-text-dark text-sm mb-3 line-clamp-4 cursor-pointer"
              onClick={() => {
                router.push(`/post/${post.id}`);
              }}
            >
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-bold rounded-full underline bg-eco-primary-soft text-eco-text-dark"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats + Actions */}
          <div>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" /> {likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />{" "}
                  {post.comments_count || 0}
                </span>
             
              </div>
            </div>

            <Separator className="bg-eco-primary-soft my-2" />

            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={toggleLike}
                className={`flex items-center gap-2 ${
                  isLiked ? "text-red-500" : "text-gray-700"
                }`}
              >
                <Heart className={`h-5 w-5 mr-2`} /> Like
              </Button>

              <Button
                variant="ghost"
                className="text-eco-text-dark hover:bg-eco-primary-soft/50"
              >
                <MessageCircle className="h-5 w-5 mr-2" /> Comment
              </Button>

              <Button
                variant="ghost"
                className="text-eco-text-dark hover:bg-eco-primary-soft/50"
              >
                <Share2 className="h-5 w-5 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PostCard;

"use client";

import { PostData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Triangle } from "react-loader-spinner";
import PostCard from "./PostCard";
import { motion, AnimatePresence } from "framer-motion";
type PostCardContainerProps = {
  currentUserPost?: string;
  refreshFeed?: boolean;
};
const PostCardContainer = ({
  currentUserPost = "",
  refreshFeed,
}: PostCardContainerProps) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/get-post");
        setPosts(response.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refreshFeed]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Triangle
          visible={true}
          height="90"
          width="90"
          color="#4fa94d"
          ariaLabel="triangle-loading"
        />
      </div>
    );

  if (error) return <p>Error: {error}</p>;

  // Ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];

  // Filter based on current user ID
  const filteredPosts =
    currentUserPost && currentUserPost.trim() !== ""
      ? safePosts.filter((post) => post.profiles?.id === currentUserPost)
      : safePosts;

  if (currentUserPost && filteredPosts.length === 0) {
    return <p className="text-center text-gray-500 py-10">No posts yet</p>;
  }

  return (
    <AnimatePresence>
      <div>
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.98, height: "auto" }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0, padding: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
              height: { duration: 0.25 },
            }}
            style={{ overflow: "hidden" }} // helps height animation
            layout //  makes layout changes smooth
          >
            <PostCard
              post={post}
              onDelete={(id) => {
                setPosts((prev) => prev.filter((p) => p.id !== id));
              }}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default PostCardContainer;

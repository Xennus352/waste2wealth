"use client";

import { PostData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Triangle } from "react-loader-spinner";
import PostCard from "./PostCard";

const PostCardContainer = ({
  currentUserPost = "",
}: {
  currentUserPost?: string;
}) => {
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
  }, []);

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
    <div>
      {filteredPosts.map((post) => (
        <div key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostCardContainer;

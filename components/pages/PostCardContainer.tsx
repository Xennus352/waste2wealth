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

  //   fetch post
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
      <div className=" flex items-center justify-center min-h-screen">
        <Triangle
          visible={true}
          height="90"
          width="90"
          color="#4fa94d"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );

  if (error) return <p>Error: {error}</p>;

  console.log("All Posts", posts);

  console.log("Current user id", currentUserPost);
  return (
    <div>
      {(() => {
        let safePosts = Array.isArray(posts) ? posts : [];

        let filteredPosts =
          currentUserPost && currentUserPost.trim() !== ""
            ? safePosts.filter((post) => post.profiles?.id === currentUserPost)
            : safePosts;

        // Make 100% sure it's always an array
        filteredPosts = Array.isArray(filteredPosts) ? filteredPosts : [];

        // No posts from that user
        if (currentUserPost && filteredPosts.length === 0) {
          return (
            <p className="text-center text-gray-500 py-10">No posts yet</p>
          );
        }

        return filteredPosts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        ));
      })()}
      {(() => {
        // Normalize ID → if undefined or null → treat as empty string
        const userId = currentUserPost ? currentUserPost.trim() : "";

        // Guarantee posts is always array
        const safePosts = Array.isArray(posts) ? posts : [];

        // Filter only when userId is NOT empty
        const filteredPosts =
          userId !== ""
            ? safePosts.filter((post) => post.profiles?.id === userId)
            : safePosts;

       

        // Render posts
        return filteredPosts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        ));
      })()}
    </div>
  );
};

export default PostCardContainer;

"use client";

import { PostCard } from "@/components/pages/PostCard";
import PostCardContainer from "@/components/pages/PostCardContainer";
import { PostCreator } from "@/components/pages/PostCreator";


export default function Home() {
  
  return (
    <div className="min-h-screen bg-eco-background p-4 sm:p-6">
      <div className="space-y-6">
        {/* Post Creation Section */}
        <PostCreator />

        {/* --- Feed Separator --- */}
        <div className="max-w-2xl mx-auto pt-4">
          <h2 className="text-xl font-bold text-eco-text-dark mb-4">
            Latest Eco-Activity
          </h2>
        </div>

        {/* Post Feed Section */}
        <div className="space-y-6 ">
          <PostCardContainer />
        </div>
      </div>
    </div>
  );
}

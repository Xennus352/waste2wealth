"use client";

import EcoRecycleLanding from "@/components/pages/EcoRecycleLanding";
import PostCardContainer from "@/components/pages/PostCardContainer";
import { PostCreator } from "@/components/pages/PostCreator";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Home() {
  const [refreshFeed, setRefreshFeed] = useState<boolean>(false);
 const user = useAuth();


  // function to trigger feed refresh
  const triggerRefresh = () => setRefreshFeed((prev) => !prev);
  return user ? (
    // when user is login
    <div className="min-h-screen bg-eco-background p-4 sm:p-6">
      <div className="space-y-6">
        {/* Post Creation Section */}
        <PostCreator onPostCreated={triggerRefresh} />

        {/* --- Feed Separator --- */}
        <div className="max-w-2xl mx-auto pt-4">
          <h2 className="text-xl font-bold text-eco-text-dark mb-4">
            Latest Eco-Activity
          </h2>
        </div>

        {/* Post Feed Section */}
        <div className="space-y-6 ">
          <PostCardContainer refreshFeed={refreshFeed} />
        </div>
      </div>
    </div>
  ) : (
    <EcoRecycleLanding />
  );
}

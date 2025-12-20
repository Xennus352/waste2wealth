"use client";

import { Button } from "@/components/ui/button";
import { PostData } from "@/types";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostClient({ post }: { post: PostData }) {
  const router = useRouter();
  const images: string[] = Array.isArray(post.image_url) ? post.image_url : [];

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="w-full mx-auto p-4">
      <Button
        variant={"ghost"}
        onClick={handleBack}
        className="border rounded-xl mb-4  hover:border-eco-primary"
      >
        <ChevronLeft /> Go Back
      </Button>

      {/* ✅ Image rendering */}
      {images.length === 1 && (
        <div className=" w-full flex items-center justify-center gap-2 h-20">
          {/* set height */}
          <img
            src={images[0]}
            alt="Post image"
            className="object-cover w-60 rounded-xl"
          />
        </div>
      )}

      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Post image ${i + 1}`}
              className="w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      {/* description of the post  */}
      <div className="mt-10">
        <p className=" whitespace-pre-wrap">{post.description} </p>
        <div className="flex flex-wrap gap-2 m-2 w-full justify-end">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 rounded-full bg-eco-primary text-gray-200 border border-eco-primarySoft hover:bg-gray-700 transition "
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

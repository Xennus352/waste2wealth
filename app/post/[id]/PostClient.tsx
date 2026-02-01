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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-eco-primary/10 via-slate-50 to-emerald-50/20 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 🔙 Minimalist Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="group flex items-center gap-2 rounded-2xl bg-white/40 hover:bg-white backdrop-blur-md border border-white/50 px-5 py-5 transition-all shadow-sm hover:shadow-md"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-bold tracking-tight">
            Back to Explore
          </span>
        </Button>

        {/* 🖼 Dynamic Gallery */}
        <div className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white">
          {images.length === 1 ? (
            <img
              src={images[0]}
              alt="Post image"
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="grid grid-cols-12 gap-1 h-[500px]">
              {/* Main Featured Image */}
              <div
                className={`${images.length > 1 ? "col-span-8" : "col-span-12"} h-full overflow-hidden`}
              >
                <img
                  src={images[0]}
                  className="w-full h-full object-cover"
                  alt="Main"
                />
              </div>

              {/* Side Stack */}
              {images.length > 1 && (
                <div className="col-span-4 grid grid-rows-2 gap-1 h-full">
                  <img
                    src={images[1]}
                    className="w-full h-full object-cover"
                    alt="Detail 1"
                  />
                  {images.length > 2 ? (
                    <div className="relative h-full">
                      <img
                        src={images[2]}
                        className="w-full h-full object-cover"
                        alt="Detail 2"
                      />
                      {images.length > 3 && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            +{images.length - 2}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-eco-primary/10 flex items-center justify-center">
                      <span className="text-eco-primary font-medium italic">
                        Eco Craft
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 🌿 Floating Badge */}
          <div className="absolute top-6 right-6">
            <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-lg border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-eco-primary"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-800">
                Eco Craft Idea ♻️
              </span>
            </div>
          </div>
        </div>

        {/* 📝 Premium Article Body */}
        <article className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/40 p-8 md:p-12">
          {/* Subtle Decorative Element */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-eco-primary/5 rounded-full blur-3xl" />

          <div className="relative space-y-8">
            <div className="space-y-4">
              <div className="w-12 h-1 bg-eco-primary/30 rounded-full" />
              <p
                className=" whitespace-pre-wrap
    leading-snug
    text-lg
    text-gray-700
    [&_p]:my-1
    [&_li]:my-0"
              >
                {post.description}
              </p>
            </div>

            {/* 🏷 Interactive Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-100">
              {post.tags.map((tag, index) => (
                <button
                  key={index}
                  className="text-xs font-bold px-5 py-2.5 rounded-xl
                           bg-zinc-100 text-zinc-600
                           hover:bg-eco-primary hover:text-white hover:-translate-y-0.5
                           transition-all duration-300 shadow-sm"
                >
                  #{tag.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

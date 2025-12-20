import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg animate-pulse">
      {/* Product Image Skeleton */}
      <div className="h-56 w-full bg-gray-200 rounded-t-3xl"></div>

      {/* Info Panel Skeleton */}
      <div className="p-4 bg-white backdrop-blur-sm bg-opacity-80 flex flex-col gap-2">
        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
        {/* Description */}
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-2">
          <div className="h-5 w-20 bg-gray-300 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-12 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-14 bg-gray-300 rounded-full"></div>
        </div>

        {/* Order Section Skeleton */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center border rounded-xl border-gray-300 overflow-hidden">
            <div className="h-8 w-8 bg-gray-200"></div>
            <div className="h-8 w-12 bg-gray-300"></div>
            <div className="h-8 w-8 bg-gray-200"></div>
          </div>
          <div className="ml-auto h-8 w-24 bg-gray-300 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}

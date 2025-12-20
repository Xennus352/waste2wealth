"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coins, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function FiltersBar({ onFilterChange }: any) {
  const [filters, setFilters] = useState({
    material: "",
    sort: "",
  });
  const user = useAuth();

  const updateFilter = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="w-full flex  items-center gap-3 bg-white/20 backdrop-blur-lg shadow-sm border rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Icon */}
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <SlidersHorizontal size={18} /> Filters
        </div>

        {/* ⭐ MATERIAL FILTER*/}
        <Select onValueChange={(v) => updateFilter("material", v)}>
          <SelectTrigger className="w-40 rounded-xl">
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent className=" bg-eco-background">
            <SelectItem value="paper">Paper</SelectItem>
            <SelectItem value="plastic">Plastic</SelectItem>
            <SelectItem value="wood">Wood</SelectItem>
            <SelectItem value="metal">Metal</SelectItem>
            <SelectItem value="glass">Glass</SelectItem>
            <SelectItem value="tire">Tire</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select onValueChange={(v) => updateFilter("sort", v)}>
          <SelectTrigger className="w-40 rounded-xl">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className=" bg-eco-background">
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="old">Old</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}
        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              material: "",
              sort: "",
            });
            onFilterChange({
              material: "",
              sort: "",
            });
          }}
          className="rounded-xl text-sm"
        >
          Reset
        </Button>
      </div>
      {/* points  */}
      <div className="ml-auto font-medium ">
        <p className="flex items-center  gap-2">
          Balance:
          <span className=" flex items-center gap-1 text-yellow-500">
            {user?.points} <Coins />
          </span>
        </p>
      </div>
    </div>
  );
}

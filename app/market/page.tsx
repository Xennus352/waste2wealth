"use client";
import FiltersBar from "@/components/pages/FiltersBar";
import GuideCard from "@/components/pages/ProductCard";
import ProductCardSkeleton from "@/components/pages/ProductCardSkeleton";
import axios from "axios";
import { useEffect, useState } from "react";

interface Owner {
  id: string;
  display_name: string;
  avatar_url?: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  quality: number;
  photo?: string;
  tags: string[];
  ownerId: string;
  owner?: Owner | null;
  created_at: string;
  updated_at: string;
}

const Market = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cards, setCards] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/get-product");
        setProducts(response.data);
        setCards(response.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    );

  if (!products.length)
    return <p className=" text-center text-2xl m-2">No products found.</p>;

  const handleFilters = (filter: { material?: string; sort?: string }) => {
    console.log("Filter received:", filter);

    const materialFilter = filter?.material?.toLowerCase();
    const sortOption = filter?.sort;

    // Filter products by material
    let filteredCards = materialFilter
      ? products.filter((product) =>
          product.tags.some((tag) => tag.toLowerCase() === materialFilter)
        )
      : [...products]; // clone the array to avoid mutating original

    // Sort products by updated_at
    if (sortOption === "latest") {
      filteredCards = [...filteredCards].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } else if (sortOption === "old") {
      filteredCards = [...filteredCards].sort(
        (a, b) =>
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      );
    }

    console.log("Filtered & sorted cards:", filteredCards);
    setCards(filteredCards);
  };


  return (
    <div>
      <FiltersBar onFilterChange={handleFilters} />
      <div>
        {cards.length === 0 ? (
          <p className="text-center text-2xl m-2">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((product) => (
              <GuideCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;

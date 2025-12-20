"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface ProductImage {
  fileName: string;
  fileData: string; // Base64 string
}

interface ProductData {
  userId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  tags: string[];
  images?: ProductImage[];
}

const availableTags = [
  "Paper",
  "Plastic",
  "Wood",
  "Metal",
  "Glass",
  "Tire",
  "Other",
] as const;
type Tag = (typeof availableTags)[number];

export default function CreateProductForm() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAuth();

  const toggleTag = (tag: Tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value === "" ? "" : parseFloat(value));
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStock(value === "" ? "" : parseInt(value));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!title || !description || price === "" || stock === "") {
      toast.error("Please fill all required fields");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const imagesData: ProductImage[] = imageBase64
        ? [
            {
              fileName: `product-${user.id}-${Date.now()}-${Math.floor(
                Math.random() * 1000
              )}.jpg`,
              fileData: imageBase64.split(",")[1], // remove base64 prefix
            },
          ]
        : [];

      const productData: ProductData = {
        userId: user.id,
        title,
        description,
        price: Number(price),
        stock: Number(stock),
        tags,
        images: imagesData,
      };

      const response = await axios.post("/api/create-product", productData);

      console.log("Product created successfully:", response.data);
      toast.success("Product published successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setTags([]);
      setImageBase64("");
    } catch (err: any) {
      console.error(
        "Failed to create product:",
        err.response?.data || err.message
      );
      toast.error("Failed to create product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-4"
    >
      <h3 className="text-2xl font-bold mb-4 text-[#1B5E20]">
        Post a Recycled Product
      </h3>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[#A5D6A7] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
        />

        <textarea
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            // Auto-resize
            const target = e.target;
            target.style.height = "auto"; // reset height
            target.style.height = target.scrollHeight + "px"; // set new height
          }}
          className="w-full border border-[#A5D6A7] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price ($)"
            value={price}
            onChange={handlePriceChange}
            className="border border-[#A5D6A7] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
          />

          <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={handleStockChange}
            className="border border-[#A5D6A7] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
          />
        </div>
        {/* tags  */}
        <div>
          <p className="mb-2 font-medium text-[#1B5E20]">Tags</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full border ${
                  tags.includes(tag)
                    ? "bg-[#66BB6A] text-white border-[#66BB6A]"
                    : "border-[#A5D6A7] text-[#1B5E20]"
                } transition hover:scale-105`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        {/* image upload  */}
        <div>
          <p className="mb-2 font-medium text-[#1B5E20]">Upload Image</p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onloadend = () => setImageBase64(reader.result as string);
              reader.readAsDataURL(file);
            }}
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#A5D6A7] rounded-lg hover:border-[#66BB6A] hover:bg-[#F1F8F2] transition relative cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () =>
                  setImageBase64(reader.result as string);
                reader.readAsDataURL(file);
              }}
              className="hidden"
            />

            {imageBase64 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={imageBase64}
                  alt="Preview"
                  className="max-h-40 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageBase64("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center text-[#1B5E20]">
                <p className="font-semibold">Click or Drag & Drop to upload</p>
                <p className="text-sm text-[#4B9444]">Supported: JPG, PNG</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full py-3 rounded bg-[#2E7D32] text-white font-semibold hover:bg-[#66BB6A] transition"
        >
          {loading ? "Publishing..." : "Publish Product"}
        </button>
      </div>
    </motion.form>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Tag as TagIcon, Camera, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const PostCreator = () => {
  const user = useAuth();
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const MAX_IMAGES = 2;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    // Check max limit
    if (mediaFiles.length + fileArray.length > MAX_IMAGES) {
      toast.error("You can upload a maximum of 2 images only");
      return;
    }

    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));

    setMediaFiles((prev) => [...prev, ...fileArray]);
    setMediaPreviews((prev) => [...prev, ...newPreviews]);

    // Reset input so same file can be reselected
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePost = async () => {
    if (!text && mediaFiles.length === 0) return;

    setLoading(true);
    try {
      const imagesPayload = await Promise.all(
        mediaFiles.map(
          (file) =>
            new Promise<{ fileName: string; fileData: string }>(
              (resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                  const base64String = (reader.result as string).split(",")[1];
                  resolve({ fileName: file.name, fileData: base64String });
                };
                reader.onerror = () => reject("Failed to read file");
              }
            )
        )
      );

      await axios.post("/api/create-post", {
        userId: user?.id,
        description: text,
        tags,
        images: imagesPayload,
      });

      toast.success("Post created!");
      router.refresh();
      setText("");
      setTags([]);
      setMediaFiles([]);
      setMediaPreviews([]);
    } catch (err) {
      console.error("Failed to create post:", err);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-gradient-to-br from-green-50 to-green-100 shadow-2xl">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your eco-project, tip, or upcycling idea..."
        className="w-full resize-none rounded-2xl p-4 border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-300 shadow-sm text-green-900 placeholder-green-700 transition-all min-h-[100px] lg:min-h-[140px]"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {["Paper", "Plastic", "Wood", "Metal", "Glass", "Tire", "Other"].map(
          (tag) => (
            <Button
              key={tag}
              variant={tags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => handleAddTag(tag)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                tags.includes(tag)
                  ? "bg-green-500 text-white"
                  : "text-green-800 border-green-300"
              }`}
            >
              <TagIcon className="w-3 h-3" />
              <span className="text-xs">{tag}</span>
            </Button>
          )
        )}
      </div>

      {mediaPreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaPreviews.map((src, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden border border-green-300 shadow-inner"
            >
              <img
                src={src}
                alt="preview"
                className="w-full h-40 object-cover"
              />
              <button
                onClick={() => removeMedia(idx)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-end mt-5 space-y-3 lg:space-y-0 lg:space-x-3">
        <input
          id="media-upload-input"
          type="file"
          accept="image/*"
          onChange={handleMediaUpload}
          multiple
          hidden
        />
        <Button
          onClick={() => document.getElementById("media-upload-input")?.click()}
          variant="outline"
          className="flex items-center space-x-2 border-green-300 text-green-700 hover:bg-green-200 hover:text-green-900"
        >
          <Camera className="w-4 h-4" />
          <span>Add Media</span>
        </Button>

        <Button
          onClick={handlePost}
          disabled={!text && mediaFiles.length === 0}
          className={`bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-green-700 transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

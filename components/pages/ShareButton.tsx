import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, X } from "lucide-react";
import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
  ViberShareButton,
  ViberIcon,
  TelegramIcon,
  TelegramShareButton,
} from "react-share";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DialogOverlay } from "@radix-ui/react-dialog";

export default function ShareButton({ post }: any) {
  const [open, setOpen] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/post/${post?.id}`;
  // to copy the post link
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Copyed the link.");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-eco-text-dark hover:bg-eco-primary-soft flex items-center"
          onClick={() => setOpen(true)}
        >
          <Share2 className="h-5 w-5 mr-2" /> Share
        </Button>
      </DialogTrigger>

      <DialogContent className="!p-0 [&>button]:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="bg-eco-background w-full dark:bg-gray-900 rounded-md shadow-2xl p-6 flex flex-col gap-4 relative"
        >
          {/*  close button */}
          <Button
            variant={"ghost"}
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-black hover:text-gray-800 dark:hover:text-gray-200 text-lg font-bold"
          >
            <X color="black"/>
          </Button>

          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
              Share this post
            </DialogTitle>
          </DialogHeader>

          {/* Share buttons */}
          <div className="flex justify-around items-center mt-2">
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={48} round />
            </FacebookShareButton>

            <TelegramShareButton url={shareUrl}>
              <TelegramIcon size={48} round />
            </TelegramShareButton>

            <ViberShareButton url={shareUrl}>
              <ViberIcon size={48} round />
            </ViberShareButton>

            <EmailShareButton url={shareUrl}>
              <EmailIcon size={48} round />
            </EmailShareButton>
          </div>

          {/* Copy link */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
            />
            <Button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-white text-sm"
            >
              Copy
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

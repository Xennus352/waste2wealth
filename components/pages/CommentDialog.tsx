"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Trash, TrashIcon, X } from "lucide-react";
import { CommentWithUser } from "@/types";
import { TimeFormatter } from "@/utils/timeFormatter";
import { createClient } from "@/lib/supabase/client";

type CommentDialogProps = {
  postId: string;
  currentUserId: string;
};

export const CommentDialog = ({
  postId,
  currentUserId,
}: CommentDialogProps) => {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/get-comment/${postId}`);
      setComments(res.data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };
  const supabase = createClient();
  // realtime comment
  useEffect(() => {
    const commentChannel = supabase.channel(`comments-post-${postId}`);

    commentChannel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          const newComment = payload.new as CommentWithUser;
          setComments((prev) => {
            if (prev.find((c) => c.id === newComment.id)) return prev;
            return [...prev, newComment];
          });
          scrollToBottom();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          console.log("DELETE payload:", payload);
          const deletedComment = payload.old as CommentWithUser;
          setComments((prev) => prev.filter((c) => c.id !== deletedComment.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/add-comment", {
        postId,
        userId: currentUserId,
        text: newComment,
      });

      setNewComment("");
      scrollToBottom();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send comment");
    } finally {
      setLoading(false);
    }
  };

  // delete comment
  const handleDeleteComment = async (comment_id: string) => {
    try {
      await axios.post("/api/delete-comment/", { comment_id });
      // Remove from UI
      setComments((prev) =>
        prev.filter((comment) => comment.id !== comment_id)
      );
      toast.success("Comment deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  // Typing indicator (dummy for trend effect)
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // typing effect realtime
  useEffect(() => {
    if (!newComment.trim()) return;

    // Send "typing" broadcast
    supabase.channel(`comments-typing-${postId}`).send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId: currentUserId,
        typing: true,
      },
    });

    const timeout = setTimeout(() => {
      supabase.channel(`comments-typing-${postId}`).send({
        type: "broadcast",
        event: "typing",
        payload: {
          userId: currentUserId,
          typing: false,
        },
      });
    }, 2000); // stop typing after 2s of inactivity

    return () => clearTimeout(timeout);
  }, [newComment]);

  useEffect(() => {
    const typingSubscription = supabase
      .channel(`comments-typing-${postId}`)
      .on("broadcast", { event: "typing" }, (payload: any) => {
        const { userId, typing } = payload.payload;
        setTypingUsers((prev) => {
          if (typing) {
            if (!prev.includes(userId)) return [...prev, userId];
          } else {
            return prev.filter((id) => id !== userId);
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(typingSubscription);
    };
  }, [postId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors cursor-pointer font-semibold">
          <MessageCircle className="h-5 w-5" />
          Comment
        </div>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md sm:max-w-lg bg-eco-primarySoft dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col h-[80vh] p-5">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-2xl font-bold">
            Comments
          </DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300 text-sm mt-1">
            Join the conversation about this post
          </DialogDescription>
        </DialogHeader>

        {/* Comment List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto mt-4 flex flex-col gap-3 px-1"
        >
          <AnimatePresence initial={false}>
            {comments?.map((c: any) => {
              const isMine = c.user_id === currentUserId;
              const createdAt = new Date(Date.parse(c.created_at + "Z"));

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: isMine ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isMine ? 50 : -50 }}
                  transition={{ duration: 0.25 }}
                  className={`max-w-[80%] p-4 rounded-2xl break-words shadow-md relative
            ${
              isMine
                ? "ml-auto bg-green-500 text-white"
                : "mr-auto bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            }`}
                >
                  <div className="flex justify-between items-center mb-1 text-sm font-semibold">
                    <span>{isMine ? "You" : c?.profiles?.display_name}</span>
                    <span className="text-xs indent-11 text-gray-500 dark:text-gray-400">
                      {TimeFormatter(createdAt)}
                    </span>
                  </div>
                  <div className="text-base leading-relaxed">{c.content}</div>

                  {isMine && (
                    <button
                      onClick={() => {
                        handleDeleteComment(c.id);
                      }}
                      className="absolute top-0 -right-1 text-xs text-red-600 hover:text-red-400"
                      title="Delete comment"
                    >
                      <X />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* typing effect  */}
        <div className="mt-2 min-h-1 text-sm text-gray-500 dark:text-gray-400">
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1"
            >
              <span>
                {typingUsers.length === 1
                  ? "Someone is typing..."
                  : "Multiple users are typing..."}
              </span>
              <span className="flex gap-1">
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-1 h-1 bg-gray-500 rounded-full"
                />
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-1 h-1 bg-gray-500 rounded-full"
                />
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-1 h-1 bg-gray-500 rounded-full"
                />
              </span>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2 items-center">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            placeholder="Write your comment..."
            className="flex-1 p-4 rounded-3xl border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-300 resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base leading-relaxed"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !newComment.trim()}
            className={`px-6 py-2 rounded-3xl bg-green-500 hover:bg-green-400 text-white shadow-lg transition-all ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

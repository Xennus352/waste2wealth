import type { User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  display_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
};

export type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
};

export type Like = {
  id: string;
  user_id: string;
};

export type Comment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type CommentWithUser = {
  id: string;
  user_id: string;
  content: string;
  created_at: Date;
  users: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
};

export type Share = {
  id: string;
  user_id: string;
};

export type PostData = {
  id: string;
  user_id: string;
  description: string;
  tags: string[];
  image_url: string[];
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
  likes?: Like[];
  comments?: CommentWithUser[];
  shares?: Share[];
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
};

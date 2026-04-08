import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Comment, Post, Story } from '../types/models';
import { makeMockPosts, makeMockStories } from '../mock/mockFeed';
import { uuid } from '../utils/uuid';

type FeedState = {
  stories: Story[];
  posts: Post[];
  comments: Comment[];
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  markStorySeen: (storyId: string) => void;
  resetMock: () => void;
};

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      stories: makeMockStories(),
      posts: makeMockPosts(),
      comments: [],
      toggleLike: (postId) => {
        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;
            const liked = !p.liked;
            return {
              ...p,
              liked,
              likeCount: Math.max(0, p.likeCount + (liked ? 1 : -1)),
            };
          }),
        }));
      },
      toggleSave: (postId) => {
        set((state) => ({
          posts: state.posts.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p)),
        }));
      },
      addComment: (postId, text) => {
        const newComment: Comment = {
          id: uuid(),
          postId,
          authorName: 'Tú',
          authorAvatarSeed: 'me',
          createdAt: Date.now(),
          text,
        };
        set((state) => ({
          comments: [newComment, ...state.comments],
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p,
          ),
        }));
      },
      markStorySeen: (storyId) => {
        set((state) => ({
          stories: state.stories.map((s) => (s.id === storyId ? { ...s, seen: true } : s)),
        }));
      },
      resetMock: () => set({ stories: makeMockStories(), posts: makeMockPosts(), comments: [] }),
    }),
    {
      name: 'prox-feed-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);

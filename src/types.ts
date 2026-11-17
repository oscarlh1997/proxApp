export type RelationshipStatus =
  | 'no_especificado' | 'soltero' | 'soltera' | 'en_relacion' | 'casado' | 'casada' | 'es_complicado';

export type SocialLink = { id?: string; platform: string; url: string; handle: string };

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarSeed: string;
  relationshipStatus: RelationshipStatus;
  interests: string[];
  socialLinks: SocialLink[];
  visible: boolean;
};

export type NearbyUser = UserProfile & { distanceM: number };

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatarSeed: string;
  createdAt: number;
  text: string;
  tags: string[];
  liked: boolean;
  saved: boolean;
  likeCount: number;
  commentCount: number;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarSeed: string;
  createdAt: number;
  text: string;
};

export type Conversation = {
  id: string;
  other: { id: string; displayName: string; avatarSeed: string };
  lastText: string | null;
  lastAt: number | null;
  lastFromMe: boolean;
};

export type Message = { id: string; conversationId: string; senderId: string; text: string; createdAt: number };

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted';

export type ConnectionItem = {
  userId: string;
  status: 'pending' | 'accepted';
  displayName: string;
  avatarSeed: string;
  createdAt: number;
};

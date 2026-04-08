export type Bucket = 'NEAR' | 'MID' | 'FAR' | 'OUT';

export type SocialLink = {
  id?: string;
  platform: string;
  url: string;
  handle: string;
};

export type RelationshipStatus = 'soltero' | 'soltera' | 'en_relacion' | 'casado' | 'casada' | 'es_complicado' | 'no_especificado';

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
  latitude?: number;
  longitude?: number;
};

export type NearbyUser = {
  rpi?: string;
  id?: string;
  displayName: string;
  avatarSeed: string;
  tags?: string[];
  interests?: string[];
  socialLinks?: SocialLink[];
  bio?: string;
  relationshipStatus?: string;
  distanceM: number;
  angleDeg?: number;
  bucket?: Bucket;
  lastSeenAt?: number;
};

export type Story = {
  id: string;
  userName: string;
  avatarSeed: string;
  seen: boolean;
};

export type Post = {
  id: string;
  authorId?: string;
  authorName: string;
  authorUsername?: string;
  authorAvatarSeed: string;
  createdAt: number;
  text: string;
  tags: string[];
  liked: boolean;
  saved: boolean;
  likeCount: number;
  commentCount: number;
  imageUrl?: string;
};

export type Comment = {
  id: string;
  postId: string;
  authorName: string;
  authorAvatarSeed: string;
  createdAt: number;
  text: string;
};

export type Conversation = {
  id: string;
  members: { id: string; display_name: string; avatar_seed: string }[];
  lastText: string | null;
  lastAt: number | null;
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarSeed: string;
  text: string;
  createdAt: number;
};

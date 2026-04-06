export type Bucket = 'NEAR' | 'MID' | 'FAR' | 'OUT';

export type NearbyUser = {
  rpi: string; // id efímero rotatorio
  displayName: string;
  avatarSeed: string;
  tags: string[];
  distanceM: number; // aprox
  angleDeg: number;  // cosmético (o UWB si existiese)
  bucket: Bucket;
  lastSeenAt: number;
};

export type Story = {
  id: string;
  userName: string;
  avatarSeed: string;
  seen: boolean;
};

export type Post = {
  id: string;
  authorName: string;
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
  authorName: string;
  authorAvatarSeed: string;
  createdAt: number;
  text: string;
};

import { API_BASE } from './config';
import { useAuth } from '../store';
import type {
  Comment, ConnectionItem, ConnectionStatus, Conversation, Message, NearbyUser, Post, SocialLink, UserProfile,
  RelationshipStatus,
} from '../types';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { token } = useAuth.getState();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      `No se puede conectar con ${API_BASE}. Comprueba que el backend está arrancado y que el móvil está en la misma Wi-Fi.`,
      0,
    );
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => null);
  if (res.status === 401 && token) useAuth.getState().logout();
  if (!res.ok) throw new ApiError(data?.message || `Error ${res.status}`, res.status);
  return data as T;
}

type AuthResult = { token: string; user: { id: string; username: string; displayName: string } };
type ProfileUpdate = Partial<{
  displayName: string; bio: string; relationshipStatus: RelationshipStatus;
  interests: string[]; socialLinks: SocialLink[]; visible: boolean;
}>;

export const api = {
  register: (b: { username: string; email: string; password: string; displayName?: string }) =>
    request<AuthResult>('POST', '/api/auth/register', b),
  login: (b: { email: string; password: string }) => request<AuthResult>('POST', '/api/auth/login', b),

  getMe: () => request<UserProfile>('GET', '/api/profile/me'),
  updateMe: (b: ProfileUpdate) => request<UserProfile>('PUT', '/api/profile/me', b),
  getUser: (id: string) => request<UserProfile>('GET', `/api/profile/${id}`),

  updateLocation: (latitude: number, longitude: number) =>
    request<{ ok: true }>('POST', '/api/location', { latitude, longitude }),
  getNearby: (radiusKm = 0.5) => request<NearbyUser[]>('GET', `/api/nearby?radius=${radiusKm}`),

  getFeed: (limit = 20, offset = 0) => request<Post[]>('GET', `/api/feed?limit=${limit}&offset=${offset}`),
  createPost: (text: string, tags: string[] = []) => request<{ id: string }>('POST', '/api/posts', { text, tags }),
  toggleLike: (id: string) => request<{ liked: boolean; likeCount: number }>('POST', `/api/posts/${id}/like`),
  toggleSave: (id: string) => request<{ saved: boolean }>('POST', `/api/posts/${id}/save`),
  getComments: (id: string) => request<Comment[]>('GET', `/api/posts/${id}/comments`),
  addComment: (id: string, text: string) => request<{ id: string }>('POST', `/api/posts/${id}/comments`, { text }),

  getConversations: () => request<Conversation[]>('GET', '/api/conversations'),
  openConversation: (targetUserId: string) => request<{ id: string }>('POST', '/api/conversations', { targetUserId }),
  getMessages: (id: string) => request<Message[]>('GET', `/api/conversations/${id}/messages`),
  sendMessage: (id: string, text: string) => request<Message>('POST', `/api/conversations/${id}/messages`, { text }),

  connect: (userId: string) => request<{ status: ConnectionStatus }>('POST', `/api/connect/${userId}`),
  connectionWith: (userId: string) => request<{ status: ConnectionStatus }>('GET', `/api/connections/with/${userId}`),
  getConnections: () => request<{ sent: ConnectionItem[]; received: ConnectionItem[] }>('GET', '/api/connections'),
  acceptConnection: (userId: string) => request<{ status: ConnectionStatus }>('PUT', `/api/connections/${userId}/accept`),
  rejectConnection: (userId: string) => request<{ status: ConnectionStatus }>('DELETE', `/api/connections/${userId}`),

  seed: () => request<{ message: string }>('POST', '/api/seed'),
  demoNearby: () => request<{ message: string }>('POST', '/api/dev/demo-nearby'),
};

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Algo ha fallado');

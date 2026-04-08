import { API_BASE } from './config';
import { useAuthStore } from '../store/useAuthStore';

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...((opts.headers as any) || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (res.status === 401) { useAuthStore.getState().logout(); throw new Error('Unauthorized'); }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

export const api = {
  // Auth
  register: (body: any) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  // Profile
  getMe: () => apiFetch('/api/profile/me'),
  updateMe: (body: any) => apiFetch('/api/profile/me', { method: 'PUT', body: JSON.stringify(body) }),
  getUser: (id: string) => apiFetch(`/api/profile/${id}`),

  // Location / Nearby
  updateLocation: (lat: number, lon: number) => apiFetch('/api/location', { method: 'POST', body: JSON.stringify({ latitude: lat, longitude: lon }) }),
  getNearby: (radius = 0.5) => apiFetch(`/api/nearby?radius=${radius}`),

  // Feed
  getFeed: (limit = 20, offset = 0) => apiFetch(`/api/feed?limit=${limit}&offset=${offset}`),
  createPost: (text: string, tags: string[]) => apiFetch('/api/posts', { method: 'POST', body: JSON.stringify({ text, tags }) }),
  toggleLike: (postId: string) => apiFetch(`/api/posts/${postId}/like`, { method: 'POST' }),
  toggleSave: (postId: string) => apiFetch(`/api/posts/${postId}/save`, { method: 'POST' }),

  // Comments
  getComments: (postId: string) => apiFetch(`/api/posts/${postId}/comments`),
  addComment: (postId: string, text: string) => apiFetch(`/api/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),

  // Messages
  getConversations: () => apiFetch('/api/conversations'),
  createConversation: (targetUserId: string) => apiFetch('/api/conversations', { method: 'POST', body: JSON.stringify({ targetUserId }) }),
  getMessages: (convoId: string) => apiFetch(`/api/conversations/${convoId}/messages`),
  sendMessage: (convoId: string, text: string) => apiFetch(`/api/conversations/${convoId}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),

  // Connections
  connect: (userId: string) => apiFetch(`/api/connect/${userId}`, { method: 'POST' }),
  getConnections: () => apiFetch('/api/connections'),
  acceptConnection: (requesterId: string) => apiFetch(`/api/connections/${requesterId}/accept`, { method: 'PUT' }),

  // Seed
  seed: () => apiFetch('/api/seed', { method: 'POST' }),
};

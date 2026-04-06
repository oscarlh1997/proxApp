import { Post, Story } from '../types/models';
import { uuid } from '../utils/uuid';

export function makeMockStories(): Story[] {
  const names = ['Ana','Luis','Mar','Pablo','Sara','Iván','Carmen','Diego'];
  return names.map((n) => ({
    id: uuid(),
    userName: n,
    avatarSeed: n.toLowerCase(),
    seen: false,
  }));
}

export function makeMockPosts(): Post[] {
  const posts: Array<Pick<Post, 'authorName'|'text'|'tags'>> = [
    { authorName: 'Ana', text: '¿Alguien para café y hablar de ML?', tags: ['ML','Café'] },
    { authorName: 'Luis', text: 'Busco gente para correr trail este finde.', tags: ['Trail'] },
    { authorName: 'Mar', text: 'Estoy en el coworking: networking y UI/UX!', tags: ['UI/UX'] },
    { authorName: 'Pablo', text: '¿Quién va al meetup de Cloud hoy?', tags: ['Cloud'] },
  ];
  return posts.map((p) => ({
    id: uuid(),
    authorName: p.authorName,
    authorAvatarSeed: p.authorName.toLowerCase(),
    createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 6),
    text: p.text,
    tags: p.tags,
    liked: false,
    saved: false,
    likeCount: Math.floor(Math.random() * 120),
    commentCount: Math.floor(Math.random() * 30),
  }));
}

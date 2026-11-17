export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  handle: string;
}

export const RELATIONSHIP_STATUSES = [
  'no_especificado', 'soltero', 'soltera', 'en_relacion', 'casado', 'casada', 'es_complicado',
] as const;
export type RelationshipStatus = (typeof RELATIONSHIP_STATUSES)[number];

/** Perfil visible para otros usuarios: nunca incluye coordenadas exactas. */
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarSeed: string;
  relationshipStatus: RelationshipStatus;
  interests: string[];
  socialLinks: SocialLink[];
  visible: boolean;
}

export interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  avatarSeed?: string;
  relationshipStatus?: RelationshipStatus;
  interests?: string[];
  socialLinks?: SocialLink[];
  visible?: boolean;
}

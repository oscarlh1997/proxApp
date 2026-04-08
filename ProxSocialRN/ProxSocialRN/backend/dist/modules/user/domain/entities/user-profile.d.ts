export interface SocialLink {
    id?: string;
    platform: string;
    url: string;
    handle: string;
}
export type RelationshipStatus = 'soltero' | 'soltera' | 'en_relacion' | 'casado' | 'casada' | 'es_complicado' | 'no_especificado';
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
    latitude?: number | null;
    longitude?: number | null;
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

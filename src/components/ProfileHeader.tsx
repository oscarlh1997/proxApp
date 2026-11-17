import React from 'react';
import { Text, View } from 'react-native';
import { C, T } from '../theme';
import { UserProfile } from '../types';
import { RELATIONSHIP_LABELS } from '../utils/format';
import { Avatar } from './Avatar';
import { Chip } from './Chip';
import { SocialLinkRow } from './Social';

/** Cabecera común de "mi perfil" y el perfil de otra persona. */
export function ProfileHeader({ profile, distance, sharedInterests = [], children }: {
  profile: UserProfile; distance?: string; sharedInterests?: string[]; children?: React.ReactNode;
}) {
  const status = profile.relationshipStatus !== 'no_especificado' ? RELATIONSHIP_LABELS[profile.relationshipStatus] : null;
  return (
    <View>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 10 }}>
        <Avatar name={profile.displayName} seed={profile.avatarSeed} size={84} />
        <View>
          <Text style={T.display}>{profile.displayName}</Text>
          <Text style={T.meta}>@{profile.username}</Text>
          {distance ? <Text style={{ color: C.signal, fontWeight: '700', marginTop: 2 }}>A {distance} de ti</Text> : null}
        </View>
        {status && (
          <View style={{ alignSelf: 'flex-start', backgroundColor: C.pulseSoft, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 }}>
            <Text style={{ color: C.pulse, fontWeight: '700', fontSize: 13 }}>{status}</Text>
          </View>
        )}
        {profile.bio ? <Text style={[T.body, { fontSize: 16, lineHeight: 23 }]}>{profile.bio}</Text> : null}
        {children}
      </View>

      {profile.interests.length > 0 && (
        <Section title="Intereses">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {profile.interests.map((t) => <Chip key={t} label={t} highlight={sharedInterests.includes(t)} />)}
          </View>
        </Section>
      )}

      {profile.socialLinks.length > 0 && (
        <Section title="En otras redes">
          {profile.socialLinks.map((l, i) => (
            <SocialLinkRow key={l.id ?? i} link={l} last={i === profile.socialLinks.length - 1} />
          ))}
        </Section>
      )}
    </View>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: C.line }}>
      <Text style={[T.title, { fontSize: 18, marginBottom: 10 }]}>{title}</Text>
      {children}
    </View>
  );
}

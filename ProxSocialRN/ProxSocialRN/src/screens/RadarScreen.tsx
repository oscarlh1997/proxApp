import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, RefreshControl, ScrollView, Switch, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { RadarSvg } from '../components/RadarSvg';
import { NearbyUserCard } from '../components/NearbyUserCard';
import { api } from '../api/client';
import { NearbyUser } from '../types/models';
import { hashToAngleDeg } from '../utils/hash';
import { useNavigation } from '@react-navigation/native';

export default function RadarScreen() {
  const nav = useNavigation<any>();
  const [nearby, setNearby] = useState<NearbyUser[]>([]);
  const [visible, setVisible] = useState(true);
  const [scanning, setScanning] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      // Update own location (use device GPS or mock for testing)
      try {
        // In a real app, use Geolocation API. For testing, we use Madrid center with slight random offset.
        const lat = 40.4168 + (Math.random() - 0.5) * 0.002;
        const lon = -3.7038 + (Math.random() - 0.5) * 0.002;
        await api.updateLocation(lat, lon);
      } catch {}

      if (scanning) {
        const data = await api.getNearby(0.5);
        // Enrich with radar display data
        const enriched: NearbyUser[] = data.map((u: any) => ({
          ...u,
          angleDeg: hashToAngleDeg(u.id || u.username || ''),
          bucket: u.distanceM <= 50 ? 'NEAR' : u.distanceM <= 150 ? 'MID' : 'FAR',
          tags: u.interests,
          lastSeenAt: Date.now(),
        }));
        setNearby(enriched);
      }
    } catch {}
  }, [scanning]);

  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, [load]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleVisibleChange = async (v: boolean) => {
    setVisible(v);
    try { await api.updateMe({ visible: v }); } catch {}
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text }}>Radar</Text>
        <Text style={{ color: Colors.subtext, marginTop: 6 }}>
          Descubre personas cerca de ti. La distancia es aproximada por GPS.
        </Text>

        <View style={{ marginTop: 12 }}>
          <RadarSvg users={nearby} size={320} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: Colors.text, fontWeight: '700', flex: 1 }}>Visible para otros</Text>
          <Switch value={visible} onValueChange={handleVisibleChange} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: Colors.text, fontWeight: '700', flex: 1 }}>Escanear cercanos</Text>
          <Switch value={scanning} onValueChange={setScanning} />
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text, marginTop: 14 }}>
        Personas detectadas ({nearby.length})
      </Text>
      <View style={{ marginTop: 10 }}>
        {nearby.length === 0 ? (
          <Text style={{ color: Colors.subtext }}>
            No hay personas en rango. Tira hacia abajo para refrescar.
          </Text>
        ) : (
          nearby.map((u) => (
            <NearbyUserCard key={u.id || u.rpi} user={u}
              onConnect={() => nav.navigate('UserDetail', { userId: u.id, nearbyUser: u })} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

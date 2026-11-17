import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Switch, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { api, errorMessage } from '../api/client';
import { useMe } from '../store';
import { C, T } from '../theme';
import { NearbyUser } from '../types';
import { Radar } from '../components/Radar';
import { PersonRow } from '../components/PersonRow';
import { Button } from '../components/Button';
import { Empty, ErrorBanner } from '../components/States';

const RADIUS_KM = 0.5;
const SCAN_MS = 15000;

export default function RadarScreen() {
  const nav = useNavigation();
  const { width } = useWindowDimensions();
  const { me, setMe } = useMe();
  const [permission, setPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [people, setPeople] = useState<NearbyUser[]>([]);
  const [scanned, setScanned] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const askPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermission(status === 'granted' ? 'granted' : 'denied');
  }, []);

  useEffect(() => {
    askPermission().catch(() => setPermission('denied'));
  }, [askPermission]);

  const scan = useCallback(async () => {
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      await api.updateLocation(pos.coords.latitude, pos.coords.longitude);
      setPeople(await api.getNearby(RADIUS_KM));
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setScanned(true);
    }
  }, []);

  // Solo escanea mientras esta pestaña está a la vista: ahorra batería y peticiones
  useFocusEffect(
    useCallback(() => {
      if (permission !== 'granted') return;
      scan();
      const t = setInterval(scan, SCAN_MS);
      return () => clearInterval(t);
    }, [permission, scan]),
  );

  const toggleVisible = async (visible: boolean) => {
    if (!me) return;
    setMe({ ...me, visible });
    try {
      setMe(await api.updateMe({ visible }));
    } catch (e) {
      setMe({ ...me, visible: !visible });
      setError(errorMessage(e));
    }
  };

  const bringDemo = async () => {
    setDemoLoading(true);
    try {
      await api.seed();
      await api.demoNearby();
      await scan();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setDemoLoading(false);
    }
  };

  const open = (u: NearbyUser) => nav.navigate('UserDetail', { userId: u.id, nearby: u });
  const shared = (u: NearbyUser) => (me ? u.interests.filter((t) => me.interests.includes(t)) : []);
  const radarSize = Math.min(width - 40, 380);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.paper }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => { setRefreshing(true); await scan(); setRefreshing(false); }}
          />
        }
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
          <Text style={T.display}>Cerca de ti</Text>
          <Text style={T.meta}>
            {permission !== 'granted'
              ? 'Necesitamos tu ubicación para buscar'
              : !scanned
                ? 'Buscando…'
                : people.length === 1
                  ? '1 persona a menos de 500 m'
                  : `${people.length} personas a menos de 500 m`}
          </Text>
        </View>

        {permission === 'denied' ? (
          <Empty
            icon="location-outline"
            title="Sin ubicación no hay radar"
            text="Permite el acceso a tu ubicación para ver quién está cerca. Solo compartimos la distancia aproximada, nunca tu posición exacta."
          >
            <Button title="Permitir ubicación" icon="location" onPress={askPermission} />
          </Empty>
        ) : (
          <>
            <Radar users={people} size={radarSize} onSelect={open} />

            <View style={{ marginHorizontal: 20, marginTop: 20 }}>
              <ErrorBanner message={error} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderRadius: 16, padding: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={T.name}>{me?.visible === false ? 'Estás oculto' : 'Te pueden ver'}</Text>
                  <Text style={T.meta}>
                    {me?.visible === false ? 'Nadie te verá en su radar hasta que lo actives.' : 'Apareces en el radar de quien está cerca.'}
                  </Text>
                </View>
                <Switch
                  accessibilityLabel="Visible para otros"
                  value={me?.visible ?? true}
                  onValueChange={toggleVisible}
                  disabled={!me}
                  trackColor={{ true: C.signal, false: C.line }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              {people.map((u) => (
                <PersonRow key={u.id} user={u} sharedInterests={shared(u)} onPress={() => open(u)} />
              ))}
            </View>

            {scanned && people.length === 0 && !error && (
              <Empty icon="radio-outline" title="No hay nadie a menos de 500 m" text="El radar se actualiza solo cada 15 segundos.">
                {__DEV__ && (
                  <Button title="Traer usuarios de prueba aquí" variant="secondary" icon="people-outline"
                    loading={demoLoading} onPress={bringDemo} />
                )}
              </Empty>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

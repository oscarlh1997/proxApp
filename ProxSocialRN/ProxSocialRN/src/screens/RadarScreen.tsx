import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { RadarSvg } from '../components/RadarSvg';
import { useProximityStore } from '../store/useProximityStore';
import { NearbyUserCard } from '../components/NearbyUserCard';

export default function RadarScreen() {
  const visible = useProximityStore((s) => s.visible);
  const scanning = useProximityStore((s) => s.scanning);
  const setVisible = useProximityStore((s) => s.setVisible);
  const setScanning = useProximityStore((s) => s.setScanning);
  const nearby = useProximityStore((s) => s.nearby);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ padding: 12 }}>
      <View
        style={{
          backgroundColor: Colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: Colors.border,
          padding: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text }}>Radar</Text>
        <Text style={{ color: Colors.subtext, marginTop: 6 }}>
          El ángulo es cosmético (BLE no da rumbo). La distancia es aproximada.
        </Text>

        <View style={{ marginTop: 12 }}>
          <RadarSvg users={nearby} size={320} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: Colors.text, fontWeight: '700', flex: 1 }}>Visible</Text>
          <Switch value={visible} onValueChange={setVisible} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: Colors.text, fontWeight: '700', flex: 1 }}>Escanear</Text>
          <Switch value={scanning} onValueChange={setScanning} />
        </View>
      </View>

      <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text, marginTop: 14 }}>
        Personas detectadas
      </Text>
      <View style={{ marginTop: 10 }}>
        {nearby.length === 0 ? (
          <Text style={{ color: Colors.subtext }}>
            Aún no hay personas en rango. Asegúrate de estar en un dispositivo físico con Bluetooth activo.
          </Text>
        ) : (
          nearby.map((u) => <NearbyUserCard key={u.rpi} user={u} onConnect={() => {}} />)
        )}
      </View>
    </ScrollView>
  );
}

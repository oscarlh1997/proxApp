import React, { useEffect, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { requestBlePermissions } from './permissions';
import { ProxBleService } from './bleService';
import { useProximityStore } from '../store/useProximityStore';
import { currentRpi } from './rpi';

export const ProximityBootstrap: React.FC<React.PropsWithChildren> = ({ children }) => {
  const service = useMemo(() => new ProxBleService(), []);
  const visible = useProximityStore((s) => s.visible);
  const scanning = useProximityStore((s) => s.scanning);

  useEffect(() => {
    (async () => {
      await requestBlePermissions();
      await service.start();
    })();

    const sub = AppState.addEventListener('change', (s) => onAppState(s, service));
    return () => {
      sub.remove();
      service.stop();
    };
  }, [service]);

  useEffect(() => {
    // Reiniciar advertising/scan cuando cambian toggles
    (async () => {
      await service.stop();
      // fuerza rotación/lectura de RPI (se usará por el advertiser)
      currentRpi();
      await service.start();
    })();
  }, [visible, scanning, service]);

  return <>{children}</>;
};

function onAppState(state: AppStateStatus, service: ProxBleService) {
  // En background: podrías parar el scan para ahorrar batería y por políticas iOS.
  // Este MVP mantiene el comportamiento simple: parar en background, reanudar en foreground.
  if (state !== 'active') {
    service.stop();
  } else {
    service.start();
  }
}

import Foundation
import CoreBluetooth

@objc(ProxBleAdvertiser)
class ProxBleAdvertiser: NSObject, RCTBridgeModule, CBPeripheralManagerDelegate {
  static func moduleName() -> String! { "ProxBleAdvertiser" }
  static func requiresMainQueueSetup() -> Bool { true }

  private var peripheral: CBPeripheralManager?
  private var pending: (service: CBUUID, manufacturer: Data)?
  private var pendingPromise: (resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock)?

  @objc func startAdvertising(_ serviceUuid: String, manufacturerHex: String,
                             resolver resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) {
    let service = CBUUID(string: serviceUuid)
    guard let manufacturer = ProxBleAdvertiser.hexToData(manufacturerHex) else {
      reject("bad_hex", "manufacturerHex inválido", nil); return
    }
    self.pending = (service: service, manufacturer: manufacturer)
    self.pendingPromise = (resolve: resolve, reject: reject)

    if self.peripheral == nil {
      self.peripheral = CBPeripheralManager(delegate: self, queue: nil)
      // Espera a peripheralManagerDidUpdateState
    } else {
      self.tryStartIfReady()
    }
  }

  @objc func stopAdvertising(_ resolver resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) {
    peripheral?.stopAdvertising()
    pending = nil
    pendingPromise = nil
    resolve(nil)
  }

  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    // Cuando el estado cambie, intentamos iniciar si hay algo pendiente
    tryStartIfReady()
  }

  private func tryStartIfReady() {
    guard let p = peripheral, let info = pending, let prom = pendingPromise else { return }

    guard p.state == .poweredOn else {
      // Si no está poweredOn, no rechazamos: puede pedir al usuario activar BT
      prom.resolve(nil)
      return
    }

    let adv: [String: Any] = [
      CBAdvertisementDataServiceUUIDsKey: [info.service],
      CBAdvertisementDataManufacturerDataKey: info.manufacturer
    ]
    p.startAdvertising(adv)
    prom.resolve(nil)
    // mantenemos pending para poder reiniciar si hace falta, pero limpiamos la promesa
    pendingPromise = nil
  }

  // Helpers
  private static func hexToData(_ hex: String) -> Data? {
    let clean = hex.replacingOccurrences(of: "[^0-9a-fA-F]", with: "", options: .regularExpression)
    if clean.count % 2 != 0 { return nil }
    var bytes = [UInt8]()
    bytes.reserveCapacity(clean.count / 2)
    var i = clean.startIndex
    while i < clean.endIndex {
      let next = clean.index(i, offsetBy: 2)
      let sub = String(clean[i..<next])
      if let b = UInt8(sub, radix: 16) { bytes.append(b) } else { return nil }
      i = next
    }
    return Data(bytes)
  }
}

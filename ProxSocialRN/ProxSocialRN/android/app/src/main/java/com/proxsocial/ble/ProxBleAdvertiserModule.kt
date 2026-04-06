package com.proxsocial.ble

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.content.Context
import android.os.Build
import android.os.ParcelUuid
import com.facebook.react.bridge.*

class ProxBleAdvertiserModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private var advertiser: BluetoothLeAdvertiser? = null
  private var callback: AdvertiseCallback? = null

  override fun getName(): String = "ProxBleAdvertiser"

  @ReactMethod
  fun startAdvertising(serviceUuid: String, manufacturerHex: String, promise: Promise) {
    try {
      val bm = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
      val adapter: BluetoothAdapter = bm.adapter ?: run {
        promise.reject("no_bt", "BluetoothAdapter null")
        return
      }
      advertiser = adapter.bluetoothLeAdvertiser
      if (advertiser == null) {
        promise.reject("no_adv", "BluetoothLeAdvertiser no disponible")
        return
      }

      val service = ParcelUuid(java.util.UUID.fromString(serviceUuid))
      val manufacturer = hexToBytes(manufacturerHex)

      val settings = AdvertiseSettings.Builder()
        .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
        .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
        .setConnectable(false)
        .build()

      val data = AdvertiseData.Builder()
        .addServiceUuid(service)
        .addManufacturerData(0x1234, manufacturer)
        .setIncludeDeviceName(false)
        .build()

      callback = object : AdvertiseCallback() {
        override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
          promise.resolve(null)
        }
        override fun onStartFailure(errorCode: Int) {
          promise.reject("adv_fail", "Advertising failed: $errorCode")
        }
      }

      advertiser?.startAdvertising(settings, data, callback)
    } catch (e: Exception) {
      promise.reject("err", e)
    }
  }

  @ReactMethod
  fun stopAdvertising(promise: Promise) {
    try {
      if (advertiser != null && callback != null) {
        advertiser?.stopAdvertising(callback)
      }
      advertiser = null
      callback = null
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("err", e)
    }
  }

  private fun hexToBytes(hex: String): ByteArray {
    val clean = hex.replace(Regex("[^0-9a-fA-F]"), "")
    val out = ByteArray(clean.length / 2)
    var i = 0
    while (i < clean.length) {
      out[i/2] = clean.substring(i, i+2).toInt(16).toByte()
      i += 2
    }
    return out
  }
}

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ProxBleAdvertiser, NSObject)

RCT_EXTERN_METHOD(startAdvertising:(NSString *)serviceUuid
                  manufacturerHex:(NSString *)manufacturerHex
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopAdvertising:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end

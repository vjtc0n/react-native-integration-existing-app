//
//  ReactNativeFingerPrint.m
//  starterkit
//
//  Created by Thanh Tu on 8/7/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "ReactNativeFingerprint.h"
#import <React/RCTDefines.h>
#import <LocalAuthentication/LocalAuthentication.h>

#if __has_include(<React/RCTUtils.h>) // React Native >= 0.40
#import <React/RCTUtils.h>
#import <React/RCTAssert.h>
#else // React Native < 0.40
#import "RCTUtils.h"
#import "RCTAssert.h"
#endif

static BOOL IsFaceIDDevice() {
  static BOOL isIPhoneX = NO;
  static dispatch_once_t onceToken;
  
  dispatch_once(&onceToken, ^{
    RCTAssertMainQueue();
    
    isIPhoneX = CGSizeEqualToSize(
                                  [UIScreen mainScreen].nativeBounds.size,
                                  CGSizeMake(1125, 2436)
                                  );
  });
  
  return isIPhoneX;
}

// should only use reject for try/catch
@implementation ReactNativeFingerprint

RCT_EXPORT_MODULE(ExponentFingerprint)

RCT_EXPORT_METHOD(hasHardwareAsync:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [LAContext new];
  NSError *error = nil;
  
  BOOL isSupported = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
  resolve(!isSupported && error.code == LAErrorTouchIDNotAvailable ? @(NO) : @(YES));
  
}

RCT_EXPORT_METHOD(isEnrolledAsync:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  LAContext *context = [LAContext new];
  NSError *error = nil;
  
  BOOL isSupported = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
  resolve(isSupported && !error ? @(YES) : @(NO));
}

RCT_EXPORT_METHOD(authenticateAsync:(NSString *)reason
                           resolve:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  __block BOOL isFaceIdDevice;
  [ReactNativeFingerprint performSynchronouslyOnMainThread:^{
    isFaceIdDevice = IsFaceIDDevice();
  }];
  
  if (isFaceIdDevice) {
    NSString *usageDescription = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"NSFaceIDUsageDescription"];
    if (!usageDescription) {
      
        NSString *errorMessage = @"FaceID is available but has not been configured. To enable FaceID, provide `NSFaceIDUsageDescription`.";
      
      reject(@"E_FACEID_NOT_CONFIGURED", errorMessage, RCTErrorWithMessage(errorMessage));
      return;
    }
  }
  
  LAContext *context = [LAContext new];
  
  [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
          localizedReason:reason
                    reply:^(BOOL success, NSError *error) {
                      if (success) {
                        resolve(@{@"success": @(YES)});
                      } else {
                        resolve(@{
                                  @"success": @(NO),
                                  @"error": [self convertErrorCode:error.code],
                                  });
                      }
                    }];
  
  
}

- (NSString *)convertErrorCode:(NSInteger)code
{
  switch (code) {
    case LAErrorSystemCancel:
      return @"system_cancel";
    case LAErrorAppCancel:
      return @"app_cancel";
    case LAErrorTouchIDLockout:
      return @"lockout";
    case LAErrorUserFallback:
      return @"user_fallback";
    case LAErrorUserCancel:
      return @"user_cancel";
    case LAErrorTouchIDNotAvailable:
      return @"not_available";
    case LAErrorInvalidContext:
      return @"invalid_context";
    case LAErrorTouchIDNotEnrolled:
      return @"not_enrolled";
    case LAErrorPasscodeNotSet:
      return @"passcode_not_set";
    case LAErrorAuthenticationFailed:
      return @"authentication_failed";
    default:
      return @"unknown";
  }
}

+ (void)performSynchronouslyOnMainThread:(void (^)(void))block
{
  if ([NSThread isMainThread]) {
    block();
  } else {
    dispatch_sync(dispatch_get_main_queue(), block);
  }
}

@end

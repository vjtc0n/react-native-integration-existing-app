//
//  ReactNativeFingerPrint.h
//  starterkit
//
//  Created by Thanh Tu on 8/7/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#if __has_include(<React/RCTBridgeModule.h>) // React Native >= 0.40
#import <React/RCTBridgeModule.h>
#else // React Native < 0.40
#import "RCTBridgeModule.h"
#endif

@interface ReactNativeFingerprint : NSObject <RCTBridgeModule>

@end

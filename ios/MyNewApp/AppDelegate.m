/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
//#import "RCTRestart.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RCCManager.h>

@implementation AppDelegate

RCTRootView *rootView;
NSURL *jsCodeLocation;
NSDictionary * launchOptions;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  launchOptions = launchOptions;
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
   jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"base" withExtension:@"jsbundle"];
#endif
  
//  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  self.window.backgroundColor = [UIColor whiteColor];

  
//  rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
//                                                      moduleName:@"MyNewApp"
//                                               initialProperties:nil
//                                                   launchOptions:launchOptions];
//
  return YES;
}

- (void) getRootView {
  
//  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  return [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
}


@end

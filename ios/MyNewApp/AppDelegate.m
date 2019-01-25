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

@implementation AppDelegate

RCTRootView *rootView;
NSURL *jsCodeLocation;
NSDictionary * launchOptions;

UIStoryboard *sb;

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
  
  sb = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
  
  RCCManager *instance = [RCCManager sharedInstance];
  
  instance.delegate = self;
  
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  
  return YES;
}


// Implement delegate method
- (UIViewController *)getViewController:(NSString *)native{
  UIViewController *viewController = [sb instantiateViewControllerWithIdentifier:native];
  return viewController;
}


@end

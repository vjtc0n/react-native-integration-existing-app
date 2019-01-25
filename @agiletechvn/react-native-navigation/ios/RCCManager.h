#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>


@protocol RCCManagerDelegate <NSObject>
@optional
- (UIViewController*)getViewController:(NSString *)native;
@end

@interface RCCManager : NSObject

+ (instancetype)sharedInstance;

-(void)initBridgeWithBundleURL:(NSURL *)bundleURL;
-(void)initBridgeWithBundleURL:(NSURL *)bundleURL launchOptions:(NSDictionary *)launchOptions;
-(RCTBridge*)getBridge;
-(UIWindow*)getAppWindow;
-(void)setAppStyle:(NSDictionary*)appStyle;
-(NSDictionary*)getAppStyle;
-(NSDictionary*)getLaunchArgs;

-(void)registerController:(UIViewController*)controller componentId:(NSString*)componentId componentType:(NSString*)componentType;
-(id)getControllerWithId:(NSString*)componentId componentType:(NSString*)componentType;
-(void)unregisterController:(UIViewController*)vc;
-(NSString*) getIdForController:(UIViewController*)vc;
-(void) navigate:(NSDictionary*)options;
-(void)clearModuleRegistry;

@property (nonatomic, weak) id <RCCManagerDelegate> delegate;

@end

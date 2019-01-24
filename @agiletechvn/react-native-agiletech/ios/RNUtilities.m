
#import "RNUtilities.h"
#import <React/RCTBridge.h>
#import <Zxcvbn/DBZxcvbn.h>
#import <CommonCrypto/CommonCrypto.h>

@implementation RNUtilities {
        DBZxcvbn *zxcvbn;
}

//@synthesize bridge = _bridge;

- (id)init {
    self = [super init];
    if (self) {
        zxcvbn = [[DBZxcvbn alloc] init];
    }
    
    return self;
}

- (char *)md5HEX : (NSString *)input length:(uint)length {
    
    const char* cStr = [input UTF8String];
    unsigned char result[CC_MD5_DIGEST_LENGTH];
    CC_MD5(cStr, (CC_LONG)strlen(cStr), result);
    
    static const char HexEncodeChars[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
    char *resultData = malloc(length + 1);
    uint loopTotal = length / 2;
    for (uint index = 0; index < loopTotal; index++) {
        resultData[index * 2] = HexEncodeChars[(result[index] >> 4)];
        resultData[index * 2 + 1] = HexEncodeChars[(result[index] % 0x10)];
    }
    resultData[length] = 0;
    
    return resultData;
    
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport {
  NSString *language = [[[NSBundle mainBundle] preferredLocalizations] objectAtIndex:0];

  NSLocale *locale = [NSLocale currentLocale];
  NSString *countryCode = [locale objectForKey: NSLocaleCountryCode];

  NSLocale *usLocale = [[NSLocale alloc] initWithLocaleIdentifier:@"en_US"];
  NSString *country = [usLocale displayNameForKey: NSLocaleCountryCode value: countryCode];

  return @{@"appVersion"  : [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"],
           @"buildVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:(NSString *)kCFBundleVersionKey],
           @"bundleIdentifier"  : [[NSBundle mainBundle] bundleIdentifier],
           @"locale": language,
           @"country": country,
           @"countryCode": countryCode
          };
}

RCT_EXPORT_METHOD(passwordStrength:(NSString *)password
                  userInputs:(NSArray *)userInputs
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
 
    DBResult *result = [zxcvbn passwordStrength:password userInputs:userInputs];
    resolve([NSNumber numberWithInt:result.score]);
    
}

RCT_EXPORT_METHOD(pinDecrypt:(NSString *)key
                  data:(NSString *)data
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
    
    // tripple des keysize is 24
    NSData *inputData = [[NSData alloc] initWithBase64EncodedString:data options:NSDataBase64DecodingIgnoreUnknownCharacters];
    char* keyBytes = [self md5HEX:key length:kCCKeySize3DES];
    
    NSMutableData *outputData = [NSMutableData dataWithLength:(inputData.length  +  kCCBlockSize3DES)];
    size_t outLength;
    CCCryptorStatus code = CCCrypt(kCCDecrypt, // operation
                     kCCAlgorithm3DES, // Algorithm
                     kCCOptionPKCS7Padding | kCCOptionECBMode, // options
                     keyBytes, // key
                     kCCKeySize3DES, // keylength
                     nil,// iv
                     inputData.bytes, // dataIn
                     inputData.length, // dataInLength,
                     outputData.mutableBytes, // dataOut
                     outputData.length, // dataOutAvailable
                     &outLength); // dataOutMoved
    
    if (code != kCCSuccess) {
        return reject(@"DECRYPT", @"RNUtilities: can't decrypt", nil);
    }
    
    [outputData setLength:outLength];
    
//    NSLog(@"DECRYPT %@", outputData);
    
    resolve([[NSString alloc] initWithData:outputData encoding:NSASCIIStringEncoding]);
}


@end
  


package vn.agiletech.rnutils;

import android.content.pm.PackageManager;
import android.support.annotation.Nullable;
import android.util.Base64;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import java.util.ArrayList;
import com.nulabinc.zxcvbn.Zxcvbn;
import com.nulabinc.zxcvbn.Strength;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import android.util.Log;

/**
 * Created by anhtuank7c on 3/26/18.
 */
public class RNUtilitiesModule extends ReactContextBaseJavaModule {
  private static final String APP_VERSION = "appVersion";
  private static final String APP_BUILD = "buildVersion";
  private static final String APP_ID = "bundleIdentifier";
  private static final String APP_LOCALE = "locale";
  private static final String APP_COUNTRY = "country";
  private static final String APP_COUNTRY_CODE = "countryCode";
  private static final List<String> SHARE_TYPES = Arrays.asList("text/plain", "image/*", "audio/*", "video/*");

  private Zxcvbn zxcvbn;

  public RNUtilitiesModule(ReactApplicationContext reactContext) {
      super(reactContext);
      zxcvbn = new Zxcvbn();
  }

  @Override
  public String getName() {
    return "RNUtilities";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    final PackageManager packageManager = this.getReactApplicationContext().getPackageManager();
    final String packageName = this.getReactApplicationContext().getPackageName();
    try {
      Locale locale = getReactApplicationContext().getResources().getConfiguration().locale;
      constants.put(APP_VERSION, packageManager.getPackageInfo(packageName, 0).versionName);
      constants.put(APP_BUILD, packageManager.getPackageInfo(packageName, 0).versionCode);
      constants.put(APP_ID, packageName);
      constants.put(APP_LOCALE, locale.getLanguage());
      constants.put(APP_COUNTRY, locale.getDisplayCountry());
      constants.put(APP_COUNTRY_CODE, locale.getCountry());
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    }
    return constants;
  }

  @ReactMethod
  public void passwordStrength(String password, @Nullable ReadableArray userInputs, Promise promise) {
      List<String> inputs = null;
      if(userInputs != null) {
          ArrayList<Object> stringsForUserInputs =
                  userInputs.toArrayList();
          inputs = new ArrayList<>(stringsForUserInputs.size());
          for (Object input : stringsForUserInputs) {
              inputs.add((String)input);
          }
      }

      Strength strength = zxcvbn.measure(password, inputs);
      Integer score = strength.getScore();
//      Integer score = Integer.valueOf(strength.getScore());
      promise.resolve(score);
  }

  @ReactMethod
  public void pinDecrypt(String key, String data, Promise promise){
      try {
          Cipher cipher = Cipher.getInstance("DESede/ECB/PKCS7Padding");
          MessageDigest md5 = MessageDigest.getInstance("MD5");
          md5.update(key.getBytes(), 0, key.length());
          String keymd5 = new BigInteger(1, md5.digest()).toString(16).substring(0, 24);
//          Log.d("Utilities", keymd5);
          SecretKeySpec keyspec = new SecretKeySpec(keymd5.getBytes(), "DESede");
          cipher.init(Cipher.DECRYPT_MODE, keyspec);
          byte[] raw = Base64.decode(data, Base64.DEFAULT);
//          Log.d("Utilities", new String(raw));
          byte[] stringBytes = cipher.doFinal(raw);
          String result = new String(stringBytes);

          promise.resolve(result);
      } catch (Exception ex) {
          promise.reject(ex);
      }
  }
}
package com.mynewapp;

import android.app.Application;
import com.reactnativenavigation.NavigationApplication;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.ReactInstanceManager;
import java.util.Arrays;
import java.util.List;
import android.app.Activity;
public class MainApplication extends NavigationApplication {

    @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage()
            );
        }
    
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }
    @Override
        public String getJSMainModuleName() {
            return "index";
        }
    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
    @Override
  public boolean clearHostOnActivityDestroy(Activity activity) {
    return false;
  }


  public ReactInstanceManager getReactInstanceManager() {
    return getReactNativeHost().getReactInstanceManager();
  }
   
}
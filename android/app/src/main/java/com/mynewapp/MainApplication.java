package com.mynewapp;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.reactnativenavigation.params.ScreenParams;
import com.reactnativenavigation.screens.Screen;
import com.reactnativenavigation.views.LeftButtonOnClickListener;

import java.util.Arrays;
import java.util.List;


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
      public Intent getViewController(String nativeName) {
        Intent intent = null;
        switch (nativeName){
            case "HomeController":
                intent = new Intent(this, HomeActivity.class);
                break;
        }

        return intent;
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

    public void callNavigation(final WritableMap map){
        ActivityCallbacks callbacks = new ActivityCallbacks(){
            @Override
            public void onActivityResumed(Activity activity) {
                NavigationApplication.instance.getEventEmitter().sendNavigatorEvent("EventNavigate", map);
            }
        };
        this.setActivityCallbacks(callbacks);
    }




}
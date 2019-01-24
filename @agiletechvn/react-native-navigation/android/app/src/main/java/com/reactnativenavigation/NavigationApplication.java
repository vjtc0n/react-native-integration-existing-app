package com.reactnativenavigation;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityOptionsCompat;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIImplementationProvider;
import com.facebook.react.uimanager.UIManagerModule;
import com.reactnativenavigation.bridge.EventEmitter;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.reactnativenavigation.react.NavigationReactGateway;
import com.reactnativenavigation.react.ReactGateway;

import java.util.List;

public abstract class NavigationApplication extends Application implements ReactApplication {

    public static NavigationApplication instance;

    private NavigationReactGateway reactGateway;
    private EventEmitter eventEmitter;
    private Handler handler;
    private ActivityCallbacks activityCallbacks;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        handler = new Handler(getMainLooper());
        reactGateway = new NavigationReactGateway(getUIImplementationProvider());
        eventEmitter = new EventEmitter(reactGateway);
        activityCallbacks = new ActivityCallbacks();
    }

    @Override
    public void startActivity(Intent intent) {
        String animationType = intent.getStringExtra("animationType");
        if (animationType != null && animationType.equals("fade")) {
            Bundle bundle = ActivityOptionsCompat.makeCustomAnimation(getApplicationContext(),
                    android.R.anim.fade_in,
                    android.R.anim.fade_out
            ).toBundle();
            super.startActivity(intent, bundle);
        } else {
            super.startActivity(intent);
        }
    }

    // here in case someone wants to override this
    protected UIImplementationProvider getUIImplementationProvider() {
        return null; // if null the default UIImplementationProvider will be used
    }

    public void startReactContextOnceInBackgroundAndExecuteJS() {
        reactGateway.startReactContextOnceInBackgroundAndExecuteJS();
    }

    public void runOnMainThread(Runnable runnable) {
        handler.post(runnable);
    }

    public void runOnMainThread(Runnable runnable, long delay) {
        handler.postDelayed(runnable, delay);
    }

    public ReactGateway getReactGateway() {
        return reactGateway;
    }

    public ActivityCallbacks getActivityCallbacks() {
        return activityCallbacks;
    }

    protected void setActivityCallbacks(ActivityCallbacks activityLifecycleCallbacks) {
        this.activityCallbacks = activityLifecycleCallbacks;
    }

    public boolean isReactContextInitialized() {
        return reactGateway.isInitialized();
    }

    public void onReactInitialized(ReactContext reactContext) {
        // nothing
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return reactGateway.getReactNativeHost();
    }

    public EventEmitter getEventEmitter() {
        return eventEmitter;
    }

    public UIManagerModule getUiManagerModule() {
        return getReactGateway()
                .getReactInstanceManager()
                .getCurrentReactContext()
                .getNativeModule(UIManagerModule.class);
    }

    /**
     * @see ReactNativeHost#getJSMainModuleName()
     */
    @Nullable
    public String getJSMainModuleName() {
        return null;
    }

    /**
     * @see ReactNativeHost#getJSBundleFile()
     */
    @Nullable
    public String getJSBundleFile() {
        return null;
    }

    /**
     * @see ReactNativeHost#getBundleAssetName()
     */
    @Nullable
    public String getBundleAssetName() {
        return null;
    }

    public abstract boolean isDebug();

    public boolean clearHostOnActivityDestroy(Activity activity) {
        return true;
    }

    @Nullable
    public abstract List<ReactPackage> createAdditionalReactPackages();
}

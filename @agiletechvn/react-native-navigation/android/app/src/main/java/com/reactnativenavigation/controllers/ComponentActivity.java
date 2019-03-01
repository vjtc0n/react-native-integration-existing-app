package com.reactnativenavigation.controllers;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.NavigationApplication;

public class ComponentActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return NavigationApplication.instance.getCurrentComponent();
    }
}

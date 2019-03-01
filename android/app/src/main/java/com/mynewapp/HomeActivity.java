package com.mynewapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.Button;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ComponentActivity;

public class HomeActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);
        Button btn1= (Button) findViewById(R.id.button);
        btn1.setOnClickListener(new OnClickListener() {

            public void onClick(View v) {
                // SuperApp is just an activity in Android, not Navigation in iOS
//                NavigationApplication.instance.startComponentActivity("app");

                WritableMap map = Arguments.createMap();
                map.putString("type", "push");
                map.putString("screen", "login");
                map.putString("title", "Login");
                HomeActivity.super.finish();
                NavigationApplication.instance.navigate(map);


            }

        });
    }




}
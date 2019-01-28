package com.mynewapp;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.Button;
import android.widget.FrameLayout;

import com.reactnativenavigation.params.ScreenParams;
import com.reactnativenavigation.screens.SingleScreen;
import com.reactnativenavigation.screens.Screen;
import com.reactnativenavigation.views.ContentView;
import com.reactnativenavigation.views.LeftButtonOnClickListener;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;

public class HomeScreen extends SingleScreen {

    private FrameLayout content;

    public HomeScreen(AppCompatActivity activity, ScreenParams screenParams, LeftButtonOnClickListener leftButtonOnClickListener) {
        super(activity, screenParams, leftButtonOnClickListener);
    }

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        requestWindowFeature(Window.FEATURE_NO_TITLE);
//        setContentView(R.layout.activity_main);
//
//        Button btn1= (Button) findViewById(R.id.button);
//        btn1.setOnClickListener(new OnClickListener() {
//
//            public void onClick(View v) {
//                // SuperApp is just an activity in Android, not Navigation in iOS
//                HomeScreen.super.finish();
//            }
//
//        });
//    }

    private void addContent() {
        contentView = new ContentView(getContext(),
                screenParams.screenId,
                screenParams.navigationParams);
        addView(contentView, 0, 0);

        LayoutParams params = new LayoutParams(MATCH_PARENT, MATCH_PARENT);
        if (screenParams.styleParams.drawScreenBelowTopBar) {
            params.addRule(BELOW, topBar.getId());
        }
        addView(content, params);

//        Button btn1= (Button) findViewById(R.id.button);
//        btn1.setOnClickListener(new OnClickListener() {
//
//            public void onClick(View v) {
//                // SuperApp is just an activity in Android, not Navigation in iOS
//                // call javascript
//            }
//
//        });
    }

    @Override
    protected void createContent() {
        content = new FrameLayout(getContext());
        content.setId(R.layout.activity_main);
        addContent();
    }



}



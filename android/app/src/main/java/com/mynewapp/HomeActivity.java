package com.mynewapp;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.Button;

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
                HomeActivity.super.finish();
            }

        });
    }




}



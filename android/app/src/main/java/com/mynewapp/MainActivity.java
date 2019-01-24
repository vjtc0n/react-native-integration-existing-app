package com.mynewapp;

import android.app.Activity;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import android.view.View;
import android.content.Intent;
import android.view.Window;
import android.widget.Button;
import android.view.View.OnClickListener;
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);

        Button btn1= (Button) findViewById(R.id.button);
        btn1.setOnClickListener(new OnClickListener() {

            public void onClick(View v) {

                Intent i = new Intent(getApplicationContext(), ReactMainActivity.class);
//                requestWindowFeature(Window.FEATURE_NO_TITLE);
                startActivity(i);
            }

        });
    }




}



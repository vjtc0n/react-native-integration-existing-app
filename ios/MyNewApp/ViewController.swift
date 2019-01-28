//
//  ViewController.swift
//  My Native View
//
//  Created by Khanh Pham on 1/24/19.
//  Copyright © 2019 Khanh Pham. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }


    @IBAction func OnNavigateToReact(_ sender: Any) {
      
      RCCManager.sharedInstance()?.navigate(["type": "pop"])
      
    }
    @IBAction func OnNavigateToNewReact(_ sender: Any) {
      RCCManager.sharedInstance()?.navigate(["type": "push", "screen": "login", "title": "This is Login from React Native", "passProps": ["aPropFromNative": "red"]])
    }
}


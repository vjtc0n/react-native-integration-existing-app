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
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      // Create a new UIViewController
      let rnViewController = UIViewController()
      // Assign our rootView into the UIViewController
      rnViewController.view = appDelegate.rootView
      // Present our new UIViewController
      self.present(rnViewController, animated: true, completion: nil)
        
    }
}


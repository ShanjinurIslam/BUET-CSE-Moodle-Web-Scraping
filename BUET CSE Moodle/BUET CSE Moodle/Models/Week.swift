//
//  Week.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/22/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import Foundation

struct Resource:Codable {
    var name:String
    var href:String
    var type:String
}

struct Week:Codable {
    var week_name:String
    var resourses:[Resource]
}

struct Weeks:Codable{
    var weeks:[Week]
}

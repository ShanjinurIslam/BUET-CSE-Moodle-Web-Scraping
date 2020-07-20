//
//  Course.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/20/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI

struct Courses: Codable {
    var courses: [Course]
}

struct Course:Codable {
    var id:Int
    var title:String
    var course_code:String
    var assignments:[Assignment]
}

struct Assignment:Codable{
    var title:String
    var href:String
    var due_date:String
}

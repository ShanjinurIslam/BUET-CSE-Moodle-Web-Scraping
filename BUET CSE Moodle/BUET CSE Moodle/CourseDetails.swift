//
//  CourseDetails.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/20/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI

struct CourseDetails: View {
    var course:Course
    
    var body: some View {
        List{
            if(course.assignments.count>0){
                Text("Assignments").font(.title)
                ForEach(course.assignments, id: \.title) { item in
                    Text(item.title)
                }
            }
        }.navigationBarTitle(String(course.course_code))
    }
}


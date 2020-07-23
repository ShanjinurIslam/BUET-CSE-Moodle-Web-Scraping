//
//  CourseDetails.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/20/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI

struct CourseDetails: View {
    @EnvironmentObject var userData:UserData
    @ObservedObject var fetchData:FetchData = FetchData()
    var course:Course
    
    func onLoad(){
        //userData.weeks.removeAll()
        fetchData.fetchWeeks(userData: userData, courseID: String(self.course.id))
    }
    
    var body: some View {
        List{
            if(course.assignments.count>0){
                Text("Assignments").font(.title)
                ForEach(course.assignments, id: \.title) { item in
                    VStack(alignment:.leading
                    ){
                        Text(item.title)
                        Text(item.due_date).font(.subheadline).bold()
                    }
                }.padding()
            }
            ForEach(userData.weeks,id: \.week_name){ item in
                NavigationLink(destination:WeekDetails(week: item)){
                    HStack(){
                        Text(item.week_name)
                        Spacer()
                        if item.resourses.count>0{
                            Image(systemName: "star.fill")
                            .imageScale(.medium)
                            .foregroundColor(.yellow)
                        }
                    }
                }
            }
        }
        .onAppear(perform: onLoad)
        .navigationBarTitle(String(course.course_code))
    }
}


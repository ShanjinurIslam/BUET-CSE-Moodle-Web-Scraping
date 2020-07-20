//
//  HomeView.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/20/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var userData:UserData
    @ObservedObject var fetchData:FetchData = FetchData()
    
    init(){
        UITableView.appearance().separatorStyle = .none
    }
    
    func onLoad(){
        fetchData.fetchCourses(userData: userData)
    }
    
    var body: some View {
        List(userData.courses,id:\.id){course in
            NavigationLink(destination:CourseDetails(course:course)){
                VStack(alignment:.leading){
                    Text(String(course.id)).font(.headline)
                    Text(course.title).font(.body)
                }
            }
            
        }.onAppear(perform: onLoad).navigationBarBackButtonHidden(true).navigationBarTitle(Text("Courses"))
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView().environmentObject(UserData())
    }
}

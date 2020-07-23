//
//  HomeView.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/20/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI

struct HomeView: View {
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    @EnvironmentObject var userData:UserData
    @ObservedObject var fetchData:FetchData = FetchData()
    
    init(){
        UITableView.appearance().separatorStyle = .none
    }
    
    func onLoad(){
        self.userData.weeks.removeAll()
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
            
            }.onAppear(perform: onLoad)
            .navigationBarBackButtonHidden(true)
            .navigationBarTitle(Text("Courses"))
            .navigationBarItems(trailing:
                Button(action: {
                    self.presentationMode.wrappedValue.dismiss()
                    self.fetchData.logout(userData: self.userData)
                }){
                    Text("Sign Out").font(.system(size: 15))
                }
                
            )
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView().environmentObject(UserData())
    }
}

//
//  WeekDetails.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/22/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI

struct WeekDetails: View {
    @EnvironmentObject var userData:UserData
    @ObservedObject var fetchData:FetchData = FetchData()
    @State var showQuickLook:Bool = false
    
    var week:Week
    
    var body: some View {
        List{
            ForEach(week.resourses,id:\.name){ item in
                HStack{
                    Text(item.name).bold()
                    Spacer()
                    if(item.type=="resource"){
                        Button(action: {
                            self.showQuickLook.toggle()
                            self.fetchData.fetchResource(userData: self.userData, url: item.href)
                        }){
                            Image(systemName: "arrow.down.circle")
                            .imageScale(.medium)
                            .foregroundColor(.yellow)
                        }.sheet(isPresented: self.$showQuickLook, onDismiss: {self.showQuickLook = false}) {
                            if (self.fetchData.loading == true)  {
                                ActivityIndicator(shouldAnimate: self.$fetchData.loading)
                            }
                            else{
                                QuickLookController(url:self.fetchData.url,onDismiss: {
                                    self.showQuickLook = false
                                })
                            }
                        }
                    }
                    
                    if(item.type=="url"){
                        Button(action: {
                            guard let url = URL(string: item.href) else { return }
                            UIApplication.shared.open(url)
                        }){
                            Image(systemName: "arrowshape.turn.up.right")
                            .imageScale(.medium)
                            .foregroundColor(.yellow)
                        }
                    }
                    
                }
            }
        }
        .listRowInsets(EdgeInsets())
        .navigationBarTitle(week.week_name)
    }
}


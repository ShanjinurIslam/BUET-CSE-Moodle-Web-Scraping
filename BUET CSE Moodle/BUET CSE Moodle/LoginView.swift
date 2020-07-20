//
//  LoginView.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/19/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI

extension UIApplication {
    func endEditing() {
        sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}

struct LoginView: View {
    @EnvironmentObject var userData:UserData
    @State var username:String = ""
    @State var password:String = ""
    @ObservedObject private var keyboard = KeyboardResponder()
    @ObservedObject private var fetchData:FetchData = FetchData()
    
    var body: some View {
        NavigationView{
            VStack(alignment:.leading){
                VStack{
                    VStack(alignment:.leading){
                        Text("Log In").bold().font(.title)
                        Text("BUET CSE Moodle").font(.subheadline).foregroundColor(.gray)
                    }.padding()
                }.padding().offset(y: +20)
                VStack(alignment:.center){
                    VStack(alignment:.leading){
                        TextField("Username",text:$username).padding().offset(y:+5).keyboardType(.numberPad)
                        SecureField("Password",text:$password){
                                UIApplication.shared.endEditing()
                            }.padding()
                            .offset(y:-5)
                    }
                    HStack(alignment:.center){
                        NavigationLink(destination: HomeView().environmentObject(userData), isActive: $fetchData.loggedIn) { EmptyView()
                        }
                        if(!self.fetchData.shouldAnimate){
                            Button(action: {
                                UIApplication.shared.endEditing()
                                self.fetchData.logIn(userName: self.username, password: self.password,userData: self.userData)
                            }) {
                                Text("Sign In").font(.system(size: 20))
                            }
                        }
                        else{
                            ActivityIndicator(shouldAnimate: $fetchData.shouldAnimate)
                        }
                    }
                }.padding()
            }
            .padding(.bottom, keyboard.currentHeight)
            .edgesIgnoringSafeArea(.bottom)
            .animation(.easeOut(duration: 0.16))
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView().environmentObject(UserData())
    }
}

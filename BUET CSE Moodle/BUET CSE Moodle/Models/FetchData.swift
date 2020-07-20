//
//  FetchData.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/19/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI
import Alamofire

extension Dictionary {
    func percentEncoded() -> Data? {
        return map { key, value in
            let escapedKey = "\(key)".addingPercentEncoding(withAllowedCharacters: .urlQueryValueAllowed) ?? ""
            let escapedValue = "\(value)".addingPercentEncoding(withAllowedCharacters: .urlQueryValueAllowed) ?? ""
            return escapedKey + "=" + escapedValue
        }
        .joined(separator: "&")
        .data(using: .utf8)
    }
}

extension CharacterSet {
    static let urlQueryValueAllowed: CharacterSet = {
        let generalDelimitersToEncode = ":#[]@" // does not include "?" or "/" due to RFC 3986 - Section 3.4
        let subDelimitersToEncode = "!$&'()*+,;="

        var allowed = CharacterSet.urlQueryAllowed
        allowed.remove(charactersIn: "\(generalDelimitersToEncode)\(subDelimitersToEncode)")
        return allowed
    }()
}

class FetchData:ObservableObject{
    private let baseAddress:String
    private var sesskey:String
    @Published var shouldAnimate:Bool = false
    @Published var loggedIn:Bool = false
    
    init() {
        baseAddress = "http://192.168.0.101:8080"
        sesskey = ""
    }
    
    func logIn(userName:String,password:String,userData:UserData) {
        self.shouldAnimate = true
        
        let url = URL(string: baseAddress+"/login")!
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        let parameters: [String: String] = [
            "username": userName,
            "password": password
        ]
        request.httpBody = parameters.percentEncoded()
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            
            if let data = data {
                if let decodedResponse = try? JSONDecoder().decode(Session.self, from: data) {
                    DispatchQueue.main.async {
                        self.sesskey = String(decodedResponse.sesskey)
                        userData.sesskey = self.sesskey
                        self.loggedIn = true
                    }
                    return
                }
            }
        }.resume()
    }
    
    /*
    func fetchCourses(userData:UserData){
        let url = URL(string: baseAddress+"/courses")!
        var request = URLRequest(url: url)
        
        request.httpMethod = "GET"
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let data = data {
                if let decodedResponse = try? JSONDecoder().decode(Courses.self, from: data) {
                    DispatchQueue.main.async {
                        userData.courses = decodedResponse.courses
                    }
                    return
                }
            }
        }.resume()
    }*/
    
    
    func fetchCourses(userData:UserData){
        let headers : HTTPHeaders = ["sesskey": userData.sesskey, "Content-Type": "application/json"]
        
        AF.request(baseAddress+"/courses",method: .get, headers: headers).response {
            response in
            guard let data = response.data else { return }
            do {
                let decoder = JSONDecoder()
                let decodedResponse = try decoder.decode(Courses.self, from: data)
                DispatchQueue.main.async {
                    userData.courses = decodedResponse.courses
                }
            } catch let error {
                print(error)
            }
        }
    }
}

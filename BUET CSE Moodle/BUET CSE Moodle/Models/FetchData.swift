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
    @Published var loggedOut:Bool = false
    @Published var loading:Bool = false
    @Published var url:String = ""
    
    init() {
        baseAddress = "http://192.168.0.103:8080"
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
                        self.shouldAnimate = false
                        self.loggedIn = true
                    }
                    return
                }
            }
        }.resume()
    }
    
    func logout(userData:UserData){
        let headers : HTTPHeaders = ["sesskey": userData.sesskey, "Content-Type": "application/json"]
        
        self.loggedOut = false
        AF.request(baseAddress+"/logout",method: .get, headers: headers).response {
            response in
            DispatchQueue.main.async {
                self.loggedOut = true
            }
        }
    }
    
    
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
    
    func fetchWeeks(userData:UserData,courseID:String){
        let headers : HTTPHeaders = ["sesskey": userData.sesskey, "Content-Type": "application/json"]
        
        AF.request(baseAddress+"/courses/"+courseID,method: .get, headers: headers).response {
            response in
            guard let data = response.data else { return }
            do {
                let decoder = JSONDecoder()
                let decodedResponse = try decoder.decode(Weeks.self, from: data)
                DispatchQueue.main.async {
                    userData.weeks = decodedResponse.weeks
                }
            } catch let error {
                print(error)
            }
        }
    }
    
    func fetchResource(userData:UserData,url:String){
        self.url = ""
        self.loading = true
        
        let headers : HTTPHeaders = ["sesskey": userData.sesskey, "Content-Type": "application/json", "url":url]
        
        /*
        
        AF.request(baseAddress+"/resource" ,method: .get, headers: headers).response {
            response in
            guard let data = response.data else { return }
            do {
                let decoder = JSONDecoder()
                let decodedResponse = try decoder.decode(ContentURL.self, from: data)
                DispatchQueue.main.async {
                    print(decodedResponse)
                    self.url = "sample.pdf"
                    self.loading = false
                }
            } catch let error {
                print(error)
            }
        }*/
        var localPath:URL!
        let urlString = baseAddress+"/resource"
        AF.download(urlString, headers:headers,to:{ (temporaryURL, response) in
                let directoryURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
                let pathComponent = response.suggestedFilename

                localPath = directoryURL.appendingPathComponent(pathComponent!)
                return  (localPath, [.removePreviousFile, .createIntermediateDirectories])
            }).response { response in
                print(localPath!.absoluteString)
                DispatchQueue.main.async {
                    self.url = localPath.absoluteString
                    self.loading = false
                }
            }
    }
}

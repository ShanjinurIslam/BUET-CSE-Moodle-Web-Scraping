//
//  UserData.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/19/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI
import Combine

class UserData:ObservableObject{
    @Published var sesskey:String = ""
    @Published var courses:[Course] = [Course]()
    @Published var weeks:[Week] = [Week]()
}


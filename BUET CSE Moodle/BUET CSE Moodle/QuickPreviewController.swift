//
//  QuickPreviewController.swift
//  BUET CSE Moodle
//
//  Created by Shanjinur Islam on 7/23/20.
//  Copyright © 2020 Shanjinur Islam. All rights reserved.
//

import SwiftUI
import QuickLook

struct QuickLookController: UIViewControllerRepresentable {

    var url: String
    var onDismiss: () -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func updateUIViewController(_ viewController: UINavigationController, context: UIViewControllerRepresentableContext<QuickLookController>) {
        if let controller = viewController.topViewController as? QLPreviewController {
            controller.reloadData()
        }
    }

    func makeUIViewController(context: Context) -> UINavigationController {
        let controller = QLPreviewController()

        controller.dataSource = context.coordinator
        controller.reloadData()
        return UINavigationController(rootViewController: controller)
    }

    class Coordinator: NSObject, QLPreviewControllerDataSource {
        var parent: QuickLookController

        init(_ qlPreviewController: QuickLookController) {
            self.parent = qlPreviewController
            super.init()
        }
        func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
            return 1
        }
        func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
            return URL(string:self.parent.url)! as QLPreviewItem
        }

    }
}

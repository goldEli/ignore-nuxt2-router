import * as vscode from "vscode";
import * as path from "path";
import { readFile } from "fs";

console.log(
  'Congratulations, your extension "ignore-nuxt2-router" is now active!'
);
// 激活插件
export function activate(context: vscode.ExtensionContext) {
  // 注册命令
  let disposable = vscode.commands.registerCommand(
    "extension.showMultiSelectDropdown",
    () => {
      // 创建 Webview
      const panel = vscode.window.createWebviewPanel(
        "multiSelectDropdown", // 视图标识符，这里是唯一的
        "Multi-Select Dropdown", // 视图标题
        vscode.ViewColumn.One, // 在编辑器的哪个列打开视图
        {
          enableScripts: true, // 启用脚本
        }
      );
      vscode.window.showInformationMessage(
        "Hello World from ignore-nuxt2-router!"
      );

      // 读取 HTML 模板文件
      const htmlPath = vscode.Uri.file(
        path.join(context.extensionPath, "dropdown.html")
      );
      const reader = readFile(htmlPath.fsPath, "utf-8", (err, html) => {
        if (err) {
          console.error(err);
          return;
        }

        // 更新 Webview 内容
        panel.webview.html = html;
        // 发送消息到 Webview
        panel.webview.postMessage({ text: "Hello from the extension!" });
      });

      // 处理消息
      //   panel.webview.onDidReceiveMessage((message) => {
      //     vscode.window.showInformationMessage(message.text); // 显示所选项
      //     vscode.window.showInformationMessage(
      //       "Hello World from ignore-nuxt2-router!"
      //     );
      //   });

      panel.webview.onDidReceiveMessage(
        (message) => {
          console.log("插件收到的消息：", message);
        },
        undefined,
        context.subscriptions
      );
    }
  );

  // 注册命令
  context.subscriptions.push(disposable);
}

// 插件被释放时执行的方法
export function deactivate() {}

// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "ignore-nuxt2-router" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('ignore-nuxt2-router.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from ignore-nuxt2-router!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

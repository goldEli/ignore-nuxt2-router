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
      // vscode.window.showInformationMessage(
      //   "Hello World from ignore-nuxt2-router!"
      // );

      // 读取 HTML 模板文件
      const htmlPath = vscode.Uri.file(
        path.join(context.extensionPath, "dropdown.html")
      );
      const reader = readFile(htmlPath.fsPath, "utf-8", async (err, html) => {
        if (err) {
          console.error(err);
          return;
        }

        // 更新 Webview 内容
        panel.webview.html = html;
        const folderNames = await getFolderNames();
        // 发送消息到 Webview
        panel.webview.postMessage({ text: folderNames });
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

async function getFolderNames() {
  let ret = "";
  // 获取当前工作区
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace is opened.");
    return ret;
  }

  // 获取当前活动文件夹的 URI
  const currentFolderUri = workspaceFolders[0].uri;

  try {
    // 读取 pages 文件夹下的所有文件和文件夹
    const items = await vscode.workspace.fs.readDirectory(
      vscode.Uri.joinPath(currentFolderUri, "client/pages/_lang")
    );

    // 提取文件夹名和文件名
    const folderNames = [];
    const fileNames = [];

    for (const [name, type] of items) {
      if (type === vscode.FileType.Directory) {
        folderNames.push(name);
      } else {
        fileNames.push(name);
      }
    }
    ret = folderNames.join(", ");
    // 在输出窗口中显示文件夹名和文件名
    vscode.window.showInformationMessage(
      `Folders in the pages directory: ${folderNames.join(", ")}`
    );
    //   // 读取当前目录下的所有文件和文件夹
    //   const files = await vscode.workspace.findFiles(new vscode.RelativePattern(currentFolderUri.fsPath, 'client/pages/_lang/*'));

    //   // 提取文件名
    //   // const fileNames = files.map(([name, type]) => name);
    //   // 提取文件名
    //   const fileNames = files.map(file => {
    //     return file.path.substring(file.path.lastIndexOf('/') + 1); // 获取文件名
    // });

    //   // 在输出窗口中显示文件名
    //   vscode.window.showInformationMessage(
    //     `Files in the current directory: ${fileNames.join(", ")}`
    //   );
  } catch (error) {
    vscode.window.showErrorMessage(`Error reading files}`);
  }
  return ret
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

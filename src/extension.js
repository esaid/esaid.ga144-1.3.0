const vscode = require('vscode');

function activate(context) {

    let view = vscode.window.registerTreeDataProvider('myView', {
        getChildren() {
            return ['Configuration Serial Port', 'Read Serial port', 'Readme'];
        },
        getTreeItem(element) {
            let treeItem = {
                label: element,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
            };

            if (element === 'Configuration Serial Port') {
                treeItem.command = {

                    command: 'myExtension.Ga144_Serial_Port',
                    title: 'Configuration Serial Port'
                };
            }
            else if (element === 'Read Serial port') {
                treeItem.command = {

                    command: 'myExtension.MyConfigurationSerialPort',
                    title: ''
                };
            }

            return treeItem;
        }

    });


    let disposableHello = vscode.commands.registerCommand('myExtension.sayHello', function () {
        vscode.window.showInformationMessage('Compilation');


    });
    let disposableConfigurationSerialPort = vscode.commands.registerCommand('myExtension.MyConfigurationSerialPort', function () {
        vscode.window.showInformationMessage(vscode.workspace.getConfiguration().get('myExtension.MyConfigurationSerialPort') + ' on Serial Port');
        setTimeout(() => {

        }, 1000)
    });



    let disposableSerialPort = vscode.commands.registerCommand('myExtension.Ga144_Serial_Port', function () {

        const panel = vscode.window.createWebviewPanel(
            'myWebview', // Identifiant interne de la Webview
            'Configuration Serial Port', // Titre de la Webview
            vscode.ViewColumn.One, // Panneau dans lequel la Webview s'affiche
            {
                enableScripts: true // Autorise JavaScript dans la Webview
            }
        );

        panel.webview.html = getWebviewContent();

        // Écoute des messages de la Webview
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'portInput':
                        vscode.window.showInformationMessage(`Serial Port : ${message.port}`);
                        setTimeout(() => {

                        }, 1000)


                        vscode.workspace.getConfiguration().update('myExtension.MyConfigurationSerialPort', message.port, vscode.ConfigurationTarget.Global);

                        break;

                }
            },
            undefined,
            context.subscriptions
        );

    });

    context.subscriptions.push(disposableHello, disposableConfigurationSerialPort, disposableSerialPort, view);


}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>UI de l'Extension</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                input {
                    padding: 8px;
                    margin-right: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    padding: 8px 20px;
                    background-color: #007acc;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <h1>Configuration Serial Port</h1>
            <input type="text" id="portInput" placeholder="Input serial port" />
            <button onclick="sendPort()">Send</button>
            <script>
                // Pour la communication avec l'extension VSCode
                const vscode = acquireVsCodeApi();

                function sendPort() {
                    const portValue = document.getElementById('portInput').value.trim();            
                    
                    if (portValue) {
                        vscode.postMessage({
                            command: 'portInput',
                            port: portValue
                        });                        
                    } else {                        
                        alert('Veuillez entrer un port série.');
                    }
                }
            </script>
        </body>
        </html>
    `;
}


function deactivate() { }

module.exports = {
    activate,
    deactivate
};

const vscode = require('vscode');

function activate(context) {
    // Register the custom view
    vscode.window.registerWebviewViewProvider('myCustomView', {
        resolveWebviewView(webviewView, context, token) {
            webviewView.webview.options = {
                enableScripts: true // Allow scripts in the Webview
            };

            // Set the HTML content for the Custom View
            webviewView.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Custom View</title>
                </head>
                <body>
                    <h1>Welcome to the Custom View</h1>
                    <button id="runTask">Run Task</button>
                    <script>
                        const vscode = acquireVsCodeApi();
                        document.getElementById('runTask').addEventListener('click', () => {
                            vscode.postMessage({ command: 'runTask' });
                        });
                    </script>
                </body>
                </html>
            `;

            // Listen for messages from the Custom View
            webviewView.webview.onDidReceiveMessage(
                message => {
                    if (message.command === 'runTask') {
                        vscode.commands.executeCommand('workbench.action.tasks.runTask', 'My Custom Task');
                        vscode.window.showInformationMessage('Task triggered from the Custom View!');
                    }
                }
            );
        }
    });

    let disposableHello = vscode.commands.registerCommand('myExtension.sayHello', function () {
        vscode.window.showInformationMessage('Compilation');
    });
    
    let disposableSerialPort = vscode.commands.registerCommand('myExtension.Ga144_Serial_Port', function () {
        vscode.window.showInformationMessage('Configuration Serial Port');
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
                        break;
                    
                }
            },
            undefined,
            context.subscriptions
        );

    });

    context.subscriptions.push(disposableHello, disposableSerialPort);
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

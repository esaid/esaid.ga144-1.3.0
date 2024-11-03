const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Enregistrement de la commande 'myExtension.sayHello'
    let disposable = vscode.commands.registerCommand('myExtension.sayHello', function () {
        vscode.window.showInformationMessage('Compilation');
    });


    // Enregistrer la vue
    const myTreeDataProvider = new MyTreeDataProvider();

    const treeView = vscode.window.createTreeView('myView', {
        treeDataProvider: myTreeDataProvider
    });
    // Créer et enregistrer le fournisseur de vue personnalisé
    const customViewProvider = new CustomViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('myView', customViewProvider)
    );
}

class CustomViewProvider {
    /**
     * @param {vscode.Uri} extensionUri
     */
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
    }

    /**
     * @param {vscode.WebviewView} webviewView
     * @param {vscode.WebviewViewResolveContext} context
     * @param {vscode.CancellationToken} _token
     */
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;

        // Configuration de la vue web
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        // Contenu HTML de la vue web
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Gestion des messages reçus depuis le WebView
        webviewView.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showInformationMessage(message.text);
                    break;
            }
        });
    }

    /**
     * Génère le contenu HTML pour la WebView
     * @param {vscode.Webview} webview
     * @returns {string}
     */
    _getHtmlForWebview(webview) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vue Interactive</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 10px;
                    }
                    button {
                        padding: 8px 16px;
                        background-color: #007acc;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #005f99;
                    }
                </style>
            </head>
            <body>
                <h1>Bienvenue dans la vue interactive</h1>
                <button onclick="sendMessage()">Cliquez ici</button>
                <script>
                    const vscode = acquireVsCodeApi();
                    function sendMessage() {
                        vscode.postMessage({ command: 'alert', text: 'Le bouton a été cliqué!' });
                    }
                </script>
            </body>
            </html>
        `;
    }
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};

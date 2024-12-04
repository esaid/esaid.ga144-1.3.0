const vscode = require('vscode');
const path = require('path'); // module for working with file paths

function activate(context) {
    // Obtenir le chemin d'installation de l'extension
    const extensionPath = context.extensionPath;
    // vscode.window.showInformationMessage('Extension path: ' + extensionPath);
    //  vue dans Explorer ga144
    // send file to serial port
    let viewSend = vscode.window.registerTreeDataProvider('View.ga144-send', {
        getChildren() {
            return ['Send'];
        },
        getTreeItem(element) {
            let treeItem = {
                label: element,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
            };

            if (element === 'Send') {
                treeItem.command = {

                    command: 'myExtension.Ga144_Send',
                    title: 'Send'
                };
            }
            return treeItem;
        }
    });
    // compilation
    let viewCompile = vscode.window.registerTreeDataProvider('View.ga144-compile', {
        getChildren() {
            return ['Compilation'];
        },
        getTreeItem(element) {
            let treeItem = {
                label: element,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
            };

            if (element === 'Compilation') {
                treeItem.command = {

                    command: 'myExtension.Ga144_Compile',
                    title: 'Compilation'
                };
            }
            return treeItem;
        }
    });

    // configuration serial-port
    let viewConfiguration = vscode.window.registerTreeDataProvider('View.ga144-configuration', {
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
            else if (element === 'Readme') {
                treeItem.command = {

                    command: 'myExtension.Readme',
                    title: ''
                };
            }
            return treeItem;
        }

    });

    // commands for ga144
    let disposableHello = vscode.commands.registerCommand('myExtension.sayHello', function () {
        vscode.window.showInformationMessage('Hello World!');
    });

    let disposableConfigurationSerialPort = vscode.commands.registerCommand('myExtension.MyConfigurationSerialPort', function () {
        vscode.window.showInformationMessage(vscode.workspace.getConfiguration().get('myExtension.MyConfigurationSerialPort') + ' on Serial Port');
        setTimeout(() => {
        }, 1000)
    });

    let disposableReadme = vscode.commands.registerCommand('myExtension.Readme', function () {
        vscode.window.showInformationMessage('find in -->  Parameter : My configuration Serial Port');

    });

    let disposableCompile = vscode.commands.registerCommand('myExtension.Ga144_Compile', function () {
        // Vérifiez si un éditeur est actif
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("Aucun fichier actif.");
            return;
        }
        const srcPath = path.dirname(editor.document.fileName) + '/'; // -d ${srcPath}
        const librariesPath = path.join(extensionPath, '/Libraries/');
        // const fileName = (editor.document.fileName).replace(srcPath, '');
        const fileName = path.basename(editor.document.fileName);
        vscode.window.showInformationMessage('File name: ' + fileName);


        // le chemin absolu du script
        const scriptPrecompilationtPath = path.join(extensionPath, 'launch_script_gaparser2.py')
        const commandPrecompilation = `${scriptPrecompilationtPath} -dl ${librariesPath} -d ${srcPath} -f ${fileName} -e ${extensionPath}`;
        // le fichier avec  _.ga
        const dotIndex = fileName.lastIndexOf('.');
        const fileName_ga = path.join(srcPath, (fileName.slice(0, dotIndex) + '_' + fileName.slice(dotIndex)));
        const scriptCompilationPath = path.join(extensionPath, 'launch_script_ga.py')
        const commandCompilation = `${scriptCompilationPath} -f ${fileName_ga} -e ${extensionPath}`;
        vscode.window.showInformationMessage('filename_ga : ' + fileName_ga);
        vscode.window.showInformationMessage('Pre-Compilation: ' + commandPrecompilation);
        const precompiler_task = new vscode.Task(
            { type: 'shell' },
            vscode.TaskScope.Workspace,
            'GA144 Pre-Compilation',
            'customTask',
            new vscode.ShellExecution('python', [scriptPrecompilationtPath, '-dl', librariesPath, '-d', srcPath, '-f', fileName, '-e', extensionPath]),
            
        );

        vscode.window.showInformationMessage('Compilation: ' + commandCompilation);
        const compiler_task = new vscode.Task(
            { type: 'shell' },
            vscode.TaskScope.Workspace,
            'GA144 Compilation',
            'customTask',
            new vscode.ShellExecution('python', [scriptCompilationPath, '-f', fileName_ga, '-e', extensionPath])
            // implementation sauveagarde fichier_assembleur a faire
        )

        // Événement pour détecter la fin de la tâche
        const disposable = vscode.tasks.onDidEndTaskProcess((event) => {
            
            if (event.execution.task.name === 'GA144 Pre-Compilation') {
                vscode.window.showInformationMessage('Starting Compilation Task...');
                vscode.tasks.executeTask(compiler_task);
                
                disposable.dispose(); // Nettoie l'écouteur après l'exécution
            }
        });

        vscode.tasks.executeTask(precompiler_task);

        vscode.window.showInformationMessage('Compilation All Done');
    });

    let disposableSend = vscode.commands.registerCommand('myExtension.Ga144_Send', async function () {
        // Vérifiez si un éditeur est actif
        const editor = vscode.window.activeTextEditor;
        const srcPath = path.dirname(editor.document.fileName);
        const port = vscode.workspace.getConfiguration().get('myExtension.MyConfigurationSerialPort');
        // le chemin absolu du script
        const scriptPath = path.join(extensionPath, 'launch_send_script.py');
        const filePath = path.join(srcPath, '${fileBasenameNoExtension}_.ga');
        const send_task = new vscode.Task(
            { type: 'shell' },
            vscode.TaskScope.Workspace,
            'GA144 Send Programming',
            'customTask',
            new vscode.ShellExecution('python', [scriptPath, filePath, '--port', port])

        ); // script to execute from extensionPath and file example from current folder
        vscode.tasks.executeTask(send_task);
        vscode.window.showInformationMessage('Send --port ' + port);
    });

    let disposableSerialPort = vscode.commands.registerCommand('myExtension.Ga144_Serial_Port', function () {
        const panel = vscode.window.createWebviewPanel(
            'myWebview', // Identifiant interne de la Webview
            'Configuration Serial Port', // Titre de la Webview
            vscode.ViewColumn.One, // Panneau dans lequel la Webview s'affiche
            {
                enableScripts: true // Autorise JavaScript dans la Webview
            });

        panel.webview.html = getWebviewSerialPortContent();
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

    context.subscriptions.push(disposableHello, disposableConfigurationSerialPort, disposableSerialPort, disposableReadme, viewConfiguration, viewCompile, viewSend, disposableCompile, disposableSend);

}

function getWebviewSerialPortContent() {
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

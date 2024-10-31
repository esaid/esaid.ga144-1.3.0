import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.demanderPortSerie', async () => {
        const portSerie = await vscode.window.showInputBox({
            prompt: 'Entrez le port série (ex: COM3, /dev/ttyUSB0)',
            placeHolder: 'COM3',
            validateInput: (text) => {
                return text ? null : 'Le port série ne peut pas être vide';
            }
        });

        if (portSerie) {
            vscode.window.showInformationMessage(`Port série sélectionné : ${portSerie}`);
        } else {
            vscode.window.showWarningMessage("Aucun port série n'a été sélectionné.");
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

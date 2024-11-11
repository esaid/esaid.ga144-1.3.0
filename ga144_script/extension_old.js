const vscode = require('vscode');

/**
 * Fonction appelée lors de l'activation de l'extension
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

    // Surveiller la visibilité de la vue
    treeView.onDidChangeVisibility((e) => {
        if (e.visible) {
            // La vue est visible, on déclenche la commande
            vscode.commands.executeCommand('myExtension.sayHello');
        }
    });

    context.subscriptions.push(disposable);
}

// Fournisseur de données pour la vue
class MyTreeDataProvider {
    getTreeItem(element) {
        return {
            label: 'Item',
            collapsibleState: vscode.TreeItemCollapsibleState.None
        };
    }

    getChildren(element) {
        return []; // Pas de données pour l'instant
    }
}

/**
 * Fonction appelée lors de la désactivation de l'extension
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};

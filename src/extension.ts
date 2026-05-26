import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const activePanels = new Map<string, vscode.WebviewPanel>();

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('csvBlockEditor.toggleTableView', async () => {
            const activeWebviewKey = findActiveWebviewKey();

            if (activeWebviewKey) {
                const panel = activePanels.get(activeWebviewKey);
                if (panel) {
                    const uri = vscode.Uri.parse(activeWebviewKey);
                    const viewColumn = panel.viewColumn ?? vscode.ViewColumn.One;
                    panel.dispose();
                    activePanels.delete(activeWebviewKey);
                    setTableViewContext(false);
                    try {
                        const doc = await vscode.workspace.openTextDocument(uri);
                        await vscode.window.showTextDocument(doc, viewColumn);
                    } catch { }
                }
                return;
            }

            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }

            const doc = editor.document;
            const ext = path.extname(doc.uri.fsPath).toLowerCase();
            if (ext !== '.csv' && ext !== '.txt') { return; }

            const key = doc.uri.toString();

            if (activePanels.has(key)) {
                const panel = activePanels.get(key)!;
                panel.reveal();
                return;
            }

            openTableView(context, doc, editor.viewColumn ?? vscode.ViewColumn.One);
        })
    );
}

function findActiveWebviewKey(): string | undefined {
    for (const [key, panel] of activePanels) {
        if (panel.active) {
            return key;
        }
    }
    return undefined;
}

function openTableView(context: vscode.ExtensionContext, document: vscode.TextDocument, viewColumn: vscode.ViewColumn) {
    const key = document.uri.toString();
    const fileName = path.basename(document.uri.fsPath);
    const fileUri = document.uri;
    const filePath = document.uri.fsPath;

    const panel = vscode.window.createWebviewPanel(
        'csvBlockEditor',
        fileName + ' (表格视图)',
        { viewColumn, preserveFocus: false },
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.iconPath = new vscode.ThemeIcon('table');

    const htmlPath = path.join(context.extensionPath, 'webview', 'editor.html');
    let html = fs.readFileSync(htmlPath, 'utf-8');

    const nonce = getNonce();
    const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">`;
    html = html.replace('</head>', csp + '\n</head>');
    html = html.replace(/<script>/g, `<script nonce="${nonce}">`);

    panel.webview.html = html;

    setTimeout(() => {
        panel.webview.postMessage({
            type: 'init',
            content: document.getText(),
            fileName: fileName
        });
    }, 100);

    panel.webview.onDidReceiveMessage(async (msg: { type: string; content?: string }) => {
        switch (msg.type) {
            case 'update':
                if (msg.content !== undefined) {
                    await writeToFile(filePath, msg.content);
                }
                break;
            case 'save':
                if (msg.content !== undefined) {
                    await writeToFile(filePath, msg.content);
                    panel.webview.postMessage({ type: 'saveResult', success: true });
                }
                break;
            case 'backToText':
                panel.dispose();
                break;
            case 'requestInit':
                try {
                    const freshDoc = await vscode.workspace.openTextDocument(fileUri);
                    panel.webview.postMessage({
                        type: 'init',
                        content: freshDoc.getText(),
                        fileName: fileName
                    });
                } catch {
                    panel.webview.postMessage({
                        type: 'init',
                        content: document.getText(),
                        fileName: fileName
                    });
                }
                break;
        }
    });

    panel.onDidChangeViewState(() => {
        if (panel.active) {
            setTableViewContext(true);
        }
    });

    panel.onDidDispose(async () => {
        activePanels.delete(key);
        if (activePanels.size === 0) {
            setTableViewContext(false);
        }
        try {
            const doc = await vscode.workspace.openTextDocument(fileUri);
            await vscode.window.showTextDocument(doc, viewColumn, false);
        } catch { }
    });

    activePanels.set(key, panel);
    setTableViewContext(true);
}

async function writeToFile(filePath: string, newContent: string) {
    await fs.promises.writeFile(filePath, newContent, 'utf-8');
}

function setTableViewContext(active: boolean) {
    vscode.commands.executeCommand('setContext', 'csvBlockEditor.tableViewActive', active);
}

function getNonce(): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function deactivate() { }

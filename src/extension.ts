import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const provider = new CsvBlockEditorProvider(context);
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            'csvBlockEditor.editor',
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                },
                supportsMultipleEditorsPerDocument: false
            }
        )
    );
}

export function deactivate() { }

class CsvDocument implements vscode.CustomDocument {
    private _content: string;
    private _onDidChange = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<CsvDocument>>();

    readonly onDidChange = this._onDidChange.event;
    private _isDirty = false;

    constructor(readonly uri: vscode.Uri, initialContent: string) {
        this._content = initialContent;
    }

    get content(): string {
        return this._content;
    }

    get isDirty(): boolean {
        return this._isDirty;
    }

    updateContent(newContent: string): void {
        this._content = newContent;
        this._isDirty = true;
        this._onDidChange.fire({
            document: this,
            label: 'edit',
            undo: () => { },
            redo: () => { }
        });
    }

    revert(content: string): void {
        this._content = content;
        this._isDirty = false;
    }

    markSaved(): void {
        this._isDirty = false;
    }

    dispose(): void {
        this._onDidChange.dispose();
    }
}

class CsvBlockEditorProvider implements vscode.CustomEditorProvider<CsvDocument> {
    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<CsvDocument>>();
    readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

    constructor(private readonly context: vscode.ExtensionContext) { }

    async openCustomDocument(
        uri: vscode.Uri,
        _openContext: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<CsvDocument> {
        const content = await fs.promises.readFile(uri.fsPath, 'utf-8');
        const doc = new CsvDocument(uri, content);

        doc.onDidChange((e) => {
            this._onDidChangeCustomDocument.fire(e);
        });

        return doc;
    }

    async resolveCustomEditor(
        document: CsvDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: []
        };

        const htmlPath = path.join(this.context.extensionPath, 'webview', 'editor.html');
        let html = fs.readFileSync(htmlPath, 'utf-8');

        const nonce = getNonce();
        const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">`;
        html = html.replace('</head>', csp + '\n</head>');
        html = html.replace(/<script>/g, `<script nonce="${nonce}">`);

        webviewPanel.webview.html = html;

        webviewPanel.webview.postMessage({
            type: 'init',
            content: document.content,
            fileName: path.basename(document.uri.fsPath)
        });

        webviewPanel.webview.onDidReceiveMessage(async (msg: { type: string; content?: string }) => {
            switch (msg.type) {
                case 'update':
                    if (msg.content !== undefined) {
                        document.updateContent(msg.content);
                    }
                    break;
                case 'save':
                    await this.saveDocument(document);
                    break;
                case 'ready':
                    webviewPanel.webview.postMessage({
                        type: 'init',
                        content: document.content,
                        fileName: path.basename(document.uri.fsPath)
                    });
                    break;
            }
        });

        webviewPanel.onDidChangeViewState((e) => {
            if (e.webviewPanel.visible) {
                webviewPanel.webview.postMessage({
                    type: 'init',
                    content: document.content,
                    fileName: path.basename(document.uri.fsPath)
                });
            }
        });
    }

    private async saveDocument(document: CsvDocument): Promise<void> {
        await fs.promises.writeFile(document.uri.fsPath, document.content, 'utf-8');
        document.markSaved();
    }

    async saveCustomDocument(
        document: CsvDocument,
        _cancellation: vscode.CancellationToken
    ): Promise<void> {
        await this.saveDocument(document);
    }

    async saveCustomDocumentAs(
        document: CsvDocument,
        destination: vscode.Uri,
        _cancellation: vscode.CancellationToken
    ): Promise<void> {
        await fs.promises.writeFile(destination.fsPath, document.content, 'utf-8');
    }

    async revertCustomDocument(
        document: CsvDocument,
        _cancellation: vscode.CancellationToken
    ): Promise<void> {
        const content = await fs.promises.readFile(document.uri.fsPath, 'utf-8');
        document.revert(content);
    }

    async backupCustomDocument(
        document: CsvDocument,
        context: vscode.CustomDocumentBackupContext,
        _cancellation: vscode.CancellationToken
    ): Promise<vscode.CustomDocumentBackup> {
        await fs.promises.writeFile(context.destination.fsPath, document.content, 'utf-8');
        return {
            id: context.destination.fsPath,
            delete: () => {
                try {
                    fs.unlinkSync(context.destination.fsPath);
                } catch { }
            }
        };
    }
}

function getNonce(): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

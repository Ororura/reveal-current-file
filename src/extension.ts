import * as vscode from 'vscode';

const COMMAND_ID = 'revealCurrentFile.revealInExplorer';

export function activate(context: vscode.ExtensionContext): void {
  const revealCurrentFileCommand = vscode.commands.registerCommand(COMMAND_ID, async () => {
    const resource = getActiveResourceUri();

    if (!resource) {
      await vscode.window.showInformationMessage('No active file is open in the editor.');
      return;
    }

    if (resource.scheme === 'untitled') {
      await vscode.window.showWarningMessage(
        'The current file has not been saved yet, so it cannot be revealed in Explorer.'
      );
      return;
    }

    if (!isRevealableScheme(resource.scheme)) {
      await vscode.window.showInformationMessage(
        'The current editor is not backed by a file that can be revealed in Explorer.'
      );
      return;
    }

    try {
      await vscode.commands.executeCommand('workbench.files.action.showActiveFileInExplorer');
      return;
    } catch {
      // Fall back to opening Explorer and revealing the resource directly.
    }

    try {
      await vscode.commands.executeCommand('workbench.view.explorer');
      await vscode.commands.executeCommand('revealInExplorer', resource);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.';
      await vscode.window.showErrorMessage(`Failed to reveal the current file in Explorer. ${message}`);
    }
  });

  context.subscriptions.push(revealCurrentFileCommand);
}

function getActiveResourceUri(): vscode.Uri | undefined {
  const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
  const activeInput = activeTab?.input;

  if (activeInput instanceof vscode.TabInputText) {
    return activeInput.uri;
  }

  if (activeInput instanceof vscode.TabInputTextDiff) {
    return activeInput.modified;
  }

  if (activeInput instanceof vscode.TabInputCustom) {
    return activeInput.uri;
  }

  if (activeInput instanceof vscode.TabInputNotebook) {
    return activeInput.uri;
  }

  if (activeInput instanceof vscode.TabInputNotebookDiff) {
    return activeInput.modified;
  }

  return vscode.window.activeTextEditor?.document.uri;
}

function isRevealableScheme(scheme: string): boolean {
  return scheme === 'file' || scheme === 'vscode-remote';
}

export function deactivate(): void {}

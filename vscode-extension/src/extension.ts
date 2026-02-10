import * as vscode from 'vscode';
import {
    Intent,
    ScaleLevel,
    VALID_SCALE_LEVELS,
    validateIntent,
    createIntent,
    generateStackRecommendation,
    StackRecommendation
} from './intentKit';

/**
 * This method is called when the extension is activated.
 */
export function activate(context: vscode.ExtensionContext): void {
    console.log('Intent Kit extension is now active');

    // Register commands
    const createIntentCmd = vscode.commands.registerCommand(
        'intentKit.createIntent',
        createIntentCommand
    );

    const getRecommendationCmd = vscode.commands.registerCommand(
        'intentKit.getRecommendation',
        getRecommendationCommand
    );

    const validateIntentCmd = vscode.commands.registerCommand(
        'intentKit.validateIntent',
        validateIntentCommand
    );

    context.subscriptions.push(createIntentCmd, getRecommendationCmd, validateIntentCmd);
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate(): void {
    console.log('Intent Kit extension deactivated');
}

/**
 * Command to create a new intent interactively.
 */
async function createIntentCommand(): Promise<void> {
    // Get intent name
    const name = await vscode.window.showInputBox({
        prompt: 'Enter intent name',
        placeHolder: 'my-web-app',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'Intent name cannot be empty';
            }
            return null;
        }
    });

    if (!name) {
        return;
    }

    // Get scale level
    const scaleLevel = await vscode.window.showQuickPick(
        VALID_SCALE_LEVELS.map(level => ({
            label: level,
            description: getScaleLevelDescription(level)
        })),
        {
            placeHolder: 'Select the scale level for your project'
        }
    );

    if (!scaleLevel) {
        return;
    }

    // Get requirements
    const requirementsInput = await vscode.window.showInputBox({
        prompt: 'Enter requirements (comma-separated)',
        placeHolder: 'REST API, Authentication, Database'
    });

    if (!requirementsInput) {
        return;
    }

    const requirements = requirementsInput
        .split(',')
        .map(r => r.trim())
        .filter(r => r.length > 0);

    if (requirements.length === 0) {
        vscode.window.showErrorMessage('At least one requirement is needed');
        return;
    }

    // Create and validate the intent
    const intent = createIntent(name, scaleLevel.label as ScaleLevel, requirements);
    const validation = validateIntent(intent);

    if (!validation.valid) {
        vscode.window.showErrorMessage(
            `Invalid intent: ${validation.errors.join(', ')}`
        );
        return;
    }

    // Generate recommendation
    const recommendation = generateStackRecommendation(intent);

    // Show the result
    showIntentPanel(intent, recommendation);
}

/**
 * Command to get stack recommendation for a scale level.
 */
async function getRecommendationCommand(): Promise<void> {
    const scaleLevel = await vscode.window.showQuickPick(
        VALID_SCALE_LEVELS.map(level => ({
            label: level,
            description: getScaleLevelDescription(level)
        })),
        {
            placeHolder: 'Select the scale level to get recommendations'
        }
    );

    if (!scaleLevel) {
        return;
    }

    // Create a minimal intent for recommendation
    const intent = createIntent(
        'temp-intent',
        scaleLevel.label as ScaleLevel,
        ['General requirement']
    );

    const recommendation = generateStackRecommendation(intent);

    vscode.window.showInformationMessage(
        `Recommended: ${recommendation.architecture} - ${recommendation.rationale}`
    );
}

/**
 * Command to validate an intent from the current file.
 */
async function validateIntentCommand(): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const text = editor.document.getText();

    try {
        const intent = JSON.parse(text) as Intent;
        const validation = validateIntent(intent);

        if (validation.valid) {
            vscode.window.showInformationMessage('✓ Intent is valid!');
        } else {
            vscode.window.showErrorMessage(
                `✗ Invalid intent: ${validation.errors.join(', ')}`
            );
        }
    } catch {
        vscode.window.showErrorMessage(
            'Could not parse current file as JSON intent'
        );
    }
}

/**
 * Returns a description for each scale level.
 */
function getScaleLevelDescription(level: ScaleLevel): string {
    const descriptions: Record<ScaleLevel, string> = {
        solo: 'Individual developer projects',
        startup: 'Small team, rapid iteration',
        team: 'Growing team, clear boundaries needed',
        enterprise: 'Large organization, multiple teams'
    };
    return descriptions[level];
}

/**
 * Shows the intent and recommendation in a webview panel.
 */
function showIntentPanel(intent: Intent, recommendation: StackRecommendation): void {
    const panel = vscode.window.createWebviewPanel(
        'intentKit',
        `Intent: ${intent.name}`,
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = getWebviewContent(intent, recommendation);
}

/**
 * Generates HTML content for the webview panel.
 */
function getWebviewContent(intent: Intent, recommendation: StackRecommendation): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intent Kit</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
        }
        h1 { color: var(--vscode-textLink-foreground); }
        h2 { margin-top: 20px; }
        .section {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 3px;
            margin: 2px;
        }
        ul { padding-left: 20px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <h1>🎯 ${intent.name}</h1>
    
    <div class="section">
        <h2>Intent Details</h2>
        <p><strong>Scale Level:</strong> <span class="badge">${intent.scaleLevel}</span></p>
        <p><strong>Requirements:</strong></p>
        <ul>
            ${intent.requirements.map(r => `<li>${r}</li>`).join('')}
        </ul>
    </div>
    
    <div class="section">
        <h2>📊 Stack Recommendation</h2>
        <p><strong>Architecture:</strong> <span class="badge">${recommendation.architecture}</span></p>
        <p><strong>Rationale:</strong> ${recommendation.rationale}</p>
        <p><strong>Considerations:</strong></p>
        <ul>
            ${recommendation.considerations.map(c => `<li>${c}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;
}

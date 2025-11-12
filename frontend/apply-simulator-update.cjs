/**
 * Automated Script to Apply Sales Rep Simulator Critical Updates
 *
 * This script will:
 * 1. Read the current App.jsx
 * 2. Add new state variables after line 86
 * 3. Replace the SalesRepSimulator component (lines 972-1897)
 * 4. Save the updated file
 * 5. Create a timestamped backup
 */

const fs = require('fs');
const path = require('path');

const APP_JSX_PATH = path.join(__dirname, 'src', 'App.jsx');
const UPDATE_FILE_PATH = path.join(__dirname, 'sales-rep-simulator-update.jsx');
const BACKUP_DIR = path.join(__dirname, 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('='.repeat(80));
console.log('SALES REP SIMULATOR - CRITICAL UPDATE SCRIPT');
console.log('='.repeat(80));
console.log('');

// Step 1: Create timestamped backup
console.log('[1/5] Creating timestamped backup...');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupPath = path.join(BACKUP_DIR, `App.jsx.backup-${timestamp}.jsx`);

try {
  const originalContent = fs.readFileSync(APP_JSX_PATH, 'utf8');
  fs.writeFileSync(backupPath, originalContent, 'utf8');
  console.log(`      ✓ Backup created: ${backupPath}`);
} catch (error) {
  console.error(`      ✗ Failed to create backup: ${error.message}`);
  process.exit(1);
}

// Step 2: Read files
console.log('[2/5] Reading files...');
let appContent, updateContent;

try {
  appContent = fs.readFileSync(APP_JSX_PATH, 'utf8');
  updateContent = fs.readFileSync(UPDATE_FILE_PATH, 'utf8');
  console.log('      ✓ Files read successfully');
} catch (error) {
  console.error(`      ✗ Failed to read files: ${error.message}`);
  process.exit(1);
}

// Step 3: Extract new state variables from update file
console.log('[3/5] Extracting new state variables...');
const stateVarsRegex = /\/\/ NEW STATE VARIABLES TO ADD.*?\n([\s\S]*?)\/\/ ={20,}/;
const stateVarsMatch = updateContent.match(stateVarsRegex);

if (!stateVarsMatch) {
  console.error('      ✗ Could not find state variables in update file');
  process.exit(1);
}

const newStateVars = stateVarsMatch[1].trim();
console.log('      ✓ State variables extracted');

// Step 4: Extract new component from update file
console.log('[4/5] Extracting new component...');
const componentRegex = /const SalesRepSimulator = \(\) => \{[\s\S]*?\n\};$/m;
const componentMatch = updateContent.match(componentRegex);

if (!componentMatch) {
  console.error('      ✗ Could not find SalesRepSimulator component in update file');
  process.exit(1);
}

const newComponent = componentMatch[0];
console.log('      ✓ Component extracted');

// Step 5: Apply changes to App.jsx
console.log('[5/5] Applying changes to App.jsx...');

// Split content into lines for precise manipulation
const lines = appContent.split('\n');

// Find line 86 (after setActiveScenario)
let insertLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('setActiveScenario') && lines[i].includes('useState')) {
    insertLine = i + 1;
    break;
  }
}

if (insertLine === -1) {
  console.error('      ✗ Could not find insertion point for state variables');
  process.exit(1);
}

// Find SalesRepSimulator component
let componentStart = -1;
let componentEnd = -1;
let braceCount = 0;
let foundStart = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('const SalesRepSimulator = ()')) {
    componentStart = i;
    foundStart = true;
  }

  if (foundStart) {
    // Count braces to find the end
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }

    // When braces balance and we find closing }; that's the end
    if (braceCount === 0 && line.trim().endsWith('};')) {
      componentEnd = i;
      break;
    }
  }
}

if (componentStart === -1 || componentEnd === -1) {
  console.error('      ✗ Could not find SalesRepSimulator component boundaries');
  console.error(`        Component start: ${componentStart}, end: ${componentEnd}`);
  process.exit(1);
}

console.log(`      - Found component at lines ${componentStart + 1} to ${componentEnd + 1}`);
console.log(`      - Inserting state variables at line ${insertLine + 1}`);

// Build the new content
const beforeStateVars = lines.slice(0, insertLine);
const afterStateVars = lines.slice(insertLine, componentStart);
const afterComponent = lines.slice(componentEnd + 1);

// Combine everything
const newLines = [
  ...beforeStateVars,
  '',
  '  // Marginal Cost State Variables (Critical Update)',
  ...newStateVars.split('\n').map(line => '  ' + line),
  '',
  ...afterStateVars,
  '  // Sales Rep Simulator Tab (Updated with Marginal Costs)',
  newComponent,
  ...afterComponent
];

const newContent = newLines.join('\n');

// Step 6: Write updated file
try {
  fs.writeFileSync(APP_JSX_PATH, newContent, 'utf8');
  console.log('      ✓ Changes applied successfully');
} catch (error) {
  console.error(`      ✗ Failed to write updated file: ${error.message}`);
  console.error('      ! Restoring from backup...');

  try {
    fs.writeFileSync(APP_JSX_PATH, appContent, 'utf8');
    console.log('      ✓ Original file restored');
  } catch (restoreError) {
    console.error(`      ✗ Failed to restore: ${restoreError.message}`);
  }

  process.exit(1);
}

// Summary
console.log('');
console.log('='.repeat(80));
console.log('UPDATE COMPLETE!');
console.log('='.repeat(80));
console.log('');
console.log('CHANGES APPLIED:');
console.log('  ✓ Added 6 new state variables for marginal costs and capacity');
console.log('  ✓ Replaced SalesRepSimulator component with enhanced version');
console.log('  ✓ Added cost waterfall chart');
console.log('  ✓ Added capacity analysis');
console.log('  ✓ Added ROI comparison (wrong vs correct)');
console.log('  ✓ Enhanced alerts and recommendations');
console.log('');
console.log('NEW FEATURES:');
console.log('  • Marginal cost per lead ($50-$150)');
console.log('  • Marginal cost per close ($100-$300)');
console.log('  • Team capacity analysis');
console.log('  • Additional staff calculation');
console.log('  • TRUE ROI with complete costs');
console.log('  • Cost breakdown visualizations');
console.log('');
console.log('BACKUP LOCATION:');
console.log(`  ${backupPath}`);
console.log('');
console.log('NEXT STEPS:');
console.log('  1. Review the changes in your code editor');
console.log('  2. Start your development server');
console.log('  3. Navigate to the Sales Rep Simulator tab');
console.log('  4. Test with different scenarios');
console.log('  5. Compare old ROI (wrong) vs new ROI (correct)');
console.log('');
console.log('IMPORTANT:');
console.log('  The simulator now shows TRUE profitability including:');
console.log('  - Cold caller compensation');
console.log('  - Marginal processing costs (lead + close)');
console.log('  - Sales team commissions (7.9%)');
console.log('  - Additional staff if capacity exceeded');
console.log('');
console.log('  This provides ACCURATE financial analysis for the hiring decision.');
console.log('');
console.log('='.repeat(80));

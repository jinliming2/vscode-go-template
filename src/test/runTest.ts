import path from 'path';

import { runTests } from 'vscode-test';

const main = async () => {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, `..${path.sep}..${path.sep}`);

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, `.${path.sep}suite${path.sep}index`);

    const launchArgs = ['--disable-extensions'];

    // Download VS Code, unzip it and run the integration test
    await runTests({ extensionDevelopmentPath, extensionTestsPath, launchArgs });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
};

main();

import path from 'path';
import Mocha from 'mocha';
import glob from 'glob';
import NYC from 'nyc';

export const run = async (): Promise<void> => {
  const nyc = new NYC({
    cwd: path.join(__dirname, '..', '..', '..'),
    exclude: ['**/test/**', '.vscode-test/**'],
    reporter: ['text', 'html'],
    all: true,
    instrument: true,
    hookRequire: true,
    hookRunInContext: true,
    hookRunInThisContext: true,
  });
  nyc.wrap();
  await nyc.reset();

  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  });

  const testsRoot = path.resolve(__dirname, '..');

  try {
    await new Promise<void>((resolve, reject) => {
      glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
        if (err) {
          return reject(err);
        }

        // Add files to the test suite
        files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

        try {
          // Run the mocha test
          mocha.run(failures => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              resolve();
            }
          });
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });
    });
  } catch (e) {
    console.error(e);
    throw e;
  }

  try {
    nyc.writeCoverageFile();

    // Hack: https://github.com/microsoft/vscode/issues/74173
    const writeBuffer: string[] = [];
    process.stdout.write = (buffer: string): boolean => {
      writeBuffer.push(buffer);
      return true;
    };
    process.stdout.columns = 120;

    await nyc.report();

    console.log(writeBuffer.join(''));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

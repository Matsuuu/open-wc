/* eslint-disable no-restricted-syntax, no-await-in-loop, no-console, import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const rimrafSync = require('rimraf');
const childProcess = require('child_process');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const exec = promisify(childProcess.exec);
const rimraf = promisify(rimrafSync);

const srcDir = path.join(__dirname, 'src');
const outputDir = path.join(__dirname, '..', 'docs', '.vuepress', 'public', 'codelabs');

async function main() {
  await rimraf(outputDir);
  const categories = await readdir(srcDir);

  for (const category of categories) {
    const categorySrcDir = path.join(srcDir, category);
    const categoryDir = path.join(outputDir, category);

    console.log(`Exporting category ${category}`);
    try {
      await exec(`claat export -o ${categoryDir} ${categorySrcDir}/*.md`);
    } catch (error) {
      console.error(error);
      console.log();
      console.log(
        'Failed to export codelabs, did you install the codelab CLI? See codelabs/README.md for instructions.',
      );
    }
  }
}

main();

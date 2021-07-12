import path from 'path';
import { read, write } from './FileLoader';
import { parse } from './Parser';

(async function main() {
  const args = parseArguments();
  validateFilePath(args.filePath);

  const fileData = await read(args.filePath);

  const htmlTree = parse(fileData);

  const destinationPath = getDestinationPath(args.filePath);
  write(destinationPath, htmlTree.toHtml());
})();

function getDestinationPath(targetPath: string): string {
  const extension = path.extname(targetPath);
  
  return targetPath.substring(0, targetPath.length - extension.length) + '.html';
}

function validateFilePath(filePath: string): void {
  if (!filePath)
    throw new Error('File must be specified');

  if (path.extname(filePath) !== '.htnoml')
    throw new Error('File must be of type: ".htnoml"');
}

function parseArguments(): Arguments {
  const args: Arguments = {};

  const argv = process.argv;
  let index = 0;
  
  while(index < argv.length) {
    switch (argv[index]) {
      case '-f':
        index++;
        args.filePath = argv[index];
        break;
    }
    index++;
  }

  return args;
}


interface Arguments {
  filePath?: string;
}

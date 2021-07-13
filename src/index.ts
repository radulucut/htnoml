import { read, write, getDestinationPath, validateFilePath } from './FileLoader';
import { parse } from './Parser';

(async function main() {
  const args = parseArguments();
  validateFilePath(args.filePath);

  const fileData = await read(args.filePath);

  const htmlTree = parse(fileData);

  const destinationPath = getDestinationPath(args.filePath);
  write(destinationPath, htmlTree.toHtml());
})();

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

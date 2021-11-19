import { read, write, getDestinationPath, validateFilePath } from './FileLoader';
import { parse } from './Parser';

import { InputStream } from './InputStream';
import { TokenStream } from './TokenStream';
import { Parser } from './ParserV2';

(async function main() {
  const args = parseArguments();
  validateFilePath(args.filePath);

  const fileData = await read(args.filePath);

  const destinationPath = getDestinationPath(args.filePath);
  const parser = Parser(TokenStream(InputStream(fileData)));
  write(destinationPath, JSON.stringify(parser.parse(), null, '\t'));
//  const htmlTree = parse(fileData);

//  const destinationPath = getDestinationPath(args.filePath);
//  write(destinationPath, htmlTree.toHtml());
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

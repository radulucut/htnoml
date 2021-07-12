import { read, write } from './FileLoader';
import { parse } from './Parser';

(async function main() {
  const fileData = await read('example.htnoml');

  const parseResult = parse(fileData);

  write('example.html', parseResult.toHtml());
})();


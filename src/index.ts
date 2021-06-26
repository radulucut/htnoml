import { loadFile } from './file-loader';
import { parse } from './parser';

(async function main() {
  const fileData = await loadFile('example.htnoml');

  const parseResult = parse(fileData);

  console.log(JSON.stringify(parseResult));
})();

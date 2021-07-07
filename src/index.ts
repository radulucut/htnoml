import { loadFile } from './FileLoader';
import { parse } from './Parser';

(async function main() {
  const fileData = await loadFile('example.htnoml');

  const parseResult = parse(fileData);

  console.log(parseResult.toHtml());
  console.log(JSON.stringify(parseResult));
})();


import { readFile, writeFile } from 'fs';
import parse from './parse.js';

readFile('example.htnoml', 'utf8', (err, data) => {
  if(err) 
    return console.log(err);
  
  const tree = parse(data);

  // TODO: transform to html
  
  writeFile('example.html', str, (err) => {
    if(err)
      console.log(err);
  });
});

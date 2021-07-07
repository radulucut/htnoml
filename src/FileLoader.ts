import { readFile } from 'fs';

export async function loadFile(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(filename, 'utf8', (err, data) => {
      if(err)
        return reject(err);
      
      resolve(data);
    });
  })
}

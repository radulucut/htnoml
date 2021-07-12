import { readFile, writeFile } from 'fs';

export async function read(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(path, { encoding: 'utf8' }, (err, data) => {
      if (err)
        return reject(err);
      
      resolve(data);
    });
  })
}

export async function write(path: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(path, data, { encoding: 'utf8' }, err => {
      if (err)
        return reject(err);

      resolve();
    });
  });
}

import path from 'path';
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

export function getDestinationPath(targetPath: string): string {
  const extension = path.extname(targetPath);
  
  return targetPath.substring(0, targetPath.length - extension.length) + '.html';
}

export function validateFilePath(filePath: string): void {
  if (!filePath)
    throw new Error('File must be specified');

  if (path.extname(filePath) !== '.htnoml')
    throw new Error('File must be of type: ".htnoml"');
}



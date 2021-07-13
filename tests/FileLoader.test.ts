import { getDestinationPath, validateFilePath } from '../src/FileLoader';

describe('FileLoader', () => {
  describe('getDestinationPath', () => {
    test('should return correct path', () => {
      const filePath = '~/htnoml/test/example.htnoml';

      const destinationPath = getDestinationPath(filePath);

      expect(destinationPath).toEqual('~/htnoml/test/example.html');
    });
  });

  describe('validateFilePath', () => {
    test('should throw missing file error', () => {
      expect(() => { validateFilePath(undefined); }).toThrow('File must be specified');
    });

    test('should throw invalid file type error', () => {
      expect(() => { validateFilePath('example.txt'); }).toThrow('File must be of type: ".htnoml"');
    });
  });
});

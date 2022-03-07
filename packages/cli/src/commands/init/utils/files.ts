import fs from 'fs';
import path from 'path'

  export const getCurrentDirectoryBase = () => {
    return path.basename(process.cwd());
  };

  export const directoryExists = (filePath: string) => {
    return fs.existsSync(filePath);
  };

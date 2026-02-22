import { execSync } from 'child_process';
import fs, { readSync } from 'fs';
import path from 'path';

export function getTemplateName(){
  return fs.readdirSync(path.join(import.meta.dirname, 'template'), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

export function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, 'utf-8')
  fs.writeFileSync(file, callback(content), 'utf-8')
}

export function getUser(){
  const author: { name?: string, email?: string } = {}
  author.name = execSync('git config user.name').toString().trim();
  author.email = execSync('git config user.email').toString().trim();
  return author;
}

export function getPath(){
  return process.cwd();
}

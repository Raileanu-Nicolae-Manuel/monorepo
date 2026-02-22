import { execSync } from 'child_process';
import fs from 'fs';

const TEMPLATE_DIR = 'template';

export function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, 'utf-8')
  fs.writeFileSync(file, callback(content), 'utf-8')
}

export function getTemplateName() {
  return fs.readdirSync(TEMPLATE_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
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

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const GITHUB_TEMPLATES_API = 'https://api.github.com/repos/Raileanu-Nicolae-Manuel/monorepo/contents/packages/create-rnm-bun/template?ref=main';

export function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, 'utf-8')
  fs.writeFileSync(file, callback(content), 'utf-8')
}

type GitHubContentItem = {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  download_url?: string;
};

async function getContents(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    let details = '';
    try {
      const payload = await response.json() as { message?: string };
      details = payload.message ? `: ${payload.message}` : '';
    } catch {
      details = '';
    }

    throw new Error(`Failed to load templates from GitHub (${response.status} ${response.statusText})${details}`);
  }

  return (await response.json()) as GitHubContentItem[];
}

async function copyDirectoryFromGithub(contentsApiUrl: string, targetDir: string) {
  const items = await getContents(contentsApiUrl);

  fs.mkdirSync(targetDir, { recursive: true });

  for (const item of items) {
    if (item.type === 'dir') {
      const subdirUrl = `${GITHUB_TEMPLATES_API}/${item.name}?ref=main`;
      await copyDirectoryFromGithub(subdirUrl, path.join(targetDir, item.name));
      continue;
    }

    if (item.type !== 'file' || !item.download_url) {
      continue;
    }

    const fileResponse = await fetch(item.download_url);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download ${item.path} (${fileResponse.status} ${fileResponse.statusText})`);
    }

    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());
    const filePath = path.join(targetDir, item.name);
    fs.writeFileSync(filePath, fileBuffer);
  }
}

export async function copyTemplateFromGithub(templateName: string, targetDir: string) {
  const sourceApiUrl = `${GITHUB_TEMPLATES_API}/${templateName}?ref=main`;
  await copyDirectoryFromGithub(sourceApiUrl, targetDir);
}

export async function getTemplateName() {
  const items = await getContents(GITHUB_TEMPLATES_API);

  return items
    .filter(item => item.type === 'dir')
    .map(item => item.name);
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

import { copyFile, cp, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const clientDir = path.join(distDir, "client");

async function copyClientToDistRoot() {
  if (!existsSync(clientDir)) return;

  const entries = await readdir(clientDir);
  await Promise.all(
    entries.map((entry) =>
      cp(path.join(clientDir, entry), path.join(distDir, entry), {
        recursive: true,
        force: true,
        verbatimSymlinks: true,
      }),
    ),
  );
}

async function ensureIndexHtml() {
  const indexPath = path.join(distDir, "index.html");
  if (existsSync(indexPath)) return;

  const shellPath = path.join(distDir, "_shell.html");
  if (existsSync(shellPath)) {
    await copyFile(shellPath, indexPath);
    return;
  }

  throw new Error("No index.html was found in dist or dist/client after build.");
}

async function ensure404Fallback() {
  await copyFile(path.join(distDir, "index.html"), path.join(distDir, "404.html"));
}

async function writeHtaccess() {
  const htaccess = `Options -MultiViews
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule . index.html [L]
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(html|htm)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;

  await writeFile(path.join(distDir, ".htaccess"), htaccess);
}

async function writeCpanelReadme() {
  const readme = `cPanel deployment files

Upload the CONTENTS of this dist folder to public_html, not the dist folder itself.

Required files are now at the root of dist:
- index.html
- .htaccess
- _build/ assets
- 404.html fallback

The frontend calls the Lovable Cloud backend directly from the browser.
`;
  await writeFile(path.join(distDir, "CPANEL_DEPLOY_README.txt"), readme);
}

async function verifyDistRoot() {
  const index = path.join(distDir, "index.html");
  const info = await stat(index);
  if (!info.isFile()) throw new Error("dist/index.html is not a file.");
}

await mkdir(distDir, { recursive: true });
await copyClientToDistRoot();
await ensureIndexHtml();
await ensure404Fallback();
await writeHtaccess();
await writeCpanelReadme();
await verifyDistRoot();

console.log("cPanel package ready: zip and upload the contents of dist/.");
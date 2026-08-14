import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const booksDir = join(root, 'src/content/books');
const chaptersDir = join(root, 'src/content/chapters');
const outputDir = join(root, 'work/manuscripts');

const escapeTypst = (value) => value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
const stripFrontmatter = (source) => source.replace(/^---\s*[\s\S]*?\s---\s*/, '').trim();
const parseFrontmatter = (source) => {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  const result = {};
  for (const line of (match?.[1] || '').split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (/^\d+$/.test(value)) value = Number(value);
    result[key] = value;
  }
  return result;
};

await mkdir(outputDir, { recursive: true });
const bookFiles = (await readdir(booksDir)).filter((file) => file.endsWith('.json'));

for (const bookFile of bookFiles) {
  const slug = bookFile.replace(/\.json$/, '');
  const book = JSON.parse(await readFile(join(booksDir, bookFile), 'utf8'));
  const folder = join(chaptersDir, slug);
  let chapterFiles = [];
  try { chapterFiles = (await readdir(folder)).filter((file) => /\.mdx?$/.test(file)); } catch { continue; }
  const chapters = [];
  for (const file of chapterFiles) {
    const source = await readFile(join(folder, file), 'utf8');
    const data = parseFrontmatter(source);
    if (data.draft) continue;
    chapters.push({ data, body: stripFrontmatter(source) });
  }
  chapters.sort((a, b) => a.data.order - b.data.order);
  if (!chapters.length) continue;

  const markdown = [
    '---',
    `title: "${book.title.replaceAll('"', '\\"')}"`,
    `subtitle: "${(book.subtitle || '').replaceAll('"', '\\"')}"`,
    `author: "${book.author.replaceAll('"', '\\"')}"`,
    `date: "${book.published}"`,
    `description: "${book.description.replaceAll('"', '\\"')}"`,
    'lang: en-US',
    'rights: "All rights reserved."',
    '---',
    '',
    ...chapters.flatMap((chapter) => [`# ${chapter.data.title}`, '', chapter.body, '']),
  ].join('\n');
  await writeFile(join(outputDir, `${slug}.md`), markdown);

  const wrapper = `#set document(title: "${escapeTypst(book.title)}", author: ("${escapeTypst(book.author)}",))
#set page(paper: "a5", margin: (inside: 24mm, outside: 19mm, top: 20mm, bottom: 23mm), numbering: "1")
#set text(font: ("New Computer Modern", "Libertinus Serif", "Times New Roman"), size: 10.5pt, lang: "en")
#set par(justify: true, leading: 0.72em, first-line-indent: 1.2em)
#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  v(20%)
  set align(center)
  set text(size: 22pt, weight: "regular")
  block(above: 0pt, below: 30pt)[#it.body]
}
#align(center + horizon)[
  #text(size: 28pt, weight: "regular")[${escapeTypst(book.title)}]
  #v(14pt)
  #text(size: 11pt, style: "italic")[${escapeTypst(book.subtitle || '')}]
  #v(28pt)
  #smallcaps[${escapeTypst(book.author)}]
]
#pagebreak()
#include "${slug}.body.typ"
`;
  await writeFile(join(outputDir, `${slug}.typ`), wrapper);
}

console.log(`Prepared ${bookFiles.length} book record(s).`);

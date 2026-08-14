# Storyfoundry

A reader-first home for serialized fiction. Storyfoundry turns portable Markdown chapters into a fast website, full-text search, an RSS feed, EPUB editions, and typeset PDFs.

## Start writing

Book metadata lives in `src/content/books`. Chapters live in `src/content/chapters/<book-slug>`. Copy an existing file, update its frontmatter, and write beneath the closing `---`.

You can also install the repository in [Pages CMS](https://app.pagescms.org/) for a browser-based editor. Its form configuration is already included in `.pages.yml`.

## Run locally

```sh
npm install
npm run dev
```

The search index is created by the production build:

```sh
npm run build
npm run preview
```

## Generate EPUB and PDF editions

Install Node.js, Pandoc, and Typst, then run:

```sh
npm run books:build
```

The files appear in `public/downloads`. GitHub Actions performs this automatically before every deployment.

## Publish on GitHub Pages

1. Create a GitHub repository and push this project to its `main` branch.
2. Open **Settings → Pages** and select **GitHub Actions** as the source.
3. Run the included **Build books and publish site** workflow.

For a custom domain, set a repository Actions variable named `SITE_URL` and pass it to the build environment, or replace the fallback `site` value in `astro.config.mjs`. Add your domain to `public/CNAME` after configuring DNS.

## Replace the sample identity

Search for `Storyfoundry`, `Mara Venn`, and `The Orchard at the End of Space`. These are deliberately realistic placeholders showing how the finished site behaves.

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const chapters = (await getCollection('chapters', ({ data }) => !data.draft)).sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return rss({
    title: 'Storyfoundry',
    description: 'Original novels and stories, published one chapter at a time.',
    site: new URL(base, context.site),
    items: chapters.map((chapter) => ({
      title: chapter.data.title,
      description: chapter.data.description,
      pubDate: chapter.data.published,
      link: `library/${chapter.data.book}/${chapter.id.split('/').pop()}/`,
    })),
  });
}

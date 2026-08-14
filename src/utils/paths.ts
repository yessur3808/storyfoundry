export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}

export function chapterPath(book: string, chapterId: string) {
  const slug = chapterId.split('/').pop();
  return withBase(`/library/${book}/${slug}/`);
}

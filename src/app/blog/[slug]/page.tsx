import {
  fetchBySlug,
  fetchPageBlocks,
  fetchPages,
  notion,
} from "@/app/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";

export async function generateStaticParams() {
  const posts = await fetchPages();
  return posts.results.map((post: any) => ({
    slug: post.properties.slug?.rich_text?.[0]?.plain_text || post.id,
  }));
}
export default async function Page({ params }: { params: { slug: string } }) {
  const post = await fetchBySlug(params.slug);
  if (!post) {
    return <div>Post not found</div>;
  }
  const blocks = await fetchPageBlocks(post.id);
  const renderer = new NotionRenderer({ client: notion });

  renderer.use(hljsPlugin({}));
  renderer.use(bookmarkPlugin(undefined));

  const html = await renderer.render(...blocks);
  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: html }}></div>
  );
}

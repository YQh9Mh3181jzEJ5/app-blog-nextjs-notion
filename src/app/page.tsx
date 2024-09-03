import Link from "next/link";
import { fetchPages } from "./lib/notion";

export default async function Home() {
  const posts = await fetchPages();
  try {
    return (
      <main>
        {posts.results.map((post: any) => {
          const title =
            post.properties.Title?.title?.[0]?.plain_text || "No Title";
          const slug =
            post.properties.slug?.rich_text?.[0]?.plain_text || post.id;
          return (
            <article key={post.id}>
              <Link href={`/blog/${slug}`}>{title}</Link>
            </article>
          );
        })}
      </main>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <main className="">
        エラーが発生しました。しばらくしてから再度お試しください。
      </main>
    );
  }
}

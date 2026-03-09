import { SITE_INFO } from "@/config/site"
import { getAllDocs } from "@/features/doc/data/documents"

async function getContent() {
  const allPosts = getAllDocs()
  const projects = allPosts
    .map((item) => {
      const category = item.metadata.category
        ? `\n\nCategory: ${item.metadata.category}`
        : ""
      const description = item.metadata.description
        ? `\n\n${item.metadata.description.trim()}`
        : ""
      return `## ${item.metadata.title}\n\nProject URL: ${SITE_INFO.url}/projects/${item.slug}${category}${description}`
    })
    .join("\n\n")

  return `# Projects\n\n${projects}`
}

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return new Response(await getContent(), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}

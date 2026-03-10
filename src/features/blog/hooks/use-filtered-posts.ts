import type { Doc } from "@/features/doc/types/document"

import { useSearchQuery } from "./use-search-query"

const normalize = (text: string) => text.toLowerCase().replaceAll(" ", "")

const matchesQuery = (post: Doc, normalizedQuery: string) => {
  const normalizedTitle = normalize(post.metadata.title)
  const normalizedDescription = normalize(post.metadata.description)

  const categories = Array.isArray(post.metadata.category)
    ? post.metadata.category
    : post.metadata.category
      ? [post.metadata.category]
      : []
  const matchesCategory = categories.some((cat) =>
    normalize(cat).includes(normalizedQuery)
  )

  const tags = post.metadata.tags || []
  const matchesTag = tags.some((tag) =>
    normalize(tag).includes(normalizedQuery)
  )

  return (
    normalizedTitle.includes(normalizedQuery) ||
    normalizedDescription.includes(normalizedQuery) ||
    matchesCategory ||
    matchesTag
  )
}

const searchPosts = (
  posts: Doc[],
  query: string | null,
  category: string | null
) => {
  let filtered = posts

  if (category && category !== "all") {
    filtered = filtered.filter((post) => {
      const docCategory = post.metadata.category

      if (Array.isArray(docCategory)) {
        return docCategory.some(
          (c) => c.toLowerCase() === category.toLowerCase()
        )
      }

      return docCategory?.toLowerCase() === category.toLowerCase()
    })
  }

  if (!query) return filtered

  const normalizedQuery = normalize(query)
  return filtered.filter((post) => matchesQuery(post, normalizedQuery))
}

export function useFilteredPosts(posts: Doc[]) {
  const { query, category } = useSearchQuery()
  return searchPosts(posts, query, category)
}

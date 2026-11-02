import type { Doc } from "@/features/doc/types/document"

import { PostItem } from "./post-item"

export function PostList({ posts }: { posts: Doc[] }) {
  return (
    <div className="relative pt-4">
      <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2 lg:grid-cols-3">
        <div className="border-r border-edge" />
        <div className="border-l border-edge lg:border-r" />
        <div className="hidden border-l border-edge lg:block" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostItem
            key={post.slug}
            post={post}
            shouldPreloadImage={index <= 4}
          />
        ))}

        {posts.length === 0 && (
          <div className="screen-line-before screen-line-after p-4">
            <p className="font-mono text-sm">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

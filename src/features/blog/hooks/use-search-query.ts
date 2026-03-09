import { useQueryState } from "nuqs"

export function useSearchQuery() {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
  })

  const [category, setCategory] = useQueryState("category", {
    defaultValue: "all",
  })

  return { query, setQuery, category, setCategory }
}

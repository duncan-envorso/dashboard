import { BlogPost } from "@/types";

export async function getPosts(): Promise<BlogPost[]> {
    return [
      { id: 1, title: "First Blog Post", author: "John Doe", status: "published", createdAt: "2024-09-01" },
      { id: 2, title: "Second Blog Post", author: "Jane Smith", status: "draft", createdAt: "2024-09-02" },
      { id: 3, title: "Third Blog Post", author: "Alice Johnson", status: "published", createdAt: "2024-09-03" },
      { id: 4, title: "Fourth Blog Post", author: "Bob Brown", status: "archived", createdAt: "2024-09-04" },
    ]
  }


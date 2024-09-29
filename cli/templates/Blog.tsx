type BlogPost = {
  id: number;
  title: string;
  content: string;
};

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Hello World",
    content: "Welcome to my first blog post. This is just an example of a blog written in TSX."
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is the second blog post, showcasing how to add more entries to the blog."
  }
];

export const Blog = () => {
  return (
    <div>
      <h1>My Simple Blog</h1>
      {blogPosts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};
// components/Blog.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type BlogPost = {
    id: number;
    title: string;
    content: string;
};

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: 'Hello World',
        content:
            'Welcome to my first blog post. This is just an example of a blog written in TSX.',
    },
    {
        id: 2,
        title: 'Second Post',
        content:
            'This is the second blog post, showcasing how to add more entries to the blog.',
    },
];

export const Blog = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    My Simple Blog
                </h1>
                <div className="space-y-6">
                    {blogPosts.map((post) => (
                        <Card key={post.id} className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    {post.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{post.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;

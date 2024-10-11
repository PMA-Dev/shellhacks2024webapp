// src/pages/project/DBSchemaPage.tsx

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import shadcn Tabs components
import { useDBSchema } from '@/hooks/useDBSchema';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function DBSchemaPage() {
    const {
        collections,
        activeCollectionId,
        setActiveCollectionId,
        readSchema,
        writeSchema,
    } = useDBSchema();
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        if (activeCollectionId) {
            const initialContent = readSchema(activeCollectionId);
            setContent(initialContent);
            console.log('initial content:', initialContent);
        }
    }, [activeCollectionId]);

    const handleSave = () => {
        if (activeCollectionId) {
            writeSchema(activeCollectionId, content);
            toast('Schema saved successfully!');
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        setContent(value!);
    };

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Database Schema</h2>
            <Tabs
                value={activeCollectionId!}
                onValueChange={setActiveCollectionId}
            >
                <TabsList>
                    {collections.map((collection) => (
                        <TabsTrigger key={collection.id} value={collection.id}>
                            {collection.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {collections.map((collection) => (
                    <TabsContent key={collection.id} value={collection.id}>
                        <div className="mb-4 mt-4 border rounded">
                            <Editor
                                height="60vh"
                                defaultLanguage="typescript"
                                value={
                                    activeCollectionId === collection.id
                                        ? content
                                        : ''
                                }
                                onChange={handleEditorChange}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>
                        <Button onClick={handleSave}>Save Schema</Button>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

export default DBSchemaPage;

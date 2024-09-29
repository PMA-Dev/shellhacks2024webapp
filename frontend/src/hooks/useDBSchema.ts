// src/hooks/useDBSchema.ts

import { useState, useEffect } from "react";

export interface CollectionSchema {
  id: string;
  name: string;
  content: string;
}

export const useDBSchema = () => {
  const [collections, setCollections] = useState<CollectionSchema[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // TODO: Integrate with backend to fetch the list of collections and their schemas
    const fetchCollections = async () => {
      // Sample data for demonstration
      const fetchedCollections = [
        {
          id: "1",
          name: "User",
          content: `model User {\n  id    Int    @id @default(autoincrement())\n  name  String\n}`,
        },
        {
          id: "2",
          name: "Post",
          content: `model Post {\n  id      Int    @id @default(autoincrement())\n  title   String\n  content String\n}`,
        },
      ];
      setCollections(fetchedCollections);
      setActiveCollectionId(fetchedCollections[0]?.id || null);
    };

    fetchCollections();
  }, []);

  const readSchema = (collectionId: string) => {
    const collection = collections.find((col) => col.id === collectionId);
    return collection?.content || "";
  };

  const writeSchema = (collectionId: string, content: string) => {
    // TODO: Integrate with backend to write to the DB schema file for the specific collection
    setCollections((prevCollections) =>
      prevCollections.map((col) =>
        col.id === collectionId ? { ...col, content } : col
      )
    );
  };

  return {
    collections,
    activeCollectionId,
    setActiveCollectionId,
    readSchema,
    writeSchema,
  };
};

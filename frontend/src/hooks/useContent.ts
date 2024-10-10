// src/hooks/useContent.ts

import { useState } from 'react';

export interface Asset {
    id: string;
    name: string;
    type: 'image' | 'text';
    content: string; // URL for images, text content for text assets
}

export const useContent = () => {
    const [assets, setAssets] = useState<Asset[]>([
        // Sample initial data
        {
            id: '1',
            name: 'Sample Image',
            type: 'image',
            content: 'https://via.placeholder.com/150',
        },
        {
            id: '2',
            name: 'Sample Text',
            type: 'text',
            content: 'This is a sample text asset.',
        },
    ]);

    const addAsset = (asset: Asset) => {
        // TODO: Integrate with backend to add a new asset
        setAssets([...assets, asset]);
    };

    const deleteAsset = (assetId: string) => {
        // TODO: Integrate with backend to delete the asset
        setAssets(assets.filter((asset) => asset.id !== assetId));
    };

    return {
        assets,
        addAsset,
        deleteAsset,
    };
};

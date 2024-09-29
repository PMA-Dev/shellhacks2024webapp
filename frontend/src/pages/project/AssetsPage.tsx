// src/pages/project/AssetsPage.tsx

import React, { useState } from 'react';
import { useContent } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash } from 'lucide-react';

function AssetsPage() {
    const { assets, addAsset, deleteAsset } = useContent();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [assetData, setAssetData] = useState<Partial<Asset>>({
        name: '',
        type: 'image',
        content: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAssetData({ ...assetData, [e.target.name]: e.target.value });
    };

    const handleAddAsset = () => {
        const newAsset: Asset = {
            id: Date.now().toString(),
            name: assetData.name || '',
            type: assetData.type as 'image' | 'text',
            content: assetData.content || '',
        };
        addAsset(newAsset);
        setIsDialogOpen(false);
        setAssetData({ name: '', type: 'image', content: '' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Assets</h2>
                <Button onClick={() => setIsDialogOpen(true)} className="flex items-center">
                    <Plus className="mr-2" />
                    Add Asset
                </Button>
            </div>

            {/* Assets List */}
            <div className="grid grid-cols-3 gap-4">
                {assets.map((asset) => (
                    <div key={asset.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{asset.name}</h3>
                            <Button variant="ghost" size="icon" onClick={() => deleteAsset(asset.id)}>
                                <Trash className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                        {asset.type === 'image' ? (
                            <img src={asset.content} alt={asset.name} className="w-full h-auto" />
                        ) : (
                            <p>{asset.content}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Asset Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Asset</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Asset Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={assetData.name}
                                onChange={handleInputChange}
                                placeholder="Enter asset name"
                            />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={assetData.type}
                                onChange={handleInputChange}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="image">Image</option>
                                <option value="text">Text</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {assetData.type === 'image' ? 'Image URL' : 'Text Content'}
                            </label>
                            <Input
                                id="content"
                                name="content"
                                value={assetData.content}
                                onChange={handleInputChange}
                                placeholder={
                                    assetData.type === 'image'
                                        ? 'https://example.com/image.png'
                                        : 'Enter text content'
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddAsset}>Add Asset</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AssetsPage;

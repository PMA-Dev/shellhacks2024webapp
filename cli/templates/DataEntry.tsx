// src/pages/DataEntry.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { makeFetchRequest } from '../fetchConfig';
import { toast } from 'sonner';

export const DataEntry = () => {
    const [logName, setLogName] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logName || !timestamp) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            await makeFetchRequest('/samplePost', {
                method: 'POST',
                body: JSON.stringify({ logName, timestamp }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Log submitted successfully!');
            // Optionally, navigate back to the Table page
            navigate('/table');
        } catch (error) {
            toast.error('Failed to submit log.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <Card className="w-full max-w-md border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Submit New Log
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="logName">Log Name</Label>
                            <Input
                                id="logName"
                                placeholder="Enter log name"
                                value={logName}
                                onChange={(e) => setLogName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="timestamp">Timestamp</Label>
                            <Input
                                id="timestamp"
                                type="datetime-local"
                                value={timestamp}
                                onChange={(e) => setTimestamp(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

// src/pages/Table.tsx

import React, { useEffect, useState } from 'react';
import { makeFetchRequest } from '../fetchConfig';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface LogData {
    logName: string;
    timestamp: string;
}

export const Table = () => {
    const [data, setData] = useState<LogData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await makeFetchRequest(
                    `/sampleFetch?id=${id}`,
                    {
                        method: 'GET',
                    }
                );
                setData(result);
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>{error}</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    Log Data
                </h1>
                <div className="space-y-4">
                    {data.map((log, index) => (
                        <Card key={index} className="border border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    {log.logName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">
                                    Timestamp: {log.timestamp}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Table;

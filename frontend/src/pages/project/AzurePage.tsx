import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    useAzureAuth,
    useAzureResourceGroups,
    useAzureResources,
} from '@/hooks/useAzure';
import * as React from 'react';

type ResourceGroup = {
    id: string;
    name: string;
    location: string;
};

export const AzurePage = () => {
    const { refreshAzureCredentials } = useAzureAuth();
    const { resourceGroups } = useAzureResourceGroups();
    const [selectedRG, setSelectedRG] = React.useState<ResourceGroup | null>(
        null
    );
    const { resources } = useAzureResources(selectedRG?.name);

    return (
        <div className="p-4 space-y-4">
            <button
                onClick={refreshAzureCredentials}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Connect or Refresh Azure Credentials
            </button>
            <div className="space-y-2">
                {resourceGroups?.map((rg) => (
                    <button
                        key={rg.id}
                        onClick={() => setSelectedRG(rg)}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        {rg.name}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resources?.map((resource) => (
                    <Card key={resource.id}>
                        <CardHeader>
                            <CardTitle>{resource.name}</CardTitle>
                            <CardDescription>{resource.type}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a
                                href={`https://portal.azure.com/#@/resource${resource.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-blue-600"
                            >
                                Open in Azure
                            </a>
                        </CardContent>
                        <CardFooter>{resource.location}</CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

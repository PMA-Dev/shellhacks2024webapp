import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFetchGhPat } from '@/hooks/useFetchGhPat';
import { useGalaticMetadata } from '@/hooks/useGalaticMetadata';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GalacticMetadata } from '../../../cli/models';

export const GitConfigPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const galaxyId = searchParams.get('galaxyId');
    // get galaxy from hook
    const { getGalacticMetadataById, updateGalaticMetadata } =
        useGalaticMetadata();
    const [galaxy, setGalaxy] = useState<GalacticMetadata>();

    useEffect(() => {
        getGalacticMetadataById(parseInt(galaxyId!)).then((data) => {
            setGalaxy(data as GalacticMetadata);
            setSelectedOrg(data.githubOrg ?? '');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [galaxyId]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<{ ghToken: string; ghOrg: string }>();

    const {
        ghOrgs,
        fetchOrgs,
        data: ghPat,
        fetch: fetchGhPat,
    } = useFetchGhPat(galaxyId!);
    const [selectedOrg, setSelectedOrg] = useState<string>(
        galaxy?.githubOrg ?? ''
    );
    console.log(`galaxy is: ${JSON.stringify(galaxy)}`);

    useEffect(() => {
        fetchOrgs();
    }, [fetchOrgs, galaxyId]);

    const onSubmit = async (data: { ghToken: string; ghOrg: string }) => {
        try {
            await updateGalaticMetadata({
                ...galaxy,
                githubOrg: selectedOrg,
            });
            console.log('Configuration updated successfully:', data);
        } catch (error) {
            console.error('Failed to update configuration:', error);
        }
    };

    useEffect(() => {
        if (ghPat) setValue('ghToken', ghPat);
    }, [ghPat, setValue]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="container flex items-center justify-between px-6 py-4 mx-auto">
                    <div className="flex space-x-4">
                        <Button onClick={() => navigate(-1)}>
                            Back to Dashboard
                        </Button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Configure Git
                    </h1>
                </div>
            </header>

            <main className="container px-6 py-8 mx-auto">
                <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        Enter Git Configuration
                    </h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <div>
                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={() => fetchGhPat()}
                                >
                                    Attempt to fetch token via gh CLI
                                </Button>
                            </div>
                            <Label htmlFor="ghToken">GitHub Token</Label>
                            <Input
                                id="ghToken"
                                placeholder="gho_..."
                                {...register('ghToken', {
                                    required: 'GitHub token is required',
                                })}
                            />
                            {errors.ghToken && (
                                <p className="text-red-600 text-sm">
                                    {errors.ghToken.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ghOrg">GitHub Organization</Label>
                            <select
                                id="ghOrg"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                {...register('ghOrg', {
                                    required: 'GitHub organization is required',
                                })}
                                value={selectedOrg}
                                onChange={(e) => setSelectedOrg(e.target.value)}
                            >
                                <option value="">Select an organization</option>
                                {ghOrgs.map((org) => (
                                    <option key={org} value={org}>
                                        {org}
                                    </option>
                                ))}
                            </select>
                            {errors.ghOrg && (
                                <p className="text-red-600 text-sm">
                                    {errors.ghOrg.message as string}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Save Configuration
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
};

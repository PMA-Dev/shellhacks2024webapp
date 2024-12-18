import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGalaxy } from '@/context/GalacticContext';
import { useFetchGhPat } from '@/hooks/useFetchGhPat';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const GitConfigPage = () => {
    const navigate = useNavigate();
    const { galaxy } = useGalaxy();
    const [searchParams] = useSearchParams();
    const galaxyId = searchParams.get('galaxyId') ?? galaxy?.id?.toString();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data: unknown) => {
        console.log(data);
    };

    const { data: ghPat, fetch: fetchGhPat } = useFetchGhPat(galaxyId);

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
                                    className="w-half"
                                    onClick={() => {
                                        fetchGhPat();
                                    }}
                                >
                                    Attempt to fetch token via gh CLI
                                </Button>
                            </div>
                            <Label htmlFor="name">Github Token</Label>
                            <Input
                                id="ghToken"
                                placeholder="gho_..."
                                value={ghPat ?? undefined}
                                {...register('ghToken', {
                                    required: 'Github token is required',
                                })}
                            />
                            {errors.ghToken && (
                                <p className="text-red-600 text-sm">
                                    {errors.ghToken.message as string}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email format',
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm">
                                    {errors.email.message as string}
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

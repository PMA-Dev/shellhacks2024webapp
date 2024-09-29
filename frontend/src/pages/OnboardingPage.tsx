// src/pages/OnboardingPage.tsx

import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useGalaticMetadata } from '@/hooks/useGalaticMetadata';
import { toast } from "sonner"

function OnboardingPage() {
    const navigate = useNavigate();
    const [githubPat, setPat] = useState('');
    const [workingDir, setDir] = useState('');
    const { createGalaticMetadata } = useGalaticMetadata();

    const handleSubmit = async () => {
        try {
            if (githubPat && workingDir) {
                await createGalaticMetadata({ githubPat, workingDir });
            }
            navigate('/dashboard');
            toast.success('Successfully saved your Galactic metadata!');
        } catch (error) {
            toast.error('Failed to save your Galactic metadata!');
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold text-center">Welcome to Galactic 🌌</h2>
                <div>
                    <Label htmlFor="githubPat">Github PAT</Label>
                    <Input
                        id="githubPat"
                        placeholder="Your GitHub Personal Access Token"
                        value={githubPat}
                        onChange={(e) => setPat(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="workingDir">Working Directory</Label>
                    <Input
                        id="workingDir"
                        placeholder="~/Developer/galactic"
                        value={workingDir}
                        onChange={(e) => setDir(e.target.value)}
                    />
                </div>
                <Button className="w-full" onClick={handleSubmit}>
                    Get Started
                </Button>
            </div>
        </div>
    );
}

export default OnboardingPage;

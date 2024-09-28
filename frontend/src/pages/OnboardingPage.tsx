// src/pages/OnboardingPage.tsx

import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function OnboardingPage() {
    const navigate = useNavigate();
    const [pat, setPat] = useState('');
    const [dir, setDir] = useState('');

    const handleSubmit = () => {
        // TODO: send PAT and dir to backend
        navigate('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold text-center">Welcome to Galactic 🌌</h2>
                <div>
                    <Label htmlFor="pat">Github PAT</Label>
                    <Input
                        id="pat"
                        placeholder="Your GitHub Personal Access Token"
                        value={pat}
                        onChange={(e) => setPat(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="dir">Working Directory</Label>
                    <Input
                        id="dir"
                        placeholder="~/Developer/galactic"
                        value={dir}
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

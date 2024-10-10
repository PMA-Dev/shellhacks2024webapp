// src/pages/OnboardingPage.tsx

import Galaxy from '@/components/Galaxy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGalaticMetadata } from '@/hooks/useGalaticMetadata';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function OnboardingPage() {
    const navigate = useNavigate();
    const [githubPat, setPat] = useState('testpat');
    const [workingDir, setDir] = useState('');
    const { createGalaticMetadata } = useGalaticMetadata();

    const handleSubmit = async () => {
        try {
            if (githubPat && workingDir) {
                await createGalaticMetadata({ githubPat, workingDir });
            }
            navigate('/dashboard/');
            toast.success('Successfully saved your Galactic metadata!');
        } catch (error) {
            toast.error('Failed to save your Galactic metadata!');
            console.error(error);
        }
    };

    return (
        <>
            <div className="relative flex items-center justify-center min-h-[100vh] bg-black overflow-hidden">
                {/* Galaxy Background */}
                <Canvas
                    className="absolute w-full !h-[100vh]"
                    camera={{ position: [4, 5, 1], fov: 55 }}
                >
                    <Galaxy color="#8888ff" />
                </Canvas>
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                {/* Content */}
                <div className=" z-10 w-full max-w-md p-8 space-y-6 backdrop-blur-sm bg-white bg-opacity-80 rounded shadow absolute">
                    <h2 className="text-2xl font-bold text-center">
                        Welcome to GALACTIC 🌌
                    </h2>
                    <div>
                        <Label htmlFor="githubPat">Github PAT</Label>
                        <Input
                            id="githubPat"
                            placeholder="Your GitHub Personal Access Token"
                            value={githubPat}
                            defaultValue={'testpat'}
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
        </>
    );
}

export default OnboardingPage;

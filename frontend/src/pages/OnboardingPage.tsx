import Galaxy from '@/components/Galaxy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGalacticMetadata } from '@/hooks/useGalacticMetadata';
import { Canvas } from '@react-three/fiber';
import { FolderOpen } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function OnboardingPage() {
    const navigate = useNavigate();
    const [githubPat, setPat] = useState('testpat');
    const [workingDir, setDir] = useState('');
    const { createGalacticMetadata } = useGalacticMetadata();
    const fileBrowserRef = useRef<HTMLInputElement>(null);

    const handleDirectorySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // TODO: When we have electron, we can use the electron.remote.dialog.showOpenDialog() method to open the file browser and actuall pick a directory with an absolute path
        const files = e.target.files;
        if (files && files.length > 0) {
            // Get the relative path of the first file
            const relativePath = files[0].webkitRelativePath;
            const rootFolder = relativePath.split('/')[0];
            setDir(rootFolder);
        }
    };

    const handleSubmit = async () => {
        try {
            if (githubPat && workingDir) {
                await createGalacticMetadata({ githubPat, workingDir });
                toast.success('Successfully saved your Galactic metadata!');
                navigate('/dashboard/');
            } else {
                toast.error('Please fill in all fields.');
            }
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
                <div className="z-10 w-full max-w-xl h-full max-h-[60vh] p-8 space-y-6 backdrop-blur-sm bg-white bg-opacity-80 rounded shadow absolute">
                    <h2 className="text-3xl font-bold text-center">
                        Welcome to GALACTIC 🌌
                    </h2>
                    <div>
                        <Label htmlFor="githubPat">GitHub PAT</Label>
                        <Input
                            id="githubPat"
                            placeholder="Your GitHub Personal Access Token"
                            value={githubPat} // TODO add flow to get github pat from user
                            defaultValue={'testpat'}
                            onChange={(e) => setPat(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="workingDir">Working Directory</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="workingDir"
                                placeholder="Select your working directory"
                                value={workingDir}
                                onChange={(e) => setDir(e.target.value)}
                            />
                            <Input
                                ref={fileBrowserRef}
                                type="file"
                                id="workingDirBrowser"
                                onChange={handleDirectorySelect}
                                className="hidden"
                                webkitdirectory=""
                                multiple
                            />
                            <Button
                                onClick={() => fileBrowserRef.current?.click()}
                            >
                                <FolderOpen className="w-4 h-4" />
                            </Button>
                        </div>
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

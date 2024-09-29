// components/Home.tsx

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Gradient } from '../components/Gradient.js';
import { useEffect } from 'react';

export const Home = () => {
    const gradientStyle = {
        width: '100%',
        height: '100%',
        '--gradient-color-1': "#000022",
        '--gradient-color-2': '#E7D7C1',
        '--gradient-color-4': '#FD1D64',
        '--gradient-color-3': '#590004',
    }

    useEffect(() => {
        const canvasElement = document.getElementById("gradient-canvas");
        const gradient: any = new Gradient();
        if (canvasElement) {
            gradient.initGradient("#gradient-canvas");
        } else {
            gradient.pause();
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white p-6">
            <canvas id="gradient-canvas" className='absolute -z-10' style={gradientStyle} data-transition-in />
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-extrabold sm:text-5xl">
                    Hackathon Project
                </h1>
                <p className="text-lg sm:text-xl max-w-md mx-auto">
                    Building the future, one hack at a time. Stay tuned for something amazing!
                </p>
                <Button className="bg-yellow-300 text-black hover:bg-yellow-400">
                    Learn More
                </Button>
            </div>

            {/* Call to Action */}
            <div className="mt-12 w-full max-w-md">
                <form className="flex flex-col sm:flex-row items-center">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className={cn(
                            'w-full flex-grow mb-4 sm:mb-0 sm:mr-2 p-3 rounded-md text-black',
                            'focus:outline-none focus:ring-2 focus:ring-yellow-300'
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-1/4 bg-white text-blue-600 hover:bg-gray-200 py-1 h-auto"
                    >
                        Notify Me
                    </Button>
                </form>
            </div>
        </div>
    );
}

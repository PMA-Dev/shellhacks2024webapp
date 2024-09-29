// components/Home.tsx

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 text-white p-6">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-extrabold sm:text-5xl">
                    Hackathon Project
                </h1>
                <p className="text-lg sm:text-xl max-w-md mx-auto">
                    Building the future, one hack at a time. Stay tuned for
                    something amazing!
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
                        className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-200"
                    >
                        Notify Me
                    </Button>
                </form>
            </div>
        </div>
    );
};

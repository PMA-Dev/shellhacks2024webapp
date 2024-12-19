import { useCms } from '@/hooks/useCms';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import { useState } from 'react';

export const TestVideoRender = () => {
    const { videos, uploadVideo, fetchVideos } = useCms();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            await uploadVideo(selectedFile);
            setSelectedFile(null);
        } else {
            alert('Please select a file to upload.');
        }
    };
    const handleRefresh = async () => {
        await fetchVideos();
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Video Manager</h1>

            {/* Upload Section */}
            <div className="mb-8">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="block mb-2"
                />
                <button
                    onClick={handleUpload}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Upload Video
                </button>
                <button
                    onClick={handleRefresh}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Refresh
                </button>
            </div>

            {/* Video List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="border rounded p-4 shadow hover:shadow-lg"
                    >
                        <h2 className="font-semibold text-lg mb-2">
                            {video.title}
                        </h2>
                        <Plyr
                            source={{
                                type: 'video',
                                sources: [
                                    {
                                        src: video.url,
                                        type: 'video/mp4',
                                    },
                                ],
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

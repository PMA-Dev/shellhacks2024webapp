import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

export const TestVideoRender = () => {
    return (
        <div className="video-container">
            <Plyr
                source={{
                    type: 'video',
                    sources: [
                        {
                            src: 'https://example.com/video.mp4',
                            type: 'video/mp4',
                        },
                    ],
                }}
            />
        </div>
    );
};

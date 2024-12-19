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
                            src: 'https://pmacmshost.blob.core.windows.net/publicvideo/5healthpotdravenbaitkaisarafanice.mov',
                            type: 'video/mp4',
                        },
                    ],
                }}
            />
        </div>
    );
};

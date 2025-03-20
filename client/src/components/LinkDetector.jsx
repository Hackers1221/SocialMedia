import { useState } from 'react';
import ReactLinkify from 'react-linkify';

function LinkDetector ({ title }) {
    const [check, setCheck] = useState(false);

    function toggleReadability() {
        setCheck(!check);
    }

    const displayedCaption = check ? title : title?.toString().slice(0, 200);

    return (
        <div className="text-sm text-[var(--text)] px-4 mt-4 whitespace-pre-line">
            <ReactLinkify
                componentDecorator={(href, caption, key) => (
                    <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--buttons)] hover:underline"
                    >
                        {caption}
                    </a>
                )}
            >
                {displayedCaption}
            </ReactLinkify>

            {title?.toString().length > 200 && (
                <span
                    onClick={toggleReadability}
                    className="text-[var(--buttons)] font-bold hover:cursor-pointer"
                >
                    {check ? ' Show Less' : '... Read More'}
                </span>
            )}
        </div>
    );
}

export default LinkDetector;

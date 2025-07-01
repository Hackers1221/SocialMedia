import { useState } from 'react';

function LinkDetector({ title, type }) {
    const [check, setCheck] = useState(false);

    let len = 200;
    if (type === 'displayPost') len = 300;
    if (type === 'pulse') len = 75;

    const toggleReadability = () => setCheck(!check);
    const displayedCaption = check ? title : title?.toString().slice(0, len);

    const parseText = (text) => {
        const parts = text.split(/(\s+)/); // split into words + spaces
        return parts.map((part, index) => {
            if (/^https?:\/\/[^\s]+$/.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--buttons)] hover:underline"
                    >
                        {part}
                    </a>
                );
            } else if (/^@[\w]+$/.test(part)) {
                const username = part.slice(1);
                return (
                    <a
                        key={index}
                        href={`/profile/${username}`}
                        className="text-[var(--buttons)] hover:font-semibold"
                    >
                        {part}
                    </a>
                );
            } else {
                return part;
            }
        });
    };

    return (
        <div className="text-sm text-[var(--buttonText)] whitespace-pre-line">
            {parseText(displayedCaption)}

            {title?.toString().length > len && (
                <span
                    onClick={toggleReadability}
                    className="text-[var(--buttons)] font-bold hover:cursor-pointer text-xs"
                >
                    {check ? ' Show Less' : '... Read More'}
                </span>
            )}
        </div>
    );
}

export default LinkDetector;

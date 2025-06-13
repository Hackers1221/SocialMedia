import { useSelector} from 'react-redux'

function Avatar ({size, url, border, id}) {
    const announcementState = useSelector ((state) => state.announcement);


    let dimension = 'w-12 h-12';
    if (size === 'lg') {
        dimension = 'w-20 h-20 md:w-32 md:h-32';
    }
    if (size === 'md') {
        dimension = 'w-8 h-8';
    }
    if (size === 'sm') {
        dimension = 'w-6 h-6';
    }
    let bord = ''
    if (border === "true") {
        bord = 'border-2 border-white';
    }

    return (
        <div className="flex items-center justify-center">
        {announcementState.downloadedAnnouncement?.some(announcement => announcement.user._id === id) ? (
            <div className="relative hover:cursor-pointer bg-gradient-to-tr from-sky-500 via-blue-500 to-purple-500 p-[2px] rounded-full">
            <div className="bg-white p-[2px] rounded-full">
                <img
                src={url}
                alt=""
                className={`object-cover rounded-full ${dimension} ${bord}`}
                />
            </div>
            </div>
        ) : (
            <div className="relative hover:cursor-pointer">
            <img
                src={url}
                alt=""
                className={`object-cover rounded-full ${dimension} ${bord}`}
            />
            </div>
        )}
        </div>
    );
}

export default Avatar;
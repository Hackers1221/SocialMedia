import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVerse, getVerseByUserId } from '../redux/Slices/verse.slice'
import { getUserByUsername } from "../redux/Slices/auth.slice";
import { useParams } from "react-router-dom";

function useVerse () {
    const verseState = useSelector((state) => state.verse);
    const authState = useSelector ((state) => state.auth);

    const { username } = useParams();

    const dispatch = useDispatch();

    async function loadVerse() {
        if(!verseState?.downloadedVerse?.length) dispatch(getAllVerse ()); 

        if (location.pathname.split('/')[1] == 'profile') {
            const user = await dispatch (getUserByUsername (username));

            await dispatch (getVerseByUserId (user.payload?.data?.userDetails?._id));
        }

    }
    useEffect(() => {
        loadVerse ();
    }, [username]);

    return [verseState];
}

export default useVerse;

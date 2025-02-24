import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link, useNavigate } from "react-router-dom";

function Stories () {

    const authState = useSelector ((state) => state.auth);

    const navigate = useNavigate ();
    const image = authState.data?.image || "Empty Source"

    function goProfile () {
        navigate(`/profile?username=${authState.data?.username}`);
    }

    return (
        <section className="fixed top-[4rem] md:top-[0rem] left-0 md:left-auto right-full md:right-0 w-full md:w-auto h-max md:min-h-screen flex flex-row md:flex-col items-center md:pt-5 px-4">
            <DisplayPost open={isDialogOpen} setOpen={setDialogOpen} index={index}/>
            <ul className="flex flex-row md:flex-col items-center justify-center gap-4">
                <li className="flex justify-end">
                    <Link to={`/profile/${authState?.data?.username}`}>
                        <Avatar url={image} />
                    </Link>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image"/>
                        </a>
                    </div>
                </li>
                <li className="flex flex-col items-center space-y-2">
                    <div className="bg-gradient-to-tr from-yellow-500 to-pink-600 rounded-full p-1">
                        <a className="block bg-white p-1 rounded-full transform transition hover:-rotate-12 duration-300" href="#">
                            <img className="h-10 w-10 rounded-full" src="https://i.ibb.co/yhh0Ljy/profile.jpg" alt="image" />
                        </a>
                    </div>
                </li>
            </ul>
        </section>
    )
}

export default Stories;
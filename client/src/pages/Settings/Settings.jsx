import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/Slices/auth.slice";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import PrivacyButton from "../../components/PrivacyButton";
import { showToast } from "../../redux/Slices/toast.slice";

const menuItems = [
  { name: "General", key: "general" },
  { name: "Account", key: "account" },
  { name: "Privacy", key: "privacy" }
];

function Settings() {
    const defalutImage = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    const authState = useSelector((state) => state.auth);
    const [confirmPassword, setconfirmPassword] = useState("");
    const dispatch = useDispatch();

    // Delete related
    const [isDeleteDialog, setIsdeleteDialog] = useState(false);
    const [isPrivate, setPrivate] = useState (authState.data?.isPrivate);

    const [selectedOption, setSelectedOption] = useState("general");
    const [imageUrl, setImageUrl] = useState("");
    const [userDetails, setUserDetails] = useState({
        image: authState?.data?.image?.url || "",
        name: authState?.data?.name || "",
        username: authState?.data?.username || "",
        email: authState?.data?.email || "",
        curpassword: "",
        password: "",
        about: authState?.data?.about || ""
    });
    const [image, setImage] = useState(null);
    const [width, setWidth] = useState(window.innerWidth);
    

    function handleChange(e) {
        const { name, value } = e.target;
        if (name == "confirmPassword") {
        setconfirmPassword(value);
        } else {
        setUserDetails({
            ...userDetails,
            [name]: value
        })
        }
    }
    const handleImageChange = (event) => {
        const uploadedFile = event.target.files[0];
        setImageUrl(URL.createObjectURL(uploadedFile));
        setImage(uploadedFile);
    };

    const updateuser = async () => {
        const formData = new FormData();
        formData.append("id", authState.data?._id);
        formData.append("name", userDetails.name);
        formData.append("username", userDetails.username);
        formData.append("email", userDetails.email);
        formData.append("curpassword", userDetails.curpassword);
        formData.append("password", userDetails.password);
        formData.append("about", userDetails.about);

        if (image) {
            formData.append("image", image); // Append only if an image is selected
        }
        
        const response = await dispatch(updateUser(formData));
        if (response.payload) {
            dispatch (showToast ({ message: "Successfully updated your information!", type: 'success' }));
            setUserDetails({
                ...userDetails,
                password: "",
                curpassword: "",
            })
            setconfirmPassword("");
        } else {
            // dispatch (showToast ({ message: "Something went wrong!", type: 'error' }));
        }
    }

    async function handleToggle() {
        const response = await dispatch(updateUser({ 
        id: authState.data?._id,
        isPrivate: !isPrivate }));
    
        if (response.payload) {
            dispatch (showToast ({ message: `Successfully set your account to ${isPrivate ? "public" : "private"}`, type: `${isPrivate ? "public" : "private"}`}));
            setPrivate(!isPrivate); 
        } else {
            dispatch (showToast ({ message: `Something went wrong!`, type: 'error' }));
        }
    }

    useEffect (() => {
        const handleResize = () => setWidth (window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    

    return (
        <>

        {/* Confirm delete dialog */}
        <ConfirmDeleteDialog 
            open={isDeleteDialog} 
            setOpen={setIsdeleteDialog} 
            type={"accountDelete"}
        />

        {width > 1075 ? <div className="fixed top-[9rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[75vw] h-[82vh] md:h-[97vh] flex flex-grow overflow-y-auto">
        {/* Sidebar Menu */}
        <aside className="w-[20%] fixed h-full bg-transparent p-6">
            <h2 className={`text-[2rem] text-[var(--text)] heading font-semibold mb-4`}>Settings</h2>
            <ul>
            {menuItems.map((item) => (
                <li
                key={item.key}
                onClick={() => setSelectedOption(item.key)}
                className={`cursor-pointer p-3 hover:shadow-md text-[var(--text)] ${selectedOption === item.key ? 'text-[var(--heading)] shadow-md' : ''}`}
                >
                {item.name}
                </li>
            ))}
            </ul>
        </aside>

        {/* Settings Form */}
        <main className="flex-1 p-6 bg-transparent ml-[25%]">
            {selectedOption === "general" && (
            <div className="max-w-4xl mx-auto p-8 bg-transparent shadow-xl rounded-lg">
                <h2 className={`text-3xl font-semibold text-[var(--heading)] mb-8`}>General Settings</h2>

                {/* Profile Information */}
                <div className="bg-transparent p-6 rounded-lg shadow-sm mb-6">
                <h3 className={`text-lg font-medium text-[var(--text)] mb-2`}>Profile Information</h3>
                <p className={`text-xs mb-4 text-[var(--text)]`}>
                    Update your profile details to keep your account up to date.
                </p>
                <div className="flex items-center gap-6">
                    <img
                    src={imageUrl || userDetails?.image || defalutImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border object-cover"
                    />
                    <div>
                    <input
                        type="file"
                        accept="image/*"
                        className={`px-4 py-2 border-[var(--border)] rounded-md text-sm text-[var(--text)] font-medium`}
                        onChange={handleImageChange}
                        encType= "multipart/form-data" 
                    />
                    <p className={`text-xs text-[var(--text)] mt-1`}>JPG, PNG (Max 2MB)</p>
                    </div>
                </div>
                </div>

                {/* Account Details */}
                <div className={`bg-transparent border border-[var(--input)] p-6 rounded-lg shadow-sm mb-6`}>
                <h3 className={`text-lg font-medium text-[var(--text)] mb-2`}>Personal Details</h3>
                <p className={`text-sm text-[var(--text)] mb-4`}>
                    Your account information is private and will not be shared.
                </p>
                <div className="flex flex-col gap-4">
                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={userDetails?.username}
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                        placeholder="johndoe123"
                        onChange={handleChange}
                    />
                    </div>

                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userDetails?.name}
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                        placeholder="John Doe"
                        onChange={handleChange}
                    />
                    </div>

                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>About</label>
                    <textarea
                        type="email"
                        name="about"
                        value={userDetails?.about}
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none resize-none`}
                        rows={5}
                        onChange={handleChange}
                    />
                    </div>
                </div>
                </div>

                <div className="flex justify-end">
                <button className={`px-6 py-3 bg-transparent border border-[var(--buttons)] text-[var(--buttons)] font-bold rounded-full hover:bg-[var(--buttons)] hover:text-[var(--buttonText)] transition-all`} onClick={updateuser}>
                    Save Changes
                </button>
                </div>
            </div>
            )}

            {selectedOption === "account" && (
            <div className="max-w-4xl mx-auto p-8 bg-transparent shadow-xl rounded-lg">
                <h2 className={`text-3xl font-semibold text-[var(--heading)] mb-8`}>Account Settings</h2>

                {/* Security Settings */}
                <div className={`bg-transparent border border-[var(--input)] p-6 rounded-lg shadow-sm mb-6`}>
                <h3 className={`text-lg font-medium text-[var(--text)] mb-2`}>Security Settings</h3>
                <p className={`text-sm text-[var(--text)] mb-4`}>
                    Ensure your account security by updating your password regularly.
                </p>
                <label className={`text-sm font-medium text-[var(--text)]`}>Current Password</label>
                <input
                    type="password"
                    className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                    placeholder="********"
                    name="curpassword"
                    value={userDetails.curpassword}
                    onChange={handleChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>New Password</label>
                    <input
                        type="password"
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                        placeholder="********"
                        name="password"
                        value={userDetails.password}
                        onChange={handleChange}
                    />
                    </div>
                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>Confirm Password</label>
                    <input
                        type="password"
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                        placeholder="********"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                    />
                    </div>
                </div>
                <p className={`text-xs mt-2 text-[var(--text)]`}>
                        Must be at least 8 characters long with a mix of uppercase, lowercase, numbers, and special characters
                </p>
                </div>

                <div className="flex justify-end">
                <button className={`px-6 py-3 mb-4 bg-transparent border border-[var(--buttons)] text-[var(--buttons)] font-bold rounded-full hover:bg-[var(--buttons)] hover:text-[var(--buttonText)] transition-all`} onClick={updateuser}>
                    Save Changes
                </button>
                </div>

                {/* Account Actions (Delete Account) */}
                <div className={`bg-transparent border border-red-500 p-6 rounded-lg shadow-sm`}>
                <h3 className={`text-lg font-medium text-[var(--text)] mb-2`}>Delete Account</h3>
                <p className={`text-sm text-[var(--text)] mb-4`}>
                    Deleting your account is irreversible. All your data will be permanently removed.
                    If you are part of any company, you must leave or transfer ownership before deletion.
                </p>
                <div className="flex justify-between items-center">
                    <button 
                    onClick={() => setIsdeleteDialog(true)}
                    className="px-6 py-3 font-bold bg-transparent border border-red-700 text-red-700 hover:text-white rounded-full hover:bg-red-700 transition-all">
                    Delete Account
                    </button>
                </div>
                </div>
            </div>
            )}

            {selectedOption === "privacy" && (
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-[var(--heading)]">Privacy Settings</h2>
                <div className="w-full flex justify-between items-center p-4 border border-[var(--input)] rounded-2xl">
                <h2 className="text-[var(--text)]">Private Account</h2>
                <PrivacyButton isOn={isPrivate} onToggle={handleToggle}/>
                </div>
                <div className="flex flex-col gap-4 text-sm mt-4 p-4 text-[var(--text)]">
                <p>When your account is public, your profile and posts can be seen by anyone, on or off Ripple, even if they don't have an Ripple account.</p>
                <p>When your account is private, only the followers you approve can see what you share, including your photos or videos on hashtag and location pages, and your followers and following lists. Certain info on your profile, like your profile picture and username, is visible to everyone on and off Ripple.</p>
                </div>
            </div>
            )}
        </main>
        </div> : 

        <div className="fixed top-[3rem] md:top-[1rem] md:left-[20rem] left-[1rem] h-[90vh] w-[90vw] md:h-[97vh] flex flex-grow overflow-y-auto">

        {/* Settings Form */}
        <main className="flex-1 w-full bg-transparent">
            <div className="py-8 px-2 bg-transparent shadow-xl rounded-lg">
                <h2 className={`text-3xl font-semibold text-[var(--heading)] mb-8`}>General Settings</h2>

                {/* Profile Information */}
                <div className="bg-transparent p-6 rounded-lg shadow-sm mb-6">
                <h3 className={`text-lg font-medium text-[var(--text)] mb-2`}>Profile Information</h3>
                <p className={`text-xs mb-4 text-[var(--text)]`}>
                    Update your profile details to keep your account up to date.
                </p>
                <div className="flex items-center gap-4  overflow-x-hidden">
                    <img
                        src={imageUrl || userDetails?.image || defalutImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border object-cover"
                    />
                    <div>
                    <input
                        type="file"
                        accept="image/*"
                        className={`px-2 py-2 border-[var(--border)] rounded-md text-sm text-[var(--text)] font-medium`}
                        onChange={handleImageChange}
                        encType= "multipart/form-data" 
                    />
                    <p className={`text-xs text-[var(--text)] mt-1`}>JPG, PNG (Max 2MB)</p>
                    </div>
                </div>
                </div>

                {/* Account Details */}
                <div className={`bg-transparent border border-[var(--input)] p-6 rounded-lg shadow-sm mb-6`}>
                <h3 className={`text-lg font-medium text-[var(--text)] mb-2`}>Personal Details</h3>
                <p className={`text-sm text-[var(--text)] mb-4`}>
                    Your account information is private and will not be shared.
                </p>
                <div className="flex flex-col gap-4">
                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={userDetails?.username}
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                        placeholder="johndoe123"
                        onChange={handleChange}
                    />
                    </div>

                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userDetails?.name}
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                        placeholder="John Doe"
                        onChange={handleChange}
                    />
                    </div>

                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>About</label>
                    <textarea
                        type="email"
                        name="about"
                        value={userDetails?.about}
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none resize-none`}
                        rows={5}
                        onChange={handleChange}
                    />
                    </div>
                </div>
                </div>

                <div className="flex justify-end">
                <button className={`px-6 py-3 bg-transparent border border-[var(--buttons)] text-[var(--buttons)] font-bold rounded-full hover:bg-[var(--buttons)] hover:text-[var(--buttonText)] transition-all`} onClick={updateuser}>
                    Save Changes
                </button>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-8 bg-transparent shadow-xl rounded-lg">
                <h2 className={`text-3xl font-semibold text-[var(--heading)] mb-8`}>Account Settings</h2>

                {/* Security Settings */}
                <div className={`bg-transparent border border-[var(--input)] p-6 rounded-lg shadow-sm mb-6`}>
                <h3 className={`text-lg font-medium text-[var(--text)] mb-2`}>Security Settings</h3>
                <p className={`text-sm text-[var(--text)] mb-4`}>
                    Ensure your account security by updating your password regularly.
                </p>
                <label className={`text-sm font-medium text-[var(--text)]`}>Current Password</label>
                <input
                    type="password"
                    className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                    placeholder="********"
                    name="curpassword"
                    value={userDetails.curpassword}
                    onChange={handleChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>New Password</label>
                    <input
                        type="password"
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                        placeholder="********"
                        name="password"
                        value={userDetails.password}
                        onChange={handleChange}
                    />
                    </div>
                    <div>
                    <label className={`text-sm font-medium text-[var(--text)]`}>Confirm Password</label>
                    <input
                        type="password"
                        className={`w-full p-3 border border-[var(--input)] rounded-lg mt-1 text-[var(--text)] bg-transparent focus:outline-none`}
                        placeholder="********"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                    />
                    </div>
                </div>
                <p className={`text-xs mt-2 text-[var(--text)]`}>
                        Must be at least 8 characters long with a mix of uppercase, lowercase, numbers, and special characters
                </p>
                </div>

                <div className="flex justify-end">
                <button className={`px-6 py-3 mb-4 bg-transparent border border-[var(--buttons)] text-[var(--buttons)] font-bold rounded-full hover:bg-[var(--buttons)] hover:text-[var(--buttonText)] transition-all`} onClick={updateuser}>
                    Save Changes
                </button>
                </div>

                {/* Account Actions (Delete Account) */}
                <div className={`bg-transparent border border-red-500 p-6 rounded-lg shadow-sm`}>
                <h3 className={`text-lg font-medium text-[var(--text)] mb-2`}>Delete Account</h3>
                <p className={`text-sm text-[var(--text)] mb-4`}>
                    Deleting your account is irreversible. All your data will be permanently removed.
                    If you are part of any company, you must leave or transfer ownership before deletion.
                </p>
                <div className="flex justify-between items-center">
                    <button 
                    onClick={() => setIsdeleteDialog(true)}
                    className="px-6 py-3 font-bold bg-transparent border border-red-700 text-red-700 hover:text-white rounded-full hover:bg-red-700 transition-all">
                    Delete Account
                    </button>
                </div>
                </div>
            </div>
            <div className="p-8">
                <h2 className="text-2xl font-semibold mb-4 text-[var(--heading)]">Privacy Settings</h2>
                <div className="w-full flex justify-between items-center p-4 border border-[var(--input)] rounded-2xl">
                <h2 className="text-[var(--text)]">Private Account</h2>
                    <PrivacyButton isOn={isPrivate} onToggle={handleToggle}/>
                </div>
                <div className="flex flex-col gap-4 text-sm mt-4 p-4 text-[var(--text)]">
                <p>When your account is public, your profile and posts can be seen by anyone, on or off Ripple, even if they don't have an Ripple account.</p>
                <p>When your account is private, only the followers you approve can see what you share, including your photos or videos on hashtag and location pages, and your followers and following lists. Certain info on your profile, like your profile picture and username, is visible to everyone on and off Ripple.</p>
                </div>
            </div>
        </main>
        </div>}
        </>
    );
}

export default Settings;
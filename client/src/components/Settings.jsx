import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/Slices/auth.slice";
import toast from "react-hot-toast";

const menuItems = [
  { name: "Profile", key: "profile" },
  { name: "Account", key: "account" },
  { name: "Privacy", key: "privacy" },
  { name: "Notifications", key: "notifications" },
];

function Settings () {

  const authState = useSelector ((state) => state.auth);
  const [confirmPassword,setconfirmPassword] = useState("");
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState("profile");
  const [userDetails, setUserDetails] = useState ({
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    name: authState?.data?.name,
    username: authState?.data?.username,
    email: authState?.data?.email,
    curpassword : "",
    password: "",
    about: authState?.data?.about
  })

  function handleChange (e) {
    const {name, value} = e.target;
    if(name=="confirmPassword"){
      setconfirmPassword(value);
    }else{
      setUserDetails({
        ...userDetails,
        [name] : value
      })
    }
}

const updateuser = async() => {
  if(userDetails.curpassword.trim().length>0){
    if(userDetails.password.trim().length==0 || confirmPassword.length==0){
      toast.error("Password field can't be empty");
      return;
    }
    if(userDetails.curpassword.trim() == userDetails.password.trim()){
      toast.error("Old and new password can't be same");
      return;
    }
    if(userDetails.password.trim() != confirmPassword.trim()){
      toast.error("Password does not match");
      return;
    }
  }
  const response = await dispatch(updateUser({
    id : authState?.data._id,
    newData : userDetails
  }))
  if(response.payload){
    toast.success("Successfully updated your information");
    setUserDetails({
      password : "",
      curpassword : "",
    })
    setconfirmPassword("");
  }else{
    toast.error("Something went wrong");
  }
}

  return (
    <div className="fixed top-[9rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[75vw] h-[82vh] md:h-[97vh] flex flex-grow overflow-y-auto">
      {/* Sidebar Menu */}
      <aside className="w-[20%] fixed h-full bg-transparent shadow-md p-6">
        <h2 className="text-[2rem] text-white heading font-semibold mb-4">Settings</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.key}
              onClick={() => setSelectedOption(item.key)}
              className={`cursor-pointer p-3 text-[${_COLOR.lightest}] hover:bg-[${_COLOR.medium}]`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Settings Form */}
      <main className="flex-1 p-6 bg-transparent shadow-md ml-[25%]">
        {selectedOption === "profile" && (
          <div className="max-w-4xl mx-auto p-8 bg-transparent shadow-xl rounded-lg">
            <h2 className={`text-3xl font-semibold text-[${_COLOR.lightest}] mb-8`}>Profile Settings</h2>
      
            {/* Profile Information */}
            <div className="bg-transparent p-6 rounded-lg shadow-sm mb-6">
              <h3 className={`text-lg font-medium text-[${_COLOR.lightest}] mb-2`}>Profile Information</h3>
              <p className={`text-xs text-[${_COLOR.more_light}] mb-4`}>
                Update your profile details to keep your account up to date.
              </p>
              <div className="flex items-center gap-6">
                <img
                  src={userDetails?.image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border"
                />
                <div>
                  <button className={`px-4 py-2 border border-[${_COLOR.less_light}] rounded-md text-sm text-white font-medium hover:bg-[${_COLOR.medium}]`}>
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF (Max 2MB)</p>
                </div>
              </div>
            </div>
      
            {/* Account Details */}
            <div className={`bg-transparent border border-[${_COLOR.less_light}] p-6 rounded-lg shadow-sm mb-6`}>
              <h3 className={`text-lg font-medium text-white mb-2`}>Personal Details</h3>
              <p className={`text-sm text-[${_COLOR.more_light}] mb-4`}>
                Your account information is private and will not be shared.
              </p>
              <div className="flex flex-col gap-4">
              <div>
                  <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={userDetails?.username}
                    className="w-full p-3 border rounded-lg mt-1 text-white focus:outline-none"
                    placeholder="johndoe123"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userDetails?.name}
                    className="w-full p-3 border rounded-lg mt-1 text-white focus:outline-none"
                    placeholder="John Doe"
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>About</label>
                  <textarea
                    type="email"
                    name="about"
                    value={userDetails?.about}
                    className="w-full p-3 border rounded-lg mt-1 text-white focus:outline-none"
                    rows={5}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
                <button className={`px-6 py-3 bg-transparent border border-[${_COLOR.less_light}] text-white rounded-lg hover:bg-[${_COLOR.medium}] transition-all`} onClick={updateuser}>
                  Save Changes
                </button>
              </div>
          </div>
        )}

        {selectedOption === "account" && (
          <div className="max-w-4xl mx-auto p-8 bg-transparent shadow-xl rounded-lg">
            <h2 className={`text-3xl font-semibold text-[${_COLOR.lightest}] mb-8`}>Account Settings</h2>
      
            {/* Account Details */}
            <div className={`bg-transparent border border-[${_COLOR.less_light}] p-6 rounded-lg shadow-sm mb-6`}>
              <h3 className={`text-lg font-medium text-white mb-2`}>Account Details</h3>
              <p className={`text-sm text-[${_COLOR.more_light}] mb-4`}>
                Your account information is private and will not be shared.
              </p>
              <div>
                <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails?.email}
                  className="w-full p-3 border rounded-lg mt-1 text-white focus:outline-none"
                  placeholder="john@example.com"
                  onChange={handleChange}
                />
              </div>
            </div>
      
            {/* Security Settings */}
            <div className={`bg-transparent border border-[${_COLOR.less_light}] p-6 rounded-lg shadow-sm mb-6`}>
              <h3 className={`text-lg font-medium text-white mb-2`}>Security Settings</h3>
              <p className={`text-sm text-[${_COLOR.more_light}] mb-4`}>
                Ensure your account security by updating your password regularly.
              </p>
              <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>Current Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg mt-1 focus:outline-none text-white mb-4"
                placeholder="********"
                name = "curpassword"
                value = {userDetails.curpassword}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>New Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border rounded-lg mt-1 focus:outline-none text-white"
                    placeholder="********"
                    name = "password"
                    value = {userDetails.password}
                    onChange={handleChange}
                  />
                  <p className={`text-xs text-[${_COLOR.medium}] mt-1`}>
                    Must be at least 8 characters long.
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border rounded-lg mt-1 focus:outline-none text-white"
                    placeholder="********"
                    name = "confirmPassword"
                    value = {confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end mb-4">
              <button className={`px-6 py-3 bg-transparent border border-[${_COLOR.less_light}] text-white rounded-lg hover:bg-[${_COLOR.medium}] transition-all`} onClick={updateuser}>
                Save Changes
              </button>
            </div>
      
            {/* Account Actions */}
            <div className={`bg-transparent border border-red-500 p-6 rounded-lg shadow-sm`}>
              <h3 className={`text-lg font-medium text-[${_COLOR.lightest}] mb-2`}>Delete Account</h3>
              <p className={`text-sm text-[${_COLOR.lightest}] mb-4`}>
              Deleting your account is irreversible. All your data will be permanently removed.
              If you are part of any company, you must leave or transfer ownership before deletion.
              </p>
              <div className="flex justify-between items-center">
                <button className="px-6 py-3 font-bold bg-transparent border border-red-700 text-red-700 hover:text-white rounded-lg hover:bg-red-700 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedOption === "privacy" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
            <p>Adjust your privacy preferences here.</p>
          </div>
        )}

        {selectedOption === "notifications" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>
            <p>Manage your notification preferences.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Settings;
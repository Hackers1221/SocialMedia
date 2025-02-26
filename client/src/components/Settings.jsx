function Settings () {
    return (
        <>
    <div className="max-w-4xl mx-auto p-8 bg-transparent shadow-xl rounded-lg">
      <h2 className={`text-3xl font-semibold text-[${_COLOR.lightest}] mb-8 heading`}>Account Settings</h2>

      {/* Profile Information */}
      <div className="bg-transparent p-6 rounded-lg shadow-sm mb-6">
        <h3 className={`text-lg font-medium text-[${_COLOR.lightest}] mb-2`}>Profile Information</h3>
        <p className={`text-xs text-[${_COLOR.more_light}] mb-4`}>
          Update your profile details to keep your account up to date.
        </p>
        <div className="flex items-center gap-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
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
        <h3 className={`text-lg font-medium text-white mb-2`}>Account Details</h3>
        <p className={`text-sm text-[${_COLOR.more_light}] mb-4`}>
          Your account information is private and will not be shared.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>Full Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mt-1 text-white focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>Email Address</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg mt-1 text-white focus:outline-none"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className={`bg-transparent border border-[${_COLOR.less_light}] p-6 rounded-lg shadow-sm mb-6`}>
        <h3 className={`text-lg font-medium text-white mb-2`}>Security Settings</h3>
        <p className={`text-sm text-[${_COLOR.more_light}] mb-4`}>
          Ensure your account security by updating your password regularly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`text-sm font-medium text-[${_COLOR.more_light}]`}>New Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none text-white"
              placeholder="********"
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
            />
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className={`bg-transparent border border-[${_COLOR.less_light}] p-6 rounded-lg shadow-sm`}>
        <h3 className={`text-lg font-medium text-white mb-2`}>Account Actions</h3>
        <p className={`text-sm text-[${_COLOR.more_light}] mb-4`}>
          Manage your account preferences and settings.
        </p>
        <div className="flex justify-between items-center">
          <button className={`px-6 py-3 bg-transparent border border-[${_COLOR.less_light}] text-white rounded-lg hover:bg-[${_COLOR.medium}] transition-all`}>
            Save Changes
          </button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>

        </>
    )
}

export default Settings;
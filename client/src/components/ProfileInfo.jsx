import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function ProfileInfo () {
    return (
        <div className={`mb-4 w-full bg-[${_COLOR.less_light}] px-4 pt-4`}>
          <div className={`flex items-center gap-4 `}>
            <Skeleton circle width={50} height={50}/>
            <div className="w-[50%]">
              <Skeleton count={3}/>
            </div>
          </div>
          <div className={`w-full flex justify-evenly mt-4 pb-4 h-[2rem]`}>
            <div className="w-[30%]">
                <Skeleton />
            </div>
            <div className="w-[30%]">
                <Skeleton />
            </div>
            <div className="w-[30%]">
                <Skeleton />
            </div>
          </div>
        </div>
    )
}

export default ProfileInfo;
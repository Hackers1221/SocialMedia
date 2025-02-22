
import {useSelector} from 'react-redux'


const SavedPost = () => {
    const savedposts = useSelector((state) => state.auth.data.saved);
    console.log(savedposts);
    return (
      <div className="fixed top-[10rem] md:top-[5rem] md:top-[4rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%]">
        {/* Main Content (Centered) */}
        <div className="w-full">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 ">
            {savedposts?.map((photo, index) => (
              <div key={index}>
                <img className="object-cover object-center w-[25rem] h-[10rem] rounded-sm" src={photo} alt="Post cannot be loaded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default SavedPost;
  
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonTopUser () {
    return (
        
        <div className={`rounded-md mb-4 p-4 border border-[var(--text)]`} >
            <div className="flex gap-4">
                <div>
                    <Skeleton circle height={30} width={30} />
                </div>
                <div className='w-[50%]'>
                    <Skeleton count={2} />
                </div>
            </div>
            <div className='my-5'>
                <Skeleton height={300}/>
            </div>
            <div className="mt-5 flex w-full justify-between px-2">
                <Skeleton />
            </div>
            <Skeleton />
            <div className="flex mt-4 gap-3">
                <div>
                    <Skeleton circle height={30} width={30}/>
                </div>
                <div className="grow rounded-full relative">
                    <Skeleton height={30}/>
                </div>
            </div>
        </div>
    );
}

export default SkeletonTopUser;
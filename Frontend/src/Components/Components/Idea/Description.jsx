import gsap from "gsap";
import {
  useEffect,
  useRef,
  useState
} from "react";

const Description = ({ description, seeingLikedBy, likedBy, className }) => {
  const [seeing, setSeeing] = useState(false);
  const descriptionEleRef = useRef();
  const handleClick = () => {
    const descriptionEle = descriptionEleRef.current;
    if (seeingLikedBy) return;
    if (!seeing) {
      gsap.to(descriptionEle,{
        height: 280,
        backgroundColor: "black",
        color: "white",
        duration: 0.3,
      })
      setSeeing(true);
    }
    else {
      gsap.to(descriptionEle,{
        backgroundColor: "transparent",
        color: "black",
        height: 50,
        duration: 0.3,
      })
      setSeeing(false);
    }
  }
  useEffect(() => {
    if (seeingLikedBy) {
      const descriptionEle = descriptionEleRef.current;
      gsap.to(descriptionEle,{
        height: 280,
        backgroundColor: "black",
        color: "white",
        duration: 0.3,
      })
    } else {
      const descriptionEle = descriptionEleRef.current;
      gsap.to(descriptionEle,{
        height: 50,
        backgroundColor: "transparent",
        color: "black",
        duration: 0.3,
      })
    }
  }, [seeingLikedBy])
  return (
    <div
      onClick={handleClick}
      ref={descriptionEleRef}
      className={`overflow-y-hidden border-2 border-black border-solid border-b-0 rounded-t-2xl p-[3px] leading-5 h-[50px] cursor-pointer w-full flex flex-col gap-2 ${className}`}
    >
      {seeingLikedBy ?
        likedBy.map(({ profileImage, username }) => (
            <div className="flex px-2 py-1 gap-3 items-center text-white">
              <img src={profileImage} className="h-7 w-7 rounded-full"/>
              <p>{username}</p>
            </div>
          )
        )
        :
        description
      }
    </div>
  )
}

export default Description;
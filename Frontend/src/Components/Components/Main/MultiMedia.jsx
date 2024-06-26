import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX
} from "lucide-react";
import Uploading from "../General/Uploading";

const MultiMedia = ({
  medias,
  start,
  id,
  navigationSize,
  soundSize,
  wrapperClassName,
  uploading,
  containerClassName
}) => {
  const [index, setIndex] = useState(start);
  const container = useRef(null);
  const [muted, setMuted] = useState(new Array(medias.length).fill(true));
  const moveTo = (from, to) => {
    if (medias[from].type == "video") document.getElementById(`${id}Video${from}`).pause();
    if (medias[to].type == "video") {
      document.getElementById(`${id}Video${to}`).play();
      document.getElementById(`${id}Video${to}`).muted = muted[to];
    }
    container.current.scrollTo({
      left: container.current.clientWidth*to,
      right: 0,
      behavior: "smooth"
    });
    setIndex(to);
  }
  const muteUnmute = (video, index) => {
    video.muted = !video.muted;
    setMuted(prev => prev.map((val, ind) => ind == index ? !val : val));
  }
  useEffect(() => {
    moveTo(0, start);
  } ,[start]);
  useEffect(() => {
    if (uploading) {
      container.current.scrollTo({
        left: container.current.clientWidth*medias.length,
        right: 0,
        behavior: "smooth"
      });
    }
  },[uploading]);
  return (
    <div className={`relative ${wrapperClassName}`}>
      <div
        className={`h-full w-full flex backdrop-blur-sm overflow-x-scroll overflow-y-hidden ${containerClassName}`}
        ref={container}
      >
        {medias.map((media, ind) => {
          const {
            src,
            type,
            alt
          } = media;
          return (
            <div
              key={src}
              className="flex justify-center items-center h-full w-full flex-shrink-0"
            >
              {type == "image" || type == "default" ?
                <img
                  src={src}
                  alt={alt}
                  className="h-full w-full object-cover"
                />
                : 
                type == "video" ?
                  <div className="h-full w-full relative">
                    <video
                      id={`${id}Video${ind}`}
                      loop
                      src={src}
                      alt={alt}
                      className="h-full w-full object-cover"
                    />
                    {muted[ind] ? 
                      <VolumeX
                        onClick={(e) => muteUnmute(e.target.parentNode.firstChild, ind)}
                        size={soundSize}
                        color="white"
                        className="absolute bottom-3 right-3 rounded-full bg-black border-2 border-white p-1"
                      />
                      :
                      <Volume2
                        onClick={(e) => muteUnmute(e.target.parentNode.firstChild, ind)}
                        size={soundSize}
                        color="white"
                        className="absolute bottom-3 right-3 rounded-full bg-black border-2 border-white p-1"
                      />
                    }
                  </div>
                : null
              }
            </div>
          )
        })}
        {uploading &&
          <div className="flex justify-center items-center h-full w-full flex-shrink-0 bg-white">
            <Uploading size={120} loading={uploading}/>
          </div>
        }
      </div>
      <div className={`absolute bottom-3 ${medias.length > 1 ? "flex" : "hidden"} justify-center items-center gap-5 left-1/2 -translate-x-1/2`}>
        <p
          onClick={() => moveTo(index, index-1)}
          className={`${index == 0 ? "hidden" : ""} bg-black p-2 rounded-full border-2 border-white`}
        >
          <ChevronLeft
            size={navigationSize}
            color="white"
          />
        </p>
        <p
          onClick={() => moveTo(index, index+1)}
          className={`${index == medias.length-1 ? "hidden" : ""} bg-black p-2 rounded-full border-2 border-white`}
        >
          <ChevronRight
            size={navigationSize}
            color="white"
          />
        </p>
      </div>
    </div>
    
  )
}

export default MultiMedia;
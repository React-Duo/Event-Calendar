import { useRef, useEffect } from "react"
import "./VideoPlayer.css"
import PropTypes from "prop-types";


const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  });

  return (
    <div>
        Uid: {user.uid}
      <div className="video-player"
        ref={ref}
      ></div>
    </div>
  );
};

VideoPlayer.propTypes = {
  user: PropTypes.object.isRequired
}
export default VideoPlayer
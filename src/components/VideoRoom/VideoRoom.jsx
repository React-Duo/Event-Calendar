import "./VideoRoom.css"
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
const APP_ID = "6083e35c080d4b069b777496f343bdb1"
const TOKEN = "007eJxTYFgS99qw5+xNhh+7l26a8rBEbZafwoG5C3ff/3T12C+xHr9SBQYzAwvjVGPTZAMLgxSTJAMzyyRzc3MTS7M0YxPjpJQkw/xHsWkNgYwMPvMuMDMyQCCIz8JQklpcwsAAAErFIqg="
const CHANNEL = "test"
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const VideoRoom = () => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user]);
        }

        if (mediaType === 'audio') {
            user.audioTrack.play()
        }
    };

    const handleUserLeft = (user) => {
        setUsers((previousUsers) =>
            previousUsers.filter((u) => u.uid !== user.uid)
        );
    };

    useEffect(() => {
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        client
            .join(APP_ID, CHANNEL, TOKEN, null)
            .then((uid) =>
                Promise.all([
                    AgoraRTC.createMicrophoneAndCameraTracks(),
                    uid,
                ])
            )
            .then(([tracks, uid]) => {
                const [audioTrack, videoTrack] = tracks;
                setLocalTracks(tracks);
                setUsers((previousUsers) => [
                    ...previousUsers,
                    {
                        uid,
                        videoTrack,
                        audioTrack,
                    },
                ]);
                client.publish(tracks);
            });

        return () => {
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
            client.unpublish(localTracks).then(() => client.leave());
        };
    }, []);
    return (
        <div>
            <div className="video-container">
                {users.map(user => (
                    <VideoPlayer key={user.uid} user={user} />
                ))}
            </div>
        </div>
    )
}
export default VideoRoom

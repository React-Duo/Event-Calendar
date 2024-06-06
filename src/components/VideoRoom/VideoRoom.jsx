import "./VideoRoom.css"
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { useNavigate } from "react-router-dom";

const APP_ID = "6083e35c080d4b069b777496f343bdb1"
const TOKEN = "007eJxTYFAtW6nOHXGiIu5+abvqr1X9V7K9rEQk6qYaH6jnEC2ve6rAYGZgYZxqbJpsYGGQYpJkYGaZZG5ubmJplmZsYpyUkmQoMzEhrSGQkUH+ym4WRgYIBPFZGEpSi0sYGACfFx0R"
const CHANNEL = "test"



const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VideoRoom = () => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [joined, setJoined] = useState(false);
    const navigate = useNavigate();



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
        AgoraRTC.setLogLevel(4);
        const joinAndPublish = async () => {
            try {
                const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);
                setJoined(true);
                const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
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
                await client.publish(tracks);
            } catch (error) {
                console.error("Error joining channel and publishing tracks:", error);
            }
        };

        joinAndPublish();

        return () => {
            for (let localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
            const cleanup = async () => {
                if (joined) {
                    await client.unpublish(localTracks);
                    await client.leave();
                }
            };
            cleanup();
        };
    }, []);

    return (
        <div>
            <button onClick={()=> navigate("/contacts")}>Leave</button>
            <div className="video-container">
                {users.map(user => (
                    <VideoPlayer key={user.uid} user={user} />
                ))}
            </div>
        </div>
    );
};
export default VideoRoom

import IdeaMessage from "./Messages/IdeaMessage";
import TextMessage from "./Messages/TextMessage";
import ImageMessage from "./Messages/ImageMessage";
import VideoMessage from "./Messages/VideoMessage";
import AudioMessage from "./Messages/AudioMessage";
import VoiceMessage from "./Messages/VoiceMessage";
import DocumentMessage from "./Messages/DocumentMessage";
import { Link } from "react-router-dom";
import { RiVideoChatLine } from "@remixicon/react";
import { useSocket } from "../../../context/socket";
import { useChat } from "../../../context/chats";
import { useVideoCall } from "../../../context/videoCall";
import {
	useCallback,
	useEffect
} from "react";

const Messages = ({
	firstName,
	lastName,
	gotVideoCall,
	messages,
	activeUsername,
	ideaMessages,
	userId,
	sendStreams,
	originalUsername
}) => {
	const socket = useSocket();

	const {
		currChat : {
			_id,
			name
		},
		username,
		profileImage,
		setUsername
	} = useChat();

	const {
		onVideoCall,
		setOnVideoCall,
		setVideoCallStatus
	} = useVideoCall();
	
	const requestVideoCall = useCallback(() => {
		setOnVideoCall(true);
		setVideoCallStatus("Calling");
		socket.emit("requestCall",{reciver: _id});
  },[_id]);

	useEffect(() => {
		let messageEle = document.querySelector("#message");
		messageEle.scrollTo({
			top: messageEle.scrollHeight,
			behavior: "smooth",
		});
  },[messages])

	const reciveTyping = useCallback(({ room, message }) => {
		if (room == _id) {
			if (message.length > 0) setUsername(message);
			else setUsername(originalUsername);
		}
  },[_id])

	useEffect(() => {
		socket.on("reciveTyping", reciveTyping)
		return () => socket.off("reciveTyping", reciveTyping)
  },[
		socket,
		_id,
		reciveTyping
	])

  return (
    <>
      <div className="py-2 px-5 flex justify-between items-center border-b-[1px] border-black border-solid">
				<div className="flex justify-center gap-3">
					<Link
						to={name ? "" : `/profile/${username}`}
						className="h-10 rounded-full"
					>
						<img
							className="h-full aspect-square object-cover rounded-full"
							src={profileImage}
						/>
					</Link>
					<div className="flex flex-col justify-between">
						<p className="font-semibold">{firstName} {lastName}</p>
						<p className="text-sm">{username}</p>
					</div>
				</div>
				<div className={`${name ? "hidden" : "flex"} justify-center gap-5 items-center hover:scale-110`}>
					<RiVideoChatLine
						id="videoCallIcon"
						size={30}
						onClick={() => {
							if (gotVideoCall) {
								if (_id == gotVideoCall) sendStreams();
							}
							else requestVideoCall();
						}}
						color={onVideoCall ? "red" : gotVideoCall ? "green" : "black"}
						className="scale-x-110 cursor-pointer"
					/>
				</div>
			</div>
			<div
				id="message"
				className={`${onVideoCall ? "hidden" : ""} flex-grow w-full overflow-scroll p-2`}
			>
				{messages.map((message, ind) => {
					let align = "start";
					if (userId.toString() == message.sender.toString()) align = "end";
					if (message.messageType == "text") {
						return (
							<TextMessage
								align={align}
								message={message}
								messagesLength={messages.length}
								nextSender={messages[ind+1]?.sender}
								activeUsername={activeUsername}
								ind={ind}
							/>
						)
					} else if (message.messageType == "image") {
						return (
							<ImageMessage
								align={align}
								message={message}
								chatTitle={name ? name : username}
								messagesLength={messages.length}
								nextSender={messages[ind+1]?.sender}
								activeUsername={activeUsername}
								ind={ind}
							/>
						)
					} else if (message.messageType == "video") {
						return (
							<VideoMessage
								align={align}
								message={message}
								chatTitle={name ? name : username}
								ind={ind}
								messagesLength={messages.length}
								nextSender={messages[ind+1]?.sender}
								activeUsername={activeUsername}
							/>
						)
					} else if (message.messageType == "audio") {
						return (
							<AudioMessage
								align={align}
								message={message}
								chatTitle={name ? name : username}
								ind={ind}
								messagesLength={messages.length}
								nextSender={messages[ind+1]?.sender}
								activeUsername={activeUsername}
							/>
						)
					} else if (message.messageType == "voice") {
						return (
							<VoiceMessage
								align={align}
								message={message}
								messagesLength={messages.length}
								nextSender={messages[ind+1]?.sender}
								activeUsername={activeUsername}
								ind={ind}
							/>
						)
					} else if (message.messageType == "idea") {
						return (
							<IdeaMessage
								align={align}
								message={message}
								thisIdea={ideaMessages.get(message.message)}
								ind={ind}
								messagesLength={messages.length}
								nextSender={messages[ind+1]?.sender}
								activeUsername={activeUsername}
							/>
						)
					} else {
						return (
							<DocumentMessage
								align={align}
								message={message}
								activeUsername={activeUsername}
								chatTitle={name ? name : username}
								ind={ind}
								messagesLength={messages.length}
								nextSender={messages[ind+1]?.sender}
							/>
						)
					}
				})}
			</div>
    </>
  )
}

export default Messages
import React, { useEffect, useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import GroupIcon from "@material-ui/icons/Group";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import "./Chat.css";

const Chat = ({ room, user, socket }) => {
	const [conversations, setConversations] = useState([]);
	const [senderText, setSenderText] = useState("");
	const [usersTyping, setUsersTyping] = useState(false);
	const [typingInfo, setTypingInfo] = useState({});
	const [roomUsers, setRoomUsers] = useState();

	useEffect(() => {
		fetch("https://chattie-backend.herokuapp.com/getmsgs", {
			method: "post",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				room: room.name,
			}),
		})
			.then((res) => res.json())
			.then((data) => setConversations(data))
			.then(() => {
				socket.on("room__mod", (data) => {
					setRoomUsers(data);
				});

				socket.emit("join__room", { user: user, room: room });

				socket.on("new__typing", (info) => {
					if (info.message) {
						setUsersTyping(true);
						setTypingInfo({
							username: `${info.username} typing...`,
							message: `${info.message}...`,
						});
					} else setUsersTyping(false);
				});

				socket.on("new__msg", (msg) => {
					setConversations((prevState) => [...prevState, msg]);
				});
			})
			.catch((err) => console.log("Server Error"));
	}, [user, socket, room]);

	useEffect(() => {
		if (conversations.length) {
			const scrollto = document.getElementById("need_scroll");

			scrollto.scrollTop = scrollto.scrollHeight;
			scrollto.style.scrollBehavior = "smooth";
		}
	}, [conversations, typingInfo]);

	const sendMessage = (e) => {
		e.preventDefault();
		senderText &&
			socket.emit("chat__msg", {
				room: room.name,
				username: user,
				message: senderText,
			});

		setSenderText("");
	};

	useEffect(() => {
		socket.emit("chat__typing", {
			room: room.name,
			username: user,
			message: senderText,
		});
	}, [senderText, room, user, socket]);

	// const typing = (e) => {
	// 	setSenderText(e.target.value);
	// 	if (senderText) {
	// 		socket.emit("chat__typing", {
	// 			room: room.name,
	// 			username: user,
	// 			message: e.target.value,
	// 		});
	// 	}
	// };

	return (
		<div className='chat'>
			<div id='chat__body' className='chat__body'>
				<div id='chat__info' className='chat__info'>
					<h4>
						<GroupIcon /> Room
					</h4>
					<p className='room_name'>{room.name}</p>
					<h4>
						<AccountCircleIcon />
						Users
					</h4>
					<div className='room__users'>
						{roomUsers?.users.map((user) => (
							<li className='room__user' key={user}>
								{user}
							</li>
						))}
					</div>
				</div>
				<div id='need_scroll' className='chat__msgs'>
					{conversations.map((msg) => (
						<div
							key={Math.random().toString()}
							className={`${
								user === msg.username ? "msg__containerself" : undefined
							} ${msg.username === "chaTTie BOT" && "bot__msg"}`}
						>
							<div className='chat__msg'>
								<h6>{msg.username}</h6>
								<div>{msg.message}</div>
							</div>
						</div>
					))}
					{usersTyping && (
						<div className='chat__msg'>
							<h6>{typingInfo.username}</h6>
							<div>{typingInfo.message}</div>
						</div>
					)}
				</div>
			</div>
			<form className='chat__footer'>
				<div className='mobile__footer'>
					<input
						className='chat__input'
						onChange={(e) => setSenderText(e.target.value)}
						type='text'
						placeholder='Enter your message'
						value={senderText}
					/>
					<button onClick={sendMessage} type='submit'>
						<SendIcon />
					</button>
				</div>
			</form>
		</div>
	);
};

export default Chat;

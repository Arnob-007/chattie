import React, { useState } from "react";
import SupervisedUserCircleOutlinedIcon from "@material-ui/icons/SupervisedUserCircleOutlined";
import "./Join.css";

const Join = ({ setRoom, setUser }) => {
	const [userName, setUserName] = useState("");
	const [roomCode, setroomCode] = useState("");

	const handleAuth = (e) => {
		e.preventDefault();
		userName &&
			roomCode &&
			fetch("https://chattie-backend.herokuapp.com/auth", {
				method: "post",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					username: userName,
					roomname: roomCode,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data === "Invalid") {
						alert("Wrong Credentials");
					} else {
						setRoom(data);
						setUser(userName);
					}
				})
				.catch((err) => console.log("Server Error"));

		setUserName("");
		setroomCode("");
	};

	return (
		<>
			<form className='join'>
				<div className='app__title'>
					<SupervisedUserCircleOutlinedIcon style={{ fontSize: "100px" }} />
					<h3>JOIN | CHAT | FORGET</h3>
				</div>
				<p>Username</p>
				<input
					onChange={(e) => setUserName(e.target.value)}
					type='text'
					placeholder='Enter UserName...'
					value={userName}
				></input>
				<p>Room Code</p>
				<input
					onChange={(e) => setroomCode(e.target.value)}
					type='text'
					placeholder='Enter Code'
					value={roomCode}
				></input>
				<button type='submit' onClick={handleAuth}>
					Join Chat
				</button>
			</form>
		</>
	);
};

export default Join;

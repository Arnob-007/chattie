import React, { useState } from "react";
import io from "socket.io-client";
import Join from "./Join";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import MenuIcon from "@material-ui/icons/Menu";
import "./App.css";
import Chat from "./Chat";

const socket = io("https://chattie-backend.herokuapp.com/");

const App = () => {
	const [room, setRoom] = useState(null);
	const [user, setUser] = useState("");

	const handleLogOut = () => {
		window.location.reload();
	};

	const toggleinfo = () => {
		const info = document.getElementById("chat__info");
		info.style.display === "none"
			? (info.style.display = "flex")
			: (info.style.display = "none");
	};

	return (
		<div className='app'>
			<div id='app_card' className={`app_card ${user && "app_cardext"}`}>
				<div id='app_title' className='app_title'>
					<h1>.chaTTie</h1>
					{user && (
						<div>
							<button className='leave__room' onClick={handleLogOut}>
								<ExitToAppRoundedIcon />
							</button>

							{window.screen.width <= 500 && (
								<button className='leave__room' onClick={toggleinfo}>
									<MenuIcon />
								</button>
							)}
						</div>
					)}
				</div>
				<div className='mobile__view'>
					{user ? (
						<Chat room={room} user={user} socket={socket} />
					) : (
						<Join setRoom={setRoom} setUser={setUser} />
					)}
				</div>
			</div>
		</div>
	);
};

export default App;

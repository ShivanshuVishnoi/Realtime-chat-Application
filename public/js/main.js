const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", function ({ room, users }) {
    outputRoomName(room);
    outputUsers(users);
})

socket.on("message", function (message) {
    console.log(message);
    outputMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;
});


chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const msg = event.target.elements.msg.value;

    socket.emit("chatMessage", msg);
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();

});

function outputMessage(message) {
    const div = document.createElement("div");

    div.classList.add("message");
    div.innerHTML = '<p class="meta">' + message.userName + ' <span>' + message.time + '</span></p><p class="text">' + message.text + '</p >';
    document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
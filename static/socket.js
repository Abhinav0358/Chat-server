const socket = io("https://chat-server-abhinav.onrender.com");
let users = [];
const usernameColors = [
  "#e74c3c", // Red
  "#3498db", // Blue
  "#2ecc71", // Green
  "#9b59b6", // Purple
  "#f39c12", // Orange
  "#1abc9c", // Teal
  "#e67e22", // Dark Orange
  "#34495e", // Navy Gray
  "#16a085", // Aqua Green
  "#c0392b"  // Dark Red
];
socket.on("connect", () => {
    console.log("Connected to server");

    // const username = sessionStorage.getItem("username");
    // if (!username) {
    //     alert("Username not found, redirecting...");
    //     window.location.href = '/';
    //     return;
    // }

    // // Send username to server
    // socket.emit("enter", username);
});

socket.on("message", function(data) {
    let now = new Date();
    let timeString = now.toTimeString().split(' ')[0];
    const item = document.createElement("li");
    const header=document.createElement("div");
    const body=document.createElement("div");
    const msgTime=document.createElement("span")
    header.classList.add("message-header")
    const usernameSpan = document.createElement("span");
    usernameSpan.classList.add("message-username");
    usernameSpan.textContent = data.username;
    body.classList.add("message-body")
    msgTime.classList.add("message-time")
    msgTime.textContent=`${timeString}`
    const index = data.username.length % usernameColors.length;
    usernameSpan.style.color = usernameColors[index]
    header.appendChild(usernameSpan);
    header.appendChild(msgTime)
    body.textContent=`${data.msg}`
    item.appendChild(header)
    item.appendChild(body)
    document.getElementById("messages").appendChild(item);
    scrollToBottom();
});

socket.on("enter", function(data) {
    console.log(data)
    const item = document.createElement("li");
    item.textContent = `${data.username} just joined the server`;
    users = data.users;
    document.getElementById("messages").appendChild(item);
    scrollToBottom();
});

function sendMessage() {
    const msgInput = document.getElementById("msg");
    const msg = msgInput.value.trim();
    if (!msg) return;

    const username = sessionStorage.getItem("username");
    socket.emit("message", {
        username: username,
        msg: msg
    });

    msgInput.value = '';
}

function scrollToBottom() {
    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
}
function enterChat() {
    const username = document.getElementById('username').value.trim();
    if (!username) return alert("Please enter a name");
    sessionStorage.setItem("username", username);
    window.location.href = '/chat';
}
window.onload=()=>{
    if(window.location.pathname == '/chat'){
        document.getElementById('username').textContent=`Welcome, ${sessionStorage.getItem("username")}`
        socket.emit("enter",
            sessionStorage.getItem("username")
        )
    }
}
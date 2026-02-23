// Skapa eller hämta anonymt användarnummer
let userId = localStorage.getItem("freebiird_user");

if (!userId) {
  userId = Math.floor(100 + Math.random() * 900); // 100–999
  localStorage.setItem("freebiird_user", userId);
}
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatLog = document.getElementById("chat-log");

const db = firebase.database();
const messagesRef = db.ref("messages");

// Skicka meddelande
sendBtn.onclick = sendMessage;
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  messagesRef.push({
    text: text,
    time: Date.now()
  });

  input.value = "";
}

// Ta emot meddelanden LIVE
messagesRef.limitToLast(100).on("child_added", snapshot => {
  const msg = document.createElement("div");
  msg.className = "message left";
  msg.textContent = snapshot.val().text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
});
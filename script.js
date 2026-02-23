// ===============================
// 1. Skapa eller hämta anonymt användarnummer
// ===============================
let userId = localStorage.getItem("freebiird_user");

if (!userId) {
  userId = Math.floor(100 + Math.random() * 900); // 100–999
  localStorage.setItem("freebiird_user", userId);
}

// ===============================
// 2. DOM-element
// ===============================
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatLog = document.getElementById("chat-log");

// ===============================
// 3. Firebase
// ===============================
const db = firebase.database();
const messagesRef = db.ref("messages");

// ===============================
// 4. Skicka meddelande
// ===============================
sendBtn.onclick = sendMessage;

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  messagesRef.push({
    text: text,
    user: userId,
    time: Date.now()
  });

  input.value = "";
}

// ===============================
// 5. Ta emot meddelanden LIVE
// ===============================
messagesRef.limitToLast(100).on("child_added", (snapshot) => {
  const data = snapshot.val();

  const msg = document.createElement("div");
  msg.className = "message";

  msg.innerHTML = `<strong>User ${data.user}:</strong> ${data.text}`;

  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
});
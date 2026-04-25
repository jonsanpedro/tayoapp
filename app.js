import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "tayoapp-c8f3f.firebaseapp.com",
  projectId: "tayoapp-c8f3f",
  storageBucket: "tayoapp-c8f3f.appspot.com",
  messagingSenderId: "498121530470",
  appId: "1:498121530470:web:3c715d619dea194834a1a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const remindersCol = collection(db, 'reminders');

// BROADCAST ACTION
document.getElementById('addBtn').addEventListener('click', async () => {
    const taskInput = document.getElementById('taskInput');
    const friendInput = document.getElementById('friendInput');
    
    if(taskInput.value && friendInput.value) {
        await addDoc(remindersCol, {
            task_name: taskInput.value,
            tagged_friend: friendInput.value,
            timestamp: new Date()
        });
        taskInput.value = '';
        friendInput.value = '';
    }
});

// GLOBAL DELETE FUNCTION
window.deletePing = async (id) => {
    if(confirm("Confirm deletion?")) await deleteDoc(doc(db, "reminders", id));
};

// LIVE SYNC
const q = query(remindersCol, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    const list = document.getElementById('reminderList');
    list.innerHTML = snapshot.empty ? `<p style="color: #475569">Your timeline is quiet...</p>` : "";
    
    snapshot.forEach(snap => {
        const data = snap.data();
        list.innerHTML += `
            <div class="ping-card">
                <div class="ping-content">
                    <b>${data.task_name}</b>
                    <span class="ping-tag">${data.tagged_friend.startsWith('@') ? data.tagged_friend : '@'+data.tagged_friend}</span>
                </div>
                <button class="del-btn" onclick="deletePing('${snap.id}')">×</button>
            </div>`;
    });
});

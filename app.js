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

// ADD
document.getElementById('addBtn').addEventListener('click', async () => {
    const task = document.getElementById('taskInput').value;
    const friend = document.getElementById('friendInput').value;
    if(task && friend) {
        await addDoc(remindersCol, { task_name: task, tagged_friend: friend, timestamp: new Date() });
        document.getElementById('taskInput').value = '';
        document.getElementById('friendInput').value = '';
    }
});

// DELETE
window.deletePing = async (id) => {
    if(confirm("Burahin itong ping?")) await deleteDoc(doc(db, "reminders", id));
};

// DISPLAY
const q = query(remindersCol, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    const list = document.getElementById('reminderList');
    list.innerHTML = "";
    snapshot.forEach(snap => {
        const data = snap.data();
        list.innerHTML += `
            <div class="ping-item">
                <div class="ping-info">
                    <b>${data.task_name}</b>
                    <span>${data.tagged_friend.startsWith('@') ? data.tagged_friend : '@'+data.tagged_friend}</span>
                </div>
                <button class="delete-btn" onclick="deletePing('${snap.id}')">✕</button>
            </div>`;
    });
});

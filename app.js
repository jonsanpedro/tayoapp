import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// I-paste mo dito yung firebaseConfig mo galing sa Notes!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "tayoapp-c8f3f.firebaseapp.com",
  projectId: "tayoapp-c8f3f",
  storageBucket: "tayoapp-c8f3f.appspot.com",
  messagingSenderId: "498121530470",
  appId: "1:498121530470:web:3c715d619dea194834a1a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const remindersCol = collection(db, 'reminders');

// Logic para mag-ADD ng data
document.getElementById('addBtn').addEventListener('click', async () => {
    const task = document.getElementById('taskInput').value;
    const friend = document.getElementById('friendInput').value;
    
    if(task && friend) {
        await addDoc(remindersCol, {
            task_name: task,
            tagged_friend: friend,
            status: "pending",
            timestamp: new Date()
        });
        document.getElementById('taskInput').value = '';
        document.getElementById('friendInput').value = '';
    }
});

// Logic para i-DISPLAY ang data (Real-time!)
onSnapshot(remindersCol, (snapshot) => {
    const list = document.getElementById('reminderList');
    list.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        list.innerHTML += `<div class="card">
            <b>${data.task_name}</b><br>
            Tagged: ${data.tagged_friend}
        </div>`;
    });
});

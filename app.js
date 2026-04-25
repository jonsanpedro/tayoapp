import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// IMPORTANT: Palitan mo ito ng sarili mong Firebase Config!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "tayoapp-c8f3f.firebaseapp.com",
  projectId: "tayoapp-c8f3f",
  storageBucket: "tayoapp-c8f3f.appspot.com",
  messagingSenderId: "498121530470",
  appId: "1:498121530470:web:3c715d619dea194834a1a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const remindersCol = collection(db, 'reminders');

// Function para mag-save ng data
document.getElementById('addBtn').addEventListener('click', async () => {
    const task = document.getElementById('taskInput').value;
    const friend = document.getElementById('friendInput').value;
    
    if(task.trim() !== "" && friend.trim() !== "") {
        try {
            await addDoc(remindersCol, {
                task_name: task,
                tagged_friend: friend,
                timestamp: new Date()
            });
            // Clear inputs pagkatapos ma-save
            document.getElementById('taskInput').value = '';
            document.getElementById('friendInput').value = '';
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Nagka-error sa pag-save. Check your Firebase Rules!");
        }
    } else {
        alert("Paki-fill up lahat ng fields!");
    }
});

// Real-time listener para ipakita ang data
// Naka-order ito by timestamp para yung bago ang laging nasa taas
const q = query(remindersCol, orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    const list = document.getElementById('reminderList');
    
    if (snapshot.empty) {
        list.innerHTML = `<p style="color: #A0AEC0; font-size: 0.9rem;">No reminders yet. Start tagging!</p>`;
        return;
    }

    list.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        // Fallback checks para hindi mag-undefined
        const task = data.task_name || "No Task Name";
        const friend = data.tagged_friend || "No Friend Tagged";
        
        list.innerHTML += `
            <div class="reminder-item">
                <div class="reminder-info">
                    <b>${task}</b>
                    <span class="tag">${friend.startsWith('@') ? friend : '@' + friend}</span>
                </div>
            </div>`;
    });
});

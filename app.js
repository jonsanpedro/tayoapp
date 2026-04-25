// ... (panatilihin yung Firebase Config mo sa taas) ...

document.getElementById('addBtn').addEventListener('click', async () => {
    const task = document.getElementById('taskInput').value;
    const friend = document.getElementById('friendInput').value;
    
    if(task && friend) {
        await addDoc(remindersCol, {
            task_name: task,     // siguraduhin na "task_name" ang spelling
            tagged_friend: friend, 
            timestamp: new Date()
        });
        document.getElementById('taskInput').value = '';
        document.getElementById('friendInput').value = '';
    }
});

onSnapshot(remindersCol, (snapshot) => {
    const list = document.getElementById('reminderList');
    list.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        list.innerHTML += `
            <div class="reminder-item">
                <div class="reminder-info">
                    <b>${data.task_name || "Untitled Task"}</b>
                    <span class="tag">@${data.tagged_friend || "Anyone"}</span>
                </div>
            </div>`;
    });
});

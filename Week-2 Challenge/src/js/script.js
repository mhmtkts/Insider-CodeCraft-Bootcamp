document.addEventListener('DOMContentLoaded', function() {
    // DOM elemanlarını seçme
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskStatus = document.getElementById('task-status');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    
    // Form gönderme olayını dinleme
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form verilerini alma
        const title = taskTitle.value.trim();
        const description = taskDesc.value.trim();
        const priorityEl = document.querySelector('input[name="priority"]:checked');
        
        if (!priorityEl || title === '') {
            alert('Please fill all required fields');
            return;
        }
        
        const priority = priorityEl.value;
        const isCompleted = taskStatus.checked;
        
        // Yeni görev oluşturma
        addTask(title, description, priority, isCompleted);
        
        // Formu sıfırlama
        taskForm.reset();
    });
    
    // Görev ekleme fonksiyonu
    function addTask(title, description, priority, isCompleted) {
        // Yeni görev elemanını oluşturma
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${priority.toLowerCase()}`;
        
        // Görev içeriğini oluşturma
        taskItem.innerHTML = `
            <h3>${title} <span class="priority-badge priority-${priority.toLowerCase()}">${priority}</span></h3>
            <p>${description || 'No description'}</p>
            <div class="task-actions">
                <button class="btn btn-complete">${isCompleted ? 'Undo' : 'Complete'}</button>
                <button class="btn btn-delete">Delete</button>
            </div>
        `;
        
        // Görev tamamlanmış veya tamamlanmamış olarak ekleme
        if (isCompleted) {
            taskItem.classList.add('completed');
            completedList.appendChild(taskItem);
        } else {
            pendingList.appendChild(taskItem);
        }
    }
});
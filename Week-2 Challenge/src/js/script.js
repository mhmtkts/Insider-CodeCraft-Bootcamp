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
        
        try {
            // Form doğrulama
            if (!validateForm()) {
                return;
            }
            
            // Form verilerini alma
            const title = taskTitle.value.trim();
            const description = taskDesc.value.trim();
            const priorityEl = document.querySelector('input[name="priority"]:checked');
            
            // Öncelik seçilmediyse hata göster
            if (!priorityEl) {
                showError('Please select a priority level');
                return;
            }
            
            const priority = priorityEl.value;
            const isCompleted = taskStatus.checked;
            
            // Yeni görev oluşturma
            addTask(title, description, priority, isCompleted);
            
            // Formu sıfırlama
            taskForm.reset();
        } catch (error) {
            console.error('Error adding task:', error);
            showError('An unexpected error occurred. Please try again.');
        }
    });
    
    // Form doğrulama fonksiyonu
    function validateForm() {
        if (taskTitle.value.trim() === '') {
            showError('Please enter a task title');
            return false;
        }
        
        const prioritySelected = document.querySelector('input[name="priority"]:checked');
        if (!prioritySelected) {
            showError('Please select a priority level');
            return false;
        }
        
        return true;
    }
    
    // Hata mesajı gösterme fonksiyonu
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Mevcut hata mesajları varsa kaldır
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Yeni hata mesajını forma ekle
        taskForm.prepend(errorDiv);
        
        // 3 saniye sonra hata mesajını kaldır
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
    
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
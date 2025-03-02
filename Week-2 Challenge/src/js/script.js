document.addEventListener('DOMContentLoaded', function() {
    // DOM elemanlarını seçme
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskStatus = document.getElementById('task-status');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    const filterView = document.getElementById('filter-view');
    const sortOrder = document.getElementById('sort-order');
    
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
        taskItem.dataset.priority = priority.toLowerCase();
        
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
        
        // Mevcut filtreye göre görünürlüğü ayarla
        updateTasksVisibility();
        
        // Mevcut sıralamaya göre yeniden sırala
        if (sortOrder.value !== 'default') {
            sortTasks(sortOrder.value);
        }
    }
    
    // Event delegation ile tüm buton olaylarını dinleme
    document.querySelector('.tasks-container').addEventListener('click', function(e) {
        // Event bubbling'i önle
        e.stopPropagation();
        
        const target = e.target;
        
        // Tamamla/Geri al butonuna tıklandığında
        if (target.classList.contains('btn-complete')) {
            const taskItem = target.closest('.task-item');
            
            if (taskItem.parentNode === pendingList) {
                pendingList.removeChild(taskItem);
                taskItem.classList.add('completed');
                target.textContent = 'Undo';
                completedList.appendChild(taskItem);
            } else {
                completedList.removeChild(taskItem);
                taskItem.classList.remove('completed');
                target.textContent = 'Complete';
                pendingList.appendChild(taskItem);
            }
            
            // Mevcut filtreye göre görünürlüğü ayarla
            updateTasksVisibility();
            
            // Mevcut sıralamaya göre yeniden sırala
            if (sortOrder.value !== 'default') {
                sortTasks(sortOrder.value);
            }
        }
        
        // Silme butonuna tıklandığında
        if (target.classList.contains('btn-delete')) {
            const taskItem = target.closest('.task-item');
            taskItem.parentNode.removeChild(taskItem);
        }
    });
    
    // Filtreleme için olay dinleyicisi
    filterView.addEventListener('change', updateTasksVisibility);
    
    // Görevlerin görünürlüğünü güncelleme fonksiyonu
    function updateTasksVisibility() {
        const pendingTasksSection = document.getElementById('pending-tasks');
        const completedTasksSection = document.getElementById('completed-tasks');
        
        switch (filterView.value) {
            case 'all':
                pendingTasksSection.style.display = 'block';
                completedTasksSection.style.display = 'block';
                break;
            case 'pending':
                pendingTasksSection.style.display = 'block';
                completedTasksSection.style.display = 'none';
                break;
            case 'completed':
                pendingTasksSection.style.display = 'none';
                completedTasksSection.style.display = 'block';
                break;
        }
    }
    
    // Sıralama için olay dinleyicisi
    sortOrder.addEventListener('change', function() {
        if (this.value === 'default') {
            // Default sıralama
            location.reload();
        } else {
            sortTasks(this.value);
        }
    });
    
    // Görevleri önceliğe göre sıralama fonksiyonu
    function sortTasks(order) {
        const priorityOrder = {'high': 1, 'medium': 2, 'low': 3};
        
        // Bekleyen görevleri sırala
        const pendingElements = Array.from(pendingList.children);
        
        pendingElements.sort((a, b) => {
            if (order === 'high-to-low') {
                return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
            } else {
                return priorityOrder[b.dataset.priority] - priorityOrder[a.dataset.priority];
            }
        });
        
        // DOM'u güncelle
        pendingElements.forEach(element => pendingList.appendChild(element));
        
        // Tamamlanan görevleri sırala
        const completedElements = Array.from(completedList.children);
        
        completedElements.sort((a, b) => {
            if (order === 'high-to-low') {
                return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
            } else {
                return priorityOrder[b.dataset.priority] - priorityOrder[a.dataset.priority];
            }
        });
        
        // DOM'u güncelle
        completedElements.forEach(element => completedList.appendChild(element));
    }
    
    // Sayfa yüklendiğinde varsayılan filtreleme ayarı
    updateTasksVisibility();
});
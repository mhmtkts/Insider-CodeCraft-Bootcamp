document.addEventListener("DOMContentLoaded", function () {
  // DOM elemanlarını seçme
  const taskForm = document.getElementById("task-form");
  const taskTitle = document.getElementById("task-title");
  const taskDesc = document.getElementById("task-desc");
  const taskStatus = document.getElementById("task-status");
  const pendingList = document.getElementById("pending-list");
  const completedList = document.getElementById("completed-list");
  const filterView = document.getElementById("filter-view");
  const sortOrder = document.getElementById("sort-order");
  const emptyPending = document.getElementById("empty-pending");
  const emptyCompleted = document.getElementById("empty-completed");

  if (localStorage.getItem("darkTheme") === "true") {
    document.body.classList.add("dark-theme");
  }

  // Tema değiştirme butonu olayı
  document.getElementById("theme-switch").addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");

    // Kullanıcı tercihini kaydet
    const isDarkTheme = document.body.classList.contains("dark-theme");
    localStorage.setItem("darkTheme", isDarkTheme);
  });

  // Tüm görevleri takip etmek için diziler
  let pendingTasks = [];
  let completedTasks = [];

  // Form gönderme olayını dinleme
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    try {
      // Form doğrulama
      if (!validateForm()) {
        return;
      }

      // Form verilerini alma
      const title = taskTitle.value.trim();
      const description = taskDesc.value.trim();
      const priorityEl = document.querySelector(
        'input[name="priority"]:checked'
      );

      // Öncelik seçilmediyse hata göster
      if (!priorityEl) {
        showError("Please select a priority level");
        return;
      }

      const priority = priorityEl.value;
      const isCompleted = taskStatus.checked;

      // Yeni görev oluşturma
      addTask(title, description, priority, isCompleted);

      // Formu sıfırlama
      taskForm.reset();
    } catch (error) {
      console.error("Error adding task:", error);
      showError("An unexpected error occurred. Please try again.");
    }
  });

  // Form doğrulama fonksiyonu
  function validateForm() {
    if (taskTitle.value.trim() === "") {
      showError("Please enter a task title");
      return false;
    }

    const prioritySelected = document.querySelector(
      'input[name="priority"]:checked'
    );
    if (!prioritySelected) {
      showError("Please select a priority level");
      return false;
    }

    return true;
  }

  // Hata mesajı gösterme fonksiyonu
  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    // Mevcut hata mesajları varsa kaldır
    const existingErrors = document.querySelectorAll(".error-message");
    existingErrors.forEach((error) => error.remove());

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
    const taskItem = document.createElement("div");
    taskItem.className = `task-item ${priority.toLowerCase()}`;
    taskItem.dataset.priority = priority.toLowerCase();

    // Görev içeriğini oluşturma
    taskItem.innerHTML = `
            <h3>${title} <span class="priority-badge priority-${priority.toLowerCase()}">${priority}</span></h3>
            <p>${description || "No description"}</p>
            <div class="task-actions">
                <button class="btn btn-complete">${
                  isCompleted ? "Undo" : "Complete"
                }</button>
                <button class="btn btn-delete">Delete</button>
            </div>
        `;

    // Görev ID'si atama
    const taskId = Date.now().toString();
    taskItem.dataset.id = taskId;

    // Görev nesnesini oluşturma
    const taskObject = {
      id: taskId,
      title: title,
      description: description,
      priority: priority,
      isCompleted: isCompleted,
      element: taskItem,
    };

    // Görev tamamlanmış veya tamamlanmamış olarak ekleme
    if (isCompleted) {
      taskItem.classList.add("completed");
      completedList.appendChild(taskItem);
      completedTasks.push(taskObject);
    } else {
      pendingList.appendChild(taskItem);
      pendingTasks.push(taskObject);
    }

    // Boş liste mesajlarını güncelle
    updateEmptyListMessages();

    // Mevcut filtreye göre görünürlüğü ayarla
    updateTasksVisibility();

    // Mevcut sıralamaya göre yeniden sırala
    if (sortOrder.value !== "default") {
      sortTasks(sortOrder.value);
    }
  }

  // Boş liste mesajlarını güncelle
  function updateEmptyListMessages() {
    if (pendingTasks.length === 0) {
      emptyPending.style.display = "flex";
    } else {
      emptyPending.style.display = "none";
    }

    if (completedTasks.length === 0) {
      emptyCompleted.style.display = "flex";
    } else {
      emptyCompleted.style.display = "none";
    }
  }

  // Event delegation ile tüm buton olaylarını dinleme
  document
    .querySelector(".tasks-container")
    .addEventListener("click", function (e) {
      // Event bubbling'i önle
      e.stopPropagation();

      const target = e.target;

      // Tamamla/Geri al butonuna tıklandığında
      if (target.classList.contains("btn-complete")) {
        const taskItem = target.closest(".task-item");
        const taskId = taskItem.dataset.id;

        if (taskItem.parentNode === pendingList) {
          // Task'ı diziden bul ve güncelle
          const taskIndex = pendingTasks.findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            const task = pendingTasks.splice(taskIndex, 1)[0];
            task.isCompleted = true;
            completedTasks.push(task);
          }

          // DOM'u güncelle
          pendingList.removeChild(taskItem);
          taskItem.classList.add("completed");
          target.textContent = "Undo";
          completedList.appendChild(taskItem);
        } else {
          // Task'ı diziden bul ve güncelle
          const taskIndex = completedTasks.findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            const task = completedTasks.splice(taskIndex, 1)[0];
            task.isCompleted = false;
            pendingTasks.push(task);
          }

          // DOM'u güncelle
          completedList.removeChild(taskItem);
          taskItem.classList.remove("completed");
          target.textContent = "Complete";
          pendingList.appendChild(taskItem);
        }

        // Boş liste mesajlarını güncelle
        updateEmptyListMessages();

        // Mevcut filtreye göre görünürlüğü ayarla
        updateTasksVisibility();

        // Mevcut sıralamaya göre yeniden sırala
        if (sortOrder.value !== "default") {
          sortTasks(sortOrder.value);
        }
      }

      // Silme butonuna tıklandığında
      if (target.classList.contains("btn-delete")) {
        const taskItem = target.closest(".task-item");
        const taskId = taskItem.dataset.id;

        // Task'ı diziden sil
        if (taskItem.parentNode === pendingList) {
          pendingTasks = pendingTasks.filter((task) => task.id !== taskId);
        } else {
          completedTasks = completedTasks.filter((task) => task.id !== taskId);
        }

        // DOM'dan sil
        taskItem.parentNode.removeChild(taskItem);

        // Boş liste mesajlarını güncelle
        updateEmptyListMessages();
      }
    });

  // Filtreleme için olay dinleyicisi
  filterView.addEventListener("change", updateTasksVisibility);

  // Görevlerin görünürlüğünü güncelleme fonksiyonu
  function updateTasksVisibility() {
    const pendingTasksSection = document.getElementById("pending-tasks");
    const completedTasksSection = document.getElementById("completed-tasks");

    switch (filterView.value) {
      case "all":
        pendingTasksSection.style.display = "block";
        completedTasksSection.style.display = "block";
        break;
      case "pending":
        pendingTasksSection.style.display = "block";
        completedTasksSection.style.display = "none";
        break;
      case "completed":
        pendingTasksSection.style.display = "none";
        completedTasksSection.style.display = "block";
        break;
    }
  }

  // Sıralama için olay dinleyicisi
  sortOrder.addEventListener("change", function () {
    if (this.value === "default") {
      // Default sıralama - görevleri eklendiği sıraya göre göster
      renderDefaultOrder();
    } else {
      sortTasks(this.value);
    }
  });

  // Görevleri varsayılan sırada gösterme fonksiyonu
  function renderDefaultOrder() {
    // Bekleyen görevleri temizle ve varsayılan sırada yeniden ekle
    while (pendingList.firstChild) {
      pendingList.removeChild(pendingList.firstChild);
    }

    pendingTasks.forEach((task) => {
      pendingList.appendChild(task.element);
    });

    // Tamamlanan görevleri temizle ve varsayılan sırada yeniden ekle
    while (completedList.firstChild) {
      completedList.removeChild(completedList.firstChild);
    }

    completedTasks.forEach((task) => {
      completedList.appendChild(task.element);
    });
  }

  // Görevleri önceliğe göre sıralama fonksiyonu
  function sortTasks(order) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    // Bekleyen görevleri sırala
    const pendingElements = Array.from(pendingList.children);

    pendingElements.sort((a, b) => {
      if (order === "high-to-low") {
        return (
          priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority]
        );
      } else {
        return (
          priorityOrder[b.dataset.priority] - priorityOrder[a.dataset.priority]
        );
      }
    });

    // DOM'u güncelle
    pendingElements.forEach((element) => pendingList.appendChild(element));

    // Tamamlanan görevleri sırala
    const completedElements = Array.from(completedList.children);

    completedElements.sort((a, b) => {
      if (order === "high-to-low") {
        return (
          priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority]
        );
      } else {
        return (
          priorityOrder[b.dataset.priority] - priorityOrder[a.dataset.priority]
        );
      }
    });

    // DOM'u güncelle
    completedElements.forEach((element) => completedList.appendChild(element));
  }

  // Sayfa yüklendiğinde varsayılan filtreyi ve sıralamayı ayarla ve boş liste mesajlarını göster
  updateTasksVisibility();
  updateEmptyListMessages();
});

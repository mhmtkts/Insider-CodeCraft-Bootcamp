document.addEventListener("DOMContentLoaded", function () {
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

  document.getElementById("theme-switch").addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");

    const isDarkTheme = document.body.classList.contains("dark-theme");
    localStorage.setItem("darkTheme", isDarkTheme);
  });

  let pendingTasks = [];
  let completedTasks = [];

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    try {
      if (!validateForm()) {
        return;
      }

      const title = taskTitle.value.trim();
      const description = taskDesc.value.trim();
      const priorityEl = document.querySelector(
        'input[name="priority"]:checked'
      );

      if (!priorityEl) {
        showError("Please select a priority level");
        return;
      }

      const priority = priorityEl.value;
      const isCompleted = taskStatus.checked;

      addTask(title, description, priority, isCompleted);

      taskForm.reset();
    } catch (error) {
      console.error("Error adding task:", error);
      showError("An unexpected error occurred. Please try again.");
    }
  });

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

  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    const existingErrors = document.querySelectorAll(".error-message");
    existingErrors.forEach((error) => error.remove());

    taskForm.prepend(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  function addTask(title, description, priority, isCompleted) {
    const taskItem = document.createElement("div");
    taskItem.className = `task-item ${priority.toLowerCase()}`;
    taskItem.dataset.priority = priority.toLowerCase();

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

    const taskId = Date.now().toString();
    taskItem.dataset.id = taskId;

    const taskObject = {
      id: taskId,
      title: title,
      description: description,
      priority: priority,
      isCompleted: isCompleted,
      element: taskItem,
    };

    if (isCompleted) {
      taskItem.classList.add("completed");
      completedList.appendChild(taskItem);
      completedTasks.push(taskObject);
    } else {
      pendingList.appendChild(taskItem);
      pendingTasks.push(taskObject);
    }

    updateEmptyListMessages();

    updateTasksVisibility();

    if (sortOrder.value !== "default") {
      sortTasks(sortOrder.value);
    }
  }

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

  document
    .querySelector(".tasks-container")
    .addEventListener("click", function (e) {
      e.stopPropagation();

      const target = e.target;

      if (target.classList.contains("btn-complete")) {
        const taskItem = target.closest(".task-item");
        const taskId = taskItem.dataset.id;

        if (taskItem.parentNode === pendingList) {
          const taskIndex = pendingTasks.findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            const task = pendingTasks.splice(taskIndex, 1)[0];
            task.isCompleted = true;
            completedTasks.push(task);
          }

          pendingList.removeChild(taskItem);
          taskItem.classList.add("completed");
          target.textContent = "Undo";
          completedList.appendChild(taskItem);
        } else {
          const taskIndex = completedTasks.findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            const task = completedTasks.splice(taskIndex, 1)[0];
            task.isCompleted = false;
            pendingTasks.push(task);
          }

          completedList.removeChild(taskItem);
          taskItem.classList.remove("completed");
          target.textContent = "Complete";
          pendingList.appendChild(taskItem);
        }

        updateEmptyListMessages();

        updateTasksVisibility();

        if (sortOrder.value !== "default") {
          sortTasks(sortOrder.value);
        }
      }

      if (target.classList.contains("btn-delete")) {
        const taskItem = target.closest(".task-item");
        const taskId = taskItem.dataset.id;

        if (taskItem.parentNode === pendingList) {
          pendingTasks = pendingTasks.filter((task) => task.id !== taskId);
        } else {
          completedTasks = completedTasks.filter((task) => task.id !== taskId);
        }

        taskItem.parentNode.removeChild(taskItem);

        updateEmptyListMessages();
      }
    });

  filterView.addEventListener("change", updateTasksVisibility);

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

  sortOrder.addEventListener("change", function () {
    if (this.value === "default") {
      renderDefaultOrder();
    } else {
      sortTasks(this.value);
    }
  });

  function renderDefaultOrder() {
    while (pendingList.firstChild) {
      pendingList.removeChild(pendingList.firstChild);
    }

    pendingTasks.forEach((task) => {
      pendingList.appendChild(task.element);
    });

    while (completedList.firstChild) {
      completedList.removeChild(completedList.firstChild);
    }

    completedTasks.forEach((task) => {
      completedList.appendChild(task.element);
    });
  }

  function sortTasks(order) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

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

    pendingElements.forEach((element) => pendingList.appendChild(element));

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

    completedElements.forEach((element) => completedList.appendChild(element));
  }

  updateTasksVisibility();
  updateEmptyListMessages();
});
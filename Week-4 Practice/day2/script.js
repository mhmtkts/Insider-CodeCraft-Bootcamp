function formatDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

const storageKey = "api_users_data";

function saveToLocalStorage(data) {
  return new Promise((resolve) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const storageData = {
        data: data,
        expiry: formatDate(tomorrow),
      };

      localStorage.setItem(storageKey, JSON.stringify(storageData));
      resolve(true);
    } catch (error) {
      console.error("LocalStorage kayıt hatası:", error);
      resolve(false);
    }
  });
}

function getFromLocalStorage() {
  return new Promise((resolve) => {
    try {
      const storedData = localStorage.getItem(storageKey);

      if (!storedData) {
        resolve(null);
        return;
      }

      const parsedData = JSON.parse(storedData);
      const today = formatDate(new Date());

      if (parsedData.expiry < today) {
        localStorage.removeItem(storageKey);
        resolve(null);
        return;
      }

      resolve(parsedData.data);
    } catch (error) {
      console.error("LocalStorage okuma hatası:", error);
      resolve(null);
    }
  });
}

function removeUserFromLocalStorage(userId) {
  return new Promise(async (resolve) => {
    try {
      const users = await getFromLocalStorage();
      if (!users) {
        resolve(null);
        return;
      }

      const updatedUsers = users.filter((user) => user.id !== userId);

      await saveToLocalStorage(updatedUsers);
      resolve(updatedUsers);
    } catch (error) {
      console.error("Kullanıcı silme hatası:", error);
      resolve(null);
    }
  });
}

function fetchUsersFromAPI() {
  return new Promise((resolve, reject) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API yanıt vermedi: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function renderUsersList(users, container) {
  const styles = `
    <style>
      .user-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 20px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
        position: relative;
      }
      
      .user-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.15);
      }
      
      .user-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .user-avatar {
        width: 50px;
        height: 50px;
        background-color: #3498db;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 15px;
        font-size: 18px;
      }
      
      .user-name {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
        color: #2c3e50;
      }
      
      .user-username {
        color: #7f8c8d;
        font-size: 14px;
        margin: 5px 0;
      }
      
      .user-detail {
        margin: 10px 0;
        display: flex;
        align-items: center;
      }
      
      .user-detail i {
        margin-right: 10px;
        color: #3498db;
        width: 20px;
        text-align: center;
      }
      
      .user-address {
        background-color: #f8f9fa;
        padding: 10px;
        border-radius: 5px;
        margin: 15px 0;
      }
      
      .user-address p {
        margin: 5px 0;
        font-size: 14px;
      }
      
      .delete-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      .user-card:hover .delete-btn {
        opacity: 1;
      }
      
      .user-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .refresh-btn {
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      
      .loading {
        text-align: center;
        padding: 20px;
      }
    </style>
  `;

  let html = `
    ${styles}
    <div class="user-list-header">
      <h2>Kullanıcı Listesi</h2>
      <button class="refresh-btn" id="refreshData">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 4v6h-6"></path>
          <path d="M1 20v-6h6"></path>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
          <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Verileri Güncelle
      </button>
    </div>
  `;

  if (users && users.length > 0) {
    users.forEach((user) => {
      const initials = user.name
        .split(" ")
        .map((name) => name[0])
        .join("");

      html += `
        <div class="user-card" data-id="${user.id}">
          <button class="delete-btn">Sil</button>
          <div class="user-header">
            <div class="user-avatar">${initials}</div>
            <div>
              <h3 class="user-name">${user.name}</h3>
              <p class="user-username">@${user.username}</p>
            </div>
          </div>
          
          <div class="user-detail">
            <i>✉️</i>
            <span>${user.email}</span>
          </div>
          
          <div class="user-detail">
            <i>📞</i>
            <span>${user.phone}</span>
          </div>
          
          <div class="user-detail">
            <i>🌐</i>
            <a href="http://${user.website}" target="_blank">${user.website}</a>
          </div>
          
          <div class="user-address">
            <h4>Adres Bilgileri:</h4>
            <p>${user.address.street}, ${user.address.suite}</p>
            <p>${user.address.city} ${user.address.zipcode}</p>
            <p><small>Koordinatlar: ${user.address.geo.lat}, ${user.address.geo.lng}</small></p>
          </div>
        </div>
      `;
    });
  } else {
    html += "<p>Gösterilecek kullanıcı bulunmamaktadır.</p>";
  }

  container.innerHTML = html;

  attachEventListeners(container);
}

function attachEventListeners(container) {
  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const userCard = e.target.closest(".user-card");
      const userId = parseInt(userCard.getAttribute("data-id"));

      userCard.style.opacity = "0";
      userCard.style.transform = "translateY(20px)";
      userCard.style.transition = "all 0.3s ease";

      setTimeout(async () => {
        const updatedUsers = await removeUserFromLocalStorage(userId);

        if (updatedUsers) {
          userCard.remove();

          if (updatedUsers.length === 0) {
            container.innerHTML = "<p>Tüm kullanıcılar silindi.</p>";
          }
        }
      }, 300);
    });
  });

  const refreshBtn = container.querySelector("#refreshData");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      container.innerHTML = '<div class="loading">Veriler yükleniyor...</div>';
      initApp();
    });
  }
}

function showError(container, message) {
  container.innerHTML = `
    <div class="error-message">
      <strong>Hata!</strong> ${message}
    </div>
    <button class="refresh-btn" id="retryBtn">Tekrar Deneyin</button>
  `;

  container.querySelector("#retryBtn").addEventListener("click", () => {
    container.innerHTML = '<div class="loading">Veriler yükleniyor...</div>';
    initApp();
  });
}

async function initApp() {
  const container = document.querySelector(".ins-api-users");
  if (!container) return;

  try {
    let usersData = await getFromLocalStorage();

    if (!usersData) {
      container.innerHTML = '<div class="loading">Veriler yükleniyor...</div>';

      try {
        usersData = await fetchUsersFromAPI();

        await saveToLocalStorage(usersData);
      } catch (apiError) {
        console.error("API hatası:", apiError);
        showError(
          container,
          "Kullanıcı verileri çekilirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin."
        );
        return;
      }
    }

    renderUsersList(usersData, container);
  } catch (error) {
    console.error("Genel hata:", error);
    showError(
      container,
      "Bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin."
    );
  }
}

document.addEventListener("DOMContentLoaded", initApp);
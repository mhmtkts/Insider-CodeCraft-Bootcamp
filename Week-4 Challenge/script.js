const appendLocation = '.user';
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const CACHE_EXPIRATION = 30 * 60 * 1000;
const STORAGE_KEYS = {
  users: 'users',
  buttonUsed: 'reloadButtonUsed'
};

class UserManager {
  constructor(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
      console.error(`"${selector}" seçicisine sahip bir element bulunamadı`);
      return;
    }
    this.init();
  }

  init() {
    this.loadUsers();
    this.setupEventListeners();
    this.loadUsers();
  }

  setupEventListeners() {
    document.addEventListener('click', e => {
      if (e.target.closest('.delete-user')) {
        const button = e.target.closest('.delete-user');
        this.deleteUser(button.dataset.id);
      }
      
      if (e.target.closest('#reload-users-btn')) {
        this.handleReloadButtonClick();
      }
    });
  }

  loadUsers() {
    const users = this.getCachedUsers();
    
    if (users) {
      this.renderUsers(users);
    } else {
      this.fetchUsers();
    }
  }

  async fetchUsers() {
    try {
      this.showLoading();
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Hata: ${response.status} ${response.statusText}`);
      }
      
      const users = await response.json();
      
      this.cacheUsers(users);
      this.renderUsers(users);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  cacheUsers(users) {
    if (!users || !Array.isArray(users)) return;
    
    try {
      const now = Date.now();
      const cacheData = {
        users,
        expiration: now + CACHE_EXPIRATION
      };
      
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Önbelleğe kaydetme hatası:', error);
    }
  }

  getCachedUsers() {
    try {
      const cacheJson = localStorage.getItem(STORAGE_KEYS.users);
      
      if (!cacheJson) return null;
      
      const cache = JSON.parse(cacheJson);
      const now = Date.now();
      
      if (cache?.users && cache?.expiration && now < cache.expiration) {
        return cache.users;
      }
      
      localStorage.removeItem(STORAGE_KEYS.users);
      return null;
    } catch (error) {
      console.error('Önbellek okuma hatası:', error);
      return null;
    }
  }

  renderUsers(users) {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    if (!users?.length) {
        this.showReloadButton();
        return;
    }
    
    users.forEach(user => {
      const userElement = this.createUserElement(user);
      this.container.appendChild(userElement);
    });
  }

  createUserElement(user) {
    const userCard = document.createElement('div');
    userCard.classList.add('user-card');
    
    const userId = user.id?.toString() || Date.now().toString();
    userCard.dataset.id = userId;
    
    const name = user.name || 'İsimsiz Kullanıcı';
    const email = user.email || 'E-posta yok';
    
    userCard.innerHTML = `
      <h3>${name}</h3>
      <p>${email}</p>
      <button class="delete-user" data-id="${userId}" title="Kullanıcıyı Sil">
        Sil
      </button>
    `;
    
    return userCard;
  }

  deleteUser(userId) {
    if (!userId) return;
    
    try {
      const cacheJson = localStorage.getItem(STORAGE_KEYS.users);
      
      if (!cacheJson) return;
      
      const cache = JSON.parse(cacheJson);
      
      if (!cache?.users || !Array.isArray(cache.users)) return;
      
      const filteredUsers = cache.users.filter(user => user.id?.toString() !== userId);
      
      cache.users = filteredUsers;
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(cache));
      
      this.renderUsers(filteredUsers);
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error);
    }
  }

  setupMutationObserver() {
    if (!this.container) return;
    
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const isEmpty = this.container.children.length === 0;
          const hasEmptyState = this.container.querySelector('.empty-state') !== null;
          
          if (isEmpty && !hasEmptyState) {
            this.showReloadButton();
          }
        }
      }
    });
    
    observer.observe(this.container, { childList: true });
  }
  
  showReloadButton() {
    if (!this.container) return;
    
    const buttonUsed = sessionStorage.getItem(STORAGE_KEYS.buttonUsed) === 'true';
    
    const emptyState = document.createElement('div');
    emptyState.classList.add('empty-state');
    
    emptyState.innerHTML = `
      <div>
        <p>Gösterilecek kullanıcı bulunamadı</p>
        ${!buttonUsed ? 
          '<button id="reload-users-btn">Kullanıcıları Yeniden Yükle</button>' : 
          '<p>Bu oturumda yeniden yükleme hakkınızı kullandınız</p>'}
      </div>
    `;
    
    this.container.appendChild(emptyState);
  }
  
  handleReloadButtonClick() {
    sessionStorage.setItem(STORAGE_KEYS.buttonUsed, 'true');
    localStorage.removeItem(STORAGE_KEYS.users);
    this.fetchUsers();
  }

  showLoading() {
    if (!this.container) return;
    
    const loader = document.createElement('div');
    loader.classList.add('loader');
    
    loader.innerHTML = `
      <div class="spinner"></div>
      <p>Kullanıcılar yükleniyor...</p>
    `;
    
    this.container.innerHTML = '';
    this.container.appendChild(loader);
  }
  
  hideLoading() {
    if (!this.container) return;
    
    const loader = this.container.querySelector('.loader');
    if (loader) loader.remove();
  }
  
  showError(message) {
    if (!this.container) return;
    
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    
    errorElement.innerHTML = `
      <p>Hata: ${message || 'Bir hata oluştu'}</p>
    `;
    
    this.container.innerHTML = '';
    this.container.appendChild(errorElement);
  }

}

new UserManager(appendLocation);
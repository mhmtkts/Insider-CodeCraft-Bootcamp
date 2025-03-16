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
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Hata: ${response.status} ${response.statusText}`);
      }
      
      const users = await response.json();
      
      this.cacheUsers(users);
      this.renderUsers(users);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
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
      console.log('Gösterilecek kullanıcı yok');
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
    `;
    
    return userCard;
  }
}

new UserManager(appendLocation);
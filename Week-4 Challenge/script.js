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
    this.injectStyles();
    this.loadUsers();
    this.setupEventListeners();
    this.loadUsers();
  }

  injectStyles() {
    if (document.getElementById('user-manager-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'user-manager-styles';
    styleElement.textContent = `
      :root {
        --primary-color: #4e54c8;
        --primary-light: #8f94fb;
        --secondary-color: #1abc9c;
        --danger-color: #e74c3c;
        --warning-color: #f39c12;
        --dark-color: #2c3e50;
        --light-color: #f8f9fa;
        --text-color: #333333;
        --text-light: #6c757d;
        --bg-color: #f8f9fa;
        --card-shadow: 0 10px 20px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.06);
        --hover-shadow: 0 14px 28px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.06);
        --border-radius: 16px;
        --transition: all 0.3s ease;
      }
      
      .user {
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 25px;
        background-color: var(--bg-color);
      }
      
      .user-card {
        display: flex;
        align-items: center;
        background-color: #ffffff;
        border-radius: var(--border-radius);
        padding: 1.5rem;
        margin-bottom: 1.2rem;
        box-shadow: var(--card-shadow);
        position: relative;
        transition: var(--transition);
        border: 1px solid rgba(0, 0, 0, 0.04);
      }
      
      .user-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--hover-shadow);
      }
      
      .user-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 1.5rem;
        border: 4px solid #fff;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }
      
      .user-card:hover .user-avatar {
        transform: scale(1.05);
      }
      
      .user-info {
        flex: 1;
      }
      
      .user-info h3 {
        margin: 0 0 0.8rem 0;
        font-size: 1.2rem;
        color: var(--text-color);
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      
      .user-info p {
        margin: 0.5rem 0;
        color: var(--text-light);
        display: flex;
        align-items: center;
        font-size: 0.95rem;
        transition: color 0.3s ease;
      }
      
      .user-card:hover .user-info p {
        color: var(--text-color);
      }
      
      .user-info p i {
        margin-right: 0.8rem;
        color: var(--primary-color);
        width: 1.2rem;
        text-align: center;
        font-size: 1rem;
        opacity: 0.8;
        transition: opacity 0.3s;
      }
      
      .user-card:hover .user-info p i {
        opacity: 1;
      }
      
      .delete-user {
        background: none;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        outline: none;
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
        color: var(--text-light);
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(5px);
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      }
      
      .delete-user:hover {
        color: var(--danger-color);
        background-color: rgba(231, 76, 60, 0.1);
        transform: scale(1.1);
      }
      
      .delete-user i {
        font-size: 1rem;
      }
      
      .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 0;
        color: var(--text-light);
      }
      
      .spinner {
        width: 48px;
        height: 48px;
        border: 3px solid rgba(78, 84, 200, 0.15);
        border-radius: 50%;
        border-top-color: var(--primary-color);
        animation: spin 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite;
        margin-bottom: 1rem;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .error-message {
        background-color: rgba(231, 76, 60, 0.08);
        color: var(--danger-color);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px 0;
        border: 1px solid rgba(231, 76, 60, 0.2);
      }
      
      .error-message i {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--danger-color);
        opacity: 0.8;
      }
      
      .empty-state {
        text-align: center;
        padding: 3rem 1.5rem;
        background: #ffffff;
        border-radius: var(--border-radius);
        margin: 2rem 0;
        box-shadow: var(--card-shadow);
        border: 1px solid rgba(0, 0, 0, 0.04);
      }
      
      .no-users-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--text-light);
      }
      
      .no-users-message i {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        color: #c8ced3;
      }
      
      .reload-btn {
        margin-top: 1.5rem;
        padding: 0.8rem 1.5rem;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
        color: white;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(78, 84, 200, 0.3);
      }
      
      .reload-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(78, 84, 200, 0.4);
      }
      
      .reload-btn:active {
        transform: translateY(-1px);
      }
      
      .info-text {
        margin-top: 1rem;
        padding: 0.8rem 1.2rem;
        background-color: rgba(243, 156, 18, 0.08);
        border-radius: 8px;
        color: var(--warning-color);
        font-size: 0.9rem;
        border: 1px solid rgba(243, 156, 18, 0.2);
      }
      
      @media (max-width: 768px) {
        .user-card {
          flex-direction: column;
          text-align: center;
          padding: 1.5rem 1rem;
        }
        
        .user-avatar {
          margin-right: 0;
          margin-bottom: 1.2rem;
          width: 90px;
          height: 90px;
        }
        
        .user-info p {
          justify-content: center;
        }
        
        .delete-user {
          top: 10px;
          right: 10px;
        }
      }
      
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes scaleIn {
        from { 
          opacity: 0; 
          transform: scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      
      .user-card {
        animation: scaleIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
      
      .user-card:nth-child(1) { animation-delay: 0.1s; }
      .user-card:nth-child(2) { animation-delay: 0.2s; }
      .user-card:nth-child(3) { animation-delay: 0.3s; }
      .user-card:nth-child(4) { animation-delay: 0.4s; }
      .user-card:nth-child(5) { animation-delay: 0.5s; }
      .user-card:nth-child(6) { animation-delay: 0.6s; }
      .user-card:nth-child(7) { animation-delay: 0.7s; }
      .user-card:nth-child(8) { animation-delay: 0.8s; }
      .user-card:nth-child(9) { animation-delay: 0.9s; }
      .user-card:nth-child(10) { animation-delay: 1.0s; }
    `;

    document.head.appendChild(styleElement);
    
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(fontAwesome);
    }
    
    if (!document.querySelector('link[href*="inter"]')) {
      const interFont = document.createElement('link');
      interFont.rel = 'stylesheet';
      interFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      document.head.appendChild(interFont);
    }
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
    const phone = user.phone || 'Telefon yok';
    const website = user.website || 'Website yok';
    
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    
    userCard.innerHTML = `
      <img src="${avatarUrl}" alt="${name}" class="user-avatar">
      <div class="user-info">
        <h3>${name}</h3>
        <p><i class="far fa-envelope"></i> ${email}</p>
        <p><i class="fas fa-phone"></i> ${phone}</p>
        <p><i class="fas fa-globe"></i> ${website}</p>
      </div>
      <button class="delete-user" data-id="${userId}" title="Kullanıcıyı Sil">
        <i class="fas fa-trash"></i>
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
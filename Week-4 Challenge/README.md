# API Kullanıcı Verileri Projesi

Bu proje, harici bir API'den kullanıcı verilerini çeken ve bunları modern bir arayüzle listeleyen bir web uygulamasıdır. Kullanıcılar, API'den alınan verileri görüntüleyebilir, silebilir ve gerektiğinde yeniden yükleyebilir.


## 🚀 Özellikler

- Kullanıcı Verilerini Çekme: JSONPlaceholder API'si kullanılarak kullanıcı verileri alınır
- Yerel Önbellek: Ağ trafiğini azaltmak için veriler yerel depolama ile önbelleğe alınır
- Modern UI/UX: Şık ve duyarlı tasarım ile kullanıcı deneyimi optimize edilmiştir
- Animasyonlar: Kullanıcı kartları ve etkileşimler için pürüzsüz animasyonlar
- Hata Yönetimi: API çağrısı başarısız olursa kullanıcıya bilgi verilir
- Duyarlı Tasarım: Mobil cihazlardan masaüstüne kadar tüm ekran boyutlarına uyumlu


## 🛠️ Kullanılan Teknolojiler

- Vanilla JavaScript: Herhangi bir framework kullanmadan saf JavaScript
- CSS3: Modern stil ve animasyonlar için
- HTTP Fetch API: Veri almak için REST API çağrıları
- LocalStorage API: Verileri yerel olarak önbelleğe almak için
- SessionStorage API: Oturum bazlı kullanıcı etkileşimlerini takip etmek için

## ⚙️ Kurulum

1. Projeyi indirin veya klonlayın

2. index.html dosyasını bir web tarayıcısında açın

3. Alternatif olarak, bir yerel web sunucusu kullanabilirsiniz: python -m http.server veya VS Code'daki Live Server eklentisi

## 🎯 Kod Yapısı

Proje, OOP (Nesne Yönelimli Programlama) prensipleri kullanılarak geliştirilmiş, modüler bir yapıya sahiptir:

UserManager Sınıfı

Ana sınıf olup, uygulamanın tüm işlevlerini ve veri manipülasyonunu yönetir:

- Constructor: Hedef containeri seçer ve başlatma işlemlerini yapar
- init(): Stil enjekte eder, kullanıcıları yükler ve olay dinleyicileri kurar
- injectStyles(): Dinamik olarak CSS stillerini sayfaya ekler
- loadUsers(): API'den kullanıcıları çeker veya önbellekten okur
- fetchUsers(): API'den veri çekme işlemini gerçekleştirir
- renderUsers(): Alınan kullanıcı verilerini DOM'a ekler
- createUserElement(): Her kullanıcı için kart oluşturur
- deleteUser(): Kullanıcıyı listeden kaldırır
- setupEventListeners(): Uygulama genelinde olay dinleyicileri ekler

### Veri Depolama ve Önbellek

- Veriler localStorage kullanılarak önbelleğe alınır
- 30 dakikalık önbellek süresi belirlenir
- Yenileme butonunu kullanımı sessionStorage ile takip edilir

### Sınırlamalar

- Yeniden Yükleme Sınırı: Kullanıcılar, bir oturum sırasında yeniden yükleme butonunu yalnızca bir kez kullanabilir
- Önbellek Süresi: Veriler 30 dakika boyunca önbelleğe alınır, bu süre içinde API'ye yeni istekler yapılmaz

### Performans İyileştirmeleri

- Önbellek: API çağrılarını azaltmak için veriler localStorage'da saklanır
- Yavaş Ağ Simülasyonu: Yavaş bağlantılarda bile düzgün çalışması için yükleme durumu gösterilir
- DOM Manipülasyonu Optimizasyonu: DocumentFragment ve etkin seçici kullanımı

## 📸 Ekran Görüntüleri

[https://imgur.com/DO0KCct](https://imgur.com/DO0KCct)

## 🤝 Katkıda Bulunma

1. Bu projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## 📧 İletişim

[Mahmut AKTAŞ](https://github.com/mhmtkts) - [mahmutaktas.m@gmail.com](mailto:mahmutaktas.m@gmail.com)
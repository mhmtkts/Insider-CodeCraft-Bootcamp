const user = {
  name: prompt("Adınız nedir?"),
  age: getValidAge(),
  job: prompt("Mesleğiniz nedir?"),
};

function getValidAge() {
  let age = prompt("Yaşınız kaç?");
  while (isNaN(age) || age.trim() === "") {
    alert("Lütfen geçerli bir yaş girin.");
    age = prompt("Yaşınız kaç?");
  }
  return parseInt(age);
}

console.log("Kullanıcı Bilgileri", user);

const cart = [];

function addToCart() {
  const productName = prompt(
    "Sepete eklemek istediğiniz ürünü yazın (Çıkmak için 'q' girin):"
  );

  if (productName === "q") {
    displayCart();
    return false;
  }

  while (productName.trim() === "") {
    alert("Ürün adı boş olamaz. Lütfen geçerli bir ürün adı girin.");
    productName = prompt(
      "Sepete eklemek istediğiniz ürünü yazın (Çıkmak için 'q' girin):"
    );
  }

  let productPriceInput = prompt("Ürünün fiyatı:");
  let productPrice = parseInt(productPriceInput);

  while (isNaN(productPrice) || productPrice <= 0) {
    alert(
      "Hata: Geçerli bir fiyat girmelisiniz! Lütfen sayısal bir değer girin."
    );
    productPriceInput = prompt("Lütfen ürünün fiyatını sayısal olarak girin:");
    productPrice = parseInt(productPriceInput);
  }

  const newProduct = { product: productName, price: productPrice };
  cart.push(newProduct);

  console.log(`${productName} ürünü sepete eklendi. Fiyat: ${productPrice} TL`);

  return true;
}

function displayCart() {
  console.log(`Sepetiniz: ${JSON.stringify(cart)}`);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  console.log(`Toplam Fiyat: ${totalPrice} TL`);
}

function removeFromCart() {
  let continueRemoving = true;

  while (continueRemoving) {
    if (cart.length === 0) {
      console.log("Sepetinizde ürün bulunmamaktadır.");
      return false;
    }

    console.log("Sepetinizdeki ürünler:");
    cart.forEach((item, index) => {
      console.log(`${index + 1}. ${item.product} - ${item.price} TL`);
    });

    const productName = prompt(
      "Silmek istediğiniz ürünü yazın (Çıkmak için 'q' girin):"
    );

    if (productName === "q") {
      continueRemoving = false;
      continue;
    }

    const productIndex = cart.findIndex((item) => item.product === productName);
    if (productIndex === -1) {
      console.log("Ürün bulunamadı.");
    } else {
      cart.splice(productIndex, 1);
      console.log(`${productName} ürünü sepetten silindi.`);

      displayCart();

      if (cart.length > 0) {
        const answer = prompt("Başka ürün silmek istiyor musunuz? (e/h)");
        if (!answer || answer.toLowerCase() !== "e") {
          continueRemoving = false;
        }
      } else {
        console.log("Sepetiniz boş.");
        continueRemoving = false;
      }
    }
  }

  return true;
}

console.log("\n--- Alışveriş Sepeti Uygulaması ---\n");

let continueShopping = true;
while (continueShopping) {
  continueShopping = addToCart();
}

const removeItem = prompt("Sepetten ürün çıkarmak istiyor musunuz? (e/h)");
if (removeItem && removeItem.toLowerCase() === "e") {
  removeFromCart();
  displayCart();
}

console.log("\n--- Alışveriş Tamamlandı ---");
console.log("Teşekkürler!");
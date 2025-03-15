// ! Ay Dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// html'den Javascripte'e çekilen elemanlar

const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("#close-btn");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
let popupTitle = document.querySelector("header p");
let submitBtn = document.querySelector("#submit-btn");

// localStorage'dan veri çekmek, eğer veri yoksa boş bir array oluşturmak
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ! güncelleme işlemi için gereken değişkenler
let isUpdate = false;
let updateId = null;

// sayfa yüklendiğinde notları arayüze render etmek
document.addEventListener("DOMContentLoaded", () => {
  renderNotes(notes);
});

addBox.addEventListener("click", () => {
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  //body'nin kaymasını engellemek için
  document.querySelector("body").style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  //body'nin kaymasını auto'ya çevirmek için
  document.querySelector("body").style.overflow = "auto";


  // eğer update işlemi yapılmaz ve popup kapatılırsa popup ı eski haline getirmek
  isUpdate = false;
  updateId = null;
  popupTitle.textContent = "New Note";
  submitBtn.textContent = "Add Note";

  //formu sıfırlamak
  form.reset();
});

// formun gönderilmesini izlemek
form.addEventListener("submit", (e) => {
  // formun sayfa yenilemesini engellemek
  e.preventDefault();

  // formdaki input ve textarea'ya erişmek
   const titleInput = e.target[0];
   const descriptionInput = e.target[1];

  // input ve textarea'nın değerlerine eriş, başında ve sonunda boşluk var ise bunu kaldır
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  // eğer input ve textarea boş ise
  if (!title && !description) {
    alert("Lütfen tüm alanları doldurunuz.");
    return; // burada return kullanımı ile ilgili if bloğu çalıştıktan sonra kodun devam etmesini engelliyoruz.
  }

  // tarih verisini oluşturmak
  const date = new Date();

  // gün ay yıl ve id değerlerini oluşturmak
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const id = date.getTime();

  if (isUpdate) {
    // güncelleme işlemi için notu bulmak
    const findIndex = notes.findIndex((note) => note.id === updateId);

    // indexi bilinen dizi elemanını güncellemek

    notes[findIndex] = {
      id,
      title,
      description,
      date: `${month} ${day}, ${year}`,
    };

    // güncelleme işlemi için değişkenleri sıfırlamak
    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  } else {
    // not verisini yönetmek için bir obje oluşturmak
    let noteInfo = {
      id,
      title,
      description,
      date: `${month} ${day}, ${year}`,
    };

    // noteInfo'yu note dizisine eklemek
    notes.push(noteInfo);
  }

  // localStorage bizim için tarayıcıda veri tutan bir depodur. bu alanda küçük çaplı verilerimizi tutarız. bu alan bizim için key-value değer çiftleri halinde değerler tutar ve verileri string veri tipinde tutar.

  // localStorage'a not dizisini eklemek

  localStorage.setItem("notes", JSON.stringify(notes));

  //formu sıfırlamak
  form.reset();

  // popup'ı kapatmak
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  //body'nin kaymasını auto'ya çevirmek için
  document.querySelector("body").style.overflow = "auto";

  // notları arayüze render etmek
  renderNotes(notes);
});

// Notları arayüze render edecek fonksiyon

function renderNotes(notes) {
  // !mevcut notları silmek
  document.querySelectorAll(".note").forEach((li) => li.remove());
  // note dizisindeki herbir elemanı dön
  notes.forEach((note) => {
    // Note dizisindeki herbir eleman için birer note kartı oluştur.
    // ! note elemanını ayırt edebilmek için bu elemana bir id değeri ekliyoruz. bir elemana id eklemek için data-id özelliğini kullanıyoruz.
    let noteEleman = `<li class="note" data-id="${note.id}">
        <!-- Note Details -->
        <div class="details">
          <!-- Title && Description -->
          <p class="title">${note.title}</p>
          <p class="description">${note.description}</p>
        </div>
        <!-- Bottom -->
        <div class="bottom">
          <span>${note.date}</span>
          <div class="settings">
            <!-- Icon -->
            <i class="bx bx-dots-horizontal-rounded"></i>
            <!-- Menu -->
            <ul class="menu">
              <li class="editIcon"><i class="bx bx-edit"></i>Edit</li>
              <li class="deleteIcon"><i class="bx bx-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>`;

    // insertAdjacentHTML metodu bir elemanı bir html elemanına göre  yerleştirmek için kullanılır. Bu metot hangi konuma ekleme yapılacağı ve hangi elemanın ekleneceğini belirtmemizi ister.
    addBox.insertAdjacentHTML("afterend", noteEleman);
  });
}

function showMenu(eleman) {
  // elemanın parent elementine (kapsayıcısına) show classını eklemek
  eleman.parentElement.classList.add("show");

  // Eklenen show classını üç nokta harici bir yere tıklayınca kaldırmak
  document.addEventListener("click", (e) => {
    // tıklanılan eleman üç nokta (i etiketi) değilse ya da kapsam dışına tıklanırsa
    if (e.target.tagName !== "I" || e.target !== eleman) {
      eleman.parentElement.classList.remove("show");
    }
  });
}

// wrapper kısmındaki tıklamaları izlemek
wrapper.addEventListener("click", (e) => {
  // eğer üç noktaya tıklandıysa
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    // show menu fonksiyonunu çalıştırmak
    showMenu(e.target);
  }

  // eğer sil butonuna tıklandıysa
  else if (e.target.classList.contains("deleteIcon")) {
    // kullanıcıdan silme işlemi için onay almak
    const res = confirm("Are you sure you want to delete this note?");
    // eğer kullanıcı onaylarsa
    if (res) {
      // parent element ile bir üst elemana ulaştık. fakat kapsam eleman sayısı arttıkça bu yöntem işimizi zorlaştırabilir. bu yüzden closest metodu kullanarak en yakın üst elemana ulaşabiliriz.

      // tıklanılan elemanın en yakın üst parent elementine ulaşmak
      const note = e.target.closest(".note");
      // erişilen note elemanının data-id özelliğine ulaşmak
      const id = parseInt(note.dataset.id);

      // id si bilinen elemanı notes dizisinden silmek
      notes = notes.filter((note) => note.id !== id);

      // localStorage'dan notları güncellemek
      localStorage.setItem("notes", JSON.stringify(notes));

      // notları arayüze render etmek
      renderNotes(notes);
    }
  }
  // eğer edit butonuna tıklandıysa
  else if (e.target.classList.contains("editIcon")) {
    // tıklanan elemanın en yakın üst parent elementine ulaşmak
    const note = e.target.closest(".note");
    // erişilen note elemanının data-id özelliğine ulaşmak
    const id = parseInt(note.dataset.id);
    // id sine erişilen elemanı notes dizisinden bulmak
    const noteInfo = notes.find((note) => note.id === id);

    //popup'ı güncellemek

    isUpdate = true;
    updateId = id;

    //popup'ı açmak
    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    // input ve textarea'ya notun bilgilerini yazdırmak
    form[0].value = noteInfo.title;
    form[1].value = noteInfo.description;

    // popup içeriğini güncellemek
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});

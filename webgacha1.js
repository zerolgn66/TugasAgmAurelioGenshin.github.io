const characters = {
  fiveStars: ['Keqing', 'Mona', 'Qiqi', 'Diluc', 'Jean', 'Zhongli'],
  fourStars: ['Rosaria', 'Lisa', 'Amber', 'Diona', 'Kaeya', 'Barbara', 'Bennett', 'Noelle', 'Fischl', 'Razor', 'Sucrose', 'Yanfei', 'Ningguang', 'Xinyan', 'Beidou', 'Xiangling', 'Chongyun', 'Xingqiu', 'Sayu', 'Kujou-Sara'],
  specialfiveStars: ['Zhongli']
};

const weapons = {
  fourStars: ['rust', 'sacrificial-bow', 'sacrificial-fragments', 'sacrificial-greatsword', 'sacrificial-sword', 'the-stringless', 'the-widsith', 'the-bell', 'the-flute', 'favonius-warbow', 'favonius-lance', 'favonius-codex', 'favonius-greatsword', 'favonius-sword', 'dragons-bane', 'rainslasher', 'lions-roar', 'eye-of-perception'],
  threeStars: ['slingshot', 'thrilling-tales-of-dragon-slayers', 'sharpshooters-oath', 'ferrous-shadow', 'skyrider-sword', 'cool-steel', 'debate-club', 'black-tassel', 'bloodtainted-greatsword', 'magic-guide', 'emerald-orb', 'raven-bow', 'harbinger-of-dawn']
};

let guaranteed4StarCounter = 0;
let guaranteed5StarCounter = 0;
let guaranteedPromo5StarCounter = 0;
let pityCounter = 0;
let dumb = 0;
let soft = 1;




// Fungsi untuk menyimpan nilai pity ke localStorage
function savePity() {
  localStorage.setItem('pityCounter', JSON.stringify(pityCounter));
  localStorage.setItem('guaranteedPromo5StarCounter', JSON.stringify(pityCounter));
}

// Fungsi untuk memuat nilai pity dari localStorage saat halaman dimuat
function loadPity() {
  const savedPity = localStorage.getItem('pityCounter');
  if (savedPity !== null) {
    pityCounter = JSON.parse(savedPity);
  }

}

// Memanggil loadPity saat halaman dimuat untuk memuat nilai pity yang tersimpan
loadPity();

function checkPity() {
  if (pityCounter >= 75) {
    // Jika pity mencapai 75 atau lebih, tingkatkan peluang mendapatkan bintang 5 menjadi 20%
    soft = 25;
  }

  if (guaranteed5StarCounter >= 90) {
    // Jika mendapatkan bintang 5, reset pityCounter dan pityCounter bintang 5
    pityCounter = 0;
    guaranteed5StarCounter = 0;
  }
}

function gacha() {
  const random = Math.random() * 100;
  const randomType = Math.random() * 100; 

  let rarity;
  console.log("Random Number:", random); // Tambahkan ini untuk memeriksa nilai random

  if (random < soft) {
    result = getCharacter(5);
    dumb = 5;
    guaranteed4StarCounter = 0;
    guaranteed5StarCounter++;
    pityCounter = 0;
    rarity = 5;
  } else if (random < 5.1) {
    guaranteed4StarCounter++;
    guaranteed5StarCounter = 0;
    rarity = 4;
    dumb = 4;
    if (randomType <= 50) {
      // 50% kemungkinan mendapatkan karakter bintang 4
      result = getCharacter(4);
    } else {
      // 50% kemungkinan mendapatkan senjata bintang 4
      result = getWeapon(4);
    }
  } else {
    result = getWeapon(3); // Mengambil senjata bintang 3
    guaranteed4StarCounter++;
    guaranteed5StarCounter = 0;
    rarity = 3;
  }

  console.log("Result:", result); // Tambahkan ini untuk memeriksa hasil gacha

  if (guaranteed4StarCounter >= 9) {
    guaranteed4StarCounter = 0;
    guaranteed5StarCounter += 10;
    if (dumb === 5) {
      dumb = 6;
    }
      if (randomType < 60) {
      // 50% kemungkinan mendapatkan karakter bintang 4
        result = getCharacter(4);
      } else {
      // 50% kemungkinan mendapatkan senjata bintang 4
        result = getWeapon(4);
      }
  }

  if (pityCounter >= 90) {
    result = getCharacter(5);
    guaranteed4StarCounter = 0;
    guaranteed5StarCounter = 0;
    pityCounter = 0;
  }

  return result;
}


function getWeapon(rarity) {
  let weaponList = [];
  if (rarity === 3) {
    weaponList = weapons.threeStars;
  }
  else if (rarity === 4) {
    weaponList = weapons.fourStars;
  }
  const randomIndex = Math.floor(Math.random() * weaponList.length);
  return weaponList[randomIndex];
}

function getCharacter(rarity) {
  let characterList = [];
  
  if (rarity === 5) {
    if (guaranteedPromo5StarCounter === 0) {
      // Gacha pertama mendapatkan karakter 5 bintang selain 'Zhongli'
      characterList = characters.fiveStars;
      guaranteedPromo5StarCounter = 1;
      if(characterList === 'Zhongli')
      guaranteedPromo5StarCounter = 0;
    } else if(guaranteedPromo5StarCounter === 1){
      // Gacha kedua dan seterusnya mendapatkan 'Zhongli'
      characterList = characters.specialfiveStars;
      guaranteedPromo5StarCounter = 0;
    }
    
    dumb = 5;
  } else if (rarity === 4) {
    characterList = characters.fourStars;
    dumb = 4;
  }

  const randomIndex = Math.floor(Math.random() * characterList.length);
  return characterList[randomIndex];
}


function clearResults() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
}

// Fungsi untuk menambahkan hasil gacha ke dalam card-container
function displayResults(results) {
  const cardContainer = document.getElementById("card-container");
  results.forEach((result) => {
      const resultImage = document.createElement("img");
      resultImage.src = `${result}.png`; // Menggunakan nama hasil untuk membentuk URL gambar
      resultImage.alt = result;
      cardContainer.appendChild(resultImage);
  });
}


function singleWish() {
  const result = [gacha()]; // Mengubah hasil gacha menjadi array satu elemen
  displayResults(result); // Memanggil displayResults dengan array hasil gacha
  // Tambahkan 1 ke pityCounter setiap kali single-wish
  pityCounter++;
  checkPity();
  savePity(); // Menyimpan nilai pity setelah setiap pull

  let videoName;
  if (dumb === 5) {
    videoName = "1wish5.mp4";
    dumb = 0;
  } else if (dumb === 4) {
    videoName = "1wish4.mp4";
    dumb = 0;
  } else {
    videoName = "1wish3.mp4";
  }

  const resultDumbText = document.getElementById("resultDumbText1");
  resultDumbText.textContent = `result.rarity: ${pityCounter}`;
  const wrapper = document.getElementById("videoWrapper");
  wrapper.style.display = "block";

  playVideo(videoName);

}

function tenWish() {
  let results = [];
  let gotFiveStar = false; // Menandakan apakah mendapatkan bintang 5

  for (let i = 0; i < 10; i++) {
    const result = gacha();
    results.push(result);
    if (characters.fiveStars.includes(result)) {
      gotFiveStar = true;
      pityCounter = 0;
    }
  }

  displayResults(results);

  // Tambahkan 10 ke pityCounter setiap kali ten-wish
  pityCounter += 10;
  checkPity();
  savePity(); // Menyimpan nilai pity setelah setiap pull

  let videoName;
  if (gotFiveStar) {
    videoName = "10wish5.mp4";
    dumb = 6;
  } else {
    videoName = "10wish4.mp4";
    dumb = 0;
  }

  const resultDumbText = document.getElementById("resultDumbText1");
  resultDumbText.textContent = `result.rarity: ${pityCounter}`;
  const wrapper = document.getElementById("videoWrapper");
  wrapper.style.display = "block";

  playVideo(videoName);
}

function playVideo(videoName) {
  const video = document.getElementById("resultVideo");
  const videoWrapper = document.getElementById("videoWrapper");
            
            // Atur sumber video
            video.src = videoName;
            
            // Menampilkan video
            videoWrapper.style.display = "block";

  // Memutar video
  video.play().then(() => {
      // Masuk ke mode fullscreen saat video siap
      if (video.requestFullscreen) {
          video.requestFullscreen();
      } else if (video.mozRequestFullScreen) { // Untuk Firefox
          video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) { // Untuk Chrome, Safari, dan Opera
          video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { // Untuk Internet Explorer
          video.msRequestFullscreen();
      }
  }).catch(error => {
      console.error("Video play error:", error);
  });

  video.addEventListener('ended', () => {
      // Keluar dari mode fullscreen jika diperlukan
      if (document.exitFullscreen) {
          document.exitFullscreen();
          video.removeAttribute('controls');
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
          video.removeAttribute('controls');
      } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
          video.removeAttribute('controls');
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
          video.removeAttribute('controls');
      }
      videoWrapper.style.display = "none";  
  });
}

function displayFullscreenImage(imageUrl) {
  const fullscreenImage = document.getElementById("fullscreenImage");
  const fullscreenImageViewer = fullscreenImage.querySelector("img");
  fullscreenImageViewer.src = imageUrl;
  fullscreenImage.style.display = "flex";
}

function hideFullscreenImage() {
  const fullscreenImage = document.getElementById("fullscreenImage");
  fullscreenImage.style.display = "none";
  cardContainer.innerHTML = '';
}

function displayResults(results) {
  let currentImageIndex = 0;

  const fullscreenImage = document.getElementById("fullscreenImage");
  const fullscreenImageViewer = fullscreenImage.querySelector("img");
  fullscreenImageViewer.src = `${results[currentImageIndex]}.png`;

  fullscreenImage.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % results.length;
    if (currentImageIndex === 0) {
      fullscreenImage.style.display = "none";
    }
    fullscreenImageViewer.src = `${results[currentImageIndex]}.png`;
  });

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = '';
  results.forEach((result) => {
    const resultImage = document.createElement("img");
    resultImage.src = `${result}.png`;
    resultImage.alt = result;
    cardContainer.appendChild(resultImage);
  });

  cardContainer.addEventListener("click", () => {
    fullscreenImage.style.display = "flex";
  });

  if (results.length > 0) {
    const imageUrl = `${results[currentImageIndex]}.png`;
    displayFullscreenImage(imageUrl);
  }
  if(results.length >= 9){
    const fullscreenImage = document.getElementById("fullscreenImage");
      cardContainer.innerHTML = '';
  }
}
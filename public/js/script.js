const synth = window.speechSynthesis;

let categorySelect = document.getElementById('category-select');
let subcategorySelect = document.getElementById('subcategory-select');
let speechBtn = document.getElementById('speech-btn');

const authorSubcategories = {
  Authors: [
    'Narendra_Modi', 'Sundar_Pichai', 'Mukesh_Ambani', 'Vikram_Sarabhai', 'Srinivasa_Ramanujan', 'Ratan_Tata', 'APJ_Abdul_Kalam', 'Satyendra_Nath_Bose', 'Subhash_Chandra_Bose', 'Har_Gobind_Khorana', 'Mahendra_Singh_Dhoni', 'Angela_Merkel', 'Barack_Obama', 'Bill_Gates', 'Elon_Musk', 'Jeff_Bezos', 'Malala_Yousafzai', 'Mark_Zuckerberg', 'Michelle_Obama', 'Pope_Francis', 'Warren_Buffet', 'Audrey_Hepburn', 'Beyonce', 'David_Attenborough', 'JK_Rowling', 'Nelson_Mandela', 'Stephen_Hawking', 'Steve_Jobs', 'Winnie_Mandela', 'Sachin_Tendulkar'
  ],
  Subject: [
    'Life', 'Failure', 'War', 'Friendship', 'Happiness', 'Family', 'Future', 'Motivation', 'Past', 'Peace'
  ]
};

function populateSubcategories() {
  let selectedCategory = categorySelect.value;
  let subcategories = authorSubcategories[selectedCategory] || [];

  subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
  subcategories.forEach(subcategory => {
    let option = document.createElement('option');
    option.value = subcategory;
    option.textContent = subcategory.replace('_', ' ');
    subcategorySelect.appendChild(option);
  });
}

const apiBaseUrl = '';

function typeWriter(text, element, delay = 40) {
  let charIndex = 0;
  let displayText = "";

  function type() {
    if (charIndex < text.length) {
      if (text[charIndex] === '"' || text[charIndex] === '-') {
        displayText += text[charIndex];
      } else {
        displayText = text.substr(0, charIndex + 1);
      }
      element.innerHTML = displayText;
      charIndex++;
      setTimeout(type, delay);
    }
  }

  type();
}



function surpriseMe() {
  const categories = ['Authors', 'Subject'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  categorySelect.value = randomCategory;
  populateSubcategories();

  setTimeout(() => {
    const subcategoryOptions = subcategorySelect.options;
    if (subcategoryOptions.length > 1) {
      const randomSubcategory = subcategoryOptions[Math.floor(Math.random() * (subcategoryOptions.length - 1)) + 1];
      subcategorySelect.value = randomSubcategory.value;
    }
    displayQuote();
  }, 100);
}

window.onload = function() {
  surpriseMe();
};


async function displayQuote() {
  let category = categorySelect.value;
  let subcategory = subcategorySelect.value;
  let selectedType = subcategory || category;

  if (!selectedType) {
    let div = document.querySelector('#quote');
    div.innerHTML = '<p>Please select a category to continue.</p>';
    return;
  }

  try {
    let response = await fetch(`${apiBaseUrl}/api/generate?category=${categorySelect.value}&type=${selectedType}`);
    let data = await response.json();

    let quote = data.quote;
    let imageUrl = data.imageUrl;

    let div = document.querySelector('#quote');
    div.innerHTML = `      
      <p id="quote-text"></p>
      <img id="img" src="${imageUrl}" alt="Generated Image">
      <br>
      <button class="btn" id="speech-btn"><i class="fas fa-volume-up"></i></button>
      <button class="btn" id="copy-btn"><i class="fas fa-copy"></i></button>
      <button class="btn" id="tweet-button"></button>
      <button class="btn" id="download-btn"><i class="fas fa-download"></i></button>
      <button class="btn" id="email-btn"><i class="fas fa-envelope"></i></button>

    `;
    let quoteText = document.getElementById('quote-text');
    typeWriter(`${quote} `, quoteText);


    function emailQuote() {
      const quoteText = document.getElementById('quote-text').textContent;
      const subject = "Quote from Inspiration Daily";
      const body = `Check out this inspirational quote: ${quote}`;

      const emailLink = document.createElement('a');
      emailLink.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      emailLink.click();

    }

    document.getElementById("email-btn").addEventListener("click", emailQuote);


    let tweetButton = document.getElementById('tweet-button');
    tweetButton.innerHTML = '';
    let tweetLink = document.createElement('a');
    tweetLink.className = 'button circle-icon ';
    tweetLink.id = 'tweet-quote';
    tweetLink.title = 'Tweet this quote!';
    tweetLink.target = '_blank';
    tweetLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)} `;


    let twitterIcon = document.createElement('i');
    twitterIcon.className = 'fab fa-twitter';
    twitterIcon.style.color = '#000000';

    tweetLink.appendChild(twitterIcon);
    tweetButton.appendChild(tweetLink);


    let speechBtn = document.getElementById('speech-btn');
    let copyBtn = document.getElementById('copy-btn');
    let downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('click', () => {

      window.location.href = imageUrl;
    });

    const speechSynthesis = window.speechSynthesis;

    let isSpeaking = false;
    let utterance;
    speechBtn.addEventListener("click", () => {
      if (!isSpeaking) {
        utterance = new SpeechSynthesisUtterance(quote);
        speechSynthesis.speak(utterance);
        isSpeaking = true;

        const speakingMessage = document.createElement('div');
        speakingMessage.className = 'copy-success-popup';
        speakingMessage.textContent = 'Speaking!';
        document.body.appendChild(speakingMessage);

        setTimeout(() => {
          document.body.removeChild(speakingMessage);
        }, 2000);
      } else {
        speechSynthesis.cancel();
        isSpeaking = false;
      }
    });


    function copyToClipboard() {
      const quote = document.getElementById('quote-text').textContent;
      navigator.clipboard.writeText(quote)
        .then(() => {
          const popup = document.createElement('div');
          popup.className = 'copy-success-popup';
          popup.textContent = 'Successfully copied!';
          document.body.appendChild(popup);

          setTimeout(() => {
            document.body.removeChild(popup);
          }, 2000);
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
        });
    }

    document.getElementById('copy-btn').addEventListener('click', copyToClipboard);


    downloadBtn.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = 'generated_image.png';
      a.click();
    });

  } catch (error) {
    console.error('Error fetching quote:', error);
    let div = document.querySelector('#quote');
    div.innerHTML = '<p>Error fetching quote.</p>';
  }
}


'use strict';

//////////////////////////////////////
// Variables 
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// Cookie message banner
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  `We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies. <button class="btn btn--close-cookie">Got it!</button>`;
header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  message.remove();
});

message.style.backgroundColor = '#444';
message.style.width = '105%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';


// Button scroll down
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// // Page navigation smoothly - event delegation
// 1. Add event listener to common parent element to the elements
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); // prevent browser to go streight to the section

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  };
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const btnClicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!btnClicked) return;

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  btnClicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${btnClicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
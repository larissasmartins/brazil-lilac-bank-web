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

// Menu fade animation - Passing arguments to event handlers
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkClicked = e.target;
    const siblings = linkClicked.closest('.nav').querySelectorAll('.nav__link');
    const logo = linkClicked.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== linkClicked) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}
// reducing the need to pass the opacity argument explicitly every time
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


// Sticky navegation w/ Intersection observer API
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);


// Revealing sections on scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: .15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});


// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const imgLoading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgLoading, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));


// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  const maxSlide = slides.length - 1;

  let curSlide = 0;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);

      dotContainer.firstChild.classList.add('dots__dot--active');
    });
  };

  const activateDotColor = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  }

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDotColor(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDotColor(curSlide);
  }

  const init = function () {
    goToSlide(0);
    createDots(0);

    activateDotColor(0);
  }
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Keys funcionality
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Dots funcionality
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDotColor(slide);
    };
  });
};
slider();
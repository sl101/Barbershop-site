"use strict";
"use strict";

// scroll animation ==============================================
document.addEventListener('DOMContentLoaded', function () {
  var scrollItems = document.querySelectorAll('.scroll-item');
  var animated = false;

  var scrollAnimation = function scrollAnimation() {
    var windowCenter = window.innerHeight / 2 + window.scrollY;
    scrollItems.forEach(function (element) {
      var scrollOfset = element.offsetTop;

      if (windowCenter >= scrollOfset) {
        element.classList.add('animation-class');
        animated = true;
      } else {
        if (!animated) {
          element.classList.remove('animation-class');
        }
      }
    });
  }; // Backet animation ===============================


  var bodyPage = document.querySelector('body');
  var backetButtons = document.querySelectorAll('.product__button--backet');
  var backetCounter = document.querySelector('.menu__amount');
  var backet = document.querySelector('.menu__backet');
  var valueBacket = 0;

  function bodyLocker() {
    var element = window.innerWidth - document.body.offsetWidth + 'px';
    fixedBlocks.forEach(function (el) {
      el.style.paddingRight = element;
    });
    document.body.style.paddingRight = element;
    document.body.style.overflow = 'hidden';
  }

  function bodyUnlocker() {
    fixedBlocks.forEach(function (el) {
      el.style.paddingRight = '0';
    });
    document.body.style.paddingRight = '0';
    document.body.style.overflow = 'auto';
  }

  backetButtons.forEach(function (element) {
    element.addEventListener('click', function (e) {
      var parent = element.parentElement.parentElement.parentElement.parentElement;
      var targetImg;

      if (!parent.classList.contains('product-page__product')) {
        targetImg = parent.children[1].children[0].children[0];
      } else {
        targetImg = parent.children[1].children[1].children[0].children[0];
      }

      bodyLocker();
      var clone = targetImg.cloneNode(true);
      var parentTop = parent.getBoundingClientRect().top + pageYOffset + "px";
      var parentLeft = parent.getBoundingClientRect().left + "px";
      var backetTop = backet.getBoundingClientRect().top + pageYOffset + "px";
      var backetLeft = backet.getBoundingClientRect().left + "px";
      bodyPage.appendChild(clone);

      if (parent.getBoundingClientRect().top < 100) {
        parentTop = pageYOffset + 100 + 'px';
      }

      clone.style.top = parentTop;
      clone.style.left = parentLeft;
      clone.classList.add('_selected');
      setTimeout(function () {
        clone.style.top = backetTop;
        clone.style.left = backetLeft;
        clone.style.animation = 'addToBacket 2s ease';
      }, 900);
      setTimeout(function () {
        valueBacket = valueBacket + 1;
        backetCounter.textContent = valueBacket;
        clone.style.display = 'none';
        clone.remove();
        bodyUnlocker();
      }, 2000);
    });
  });
  scrollAnimation();
  window.addEventListener('scroll', function () {
    scrollAnimation();
  });
});
"use strict";

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle
function DynamicAdapt(type) {
  this.type = type;
}

DynamicAdapt.prototype.init = function () {
  var _this2 = this;

  var _this = this; // массив объектов


  this.оbjects = [];
  this.daClassname = "_dynamic_adapt_"; // массив DOM-элементов

  this.nodes = document.querySelectorAll("[data-da]"); // наполнение оbjects объктами

  for (var i = 0; i < this.nodes.length; i++) {
    var node = this.nodes[i];
    var data = node.dataset.da.trim();
    var dataArray = data.split(",");
    var оbject = {};
    оbject.element = node;
    оbject.parent = node.parentNode;
    оbject.destination = document.querySelector(dataArray[0].trim());
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
    оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
    оbject.index = this.indexInParent(оbject.parent, оbject.element);
    this.оbjects.push(оbject);
  }

  this.arraySort(this.оbjects); // массив уникальных медиа-запросов

  this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
    return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
  }, this);
  this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
    return Array.prototype.indexOf.call(self, item) === index;
  }); // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске

  var _loop = function _loop(_i) {
    var media = _this2.mediaQueries[_i];
    var mediaSplit = String.prototype.split.call(media, ',');
    var matchMedia = window.matchMedia(mediaSplit[0]);
    var mediaBreakpoint = mediaSplit[1]; // массив объектов с подходящим брейкпоинтом

    var оbjectsFilter = Array.prototype.filter.call(_this2.оbjects, function (item) {
      return item.breakpoint === mediaBreakpoint;
    });
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter);
    });

    _this2.mediaHandler(matchMedia, оbjectsFilter);
  };

  for (var _i = 0; _i < this.mediaQueries.length; _i++) {
    _loop(_i);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (var i = 0; i < оbjects.length; i++) {
      var оbject = оbjects[i];
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.moveTo(оbject.place, оbject.element, оbject.destination);
    }
  } else {
    for (var _i2 = 0; _i2 < оbjects.length; _i2++) {
      var _оbject = оbjects[_i2];

      if (_оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(_оbject.parent, _оbject.element, _оbject.index);
      }
    }
  }
}; // Функция перемещения


DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);

  if (place === 'last' || place >= destination.children.length) {
    destination.insertAdjacentElement('beforeend', element);
    return;
  }

  if (place === 'first') {
    destination.insertAdjacentElement('afterbegin', element);
    return;
  }

  destination.children[place].insertAdjacentElement('beforebegin', element);
}; // Функция возврата


DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);

  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement('beforebegin', element);
  } else {
    parent.insertAdjacentElement('afterbegin', element);
  }
}; // Функция получения индекса внутри родителя


DynamicAdapt.prototype.indexInParent = function (parent, element) {
  var array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
}; // Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max


DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === "min") {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return -1;
        }

        if (a.place === "last" || b.place === "first") {
          return 1;
        }

        return a.place - b.place;
      }

      return a.breakpoint - b.breakpoint;
    });
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return 1;
        }

        if (a.place === "last" || b.place === "first") {
          return -1;
        }

        return b.place - a.place;
      }

      return b.breakpoint - a.breakpoint;
    });
    return;
  }
};

var da = new DynamicAdapt("max");
da.init();
"use strict";

// InputMask ===============================================
var formRequest = document.querySelector('.request__form');
var telSelector = formRequest.querySelector('input[type="tel"]');
var inputMask = new Inputmask('+38(099) 999-9999');
inputMask.mask(telSelector); // Validation ===============================================
// const validation = new JustValidate('.request__form');
// validation.addField('.request__input--name', [
//     {
//       rule: 'minLength',
//       value: 3,
//     },
//     {
//       rule: 'maxLength',
//       value: 30,
//     },
//     {
//       rule: 'required',
//       value: true,
//       errorMessage: 'Enter your name!'
//     }
//   ])
//   .addField('.request__input--email', [
//     {
//       rule: 'required',
//       value: true,
//       errorMessage: 'Email is required',
//     },
//     {
//       rule: 'email',
//       value: true,
//       errorMessage: 'Enter valid e-mail',
//     },
//   ])
//   .addField('.request__input--phone', [
//     {
//       rule: 'required',
//       value: true,
//       errorMessage: 'The phone is required',
//     },
//     {
//       rule: 'function',
//       validator: function() {
//         const phone = telSelector.inputmask.unmaskedvalue();
//         return phone.length === 10;
//       },
//       errorMessage: 'Enter valid phone number',
//     },
//   ]).onSuccess((event) => {
//     console.log('Validation passes and form submitted', event);
//     let formData = new FormData(event.target);
//     console.log(...formData);
//     let xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4) {
//         if (xhr.status === 200) {
//           console.log('Sended');
//         }
//       }
//     }
//     xhr.open('POST', 'mail.php', true);
//     xhr.send(formData);
//     event.target.reset();
//   });
"use strict";

var priceFilter = document.querySelector('.price-filter__line');

if (priceFilter) {
  noUiSlider.create(priceFilter, {
    start: [200, 800],
    connect: true,
    tooltips: [wNumb({
      decimals: 0
    }), wNumb({
      decimals: 0
    })],
    range: {
      'min': 0,
      'max': 1000
    }
  });
  var priceStart = document.querySelector('.price-filter__input--start');
  var tooltipStart = document.querySelector('.noUi-handle-lower[aria-valuetext]');
  var priceEnd = document.querySelector('.price-filter__input--end');
  var tooltipEnd = document.querySelector('.noUi-handle-upper');
  priceStart.addEventListener('click', function () {
    priceStart.value = '';
  });
  priceStart.addEventListener('change', function () {
    priceFilter.noUiSlider.set([this.value, null]);
  });
  priceEnd.addEventListener('click', function () {
    priceEnd.value = '';
  });
  priceEnd.addEventListener('change', function () {
    priceFilter.noUiSlider.set([null, this.value]);
  });
  priceFilter.noUiSlider.on('update', function (values, handle) {
    var number = values[handle];

    if (handle) {
      priceEnd.value = Math.round(number);
    } else {
      priceStart.value = Math.round(number);
    }
  });
}
"use strict";

var popupLinks = document.querySelectorAll('.popup-link');
var body = document.querySelector('body');
var lockPadding = document.querySelectorAll("._fixed");
var unlock = true;
var timeout = 0;

if (popupLinks.length > 0) {
  var _loop = function _loop(index) {
    var popupLink = popupLinks[index];
    popupLink.addEventListener("click", function (e) {
      var popupName = popupLink.getAttribute('href').replace('#', '');
      var curentPopup = document.getElementById(popupName);
      popupOpen(curentPopup);
      e.preventDefault();
    });
  };

  for (var index = 0; index < popupLinks.length; index++) {
    _loop(index);
  }
}

var popupCloseIcon = document.querySelectorAll('.popup__close');

if (popupCloseIcon.length > 0) {
  var _loop2 = function _loop2(_index) {
    var el = popupCloseIcon[_index];
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup'));
      e.preventDefault();
    });
  };

  for (var _index = 0; _index < popupCloseIcon.length; _index++) {
    _loop2(_index);
  }
}

function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    var popupActive = document.querySelector('.popup.open');

    if (burger.classList.contains('_active')) {
      burger__move();
      burger_close();
    }

    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock();
    }

    curentPopup.classList.add('open');
    curentPopup.addEventListener("click", function (e) {
      if (!e.target.closest('.popup__body')) {
        popupClose(e.target.closest('.popup'));
      }
    });
  }
}

function popupClose(popupActive) {
  var doUnlock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (unlock) {
    popupActive.classList.remove('open');

    if (doUnlock) {
      bodyUnLock();
    }
  }
}

function bodyLock() {
  var lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px';

  if (lockPadding.length > 0) {
    for (var _index2 = 0; _index2 < lockPadding.length; _index2++) {
      var el = lockPadding[_index2];
      el.style.paddingRight = lockPaddingValue;
    }
  }

  body.style.paddingRight = lockPaddingValue;
  body.classList.add('_lock');
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (var _index3 = 0; _index3 < lockPadding.length; _index3++) {
        var el = lockPadding[_index3];
        el.style.paddingRight = '0px';
      }
    }

    body.style.paddingRight = '0px';
    body.classList.remove('_lock');
  }, timeout);
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

document.addEventListener('keydown', function (e) {
  if (e.which === 27) {
    var popupActive = document.querySelector('.popup.open');
    popupClose(popupActive);
  }
});

(function () {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
      var node = this;

      while (node) {
        if (node.matches(css)) return node;else node = node.parentElement;
      }

      return null;
    };
  }
})();

(function () {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
  }
})();
"use strict";

// Burger =============================================
var burger = document.querySelector('.burger');
var menuBody = document.querySelector('.menu__body');
var fixedBlocks = document.querySelectorAll('._fixed');

if (burger) {
  burger.addEventListener("click", function (e) {
    var paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';

    if (document.body.classList.contains('_lock')) {
      burger_close();
    } else {
      burger_open(paddingOffset);
    }

    burger__move();
  });
}

function burger_open(element) {
  fixedBlocks.forEach(function (el) {
    el.style.paddingRight = element;
  });
  document.body.style.paddingRight = element;
  document.body.classList.add("_lock");
  burger.classList.add("_active");
  menuBody.classList.add("_active");
}

function burger_close() {
  fixedBlocks.forEach(function (el) {
    el.style.paddingRight = '0';
  });
  document.body.style.paddingRight = '0';
  document.body.classList.remove("_lock");
  burger.classList.remove("_active");
  menuBody.classList.remove("_active");
} // MoveBurgerOnClick ================================


var headerMenu = document.querySelector('.header__menu');

function burger__move() {
  if (!burger.classList.contains('_done')) {
    burger.classList.add('_done');
    menuBody.insertBefore(burger, menuBody.children[0]);
  } else {
    burger.classList.remove('_done');
    headerMenu.insertBefore(burger, headerMenu.children[0]);
  }
} // ScrollOnClick =================================


var menuLinks = document.querySelectorAll('._goto[data-goto]');

if (menuLinks.length > 0) {
  var onMenuLinkClick = function onMenuLinkClick(e) {
    e.preventDefault();
    var menuLink = e.target;

    if (menuLink.dataset["goto"] && document.querySelector(menuLink.dataset["goto"])) {
      var gotoBlock = document.querySelector(menuLink.dataset["goto"]);
      var gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

      if (burger.classList.contains('_active')) {
        burger__move();
        burger_close();
      }

      window.scrollTo({
        top: gotoBlockValue,
        behavior: "smooth"
      });
    }
  };

  menuLinks.forEach(function (menuLink) {
    menuLink.addEventListener("click", onMenuLinkClick);
  });
} // FilterDecor / Filter-btn =====================================================


var filterDecor = document.querySelectorAll('.decor-filter');
var filterForm = document.querySelector('.products-filter__form');
var filterAside = document.querySelector('.products-filter__aside');

function showBlock(element) {
  element.classList.toggle('_active');

  if (window.innerWidth > 992) {
    if (element.style.maxHeight) {
      element.style.maxHeight = null;
    } else {
      element.style.maxHeight = element.scrollHeight + 64 + 'px';
    }
  } else {
    bodyLocker();
    document.body.classList.add('_lock');
    var filterBurger = document.querySelector('.products-filter__burger');
    var filterButton = document.querySelector('.filter-product__button');

    if (filterBurger) {
      filterBurger.addEventListener("click", function (e) {
        burger_close();
        bodyUnlocker();
        element.classList.remove('_active');
        document.body.classList.remove('_lock');
      });
    }

    if (filterButton) {
      filterButton.addEventListener("click", function (e) {
        burger_close();
        bodyUnlocker();
        element.classList.remove('_active');
        document.body.classList.remove('_lock');
      });
    }
  }
}

if (filterDecor) {
  for (var index = 0; index < filterDecor.length; index++) {
    var element = filterDecor[index];
    element.addEventListener("click", function (e) {
      this.classList.toggle('_active');
      showBlock(filterForm);
    });
  }
}

var filterBtn = document.querySelector('.filter-btn');

if (filterBtn) {
  (function () {
    var filterMenu = document.querySelector('.menu-filter');
    var filterLinks = document.querySelectorAll('.menu-filter__link');
    var filterGallery = document.querySelector('.products-filter__gallery');
    var productsList = filterGallery.children;
    filterBtn.addEventListener('click', function (e) {
      if (!filterForm.classList.contains('_active')) {
        filterMenu.classList.toggle('_checked');
      }
    });

    if (filterLinks) {
      var _loop = function _loop(_index) {
        var el = filterLinks[_index];
        el.addEventListener('click', function (e) {
          e.preventDefault;
          filterLinks.forEach(function (element) {
            element.classList.remove('_checked');
            filterGallery.classList.remove('_list');
            filterGallery.classList.remove('_image');

            for (var _index2 = 0; _index2 < productsList.length; _index2++) {
              var _element = productsList[_index2];

              _element.classList.remove('_list');

              _element.classList.remove('_image');
            }
          });

          switch (el.innerHTML) {
            case 'List':
              filterGallery.classList.add('_list');

              for (var _index3 = 0; _index3 < productsList.length; _index3++) {
                var _element2 = productsList[_index3];

                _element2.classList.add('_list');
              }

              break;

            case 'Tile':
              break;

            case 'Image':
              filterGallery.classList.add('_image');

              for (var _index4 = 0; _index4 < productsList.length; _index4++) {
                var _element3 = productsList[_index4];

                _element3.classList.add('_image');
              }

              break;
          }

          e.target.classList.add('_checked');
          filterMenu.classList.remove('_checked');
        });
      };

      for (var _index = 0; _index < filterLinks.length; _index++) {
        _loop(_index);
      }
    }
  })();
} // Marker SALE =====================================


var saleMarker = document.querySelectorAll('.product__action');
var pageGAllery = document.querySelector('.gallery');
var pageFilter = document.querySelector('.products-filter');
var markerElement = null;

if (pageGAllery) {
  markerElement = 2;
}

if (pageFilter) {
  markerElement = 5;
}

for (var _index5 = 0; _index5 < saleMarker.length; _index5++) {
  if (_index5 == markerElement) {
    var markerItem = saleMarker[_index5];
    markerItem.classList.add("_sale");
  }
} // Hide elements in gallery =======================


if (window.innerWidth < 768) {
  hideElements();
}

function hideElements() {
  var gallery = document.querySelector('.products-filter__gallery');

  if (gallery) {
    var galleryItems = gallery.children;

    for (var _index6 = 0; _index6 < galleryItems.length; _index6++) {
      var _element4 = galleryItems[_index6];

      switch (_index6) {
        case 1:
          _element4.style.display = 'none';

        case 2:
          _element4.style.display = 'none';

        case 3:
          _element4.style.display = 'none';
          break;
      }
    }
  }
}

; // see-more tab ========================

var seeMore = document.querySelectorAll('.product-item__see-more');

if (seeMore) {
  for (var _index7 = 0; _index7 < seeMore.length; _index7++) {
    var _element5 = seeMore[_index7];

    _element5.addEventListener('click', function (el) {
      this.classList.toggle('_active');
      var textMore = this.parentElement.children[1];
      textMore.classList.toggle('_show');
    });
  }
}
"use strict";

var teamSwiper = new Swiper('.team__swiper', {
  wrapperClass: 'swiper-team__wrapper',
  slideClass: 'swiper-team__slide',
  navigation: {
    nextEl: '.swiper-team__arrow--next',
    prevEl: '.swiper-team__arrow--prev'
  },
  pagination: {
    el: '.swiper-team__pagination',
    clickable: true,
    type: 'bullets'
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
    pageUpDow: true
  },
  initialSlide: 1,
  slideToClickedSlide: true,
  speed: 500,
  spaceBetween: 50,
  slidesPerGroup: 1,
  slidesPerView: 'auto',
  centeredSlides: true,
  breakpoints: {
    480: {
      spaceBetween: 31,
      slidesPerView: 'auto'
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 39
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 39
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 31
    }
  }
});
var reviewSwiper = new Swiper('.review__swiper', {
  wrapperClass: 'swiper-team__wrapper',
  slideClass: 'swiper-team__slide',
  navigation: {
    nextEl: '.swiper-team__arrow--next',
    prevEl: '.swiper-team__arrow--prev'
  },
  pagination: {
    el: '.swiper-team__pagination',
    clickable: true,
    type: 'bullets'
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
    pageUpDow: true
  },
  initialSlide: 1,
  slideToClickedSlide: true,
  speed: 500,
  spaceBetween: 50,
  slidesPerGroup: 1,
  slidesPerView: 'auto',
  centeredSlides: true,
  breakpoints: {
    480: {
      spaceBetween: 31,
      slidesPerView: 'auto'
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 39
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 39
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 31
    }
  }
});
var productSwiper = new Swiper('.product-swiper', {
  wrapperClass: 'product-swiper__wrapper',
  slideClass: 'product-swiper__slide',
  navigation: {
    nextEl: '.product-swiper__arrow--next',
    prevEl: '.product-swiper__arrow--prev'
  },
  slidesPerView: 'auto',
  slidesPerGroup: 1,
  spaceBetween: 6,
  breakpoints: {
    769.98: {
      watchOverflow: true
    }
  }
});
var shopSwiper = new Swiper('.shop-swiper', {
  wrapperClass: 'shop-swiper__wrapper',
  slideClass: 'shop-swiper__slide',
  navigation: {
    nextEl: '.shop-swiper__arrow--next',
    prevEl: '.shop-swiper__arrow--prev'
  },
  speed: 900,
  slidesPerView: 1,
  slidesPerGroup: 1,
  centeredSlides: true,
  loop: true
}); // swiperTabs============================

var teamSwiperSlides = teamSwiper.slides;
var reviewSwiperSlides = reviewSwiper.slides;
teamSwiper.on('slideChange', function () {
  teamSwiper.updateSlidesClasses();
  var descriptionItems = document.querySelectorAll(".description__item");

  for (var index = 0; index < teamSwiperSlides.length; index++) {
    var element = teamSwiperSlides[index];
    element.classList.remove('tab_active');
    descriptionItems[index].classList.remove('tab_active');

    if (element.classList.contains('swiper-slide-active')) {
      element.classList.add('tab_active');
      descriptionItems[index].classList.add('tab_active');
    }
  }
});
reviewSwiper.on('slideChange', function () {
  reviewSwiper.updateSlidesClasses();
  var descrParent = document.querySelector('.review__description');
  var descriptionItems = descrParent.children;

  for (var index = 0; index < reviewSwiperSlides.length; index++) {
    var element = reviewSwiperSlides[index];
    element.classList.remove('tab_active');
    descriptionItems[index].classList.remove('tab_active');

    if (element.classList.contains('swiper-slide-active')) {
      element.classList.add('tab_active');
      descriptionItems[index].classList.add('tab_active');
    }
  }
}); // ====================================
"use strict";

// Tabs =======================================================
var tabs = document.querySelectorAll("._tabs");

var _loop = function _loop(index) {
  var tab = tabs[index];
  var tabs_items = tab.querySelectorAll("._tabs-item");
  var tabs_blocks = tab.querySelectorAll("._tabs-block");

  var _loop2 = function _loop2(_index) {
    var tabs_item = tabs_items[_index];
    tabs_item.addEventListener("click", function (e) {
      for (var _index2 = 0; _index2 < tabs_items.length; _index2++) {
        var _tabs_item = tabs_items[_index2];

        _tabs_item.classList.remove('_active');

        tabs_blocks[_index2].classList.remove('_active');
      }

      tabs_item.classList.add('_active');

      tabs_blocks[_index].classList.add('_active');

      e.preventDefault();
    });
  };

  for (var _index = 0; _index < tabs_items.length; _index++) {
    _loop2(_index);
  }
};

for (var index = 0; index < tabs.length; index++) {
  _loop(index);
}
"use strict";
//# sourceMappingURL=main.js.map

class Slider {
  defaultOptions = {
    pagination: false,
    counter: false,
    autoplay: false,
    autoplayDelay: 4000,
    loop: false,
    step: 1,
    gap: 0,
    breakpoints: {},
  }

  currentSlide = 0

  constructor(element, options) {
    this.sliderName = element.dataset.slider;
    this.options = Object.assign({}, this.defaultOptions, options);
    this.slides = element.querySelectorAll('[data-slider-slide]');
    this.sliderWrapper = element.querySelector('[data-slider-wrapper]');
    this.totalSlides = this.slides.length;
    this.step = this.options.step;

    this.start();
  }

  start() {
    this.setNavigation();


    if (this.isBreakpoints()) {
      this.setBreakpoints();
    }

    if (this.isPagination()) {
      this.setPagination();
    }

    if (this.isCounter()) {
      this.setCounter();
    }

    if (this.isAutoplay()) {
      this.autoplay();
    }
  }

  isAutoplay = () => {
    return this.options.autoplay;
  }

  isLoop = () => {
    return this.options.loop;
  }

  isBreakpoints = () => {
    return Object.keys(this.options.breakpoints).length
  }

  isPagination = () => {
    return this.options.pagination;
  }

  isCounter = () => {
    return this.options.counter;
  }

  createDots = () => {
    const fragment = document.createDocumentFragment();
    Array.from(this.slides).forEach((el, index) => {
      const dot = document.createElement('li');
      dot.classList.add('slider__dot');
      if (this.currentSlide == index) {
        dot.classList.add('slider__dot_current');
      }
      fragment.append(dot);
    });

    this.paginationContainer.append(fragment);
  }

  setPagination() {
    this.paginationContainer = document.querySelector(`[data-slider-pagination="${this.sliderName}"]`);
    console.log(this.paginationContainer);
    this.paginationContainer.innerHTML = '';
    this.createDots();
    this.paginationDots = this.paginationContainer.querySelectorAll('.slider__dot');
  }

  updatePagination = () => {
    const dots = Array.from(this.paginationDots);
    dots[this.previousSlide]?.classList.remove('slider__dot_current');
    dots[this.currentSlide]?.classList.add('slider__dot_current');
  }

  createCounter = () => {
    return `${this.currentSlide + this.step} <span>/ ${this.totalSlides}</span>`
  }

  setCounter() {
    this.counterContainer = document.querySelector(`[data-slider-counter="${this.sliderName}"]`);
    this.counterContainer.innerHTML = '';
    this.counterContainer.insertAdjacentHTML('beforeend', this.createCounter());
  }

  updateCounter = () => {
    this.counterContainer.innerHTML = '';
    this.counterContainer.insertAdjacentHTML('beforeend', this.createCounter());
  }

  onButtonNextClick = (evt) => {
    evt.preventDefault();

    if (this.options.autoplay) {
      clearInterval(this.autoplayInterval);
    }

    this.goNext();
  }

  onButtonPrevClick = (evt) => {
    evt.preventDefault();

    if (this.isAutoplay()) {
      clearInterval(this.autoplayInterval);
    }

    this.goPrev();
  }

  setNavigation() {
    const nextButton = document.querySelector(`[data-slider-button-next=${this.sliderName}]`);
    const prevButton = document.querySelector(`[data-slider-button-prev=${this.sliderName}]`);

    if (nextButton) {
      this.nextButton = nextButton;
      this.nextButton.addEventListener('click', this.onButtonNextClick);
    }

    if (prevButton) {
      this.prevButton = prevButton;
      this.prevButton.addEventListener('click', this.onButtonPrevClick);
    }
  }

  onQueryChange = (evt) => {
    if (evt.matches) {
      const queryData = this.mediaQueries.find((mediaQuery) => mediaQuery.query.media === evt.media);
      this.step = queryData.options.step;
    }
  }

  setBreakpoints() {
    const breakValues = Object.keys(this.options.breakpoints);
    const mediaQueries = breakValues.map((value, index, values) => {
      if (index !== values.length - 1) {
        return {
          query: window.matchMedia(`(min-width: ${value}px) and (max-width: ${values[index + 1]}px)`),
          options: this.options.breakpoints[value],
        };
      }
      return {
        query: window.matchMedia(`(min-width: ${value}px)`),
        options: this.options.breakpoints[value],
      };
    });
    this.mediaQueries = mediaQueries;

    this.mediaQueries.forEach((mediaQuery) => {
      mediaQuery.query.addEventListener('change', this.onQueryChange);
      this.onQueryChange(mediaQuery.query);
    });
  }

  autoplay = () => {
    this.autoplayInterval = setInterval(this.goNext, this.options.autoplayDelay);
  }


  getTransition = (number) => {
    const index = number || this.currentSlide;
    const slidesLength = Array.from(this.slides).reduce((sum, el) => sum + el.offsetWidth, 0);
    const gap = this.options.gap;
    const slideLength = slidesLength / this.totalSlides;
    return index === 0 ? 0 : (slideLength + gap) * index;
  }

  moveTo = (number) => {
    if (this.isPagination()) {
      this.updatePagination();
    }

    if (this.isCounter()) {
      this.updateCounter();
    }

    this.sliderWrapper.style.transition = 'transform 0.3s ease';
    this.sliderWrapper.style.transform = `translate3d(${-1 * this.getTransition(number)}px, 0, 0)`;
  }

  resetTransition = () => {
    this.sliderWrapper.style.transition = '';
    this.sliderWrapper.style.transform = '';
  }

  goNext = () => {
    this.previousSlide = this.currentSlide;

    if (this.currentSlide < this.totalSlides - this.step) {
      this.prevButton.disabled = false;
      this.currentSlide += this.step;
    } else {
      if (this.isLoop()) {
        this.currentSlide = 0;
      }
    }

    if (!this.isLoop() && this.currentSlide === this.totalSlides - this.step) {
      this.nextButton.disabled = true;
    }

    this.moveTo(this.currentSlide);
  }

  goPrev = () => {
    this.previousSlide = this.currentSlide;

    const diff = this.totalSlides % this.step;

    if (this.currentSlide >= this.step) {
      this.nextButton.disabled = false;
      this.currentSlide -= this.step;
    } else {
      if (this.isLoop()) {
        this.currentSlide = this.totalSlides - (this.step - diff);
      }
    }

    if (!this.isLoop() && this.currentSlide === 0) {
      this.prevButton.disabled = true;
    }

    this.moveTo(this.currentSlide);
  }

  destroy() {
    this.resetTransition();
    this.nextButton?.removeEventListener('click', this.onButtonNextClick);
    this.prevButton?.removeEventListener('click', this.onButtonPrevClick);

    if (this.isBreakpoints()) {
      this.mediaQueries.forEach((mediaQuery) => {
        mediaQuery.query.removeEventListener('change', this.onQueryChange);
      });
    }
  }
}

export { Slider };

import { Slider } from './slider.js';

const createPlanSlider = () => {
  const planSlider = document.querySelector('[data-slider="plan"]');

  const mediaQuery = window.matchMedia('(min-width: 1000px)');

  let slider;

  const onWindowChange = (evt) => {
    if (!evt.matches) {
      if (planSlider) {
        slider = new Slider(planSlider, {
          pagination: true,
          gap: 20,
        });

        return slider;
      }
    } else {
      slider?.destroy();
    }
  };

  mediaQuery.addEventListener('change', onWindowChange);

  onWindowChange(mediaQuery);
}

export { createPlanSlider };

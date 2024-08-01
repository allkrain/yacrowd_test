import { Slider } from './slider.js';

const createParticipantsSlider = () => {
  const participantsSlider = document.querySelector('[data-slider="participants"]');

  if (participantsSlider) {
    return new Slider(participantsSlider, {
      counter: true,
      autoplay: true,
      loop: true,
      gap: 20,
      breakpoints: {
        0: {
          step: 1,
        },
        800: {
          step: 2,
        },
        1250: {
          step: 3,
        },
      },
    });
  }
};

export { createParticipantsSlider };

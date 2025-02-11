import { client } from "../utils/contentfulApi";
import TestimonialManager from "./manager/testimonialManager";

class TestimonialCarousel extends TestimonialManager {
  #section = document.querySelector(".testimonial-section");
  #container = document.querySelector(".testimonial-carousel-container");
  #currentIndex = 0;

  constructor() {
    super();
    this._processTestimonialData();
  }

  async _processTestimonialData() {
    const wrapper = document.querySelector(".testimonial-slider-wrapper");
    const testimonialData = await this._fetchTestimonialEntries();

    if (!wrapper) {
      return;
    }

    wrapper.innerHTML = this._renderTestimonialCard(testimonialData);

    this._selectTestimonialElements(wrapper.children);
  }

  _selectTestimonialElements(testimonialSlides) {
    const slides = Array.from(testimonialSlides);

    if (!slides) {
      return;
    }

    this._updateTrackPosition(slides);
    this._handleCarouselCTA(slides);
  }

  _updateTrackPosition(slides) {
    const containerWidth = this.#container.clientWidth;
    const slideWidth = slides[0].clientWidth;
    const marginRight = 50;

    const offset = this.#currentIndex * (slideWidth + marginRight);

    this.#container.style.transform = `translateX(calc(${
      containerWidth / 2
    }px - ${slideWidth / 2}px - ${offset}px))`;
  }

  _handleCarouselCTA(slides) {
    this.#section.addEventListener("click", (e) => {
      const nextBtn = e.target.closest(".carousel-next-btn");
      const prevBtn = e.target.closest(".carousel-prev-btn");

      if (nextBtn) {
        this._goToNextSlide(slides);
      } else if (prevBtn) {
        this._goToPrevSlide(slides);
      }

      if (!nextBtn || !prevBtn) {
        return;
      }
    });
  }

  _goToNextSlide(slides) {
    this.#currentIndex = (this.#currentIndex + 1) % slides.length;
    this._updateTrackPosition(slides);
  }

  _goToPrevSlide(slides) {
    this.#currentIndex =
      (this.#currentIndex - 1 + slides.length) % slides.length;

    this._updateTrackPosition(slides);
  }
}

export const testimonialCarousel = new TestimonialCarousel();

export class FAQAccodionManager {
  #faqItems = document.querySelectorAll(".faq-item");
  constructor() {
    this._initializeFAQ();
  }

  _initializeFAQ() {
    const faqContainer = document.querySelector(".faq-content");

    if (!faqContainer) {
      return;
    }

    this._setupFAQListeners(faqContainer);
  }

  _setupFAQListeners(parentElement) {
    parentElement.addEventListener("click", (e) => {
      const target = e.target.closest(".faq-item");

      if (!target) return;

      this._toggleFaqItems(target);
    });

    document.addEventListener("click", (e) => {
      if (this._isClickoutsideParent(parentElement, e.target)) {
        this._collapseAllFAQItems();
      }
    });
  }

  _toggleFaqItems(target) {
    const { faqAnswer, icon } = this._getFaqChildElements(target);

    this._collapseAllFAQItems(target);
    faqAnswer.classList.toggle("expand-accordion");
    target.setAttribute(
      "aria-expanded",
      faqAnswer.classList.contains("expand-accordion")
    );
    icon.classList.toggle("flat-icon");
  }

  _collapseAllFAQItems(excludedItem = null) {
    this.#faqItems.forEach((item) => {
      if (item === excludedItem) return;

      const { faqAnswer, icon } = this._getFaqChildElements(item);

      faqAnswer.classList.remove("expand-accordion");
      item.setAttribute("aria-expanded", "false");
      icon.classList.remove("flat-icon");
    });
  }

  _getFaqChildElements(item) {
    const faqAnswer = item.children[item.children.length - 1];
    const icon = item.querySelector(".plus-vertical");
    return { faqAnswer, icon };
  }

  _isClickoutsideParent(element, eventTarget) {
    return !element.contains(eventTarget);
  }
}

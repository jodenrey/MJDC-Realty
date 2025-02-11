export class HeaderManager {
  #parentElement = document.querySelector("header");
  #navlinks = document.querySelectorAll(".nav-link");

  constructor() {
    this.navToggleHandler();
    this._handleNavLinkClick();
  }

  navToggleHandler() {
    if (!this.#parentElement) return;

    this.#parentElement.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".open-nav-btn");
      const closeBtn = e.target.closest(".close-nav-btn");

      this._toggleNavbar(openBtn, closeBtn);
    });
  }

  _toggleNavbar(open, close) {
    const navbar = this.#parentElement.querySelector(".navbar");
    const overlay = document.querySelector(".bg-overlay");

    if (open) {
      navbar.classList.add("expand-nav");
      overlay.classList.add("active-overlay");
    }

    if (close) {
      setTimeout(() => {
        overlay.classList.remove("active-overlay");
      }, 450);
      navbar.classList.remove("expand-nav");
    }

    if (!open || !close) {
      return;
    }
  }

  _handleNavLinkClick() {
    const currentPath =
      window.location.pathname.split("/")[
        window.location.pathname.split("/").length - 1
      ];

    if (!this.#navlinks) return;

    this.#navlinks.forEach((link) => {
      const href = link.getAttribute("href").split("/")[
        link.getAttribute("href").split("/").length - 1
      ];

      if (href === currentPath) {
        link.classList.add("active-link");
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // _removeActiveNavLinks() {
  //   this.#navlinks.forEach((link) => {
  //     link.classList.remove("active-link");
  //     link.removeAttribute("aria-current");
  //   });
  // }
}

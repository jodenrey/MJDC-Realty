export class HeaderManager {
  #parentElement = document.querySelector("header");
  #navlinks = document.querySelectorAll(".nav-link");

  constructor() {
    this.navToggleHandler();
    this._handleNavLinkClick();
    this._handleHeaderScroll();
    this._initHeaderPosition();
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
      // Hide scrollbar when navbar is opened
      document.body.style.overflow = "hidden";
    }

    if (close) {
      setTimeout(() => {
        overlay.classList.remove("active-overlay");
      }, 450);
      navbar.classList.remove("expand-nav");
      // Show scrollbar again when navbar is closed
      document.body.style.overflow = "";
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

  _initHeaderPosition() {
    // Check if we're on the home page - typically index.html has a hero video section
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname.endsWith('index.html') ||
                      document.querySelector('.hero-video');

    if (isHomePage && this.#parentElement) {
      // Instead of adding absolute class, add home-header class
      this.#parentElement.classList.add('home-header');
      // Initial scroll position check
      this._handleScrollPosition();
    }
  }

  _handleHeaderScroll() {
    if (!this.#parentElement) return;

    window.addEventListener('scroll', () => {
      this._handleScrollPosition();
    });
  }

  _handleScrollPosition() {
    const isHomePage = window.location.pathname === '/' || 
                        window.location.pathname.endsWith('index.html') ||
                        document.querySelector('.hero-video');
    
    if (isHomePage && this.#parentElement) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 50) {
        this.#parentElement.classList.add('scrolled');
      } else {
        this.#parentElement.classList.remove('scrolled');
      }
    }
  }

  // _removeActiveNavLinks() {
  //   this.#navlinks.forEach((link) => {
  //     link.classList.remove("active-link");
  //     link.removeAttribute("aria-current");
  //   });
  // }
}

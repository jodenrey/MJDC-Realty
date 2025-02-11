import BlogCardManager from "../../components/manager/blogCardManager";

class BlogCardsList extends BlogCardManager {
  #nextBtn = document.querySelector("[data-nextBtn]");
  #prevBtn = document.querySelector("[data-prevBtn]");
  constructor() {
    super();
    this.currentPage = this._getCurrentPage();
    this.limit = 6;
    this.totalItems = 0;

    this._init();
  }

  _getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    let page = parseInt(urlParams.get("page"), 10);

    if (isNaN(page) || page < 1) {
      page = 1;

      this._updateURL(page);
    }

    return page;
  }

  _updateURL(page) {
    const url = new URL(window.location);
    url.searchParams.set("page", page);
    history.pushState({}, "", url);
  }

  async _fetchBlogsList() {
    const skip = (this.currentPage - 1) * this.limit;

    const blogData = await this._fetchEntries(skip, this.limit);

    if (!blogData) return;

    this.totalItems = blogData.total;

    return blogData;
  }

  _renderBlogList(data) {
    const container = document.querySelector(".blog-grid");

    if (!container) return;

    container.innerHTML = this._renderBlogCard(data);
  }

  _updatePaginationControls() {
    const totalPages = Math.ceil(this.totalItems / this.limit);

    if (!this.#nextBtn) return;

    this.#nextBtn.style.display =
      this.currentPage < totalPages ? "block" : "none";

    this.#nextBtn.disabled = totalPages === this.currentPage;

    if (!this.#prevBtn) return;

    this.#prevBtn.style.display = this.currentPage > 1 ? "block" : "none";

    this.#prevBtn.disabled = this.currentPage === 1;
  }

  async _init() {
    const entries = await this._fetchBlogsList();
    this._renderBlogList(entries);
    this._updatePaginationControls();

    if (!this.#nextBtn || !this.#prevBtn) return;

    this.#nextBtn.addEventListener("click", (e) => {
      this.currentPage++;
      this._updateURL(this.currentPage);
      this._updatePagination();
    });

    this.#prevBtn.addEventListener("click", (e) => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this._updateURL(this.currentPage);
        this._updatePagination();
      }
    });
  }

  async _updatePagination() {
    const entries = await this._fetchBlogsList();
    this._renderBlogList(entries);
    this._updatePaginationControls();
  }
}

const blogList = new BlogCardsList();

import PropertyCard from "../../components/manager/propertyCardManager";

class Propertieslist extends PropertyCard {
  #totalEntries = 0;
  #nextBtn = document.querySelector("[data-nextPage]");
  #prevBtn = document.querySelector("[data-prevPage]");
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

  async _fetchPropertyEntries() {
    const skip = (this.currentPage - 1) * this.limit;

    const propertyData = await this._fetchEntries(skip, this.limit);

    if (!propertyData) return;

    this.totalItems = propertyData.total;
    return propertyData;
  }

  _renderPropertiesList(data) {
    const container = document.querySelector('[data-propertyList="list"]');

    if (!container) return;

    container.innerHTML = this._renderProperties(data);
  }

  _updatePaginationControls() {
    const totalPages = Math.ceil(this.totalItems / this.limit);

    if (!this.#nextBtn) return;

    this.#nextBtn.style.display =
      this.currentPage < totalPages ? "block" : "none";

    this.#nextBtn.disabled = this.currentPage === totalPages;

    if (!this.#prevBtn) return;

    this.#prevBtn.style.display = this.currentPage > 1 ? "block" : "none";

    this.#prevBtn.disabled = this.currentPage === 1;
  }

  async _init() {
    const entries = await this._fetchPropertyEntries();
    this._renderPropertiesList(entries);
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
    const entries = await this._fetchPropertyEntries();
    this._renderPropertiesList(entries);
    this._updatePaginationControls();
  }
}

export const properties = new Propertieslist();

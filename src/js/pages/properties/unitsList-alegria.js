import PropertyCard from "../../components/manager/propertyCardManager";

class AlegriaUnitsList extends PropertyCard {
  constructor() {
    super();
    this.currentPage = this._getCurrentPage();
    this.limit = 6;
    this.totalItems = 0;
    this.category = "Alegria";

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

    const propertyData = await this._fetchEntries(
      skip,
      this.limit,
      undefined,
      {
        'fields.category': this.category
      }
    );

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
    const nextBtn = document.querySelector("[data-nextPage]");
    const prevBtn = document.querySelector("[data-prevPage]");

    if (!nextBtn || !prevBtn) return;

    nextBtn.style.display = this.currentPage < totalPages ? "block" : "none";
    nextBtn.disabled = this.currentPage === totalPages;

    prevBtn.style.display = this.currentPage > 1 ? "block" : "none";
    prevBtn.disabled = this.currentPage === 1;
  }

  async _init() {
    const entries = await this._fetchPropertyEntries();
    this._renderPropertiesList(entries);
    this._updatePaginationControls();
    this._setupEventListeners();
  }

  _setupEventListeners() {
    const nextBtn = document.querySelector("[data-nextPage]");
    const prevBtn = document.querySelector("[data-prevPage]");

    if (!nextBtn || !prevBtn) return;

    nextBtn.addEventListener("click", async () => {
      this.currentPage++;
      this._updateURL(this.currentPage);
      this._updatePagination();
    });

    prevBtn.addEventListener("click", async () => {
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

// Initialize the Alegria units list
new AlegriaUnitsList();
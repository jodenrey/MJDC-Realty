import PropertyCard from "../../components/manager/propertyCardManager";

class UnitsList extends PropertyCard {
  constructor() {
    super();
    this.currentPage = 1;
    this.limit = 6;
    this.totalItems = 0;
    this.category = this._getUnitCategory();
    this._init();
  }

  _getUnitCategory() {
    const path = window.location.pathname;
    if (path.includes('idesia-units')) return 'Idesia';
    if (path.includes('amaresa-marilao-units')) return 'Amaresa Marilao';
    if (path.includes('sentrina-alaminos-units')) return 'Sentrina Alaminos';
    if (path.includes('alegria-units')) return 'Alegria';
    return '';
  }

  async _init() {
    await this._fetchPropertyEntries();
    this._setupPagination();
    this._handlePaginationClick();
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
    this._renderUnitsList(propertyData);
    return propertyData;
  }

  _renderUnitsList(data) {
    const listContainer = document.querySelector("[data-propertyList='list']");
    if (!listContainer) return;

    listContainer.innerHTML = this._renderProperties(data);
  }

  _setupPagination() {
    const totalPages = Math.ceil(this.totalItems / this.limit);
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;

    let paginationHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <button
          class="pagination-btn px-4 py-2 border rounded-lg ${
            i === this.currentPage ? "bg-stone-950 text-white" : "text-stone-950"
          }"
          data-page="${i}"
        >
          ${i}
        </button>
      `;
    }

    paginationContainer.innerHTML = paginationHTML;
  }

  _handlePaginationClick() {
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;

    paginationContainer.addEventListener("click", async (e) => {
      const btn = e.target.closest(".pagination-btn");
      if (!btn) return;

      const pageNumber = parseInt(btn.dataset.page);
      if (pageNumber === this.currentPage) return;

      this.currentPage = pageNumber;
      await this._fetchPropertyEntries();
      this._setupPagination();
    });
  }
}

new UnitsList(); 
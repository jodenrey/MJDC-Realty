import ServicesManager from "../../components/manager/servicesManager";

class FeatureServiceView extends ServicesManager {
  constructor() {
    super();
    this._fetchFeatureServices();
  }

  async _fetchFeatureServices() {
    const servicesData = await this._fetchentries(0, 4, "sys.createdAt");

    if (!servicesData) {
      return;
    }

    this._renderFeatureServices(servicesData);
  }

  _renderFeatureServices(data) {
    const parentElement = document.querySelector(".services-content-wrap");

    if (!parentElement) return;

    parentElement.innerHTML = this._renderServicesMarkup(data);
  }
}

export const featureServiceView = new FeatureServiceView();

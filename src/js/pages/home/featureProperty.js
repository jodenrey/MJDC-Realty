import PropertyCard from "../../components/manager/propertyCardManager";

class FeatureProperty extends PropertyCard {
  constructor() {
    super();
    this._featureData();
  }

  async _featureData() {
    const featureProperty = await this._fetchEntries(0, 3, "fields.price");

    if (!featureProperty) {
      return;
    }

    this._renderFeatureProperty(featureProperty);
  }

  _renderFeatureProperty(data) {
    const featureContainer = document.querySelector(".featured-projects");

    if (!featureContainer) {
      return;
    }

    featureContainer.innerHTML = this._renderProperties(data);
  }
}

export const featureProperty = new FeatureProperty();

import { client } from "../../utils/contentfulApi";
import { propertyCardMarkup } from "../../utils/markupGenerator";

export default class PropertyCard {
  constructor() {}

  async _fetchEntries(skipNum, limitNum, orderby) {
    const entries = await client.getEntries({
      skip: skipNum,
      limit: limitNum,
      content_type: "property",
      order: orderby,
    });

    if (!entries) {
      return;
    }

    const propertyData = entries;
    return propertyData;
  }

  _renderProperties(data) {
    if (!data) {
      return;
    }

    const render = data.items
      .map((property) => {
        const { title, thumbnail, status, price, city, country, slug } =
          property.fields;

        return `<div class="properties-card">
              ${propertyCardMarkup(
                title,
                thumbnail,
                status,
                price,
                city,
                country,
                slug
              )}</div>`;
      })
      .join("");

    return render;
  }
}

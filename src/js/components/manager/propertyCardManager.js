import { client } from "../../utils/contentfulApi";
import { propertyCardMarkup } from "../../utils/markupGenerator";

export default class PropertyCard {
  constructor() {}

  async _fetchEntries(skipNum, limitNum, orderby = '-sys.createdAt', filters = {}) {
    const entries = await client.getEntries({
      skip: skipNum,
      limit: limitNum,
      content_type: "property",
      order: orderby,
      ...filters
    });

    if (!entries) {
      return;
    }

    return entries;
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

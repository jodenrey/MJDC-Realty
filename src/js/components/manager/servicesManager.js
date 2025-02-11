import { client } from "../../utils/contentfulApi";

export default class ServicesManager {
  constructor() {}

  async _fetchentries(skipNum, limitNum, orderby) {
    const entries = await client.getEntries({
      skip: skipNum,
      limit: limitNum,
      content_type: "services",
      order: orderby,
    });

    if (!entries) {
      return;
    }

    return entries;
  }

  _renderServicesMarkup(data) {
    if (!data) {
      return;
    }

    const render = data.items
      .map((service) => {
        const { serviceName, icon, serviceDescription, slug } = service.fields;

        return `<div class="service-wrap py-5">
                ${this._generateMarkup(
                  serviceName,
                  icon,
                  serviceDescription,
                  slug
                )}</div>`;
      })
      .join("");

    return render;
  }

  _generateMarkup(serviceName, icon, serviceDescription, slug) {
    const markup = `
              <a href="../../../pages/service-view.html?slug=${slug}"
                class="flex flex-col gap-3 min-[480px]:flex-row 
                min-[480px]:gap-12 min-[480px]:justify-between 
                min-[480px]:items-center">


                <div class="service-wrap-header flex flex-col justify-start items-start">

                  <img
                    src="${icon?.fields.file.url}"
                    alt="${icon?.fields.title}"
                    class="service-icon"/>

                  <h3 class="font-heading font-regular my-5 tracking-wide text-xl lg:text-2xl">
                        ${serviceName}
                  </h3>

                </div>

                <p class="text-stone-800 service-text">${serviceDescription}</p>
            </a>`;

    return markup;
  }
}

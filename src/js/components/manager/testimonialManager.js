import { client } from "../../utils/contentfulApi";

export default class TestimonialManager {
  constructor() {}

  async _fetchTestimonialEntries() {
    const entries = await client.getEntries({
      content_type: "clientsTestimonial",
    });

    if (!entries) {
      return;
    }

    return entries.items;
  }

  _renderTestimonialCard(data) {
    const render = data
      .map((property) => {
        const { clientName, clientImage, testimonial, city, country } =
          property.fields;

        return `<div class="testimonial-card flex flex-col gap-5">
                ${this._generateMarkup(
                  clientName,
                  clientImage,
                  testimonial,
                  city,
                  country
                )}</div>`;
      })
      .join("");

    return render;
  }

  _generateMarkup(clientName, clientImage, testimonial, city, country) {
    const markup = `
        <div class="testimonial-header max-w-md">

                <img
                src="${clientImage?.fields.file.url}"
                alt="${clientName}"
                class="rounded-lg" />

        </div>

            <div class="testimonial-content p-5 bg-white rounded-lg flex flex-col justify-between">

            <p class="client-msg text-stone-800 leading-7">
            ${testimonial}
            </p>

            <div class="client-name-wrap my-5">
                <p class="client-name font-heading text-stone-950">${clientName}</p>
                <p class="client-location text-stone-600 text-sm">${city}, ${country}</p>
            </div>

        </div>`;

    return markup;
  }
}

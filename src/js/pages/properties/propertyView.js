import { client } from "../../utils/contentfulApi";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { _hideLoader, _showLoader } from "../../components/loaderfn";

class PropertyView {
  #urlParams = new URLSearchParams(window.location.search);
  #slug = this.#urlParams.get("slug");
  #Topsection = document.querySelector(".property-view-section");
  #bottomSection = document.querySelector(".property-gallery-section");

  constructor() {
    this._validateAndFetchSlug();
  }

  _validateAndFetchSlug() {
    if (!this.#slug) {
      window.location = "../../../pages/page-not-found.html";
      return;
    }

    this._fetchPropertyEntry();
  }

  async _fetchPropertyEntry() {
    _showLoader();

    try {
      const entries = await client.getEntries();

      if (!entries) {
        _hideLoader();
        return;
      }

      const property = entries.items.find(
        (entry) => entry.fields.slug === this.#slug
      );

      this._renderPropertyDetails(property);
    } catch (error) {
      window.location = "../../../pages/page-not-found.html";
    } finally {
      _hideLoader();
    }
  }

  _renderPropertyDetails(property) {
    if (!property) {
      window.location = "../../../pages/page-not-found.html";
      return;
    }

    _hideLoader();
    this._generateMarkup(property);
  }

  _generateMarkup(property) {
    const container = this.#Topsection.querySelector(
      ".property-view-container"
    );
    const galleryGrid = this.#bottomSection.querySelector(
      ".property-gallery-grid"
    );
    const pageTitle = document.querySelector("title");

    if (!container || !galleryGrid) return;

    container.innerHTML = this._createPropertyInfo(property.fields);
    galleryGrid.innerHTML = this._createPropertyGallery(
      property.fields.propertyGallery
    );
    pageTitle.innerHTML = `${property.fields.title} - Roofly Properties`;
  }

  _renderRichText(richTextField) {
    if (!richTextField || !richTextField.nodeType) {
      console.error("Invalid rich text field");
      return "";
    }
    return documentToHtmlString(richTextField);
  }

  _createPropertyInfo(property) {
    return `
      <div class="container-title py-5">
          <p class="uppercase text-stone-600 text-sm tracking-wide">
            Categories
          </p>
          <h1 class="text-stone-950 text-5xl font-heading">
            ${property.title}
          </h1>
      </div>

    <div class="property-view-top mt-8 flex flex-col md:flex-row gap-6">
          <div class="property-img-wrap max-h-[650px] w-full">
            <img
              src="${property.thumbnail?.fields.file.url}"
              alt="${property.thumbnail?.fields.description}"
              loading="lazy"
              class="rounded-lg w-full object-cover h-full"
            />
          </div>

          <div class="property-info-wrap w-full max-w-[380px] w-full bg-white rounded-lg p-7 border h-max lg:p-8">

            <div class="property-info-data flex flex-col gap-10">
              <div
                class="property-info-top flex justify-between border border-x-0 py-4 font-medium"
              >
                <p class="text-stone-600">Price</p>
                <p class="price">${property.price}</p>
              </div>

              <div class="property-info-bottom">
                <h2 class="font-medium text-stone-950 text-lg font-heading">
                  Information
                </h2>

                <div class="property-info-content my-5">
                  <div
                    class="content flex justify-between border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Agent Name</p>
                    <p class="agent-name text-stone-600">${
                      property?.agent.fields.name
                    }</p>
                  </div>

                  <div
                    class="content flex justify-between border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Built</p>
                    <p class="property-built text-stone-600">${
                      property.builtIn
                    }</p>
                  </div>
                  <div
                    class="content flex justify-between border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Property</p>
                    <p class="property-type text-stone-600">
                      ${property.propertyType}
                    </p>
                  </div>
                  <div
                    class="content flex justify-between border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Area</p>
                    <p class="property-area text-stone-600">${
                      property.area
                    } sq ft</p>
                  </div>
                  <div
                    class="content flex justify-between border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Bedrooms</p>
                    <p class="bedroom-info text-stone-600">
                      <span class="number-of-beds">${
                        property?.bedrooms ?? "No"
                      }</span> Bedrooms
                    </p>
                  </div>
                  <div
                    class="content flex justify-between border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Bathrooms</p>
                    <p class="bathroom-info text-stone-600">
                      <span class="number-of-baths">${
                        property?.bathrooms ?? "No"
                      }</span> Bathrooms
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="my-5 flex items-center justify-center">
              <a
                href="../pages/contact-us.html"
                class="ask-detail-btn uppercase bg-zinc-950 text-white w-full text-center p-3 rounded-lg border border-black hover:bg-transparent hover:text-stone-950 transition duration-500 ease-in-out"
              >
                ask for details</a
              >
            </div>
          </div>
      </div>

      ${this._createPropertyOverview(property)}`;
  }

  _createPropertyOverview(property) {
    return `
        <div class="property-overview-container flex flex-col-reverse gap-8 min-[992px]:flex-row 
                  min-[992px]:justify-between mt-10">

          <div class="property-overview max-w-[1080px] w-full">
          
            <div class="overview-top">
              <h2 class="text-2xl font-heading">Overview</h2>

              <div class="overview-data mt-5 text-stone-700 flex flex-col gap-5">
              ${this._renderRichText(property.description)}
              </div>

            </div>

            <div class="overview-bottom mt-12">
              <h2 class="text-2xl font-heading">Amenities</h2>

              <ul class="amenities-list mt-5 flex flex-col gap-5 text-stone-950 max-w-[750px] justify-between
                          min-[625px]:flex-row min-[625px]:flex-wrap list-disc list-inside px-2">

                          ${property.amenities
                            .map((amenity) => {
                              return `<li class="amenities text-start min-[625px]:basis-48">${amenity}</li>`;
                            })
                            .join("")}
                            
              </ul>
            </div>
          </div>
          ${this._createAgentInfo(property.agent.fields)}
        </div>`;
  }

  _createAgentInfo(agent) {
    return `
    <div
    class="property-agent-wrap border border-gray-400 rounded-lg p-5 w-full max-w-[350px] h-max"
  >
    <h3 class="font-heading font-medium text-[17px]">
      Get in touch with the agent
    </h3>

    <div class="agent-data-wrap flex items-center gap-6 mt-5">
      <div class="agent-img-wrap w-[80px] h-[80px]">
        <img
          src="${agent?.profilePic.fields.file.url}"
          alt="${agent.name}"
          class="rounded-lg object-cover w-full h-full"
        />
      </div>

      <div class="agent-inf-wrap">
        <p class="agent-name py-1 font-medium text-stone-950 text-[17px]">
          ${agent.name}
        </p>
        <a
          href="mailto:"
          class="agent-mailid text-sm flex items-center gap-3 text-stone-950 py-1"
        >
          <i class="fa-solid fa-envelope"></i> ${agent.email}
        </a>
        <a
          href="tel:"
          class="agent-number text-sm flex items-center gap-3 text-stone-950"
        >
          <i class="fa-solid fa-phone"></i>${agent.phone}
        </a>
      </div>
    </div>
  </div>`;
  }

  _createPropertyGallery(property) {
    const generateGallery = property
      .map((items) => {
        const { description, file } = items.fields;

        return `
      <div class="property-imgages">
          <img
                src="${file.url}"
                alt="${description}"
                class="rounded-lg"/>
      </div>`;
      })
      .join("");

    return generateGallery;
  }
}

const currentPropertyView = new PropertyView();

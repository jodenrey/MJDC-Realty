import { client } from "../../utils/contentfulApi";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { _hideLoader, _showLoader } from "../../components/loaderfn";

class ServiceView {
  #urlParams = new URLSearchParams(window.location.search);
  #slug = this.#urlParams.get("slug");
  #section = document.querySelector(".service-view-section");

  constructor() {
    this._validateAndFetchSlug();
  }

  _validateAndFetchSlug() {
    if (!this.#slug) {
      window.location = "../../../pages/page-not-found.html";
      return;
    }

    this._fetchServiceEntry();
  }

  async _fetchServiceEntry() {
    _showLoader();

    try {
      const entries = await client.getEntries();

      if (!entries) {
        _hideLoader();
        return;
      }

      const service = entries.items.find(
        (entry) => entry.fields.slug === this.#slug
      );

      this._renderServiceDetails(service, entries);
    } catch (error) {
      window.location = "../../../pages/page-not-found.html";
    } finally {
      _hideLoader();
    }
  }

  _renderServiceDetails(service, entries) {
    if (!service) {
      window.location = "../../../pages/page-not-found.html";
      return;
    }

    _hideLoader();
    this._generateMarkup(service, entries);
  }

  _generateMarkup(service, entries) {
    const container = this.#section.querySelector(".service-view-container");
    const title = document.querySelector("title");

    if (!container) return;

    container.innerHTML = this._createServiceInfo(service.fields, entries);
    title.innerHTML = `${service.fields.serviceName} - Roofly Service`;
  }

  _createServiceInfo(service, entries) {
    return `
    <div class="container-title py-5">

        <p class="uppercase text-stone-600 text-sm tracking-wide">Services</p>

          <h1 class="text-stone-950 text-5xl font-heading">
            ${service.serviceName}
          </h1>
    </div>

    <div class="service-view-top mt-8 flex flex-col md:flex-row gap-6">
        <div class="service-img-wrap max-h-[650px] w-full">
            <img
              src="${service?.serviceThumb.fields.file.url}"
              alt=""
              loading="lazy"
              class="rounded-lg w-full object-cover h-full"
            />
        </div>

        <div
            class="service-info-wrap w-full max-w-[380px] w-full bg-white rounded-lg p-7 border h-max lg:p-8">
                <div class="service-info-data flex flex-col">
              ${this._createServiceList(entries)}
                 </div>

            <div class="mt-10 flex flex-col items-center justify-center gap-4">
              <p class="text-[18px] text-stone-600">Any Question? Let's talk</p>

              <a
                href="../pages/contact-us.html"
                class="collobrate-btn uppercase bg-zinc-950 text-white w-full text-center p-3 rounded-lg border 
                border-black hover:bg-transparent hover:text-stone-950 transition duration-500 ease-in-out">
                Collaborate now</a>
            </div>
        </div>
    </div>

    <div
        class="service-overview-container mt-10">
        ${this._renderRichText(service.servicesContent)}

        <div class="c-wrap">
        <a href="../../../pages/contact-us.html"
                class="text-stone-950 flex items-center gap-3 uppercase text-sm mt-5 w-max font-heading">
                <i class="fa-solid fa-arrow-right-long"> </i>
                Contact Us
        </a>
        </div>
    </div>
   `;
  }

  _createServiceList(services) {
    const serviceList = services.items.filter((type) => {
      return type.sys.contentType.sys.id === "services";
    });

    const markup = serviceList
      .map((item) => {
        const { serviceName, icon, slug } = item.fields;

        return `
            <div class="service-info-bottom">
                <a
                  href="../../../pages/service-view.html?slug=${slug}"
                  class="border w-full flex items-center justify-between border-t-0 border-x-0 py-3 text-stone-600 text-[15px] hover:border-black ${
                    this.#slug === slug ? "border-black" : ""
                  }"
                  >${serviceName}  

                    <img
                    src="${icon?.fields.file.url}"
                    alt="${icon?.fields.title}"
                    class="service-view-icon w-[30px]"/>

                </a>
            </div>`;
      })
      .join("");

    return markup;
  }

  _renderRichText(richTextField) {
    if (!richTextField || !richTextField.nodeType) {
      console.error("Invalid rich text field");
      return "";
    }
    return documentToHtmlString(richTextField);
  }
}

const currentServiceView = new ServiceView();

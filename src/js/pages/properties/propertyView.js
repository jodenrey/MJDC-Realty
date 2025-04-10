import { client } from "../../utils/contentfulApi";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { _hideLoader, _showLoader } from "../../components/loaderfn";

class PropertyView {
  #urlParams = new URLSearchParams(window.location.search);
  #slug = this.#urlParams.get("slug");
  #Topsection = document.querySelector(".property-view-section");
  #bottomSection = document.querySelector(".property-gallery-section");
  #videoSection = document.querySelector(".property-video-section");

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
      const entries = await client.getEntries({
        content_type: 'property'  // Explicitly specify the content type
      });

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
    
    // Handle video if exists
    if (property.fields.propertyVideo) {
      try {
        this._setPropertyVideo(property.fields.propertyVideo);
        this.#videoSection.classList.remove("hidden");
      } catch (err) {
        this.#videoSection.classList.add("hidden");
      }
    } else {
      this.#videoSection.classList.add("hidden");
    }
    
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
                class="property-info-top flex items-center gap-2 border border-x-0 py-4 font-medium"
              >
                <p class="text-stone-950">Price:</p>
                <p class="price text-stone-600">${property.price}</p>
              </div>

              <div class="property-info-bottom">
                <h2 class="font-medium text-stone-950 text-lg font-heading">
                  Details
                </h2>

                <div class="property-info-content my-5">
                  <div
                    class="content flex items-center gap-2 border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Subdivision:</p>
                    <p class="agent-name text-stone-600">${
                      property.subdivision
                    }</p>
                  </div>

                  <div
                    class="content flex items-center gap-2 border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Location:</p>
                    <p class="property-built text-stone-600">${
                      property.location
                    }</p>
                  </div>
                  <div
                    class="content flex items-center gap-2 border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Type:</p>
                    <p class="property-type text-stone-600">
                      ${property.propertyType}
                    </p>
                  </div>
                  <div
                    class="content flex items-center gap-2 border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Lot Area:</p>
                    <p class="property-area text-stone-600">${
                      property.area
                    } sqm</p>
                  </div>
                   <div
                    class="content flex items-center gap-2 border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Floor Area:</p>
                    <p class="property-area text-stone-600">${
                      property.floorarea
                    } sqm</p>
                  </div>
                  <div
                    class="content flex items-center gap-2 border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Bedrooms:</p>
                    <p class="bedroom-info text-stone-600">
                      <span class="number-of-beds">${
                        property?.bedrooms ?? "No"
                      }</span>
                    </p>
                  </div>
                  <div
                    class="content flex items-center gap-2 border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Toilet & Bath:</p>
                    <p class="bathroom-info text-stone-600">
                      <span class="number-of-baths">${
                        property?.bathrooms ?? "No"
                      }</span>
                    </p>
                  </div>
                   <div
                    class="content flex items-center gap-2 border border-x-0 border-t-0 py-3"
                  >
                    <p class="font-medium text-stone-950">Car Garage:</p>
                    <p class="property-area text-stone-600">${
                      property.garage
                    }</p>
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

  _setPropertyVideo(videoData) {
    if (!videoData) {
      return;
    }
    
    const videoWrap = this.#videoSection.querySelector(".property-video-wrap");
    if (!videoWrap) {
      return;
    }
    
    let url;
    
    // Handle both direct URL string and reference object structures
    if (typeof videoData === 'string') {
      url = videoData;
    } else if (videoData.fields && videoData.fields.url) {
      url = videoData.fields.url;
    } else if (videoData.fields) {
      // Try to find any URL-like field
      const potentialUrlFields = Object.keys(videoData.fields).filter(key => 
        typeof videoData.fields[key] === 'string' && 
        (videoData.fields[key].includes('youtube.com') || 
         videoData.fields[key].includes('youtu.be'))
      );
      
      if (potentialUrlFields.length > 0) {
        url = videoData.fields[potentialUrlFields[0]];
      }
    }
    
    if (!url) {
      return;
    }
    
    // Check if it's a YouTube URL
    if (this._isYouTubeUrl(url)) {
      const embedUrl = this._getYouTubeEmbedUrl(url);
      
      videoWrap.innerHTML = `
        <div class="aspect-w-16">
          <iframe 
            src="${embedUrl}" 
            class="w-full h-full rounded-lg"
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
        ${videoData.fields?.description ? `<p class="text-sm text-stone-600 mt-2">${videoData.fields.description}</p>` : ''}
      `;
    } else {
      // Handle direct video file
      videoWrap.innerHTML = `
        <video 
          controls 
          class="w-full rounded-lg max-h-[600px]"
          poster="${videoData.fields?.thumbnail?.fields?.file?.url || ''}"
        >
          <source src="${url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        ${videoData.fields?.description ? `<p class="text-sm text-stone-600 mt-2">${videoData.fields.description}</p>` : ''}
      `;
    }
  }

  _isYouTubeUrl(url) {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  _getYouTubeEmbedUrl(url) {
    let videoId = '';
    
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split('?')[0];
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
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

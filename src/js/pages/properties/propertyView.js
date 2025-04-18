import { client } from "../../utils/contentfulApi";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { _hideLoader, _showLoader } from "../../components/loaderfn";

class PropertyView {
  #urlParams = new URLSearchParams(window.location.search);
  #slug = this.#urlParams.get("slug");
  #Topsection = document.querySelector(".property-view-section");
  #bottomSection = document.querySelector(".property-gallery-section");
  #videoSection = document.querySelector(".property-video-section");
  #mapsSection = document.querySelector(".property-maps-section");
  #loanCalculatorSection = document.querySelector(".loan-calculator-section");
  #fullscreenOverlay = document.querySelector(".fullscreen-overlay");
  #fullscreenImage = document.querySelector(".fullscreen-image");
  #fullscreenCaption = document.querySelector(".fullscreen-caption");
  #fullscreenImages = []; // Will store all images for fullscreen navigation
  #currentFullscreenIndex = 0;
  #fullscreenSource = ''; // To track which carousel is active in fullscreen ('gallery' or 'maps')

  constructor() {
    this._validateAndFetchSlug();
    this._setupFullscreenEvents();
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
    this._initializeLoanCalculator(property.fields.price);
  }

  _generateMarkup(property) {
    const container = this.#Topsection.querySelector(
      ".property-view-container"
    );
    const galleryWrap = this.#bottomSection.querySelector(
      ".property-gallery-wrap"
    );
    const pageTitle = document.querySelector("title");

    if (!container || !galleryWrap) return;

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
    
    // Generate gallery carousel markup
    this._createPropertyGallery(property.fields.propertyGallery);
    
    // Initialize the gallery carousel
    this._initializeGalleryCarousel();
    
    // Handle maps if exists
    if (property.fields.propertyMaps && property.fields.propertyMaps.length) {
      try {
        this._createPropertyMaps(property.fields.propertyMaps);
        this._initializeMapsCarousel();
        this.#mapsSection.classList.remove("hidden");
      } catch (err) {
        console.error("Error loading maps:", err);
        this.#mapsSection.classList.add("hidden");
      }
    } else {
      this.#mapsSection.classList.add("hidden");
    }
    
    pageTitle.innerHTML = `${property.fields.title} - MJDC Realty`;
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
        <div class="video-container flex justify-center">
          <video 
            controls 
            class="rounded-lg"
            poster="${videoData.fields?.thumbnail?.fields?.file?.url || ''}"
          >
            <source src="${url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
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

  _createPropertyGallery(galleryItems) {
    if (!galleryItems || !galleryItems.length) return;
    
    const mainCarouselList = document.querySelector('#main-carousel .splide__list');
    const thumbnailCarouselList = document.querySelector('#thumbnail-carousel .splide__list');
    
    if (!mainCarouselList || !thumbnailCarouselList) return;
    
    // Clear previous content
    mainCarouselList.innerHTML = '';
    thumbnailCarouselList.innerHTML = '';
    
    // Generate slides for both main and thumbnail carousels
    galleryItems.forEach((item, index) => {
      const { description, file } = item.fields;
      
      // Main carousel slide with data attributes for fullscreen
      mainCarouselList.innerHTML += `
        <li class="splide__slide">
          <img 
            src="${file.url}" 
            alt="${description || 'Property image'}" 
            loading="lazy"
            data-index="${index}" 
            data-source="gallery"
            class="fullscreen-trigger" 
          />
        </li>
      `;
      
      // Thumbnail carousel slide
      thumbnailCarouselList.innerHTML += `
        <li class="splide__slide">
          <img src="${file.url}" alt="${description || 'Property thumbnail'}" loading="lazy" />
        </li>
      `;
    });

    // Add click event listeners after a small delay to ensure DOM is ready
    setTimeout(() => this._setupFullscreenTriggers('gallery'), 200);
  }

  _createPropertyMaps(mapItems) {
    if (!mapItems || !mapItems.length) return;
    
    const mainCarouselList = document.querySelector('#maps-main-carousel .splide__list');
    const thumbnailCarouselList = document.querySelector('#maps-thumbnail-carousel .splide__list');
    
    if (!mainCarouselList || !thumbnailCarouselList) return;
    
    // Clear previous content
    mainCarouselList.innerHTML = '';
    thumbnailCarouselList.innerHTML = '';
    
    // Generate slides for both main and thumbnail carousels
    mapItems.forEach((item, index) => {
      const { description, file } = item.fields;
      
      // Main carousel slide with data attributes for fullscreen
      mainCarouselList.innerHTML += `
        <li class="splide__slide">
          <img 
            src="${file.url}" 
            alt="${description || 'Property map'}" 
            loading="lazy"
            data-index="${index}" 
            data-source="maps"
            class="fullscreen-trigger" 
          />
        </li>
      `;
      
      // Thumbnail carousel slide
      thumbnailCarouselList.innerHTML += `
        <li class="splide__slide">
          <img src="${file.url}" alt="${description || 'Map thumbnail'}" loading="lazy" />
        </li>
      `;
    });

    // Add click event listeners after a small delay to ensure DOM is ready
    setTimeout(() => this._setupFullscreenTriggers('maps'), 200);
  }

  _setupFullscreenEvents() {
    if (!this.#fullscreenOverlay) return;

    // Close button event
    const closeButton = this.#fullscreenOverlay.querySelector(".fullscreen-close");
    if (closeButton) {
      closeButton.addEventListener("click", this._closeFullscreen.bind(this));
    }

    // Navigation buttons events
    const prevButton = this.#fullscreenOverlay.querySelector(".fullscreen-prev");
    const nextButton = this.#fullscreenOverlay.querySelector(".fullscreen-next");
    
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        this._navigateFullscreen(-1);
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        this._navigateFullscreen(1);
      });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!this.#fullscreenOverlay || this.#fullscreenOverlay.style.display !== 'flex') return;
      
      if (e.key === "Escape") {
        this._closeFullscreen();
      } else if (e.key === "ArrowLeft") {
        this._navigateFullscreen(-1);
      } else if (e.key === "ArrowRight") {
        this._navigateFullscreen(1);
      }
    });
  }

  _setupFullscreenTriggers(source) {
    const selector = source === 'maps' ? '#maps-main-carousel .fullscreen-trigger' : '#main-carousel .fullscreen-trigger';
    const triggers = document.querySelectorAll(selector);
    
    triggers.forEach(img => {
      img.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const imgSource = e.target.dataset.source;
        this._openFullscreen(index, imgSource);
      });
    });
  }

  _openFullscreen(index, source) {
    if (!this.#fullscreenOverlay || !this.#fullscreenImage) return;
    
    this.#fullscreenSource = source;
    this.#currentFullscreenIndex = index;
    
    // Get all images from the appropriate carousel
    const selector = source === 'maps' ? '#maps-main-carousel .splide__slide img' : '#main-carousel .splide__slide img';
    const images = document.querySelectorAll(selector);
    
    // Store image sources and captions for navigation
    this.#fullscreenImages = Array.from(images).map(img => ({
      src: img.src,
      alt: img.alt
    }));
    
    // Set the current image
    if (this.#fullscreenImages[index]) {
      this.#fullscreenImage.src = this.#fullscreenImages[index].src;
      this.#fullscreenCaption.textContent = this.#fullscreenImages[index].alt;
    }
    
    // Show the overlay
    this.#fullscreenOverlay.style.display = 'flex';
    
    // Prevent body scrolling while fullscreen is active
    document.body.style.overflow = 'hidden';
  }

  _navigateFullscreen(direction) {
    if (!this.#fullscreenImages.length) return;
    
    // Calculate the new index with wrapping
    this.#currentFullscreenIndex = (this.#currentFullscreenIndex + direction + this.#fullscreenImages.length) % this.#fullscreenImages.length;
    
    // Update image and caption
    const currentImage = this.#fullscreenImages[this.#currentFullscreenIndex];
    this.#fullscreenImage.src = currentImage.src;
    this.#fullscreenCaption.textContent = currentImage.alt;
  }

  _closeFullscreen() {
    if (!this.#fullscreenOverlay) return;
    
    // Hide the overlay
    this.#fullscreenOverlay.style.display = 'none';
    
    // Restore body scrolling
    document.body.style.overflow = '';
  }

  _initializeGalleryCarousel() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
      const initCarousels = () => {
        // Create the main carousel
        const mainCarousel = new Splide('#main-carousel', {
          type: 'slide',
          perPage: 1,
          perMove: 1,
          gap: 10,
          padding: { left: 0, right: 0 },
          rewind: true,
          pagination: true,
          arrows: true,
          lazyLoad: 'sequential',
          heightRatio: 0.6,
          breakpoints: {
            768: {
              heightRatio: 0.5,
              padding: { left: 0, right: 0 }
            }
          }
        });
        
        // Create the thumbnail carousel
        const thumbnailCarousel = new Splide('#thumbnail-carousel', {
          fixedWidth: 80,
          fixedHeight: 60,
          gap: 10,
          rewind: true,
          pagination: false,
          isNavigation: true,
          arrows: true,
          focus: 'center',
          breakpoints: {
            768: {
              fixedWidth: 60,
              fixedHeight: 45
            }
          }
        });
        
        // Set up syncing between the main carousel and thumbnails
        mainCarousel.sync(thumbnailCarousel);
        
        // Mount the carousels
        mainCarousel.mount();
        thumbnailCarousel.mount();
      };
      
      // Initialize carousels
      if (document.querySelector('#main-carousel')) {
        initCarousels();
      }
    });
    
    // Also initialize immediately in case DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(() => {
        if (document.querySelector('#main-carousel')) {
          // Create the main carousel
          const mainCarousel = new Splide('#main-carousel', {
            type: 'slide',
            perPage: 1,
            perMove: 1,
            gap: 10,
            padding: { left: 0, right: 0 },
            rewind: true,
            pagination: true,
            arrows: true,
            lazyLoad: 'sequential',
            heightRatio: 0.6,
            breakpoints: {
              768: {
                heightRatio: 0.5,
                padding: { left: 0, right: 0 }
              }
            }
          });
          
          // Create the thumbnail carousel
          const thumbnailCarousel = new Splide('#thumbnail-carousel', {
            fixedWidth: 80,
            fixedHeight: 60,
            gap: 10,
            rewind: true,
            pagination: false,
            isNavigation: true,
            arrows: true,
            focus: 'center',
            breakpoints: {
              768: {
                fixedWidth: 60,
                fixedHeight: 45
              }
            }
          });
          
          // Set up syncing between the main carousel and thumbnails
          mainCarousel.sync(thumbnailCarousel);
          
          // Mount the carousels
          mainCarousel.mount();
          thumbnailCarousel.mount();
        }
      }, 100);
    }
  }
  
  _initializeMapsCarousel() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
      const initMapsCarousels = () => {
        // Create the main maps carousel
        const mainMapsCarousel = new Splide('#maps-main-carousel', {
          type: 'slide',
          perPage: 1,
          perMove: 1,
          gap: 10,
          padding: { left: 0, right: 0 },
          rewind: true,
          pagination: true,
          arrows: true,
          lazyLoad: 'sequential',
          heightRatio: 0.6,
          breakpoints: {
            768: {
              heightRatio: 0.5,
              padding: { left: 0, right: 0 }
            }
          }
        });
        
        // Create the thumbnail maps carousel
        const thumbnailMapsCarousel = new Splide('#maps-thumbnail-carousel', {
          fixedWidth: 80,
          fixedHeight: 60,
          gap: 10,
          rewind: true,
          pagination: false,
          isNavigation: true,
          arrows: true,
          focus: 'center',
          breakpoints: {
            768: {
              fixedWidth: 60,
              fixedHeight: 45
            }
          }
        });
        
        // Set up syncing between the main carousel and thumbnails
        mainMapsCarousel.sync(thumbnailMapsCarousel);
        
        // Mount the carousels
        mainMapsCarousel.mount();
        thumbnailMapsCarousel.mount();
      };
      
      // Initialize maps carousels
      if (document.querySelector('#maps-main-carousel')) {
        initMapsCarousels();
      }
    });
    
    // Also initialize immediately in case DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(() => {
        if (document.querySelector('#maps-main-carousel')) {
          // Create the main maps carousel
          const mainMapsCarousel = new Splide('#maps-main-carousel', {
            type: 'slide',
            perPage: 1,
            perMove: 1,
            gap: 10,
            padding: { left: 0, right: 0 },
            rewind: true,
            pagination: true,
            arrows: true,
            lazyLoad: 'sequential',
            heightRatio: 0.6,
            breakpoints: {
              768: {
                heightRatio: 0.5,
                padding: { left: 0, right: 0 }
              }
            }
          });
          
          // Create the thumbnail maps carousel
          const thumbnailMapsCarousel = new Splide('#maps-thumbnail-carousel', {
            fixedWidth: 80,
            fixedHeight: 60,
            gap: 10,
            rewind: true,
            pagination: false,
            isNavigation: true,
            arrows: true,
            focus: 'center',
            breakpoints: {
              768: {
                fixedWidth: 60,
                fixedHeight: 45
              }
            }
          });
          
          // Set up syncing between the main carousel and thumbnails
          mainMapsCarousel.sync(thumbnailMapsCarousel);
          
          // Mount the carousels
          mainMapsCarousel.mount();
          thumbnailMapsCarousel.mount();
        }
      }, 100);
    }
  }
  
  _initializeLoanCalculator(propertyPrice) {
    // Extract numeric value from the price string
    if (!propertyPrice) return;
    
    const priceValue = this._extractNumericPrice(propertyPrice);
    
    if (priceValue > 0) {
      // Set the contract price in the calculator
      const contractPriceInput = document.getElementById('contract_price');
      if (contractPriceInput) {
        contractPriceInput.value = priceValue;
      }
      
      // Setup calculator event listeners
      this._setupLoanCalculator();
      
      // Show the calculator section
      this.#loanCalculatorSection.classList.remove('hidden');
    } else {
      // Hide the calculator if we can't get a valid price
      this.#loanCalculatorSection.classList.add('hidden');
    }
  }
  
  _extractNumericPrice(priceString) {
    if (!priceString) return 0;
    
    // Extract only digits from the price string
    const numericValue = priceString.replace(/[^\d]/g, '');
    
    // Parse as integer and then divide by 100 to handle the cents
    // (since the last 2 digits represent cents)
    return numericValue ? parseFloat(numericValue) / 100 : 0;
  }
  
  _setupLoanCalculator() {
    // Add the global calculator function
    window.calculateLoan = function() {
      let contractPrice = parseFloat(document.getElementById('contract_price').value) || 0;
      let showSpecial = document.getElementById('toggle_special_discount').checked;
      let showAdditional = document.getElementById('toggle_additional_discount').checked;

      let specialDiscount = showSpecial ? parseFloat(document.getElementById('special_Input_Discount').value) || 0 : 0;
      let discount = showAdditional ? parseFloat(document.getElementById('additional_Input_Discount').value) || 0 : 0;

      let downpaymentPercent = parseFloat(document.getElementById('downpayment_percent').value) || 0;
      let reservationFee = parseFloat(document.getElementById('reservation_fee').value) || 0;
      let months = parseInt(document.getElementById('months').value) || 1;
      let years = parseInt(document.getElementById('years').value) || 1;
      let interestRate = parseFloat(document.getElementById('interest_rate').value) / 100 || 0;

      let netContractPrice = contractPrice - specialDiscount;
      let downpaymentAmount = netContractPrice * (downpaymentPercent / 100);
      let netDownpayment = downpaymentAmount - reservationFee - discount;
      let monthlyDownpayment = netDownpayment / months;
      let balance = netContractPrice - downpaymentAmount;

      let monthlyInterestRate = interestRate / 12;
      let nper = years * 12;
      let monthlyFinancing = (monthlyInterestRate > 0)
          ? (balance * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -nper))
          : (balance / nper);

      // Update UI with formatted values
      document.getElementById('result_contract_price').innerText = contractPrice.toLocaleString();
      document.getElementById('special_discount_display').innerText = specialDiscount.toLocaleString();
      document.getElementById('discount_display').innerText = discount.toLocaleString();
      document.getElementById('net_contract_price').innerText = netContractPrice.toLocaleString();
      document.getElementById('downpayment').innerText = downpaymentAmount.toLocaleString();
      document.getElementById('reservation_fee_display').innerText = reservationFee.toLocaleString();
      document.getElementById('net_downpayment').innerText = netDownpayment.toLocaleString();
      document.getElementById('monthly_downpayment').innerText = monthlyDownpayment.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      document.getElementById('balance').innerText = balance.toLocaleString();
      document.getElementById('monthly_financing').innerText = monthlyFinancing.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      document.getElementById('months_display').innerText = months;
      document.getElementById('years_display').innerText = years;
      document.getElementById('dp_percent').innerText = downpaymentPercent + "%";
      document.getElementById('balance_percent').innerText = (100 - downpaymentPercent) + "%";

      // Show/hide breakdown rows
      document.getElementById('special_discount_row').style.display = showSpecial ? 'block' : 'none';
      document.getElementById('additional_discount_row').style.display = showAdditional ? 'block' : 'none';
    };

    // Initialize toggle controls
    const toggleSpecial = document.getElementById('toggle_special_discount');
    const toggleAdditional = document.getElementById('toggle_additional_discount');
    const specialInputWrap = document.getElementById('special_discount_input_wrap');
    const additionalInputWrap = document.getElementById('additional_discount_input_wrap');

    if (toggleSpecial) {
      toggleSpecial.addEventListener('change', () => {
        specialInputWrap.style.display = toggleSpecial.checked ? 'block' : 'none';
        calculateLoan();
      });
    }

    if (toggleAdditional) {
      toggleAdditional.addEventListener('change', () => {
        additionalInputWrap.style.display = toggleAdditional.checked ? 'block' : 'none';
        calculateLoan();
      });
    }
    
    // Run initial calculation
    calculateLoan();
  }
}

const currentPropertyView = new PropertyView();

import { client } from "../../utils/contentfulApi";
import { _showLoader, _hideLoader } from "../../components/loaderfn";

class AgentView {
  #urlParams = new URLSearchParams(window.location.search);
  #slug = this.#urlParams.get("slug");
  #section = document.querySelector(".agent-profile-section");

  constructor() {
    this._validateAndFetchSlug();
  }

  _validateAndFetchSlug() {
    if (!this.#slug) {
      window.location = "../../../pages/page-not-found.html";
      return;
    }

    this._fetchAgentData();
  }

  async _fetchAgentData() {
    _showLoader();

    try {
      const entries = await client.getEntries();

      if (!entries) {
        _hideLoader();
        return;
      }

      const agentProfile = entries.items.find((entry) => {
        return entry.fields.slug === this.#slug;
      });

      this._renderAgentProfile(agentProfile);
    } catch (error) {
      window.location = "../../../pages/page-not-found.html";
    } finally {
      _hideLoader();
    }
  }

  _renderAgentProfile(agent) {
    if (!agent) {
      window.location = "../../../pages/page-not-found.html";
      return;
    }

    _hideLoader();
    this._generateMarkup(agent);
  }

  _generateMarkup(agent) {
    const container = this.#section.querySelector(
      ".agent-profile-overview-wrapp"
    );
    const pageTitle = document.querySelector("title");
    const heading = this.#section.querySelector("h1");

    if (!container) return;

    container.innerHTML = this._createAgentInfo(agent.fields);
    heading.innerHTML = agent.fields.name;
    pageTitle.innerHTML = `${agent.fields.name} - Roofly Agent`;
  }

  _createAgentInfo(agent) {
    return `
        <div class="agent-info-wrap p-5 bg-white md:p-6 rounded-lg 
             md:max-w-[300px] lg:max-w-[380px] border flex flex-col">

            <div class="agent-profile-pic">
              <img
                src="${agent?.profilePic.fields.file.url}"
                alt="${agent.name}"
                class="rounded-lg"
              />
            </div>

            <div class="agent-data my-8">
              <p class="address py-2 flex justify-between 
                 border border-x-0 border-t-0 font-medium text-stone-600">

                Address <span class="font-normal text-sm">${
                  agent.location
                }</span>

              </p>

              <p class="phone py-2 flex justify-between border 
                 border-x-0 border-t-0 font-medium text-stone-600">

                Phone <span class="font-normal text-sm">${agent.phone}</span>

              </p>

              <p class="email py-2 flex justify-between border 
                 border-x-0 border-t-0 font-medium text-stone-600">

                Email<span class="font-normal text-sm">${agent.email}</span>

              </p>
            </div>

            <a href="../pages/contact-us.html"
              class="collobrate-btn uppercase bg-zinc-950 text-white w-full 
              text-center p-3 rounded-lg border border-black hover:bg-transparent 
              hover:text-stone-950 transition duration-500 ease-in-out">

              Collaborate now</a>

        </div>
        ${this._createAgentListedProerty(agent)}`;
  }

  _createAgentListedProerty(agent) {
    const property = agent?.listedProperty?.fields;

    if (!property) return "";

    const markup = `
        <div class="properties-list flex flex-col 
                gap-8 md:flex-row md:flex-wrap" data-propertyList="list">

            <div class="properties-card">
              <a href="../../../pages/property-view.html?slug=${property.slug}" class="property-item-link">
                <div class="property-card-top">
                  <img
                    src="${property?.thumbnail.fields.file.url}"
                    alt="${property?.thumbnail.fields.description}"
                    class="property-card-img"
                  />
                  <span class="status-tag">${property.status}</span>
                </div>
                <div class="property-card-bottom">
                  <div
                    class="property-card-data flex justify-between gap-3 py-2"
                  >
                    <p class="property-name font-body text-stone-950 text-xl">
                      ${property.title}
                    </p>
                    <p class="property-price text-stone-950">${property.price}</p>
                  </div>
                  <div class="property-location text-stone-800 text-sm">
                    ${property.city}, ${property.country}
                  </div>
                </div>
              </a>
            </div>
          </div>
    `;

    return markup;
  }
}

const currentAgentProfile = new AgentView();

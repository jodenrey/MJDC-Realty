export function agentCardMarkup(name, bio, phone, email, profilePic, slug) {
  return `
    <a href="/pages/agent-profile.html?slug=${slug}" class="agent-profile-link flex flex-col">

    <div class="agent-header">
      <img
        src="${profilePic?.fields.file.url}"
        alt="${name}"
        loading="lazy"
        class="agent-image"
      />
    </div>

        <div class="agent-details p-5 flex flex-col gap-5 justify-between">

            <div class="agent-info-wrap">
                <p class="agent-name font-medium text-xl text-stone-950 lg:text-2xl">
                                ${name}</p>

                <p class="text-sm text-stone-600 my-2 lg:text-base">${bio}</p>

            </div>

            <div class="agent-contact">

            <p class="flex items-center gap-3 my-3 text-sm text-stone-600 lg:text-base">
                    <i class="fa-solid fa-envelope"></i>${email}</p>

            <p class="flex items-center gap-3 mt-3 text-sm text-stone-600 lg:text-base">
                    <i class="fa-solid fa-phone"></i>${phone}</p>
            </div>
        </div>
    </a>`;
}

export function propertyCardMarkup(
  title,
  thumbnail,
  status,
  price,
  city,
  country,
  slug
) {
  return `
     <a href="/pages/property-view.html?slug=${slug}" class="property-item-link">

    <div class="property-card-top">
      
    <img
        src="${thumbnail?.fields.file.url}"
        alt="${thumbnail?.fields.description}"
        loading="lazy"
        class="property-card-img"
      />

        <span class="status-tag">${status}</span>
    </div>

        <div class="property-card-bottom">
            <div class="property-card-data flex justify-between gap-3 py-2">
                <p class="property-name font-body text-stone-950 text-xl">${title}</p>
                <p class="property-price text-stone-950">${price}</p>
        </div>

        <div class="property-location text-stone-800 text-sm">${city}, ${country}</div>
    </div>

    </a>`;
}

export function blogCardMarkup(
  title,
  featuredImage,
  publishedDate,
  tags,
  slug,
  fn
) {
  return `
    <a href="/pages/blog-view.html?slug=${slug}" class="blog-link bg-white p-5 flex flex-col rounded-xl gap-3">
        <div class="blog-top rounded-md">
            <img
            src="${featuredImage?.fields.file.url}"
            alt="${featuredImage?.fields.description}" 
            loading="lazy"
            class="rounded-md" />
        </div>

        <div class="blog-bottom">
            <h4 class="blog-heading font-heading text-xl">
                ${title}
            </h4>

        <div class="blog-info flex items-center gap-5 my-3 text-stone-600 text-sm">

            <p class="block">${tags}</p>
                <hr class="sepration-line" />
            <p class="blog-date">${fn(publishedDate)}</p>

      </div>
    </div>

    <button class="blog-read-more w-max uppercase font-heading text-sm text-stone-800">
      <i class="fa-solid fa-arrow-right-long mr-3"></i> Read More </button>

    </a>
    `;
}

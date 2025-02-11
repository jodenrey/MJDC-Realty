import { client } from "../../utils/contentfulApi";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { _showLoader, _hideLoader } from "../../components/loaderfn";

class BlogView {
  #urlParams = new URLSearchParams(window.location.search);
  #slug = this.#urlParams.get("slug");
  #section = document.querySelector(".blog-view-section");
  #article = document.querySelector("article");

  constructor() {
    this._validateAndFetchSlug();
  }

  _validateAndFetchSlug() {
    if (!this.#slug) {
      window.location = "../../../pages/page-not-found.html";
      return;
    }
    this._fetchBlogDataEntry();
  }

  async _fetchBlogDataEntry() {
    _showLoader();

    try {
      const entries = await client.getEntries();

      if (!entries) {
        _hideLoader();
        return;
      }

      const blogData = entries.items.find(
        (entry) => entry.fields.slug === this.#slug
      );

      this._renderBlogDetails(blogData);
    } catch (error) {
      window.location = "../../../pages/page-not-found.html";
    } finally {
      _hideLoader();
    }
  }

  _renderBlogDetails(blogs) {
    if (!blogs) {
      window.location = "../../../pages/page-not-found.html";
      return;
    }

    _hideLoader();
    this._generateMarkup(blogs);
  }

  _generateMarkup(blogs) {
    const blogContainer = this.#section.querySelector(".blog-view-container");
    const blogArticle = this.#article.querySelector(".blog-article-container");
    const pageTitle = document.querySelector("title");

    if (!blogContainer) return;

    blogContainer.innerHTML = this._createBlogsInfo(blogs.fields);
    blogArticle.innerHTML = this._createBlogArticle(blogs.fields);
    pageTitle.innerHTML = `${blogs.fields.title} - Roofly Blogs`;
  }

  _createBlogsInfo(blogs) {
    return `
    <div class="blog-title-wrap">
        <h1
            class="text-center text-4xl leading-[40px] md:text-5xl font-heading 
            md:leading-[55px] text-stone-950 max-w-[800px] mx-auto">
            ${blogs.title}
        </h1>

        <p class="blog-info flex tracking-wide items-center 
            justify-center my-3 gap-3 text-stone-600 text-sm">
            <span class="blog-type">${blogs.tags}</span>
            <span class="sepration-line"></span>
            <span class="blog-published-date">
            ${this._convertBlogPostDate(blogs.publishedDate)}</span>
        </p>
    </div>

    <div class="blog-img-wrap max-w-[1220px] mx-auto mt-10">

      <img src="${blogs?.featuredImage.fields.file.url}" alt="${
      blogs.featuredImage?.fields.description
    }" class="rounded-md  w-full" />

    </div>
    `;
  }

  _convertBlogPostDate(publishedDate) {
    const date = new Date(publishedDate);

    return date.toDateString().split(" ").slice(1).join(" ");
  }

  _createBlogArticle(blog) {
    return `
    <div class="blogs-article-wrap max-w-[950px] mx-auto">
        ${this._renderRichText(blog.content)}
    </div>
    `;
  }

  _renderEmbededAssets() {
    const options = {
      renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
          if (!node.data.target || !node.data.target.fields) return "";
          const { file, description } = node.data.target.fields;
          return `
              <div class="embedded-asset mx-auto my-10 w-[full]">
                <img src="${file.url}" alt="${
            description || "Embedded asset"
          }" class="rounded-md  w-full h-full object-cover" />
              </div>`;
        },
      },
    };

    return options;
  }

  _renderRichText(richTextField) {
    if (!richTextField || !richTextField.nodeType) {
      console.error("Invalid rich text field");
      return "";
    }
    return documentToHtmlString(richTextField, this._renderEmbededAssets());
  }
}

const currentBlogView = new BlogView();

import BlogCardManager from "../../components/manager/blogCardManager";

class FeaturedBlogCards extends BlogCardManager {
  constructor() {
    super();
    this._featuredBlogData();
  }

  async _featuredBlogData() {
    const featureBlogs = await this._fetchEntries(0, 2, "sys.createdAt");

    if (!featureBlogs) {
      return;
    }

    this._renderFeaturedBlogs(featureBlogs);
  }

  _renderFeaturedBlogs(data) {
    const blogCardContainer = document.querySelector(".blog-card-container");

    if (!blogCardContainer) {
      return;
    }

    blogCardContainer.innerHTML = this._renderBlogCard(data);
  }
}

export const featuredBlogCards = new FeaturedBlogCards();

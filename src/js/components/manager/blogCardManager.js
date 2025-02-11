import { client } from "../../utils/contentfulApi";
import { blogCardMarkup } from "../../utils/markupGenerator";

export default class BlogCardManager {
  constructor() {}

  async _fetchEntries(skipNum, limitNum, orderby) {
    const entries = await client.getEntries({
      skip: skipNum,
      limit: limitNum,
      content_type: "blogPost",
      order: orderby,
    });

    if (!entries) {
      return;
    }

    const blogData = entries;
    return blogData;
  }

  _renderBlogCard(data) {
    if (!data) {
      return;
    }

    const render = data.items
      .map((post) => {
        const { title, featuredImage, publishedDate, tags, slug } = post.fields;

        return `<div class='blog-card'>
              ${blogCardMarkup(
                title,
                featuredImage,
                publishedDate,
                tags,
                slug,
                this._convertBlogpostDate
              )}
              </div>`;
      })
      .join("");

    return render;
  }

  _convertBlogpostDate(publishedDate) {
    const date = new Date(publishedDate);

    return date.toDateString().split(" ").slice(1).join(" ");
  }
}

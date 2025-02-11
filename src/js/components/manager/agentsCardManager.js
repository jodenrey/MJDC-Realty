import { client } from "../../utils/contentfulApi";
import { agentCardMarkup } from "../../utils/markupGenerator";

export default class AgentCardManager {
  constructor() {}

  async _fetchEnries() {
    const entries = await client.getEntries({
      content_type: "agentProfile",
    });

    if (!entries) return;

    const agentData = entries;

    return agentData;
  }

  _renderAgentCards(data) {
    if (!data) {
      return;
    }

    const render = data.items
      .map((post) => {
        const { name, bio, phone, email, profilePic, slug } = post.fields;

        return `<div class='agent-card'>
                ${agentCardMarkup(name, bio, phone, email, profilePic, slug)}
                </div>`;
      })
      .join("");

    return render;
  }
}

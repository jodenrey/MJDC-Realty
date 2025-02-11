import AgentCardManager from "../../components/manager/agentsCardManager";

class agentCardView extends AgentCardManager {
  constructor() {
    super();

    this._fetchAgenData();
  }

  async _fetchAgenData() {
    const entries = await this._fetchEnries();

    this._displayAgentCards(entries);
  }

  _displayAgentCards(data) {
    const container = document.querySelector(".agent-card-container");

    if (!container) return;

    container.innerHTML = this._renderAgentCards(data);
  }
}

const agentCards = new agentCardView();

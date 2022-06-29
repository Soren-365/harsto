import api from "../lib/http-common";

export default new (class Debug {
  debug(query) {
    return api.post("crawler/debugger", query);
  }

  readCrawlResults(query) {
    return api.post("crawler/debugger/read", query);
  }
})();

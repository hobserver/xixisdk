import LocalDb from "xixisdk/src/LocalDb"
import OnlineDb from "xixisdk/src/OnlineDb";
export default {
    getLocalSite(siteId: string) {
        return new LocalDb(siteId);
    },
    getOnlineSite(siteId: string) {
      return new OnlineDb(siteId, {});
    }
}

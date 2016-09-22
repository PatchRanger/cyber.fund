var cfCDs = CF.CurrentData .selectors;
var ns = CF.UserAssets;

var tableData = CF.Accounts.portfolioTableData;

Meteor.startup(function(){
  CF.Utils._session.default("folioWidgetSort", {"f|byValue": -1});
});

Template["portfolioWidgetTable"].helpers({
  values: function (obj) {
    return _.values(obj || {});
  },
  tableData: function(){

  },
  pSystems: function () { //  systems to display in portfolio table, including 'starred' systems
    var accounts = CF.Accounts.userProfileData();
    //Template.instance().data && Template.instance().data.accountsData;
    var systems = ns.getSystemsFromAccountsObject(accounts);

    if (Blaze._globalHelpers.isOwnAssets()) {
      var user = Meteor.user();
      var stars = user.profile.starredSystems;
      if (stars && stars.length) {
        systems = _.uniq(_.union(systems, stars));
      }
    }

    var sort = {
      // sort portfolio items by their cost, from higher to lower.
      // return -1 if x > y; return 1 if y > x
      byValue: function (x, y) {
        var q1 = ns.getQuantitiesFromAccountsObject(accounts, x._id);
        var q2 = ns.getQuantitiesFromAccountsObject(accounts, y._id);
        return Math.sign(q2 * CF.CurrentData.getPrice(y) - q1 * CF.CurrentData.getPrice(x)) || Math.sign(q2 - q1);
      },
      byAmount: function (x, y) {
        var q1 = ns.getQuantitiesFromAccountsObject(accounts, x._id);
        var q2 = ns.getQuantitiesFromAccountsObject(accounts, y._id);
        return Math.sign(q2 - q1);
      },
      byEquity: function (x, y) {
        var q1 = (x.metrics && x.metrics.supply) ?
          ns.getQuantitiesFromAccountsObject(accounts, x._id)/ x.metrics.supply : 0;
        var q2 = (y.metrics && y.metrics.supply) ?
          ns.getQuantitiesFromAccountsObject(accounts, y._id) / y.metrics.supply: 0;

        return Math.sign(q2 - q1);
      }
    };

    // for sorter values, see template file. 'f|' is for sorting by system field
    // like "by daily price change", no prefix is for using some sort function
    // from above
    var sorter = CF.Utils._session.get("folioWidgetSort"),
      _sorter = sorter && _.isObject(sorter) && _.keys(sorter) && _.keys(sorter)[0],
      _split = (_sorter || "").split("|");

    if (_sorter && _split) {
      if (_split.length == 2 && _split[0] == "f") {
        var r = CurrentData.find(cfCDs.system(systems))
          .fetch()
          .sort(sort[_split[1]]);

        var val = sorter && _.isObject(sorter) && _.values(sorter)
          && _.values(sorter)[0];
        if (val == 1) r = r.reverse();
        return r;
      }
      return CurrentData.find(cfCDs.system(systems), {sort: sorter});
    }

    return CurrentData.find(cfCDs.system(systems))
      .fetch().sort(sort.byValue);
  },
  chartData: function () {
    return  CF.Accounts.userProfileData();
  },
  quantity: function () {
    var system = this;
    if (!system._id) return NaN;
    var accounts =  CF.Accounts.userProfileData();

    return ns.getQuantitiesFromAccountsObject(accounts, system._id);
  },
  btcCost: function () {
    var system = this;
    var r= tableData();
    return r && r[system._id] && r[system._id].vBtc;
    if (!system.metrics || !system.metrics.price || !system.metrics.price.btc) return "no btc price found..";

    var accounts =  CF.Accounts.userProfileData();
    return (ns.getQuantitiesFromAccountsObject(
      accounts, system._id) * system.metrics.price.btc);
  },
  usdCost: function () {
    var system = this;
    var r= tableData();
    return (r && r[system._id] && r[system._id].vUsd);
    if (!system.metrics || !system.metrics.price || !system.metrics.price.usd) return "no usd price found..";
    var accounts = CF.Accounts.userProfileData();

    return (ns.getQuantitiesFromAccountsObject(
        accounts, system._id) * system.metrics.price.usd);
  },
  name_of_system: function () {
    return this._id;
  },
  equity: function () {
    var system = this;
    var q = 0.0;
    var r = tableData();
    //var accounts = CF.Accounts.userProfileData();

    if (system._id && r[system._id]) {
      q = r[system._id] && r[system._id].quantity || 0; //]ns.getQuantitiesFromAccountsObject(accounts, system._id);
    }
    if (system.metrics && system.metrics.supply) {
      q = 10000 * q / system.metrics.supply;
    }
    else {
      q = 0.0;
    }
    return q;
  },
  share: function () {
    var system = this;
    var r = tableData();
    if (system._id && r[system._id]) {
      var vBtc = r[system._id].vBtc;

      var sum = _.reduce(_.map(r, function(it){
        return it.vBtc;
      }), function(memo, num){ return memo + num; }, 0);

      return vBtc / sum;
    }
    return 0;
  },
  usdPrice: function () {
    var prices = CF.CurrentData.getPricesByDoc(this);
    return prices && prices.usd || 0;
  },
  usdPriceChange1d: function () {
    var system = this;
    if (system && system.metrics && system.metrics.priceChangePercents
      && system.metrics.priceChangePercents.day &&
      system.metrics.priceChangePercents.day.usd) {
      return system.metrics.priceChangePercents.day.usd;
    }
    return 0;
  },
  usdCap: function () {
    var system = this;
    if (system && system.metrics && system.metrics.price &&
      system.metrics.price.usd && system.metrics.supply) {
      return (system.metrics.price.usd * system.metrics.supply);
    }
    return 0;
  },
  btcPrice: function () { //TODO: use package functions here.
    var prices = CF.CurrentData.getPricesByDoc(this);
    return prices && prices.btc || 0;
  },
  btcPriceChange1d: function () {
    var system = this;
    return (system && system.metrics && system.metrics.priceChangePercents
      && system.metrics.priceChangePercents.day &&
      system.metrics.priceChangePercents.day.btc || 0);
  },
  btcCap: function () {
    var system = this;
    return (system && system.metrics && system.metrics.price &&
      system.metrics.price.btc && system.metrics.supply &&
      system.metrics.price.btc * system.metrics.supply || 0);
  },
  sorter: function (field) {
    var sorter = CF.Utils._session.get("folioWidgetSort");
    if (!_.isObject(sorter)) return "";
    if (sorter[field] == -1) return "↓ ";
    if (sorter[field] == 1) return "↑ ";
    return "";
  }
});

Template["portfolioWidgetTable"].events({
  "click th.sorter": function (e, t) {
    var newSorter = $(e.currentTarget).data("sorter");
    var sort = CF.Utils._session.get("folioWidgetSort");
    // same sorting criteria - reverse order
    if (sort[newSorter]) {
      sort[newSorter] = -sort[newSorter];
    } else {
      sort = {};
      sort[newSorter] = -1;
    }
    analytics.track("Sorted Portfolio", {
      sort: sort
    });
    CF.Utils._session.set("folioWidgetSort", sort);
  }
});

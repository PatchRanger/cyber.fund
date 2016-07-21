import get from 'oget'
/**
 * repressent string (of digits) splitting it in groups of 3, from begin
 *   to be used for string part before decimal dot
 * @param input - string to be split
 * @param sep - separator
 * @returns altered string
 */
function group3natural(input, sep) {
  while (/(\d+)(\d{3})/.test(input.toString())) {
    input = input.toString().replace(/(\d+)(\d{3})/, "$1" + (sep || ",") + "$2");
  }
  return input;
}

/**
 * repressent string (of digits) splitting it in groups of 3, from end
 *   to be used for string part after decimal dot
 * @param input - string to be split
 * @param sep - separator
 * @returns altered string
 */
function group3decimal(input, sep) {
  while (/(\d{3})(\d+)/.test(input.toString())) {
    input = input.toString().replace(/(\d{3})(\d+)/, "$1" + (sep || ",") + "$2");
  }
  return input;
}

function escapeNaN(formatter){
  return function(value){
    return isNaN(value) ? '' : formatter(value);
  }
}

const helpers = {
  /* this part is originally from cyberfund-base package */

  eq: function
    (value1, value2) {
    return value1 === value2;
  },
  neq: function (v1, v2) {
    return v1 !== v2;
  },
  gt: function (value1, value2) {
    return value1 > value2;
  },
  lt: function (value1, value2) {
    return value1 < value2;
  },
  lte: function (value1, value2) {
    return value1 <= value2;
  },
  gte: function (value1, value2) {
    return value1 >= value2;
  },
  and: function (value1, value2) {
    return value1 && value2;
  },
  not: function (value) {
    return !value;
  },
  or: function (value1, value2) {
    return value1 || value2;
  },
  contains: function (list, value) {
    return _.contains(list, value);
  },
  slice: function (list, start, end) {
    list = list || [];

    return list.slice(start, end);
  },
  keyValue: function (context) {
    return _.map(context, function (value, key) {
      return {
        key: key,
        value: value
      };
    });
  },
  sum: function (value1, value2) {
    return value1 + value2;
  },

  dif: function (v1, v2) {
    return parseInt(v1) - parseInt(v2)
  },
  cfRatingRound: function(v) {
    return Math.ceil(v);
  },
  session: function (key) {
    return Session.get(key);
  },

  concat: function (value1, value2) {
    return value1.toString() + value2.toString();
  },
  values_of: function (arr_or_obj) {
    var arr = _.clone(arr_or_obj);
    if (typeof arr == "object") {
      return $.map(arr, function (value, index) {
        return [value];
      });
    }
    return arr;
  },

  log: function (value) {
    console.log(value);
  },

  absoluteUrl: function () {
    return Meteor.absoluteUrl();
  },

  randomOf: function (from, to) {
    return from + Math.floor(Math.random() * (to - from + 1));
  },
  readableNumbers: CF.Utils.readableNumbers,
  readableN: function(input, roundTo){
    return escapeNaN(d3.format(',.'+roundTo||0+'f'))(input)
  },
  readableN0: escapeNaN(CF.Utils.formatters.readableN0),
  readableN1: escapeNaN(CF.Utils.formatters.readableN1),
  readableN2: escapeNaN(CF.Utils.formatters.readableN2),
  readableN3: escapeNaN(CF.Utils.formatters.readableN3),
  readableN4: escapeNaN(CF.Utils.formatters.readableN4),
  roundedN4: escapeNaN(CF.Utils.formatters.roundedN4),
  meaningful4: escapeNaN(CF.Utils.formatters.meaningful4),
  meaningful4Si: escapeNaN(CF.Utils.formatters.meaningful4Si),
  withSign: escapeNaN(CF.Utils.formatters.withSign),
  isNumber: function (value) {
    return _.isNumber(value)
  },
  percents: escapeNaN(CF.Utils.formatters.percents),
  percents0: escapeNaN(CF.Utils.formatters.percents0),
  percents1: escapeNaN(CF.Utils.formatters.percents1),
  percents2: escapeNaN(CF.Utils.formatters.percents2),
  percents3: escapeNaN(CF.Utils.formatters.percents3),

  isObject: function (value) {
    return _.isObject(value)
  },

  isEmpty: function (value) {
    return _.isEmpty(value)
  },

  satoshi_decimals: function (value, precision) {
    if (!precision && precision != 0) precision = 8;
    try {
      value = parseFloat(value);
    } catch (e) {

    }
    var out = value.toFixed(precision).split('.');
    var ret = "";
    if (out[0]) ret += group3natural(out[0]);
    if (out[1]) ret += "." + group3decimal(out[1], " ");
    return ret;
  },


  isBeforeNow: function (date) {
    var m = moment(date);
    return m.isBefore(moment());
  },
  isAfterNow: function (date/*, format*/) {
    var m = moment(date);
    return m.isAfter(moment());
  },
  isNowBetween: function (date1, date2/*, format*/) {
    var m1 = moment(date1),
    m2 = moment(date2);
    return moment().isBetween(m1, m2);
  },

  // days before date
  daysLeft: function (date) {
    return  moment(date).diff( moment() , 'days');
  },

  // since date
  daysPassed: function (date) {
    return  moment().diff(moment(date), 'days');
  },

  // when displaying string (e.g. CurrentData._id) as url path segment
  _toUnderscores: function (str) {
    return !!str ? str.replace(/\ /g, "_") : ''
  },

  // opposite to _toUnderscores
  _toSpaces: function (str) {
    return !!str ? str.replace(/_/g, " ") : ''
  },

  // html attribute-'friendly' string
  _toAttr: function (str) {
    return !!str ? str.replace(/\ /g, "_").replace(/\(/g, "_")
    .replace(/\)/g, "_").replace(/\./g, "_") : ''
  },
  usersCount: function () {
    return Counts.get('usersCount')
  },
  coinsCount: function(){
    return Counts.get('coinsCount');
  },
  coinsCount2: function(){
    return Counts.get('coinsCount2');
  },

  _system_type_: function(key){
    var types = {
      dapp: "Decentralized application"
    };
    return types[key] || key;
  },
  _specs_: function (key) {
    var specs = {
      block_time: "Target Block Time, seconds",
      rpc: "RPC Port",
      block_reward: "Block Reward",
      halfing_cycle: "Reward Halfing Cycle, blocks",
      total_tokens: "Total Tokens",
      difficulty_cycle: "Difficulty Cycle, blocks",
      txs_confirm: "Guaranted TX confirm, blocks"
    };
    return specs[key] || key;
  },
  _specs__: function (key, key2) {
    var specs = {
      cap: {
        usd: "USD Capitalization",
        btc: "Bitcoin capitalization"
      }
    };
    return specs[key] && specs[key][key2] ? specs[key][key2] : key + "_" + key2;
  },
  displaySystemName: function (system) { //see "ALIASES"
    var ret;
    if (system.aliases)
      ret = system.aliases.nickname;
    if (!ret) ret = system._id;
    return ret;
  },
  displayCurrencyName: function (system) {
    if (typeof system == 'string') system = CurrentData.findOne({_id: system})
    if (system) return system.token ? system.token.name : system._id;
    else return ''
  },
  systemFromId: function (id){
    return CurrentData.findOne({_id:id});
  },
  ownUsername: function(){
    var user =  Meteor.user();
    if (!user) return '';
    return (user.username) || '';
  },
  _largeAvatar: function(user){
    return user.largeAvatar || user.avatar || '';
  },
  dateFormat: function(date, format){
    return moment(date).format(format);
  },
  usersListFromIds: function(listFromIds) {
    return CF.User.listFromIds(listFromIds)
  },
  _btcPrice: function(){
    var btc = CurrentData.findOne({_id: "Bitcoin"});
    try {// try to return a value
      return parseFloat(btc.metrics.price.usd)
    } catch (err) {// if value undefined return nothing
      return
    }
  },
  userHasPublicAccess: function userHasPublicAccess() {
    return CF.User.hasPublicAccess(Meteor.user())
  },
  isInDevelopmentMode: function isInDevelopmentMode(){
    return CF._mode;
  },

  /* this part is from cf-market-data */
  dailyTradeVolumeToText: function (volumeDaily, absolute, needDigit) {
    if (!absolute) {
      return needDigit ? 0 : "Normal";
    }

    if (Math.abs(volumeDaily / absolute) === 0) return needDigit ? 0 : "Illiquid";
    if (Math.abs(volumeDaily / absolute) < 0.0001) return needDigit ? 0.1 : "Very Low";
    if (Math.abs(volumeDaily / absolute) < 0.001) return needDigit ? 0.2 : "Low";
    if (Math.abs(volumeDaily / absolute) < 0.005) return needDigit ? 0.3 : "Normal";
    if (Math.abs(volumeDaily / absolute) < 0.02) return needDigit ? 0.4 : "High";
    return needDigit ? 0.5 : "Very High";
  },
  greenRedNumber: function (value) {
    return (value < 0) ? "red-text" : "green-text";
  },
  inflationToText: function (percents) {
    if (percents < 0) {
      return "Deflation " + (-percents).toFixed(2) + "%";
    } else if (percents > 0) {
      return "Inflation " + percents.toFixed(2) + "%";
    } else {
      return "Stable";
    }
  },
  percentsToTextUpDown: function (percents, precision) {
    if (!precision) precision = 2;
    if (precision == 100) precision = 0;

    if (percents < 0) {
      return "↓ " + (-percents.toFixed(precision)) + "%";
    } else if (percents > 0) {
      return "↑ " + percents.toFixed(precision) + "%";
    } else {
      return "= 0%";
    }
  },
  dayToDayTradeVolumeChange: function(system) {
    var metrics = system.metrics;
    if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.day) {
      return CF.Utils.deltaPercents(metrics.tradeVolumePrevious.day, metrics.tradeVolume);
    }
    return 0;
  },
  monthToMonthTradeVolumeChange: function(system) {
    var metrics = system.metrics;
    if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.month) {
      return CF.Utils.deltaPercents(metrics.tradeVolumePrevious.month, metrics.tradeVolume);
    }
    return 0;
  },
  chartdata: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId});
  },
  chartdataOrdered: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId}, {sort: {timestamp: -1}});
  },
  chartdataSubscriptionFetch: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId}, {sort: {timestamp: -1}}). fetch();
	},
	// this is from views/profile/lib/helpers
	isOwnAssets: function(){
		return CF.Profile.currentUid() == Meteor.userId();
	},
	// this is from packages/cyberfund-chaingear-client
	cgSystemLogoUrl: function (that) {
	  var icon = (that.icon ? that.icon : that._id) || '';
	  icon = icon.toString().toLowerCase();
	  return "https://static.cyber.fund/logos/" + icon + ".png";
	},
	cgIsActiveCrowdsale: function(system) {
		// Date.now() has better perfomance than new Date()
		return Boolean(
			get(system, 'crowdsales.start_date') < Date.now() &&
			get(system, 'crowdsales.end_date') > Date.now()
		)
	},
	cgIsUpcomingCrowdsale: function(system) {
	  return system.crowdsales && system.crowdsales.start_date > new Date()
	},
	cgIsPastCrowdsale: function() {
	  return system.crowdsales && system.crowdsales.end_date < new Date()
  },
  // this is from packages/cyberfund-currentdata/client/helpers.js
  tagMatchesTags: function (tag, tags) {
	return tags.indexOf(tag) > -1;
  },

  linksWithTag: function(links, tag) { //todo: move to cyberfund-currentdata ?
	return CF.CurrentData.linksWithTag(links, tag)
  },

  cdTurnover: function turnover () {
	var metrics = this.metrics;
	  if (metrics.cap && metrics.cap.btc) {
		  return 100.0 * metrics.turnover;
	  }
	return 0;
  },

  cdSymbol: function symbol () {
	if (this.token && this.token.symbol) {
	  return this.token.symbol
	}
	return "";
	},
	// this functions gathered here from random places,
	//because they were used more then once
	existLinksWith: function(links, tag) {
			if (!_.isArray(links)) return false
			return !!_.find(links, function(link) {
			  return (_.isArray(link.tags) && link.tags.includes(tag))
			})
	},

    linksWithoutTags: function (links, tags) {
      if (!_.isArray(links)) return [];

      return _.filter(links, function (link) {
        var ret = _.isArray(link.tags);
        _.each(tags, function (tag) {
          if (link.tags.indexOf(tag) > -1) ret = false;
        });

        return ret;
      });
	  },
	  displayBtcUsd: function(vBtc, vUsd) {
		  if (vUsd && vBtc) return `Ƀ${helpers.readableN4(vBtc)}/$${helpers.readableN2(vUsd)}` // ()
		  if (vUsd || vBtc) return vBtc ? `Ƀ${helpers.readableN4(vBtc)}` : `$${helpers.readableN2(vUsd)}`
		  return 0
	  }

}
// this is from views/profile/lib/helpers
CF.Profile.currentUid = function() {
  var u = CF.User.findOneByUsername(CF.Profile.currentUsername());
  return u ? u._id : null;
};

CF.Profile.currentUsername = function(){
  return FlowRouter.getParam("username");
};
export default helpers

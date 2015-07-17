//var currentData = {meta: {}};
var logger = log4js.getLogger("meteor-fetching-es");

function _normKey(str) { //thing is, elasticsearch by default returns long string as (first 15 symbols + '...')
                         // not sure yet how to force it returning full key, so for now just cutting result + searching by "starts_with"
  return str.slice(0, 15);
}

function _searchSelector(bucketKey) {

  // sym_sys is alike 'SYMBL|System'
  bucketKey = bucketKey.split("|");
  var selector = {};
  if (bucketKey.length == 2) {
    var symbol = bucketKey[0];
    bucketKey = bucketKey[1];

  } else {
    bucketKey = bucketKey[0];
  }

  //elasticsearch returns first 15 symbols + "..." if system name is longer than 15 symbols...
  if (bucketKey.slice(-3) == "...") {
    bucketKey = bucketKey.slice(0, -3);
    bucketKey = {
      $regex: new RegExp('^' + CF.Utils.escapeRegExp(bucketKey)),
      $options: 'i'
    };
  } else {
  }
  selector = {"system": bucketKey};

  selector["token.token_symbol"] = symbol;
  return selector;
}

var esParsers = {
  errorLogger: function esErrorHandler(rejection) {
    logger.error(rejection);
  },
  latest_values: function parseLatestValues(result) {
    if (!result || !result.aggregations || !result.aggregations.by_system
      || !result.aggregations.by_system.buckets) {
      this.errorLogger(result);
      return;
    }

    var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.
    if (!_.isArray(buckets)) return;
    logger.info("latest values fetched: total of " + buckets.length + " buckets");

    var notFounds = [];
    _.each(buckets, function (bucket) {

      // elasticsearch returns 'date range' buckets in custom order,
      // not corresponding to order they were defined. it looks depending on sort order by timestamp, used inside
      // inner aggregations, so best is to explicitly get buckets.
      // here we use bucket with max 'to' value as current, next bucket is 'day ago' bucket.. same as defined in aggregation..
      var index = _.map(bucket.by_time.buckets, function (item) {
        return item.to;
      });

      // current
      var mx = _.max(index);
      var current = _.find(bucket.by_time.buckets, function (item) {
        return item.to == mx;
      });

      // day ago
      index = _.without(index, mx);
      mx = _.max(index);
      var dayAgo = _.find(bucket.by_time.buckets, function (item) {
        return item.to == mx;
      });

      var set = {},
        sNow = {}, sDayAgo = {}, sWeekAgo = {};

      if (_.isArray(current.latest.hits.hits) && current.latest.hits.hits.length > 0) {
        sNow = current.latest.hits.hits[0]._source;
      } else {
        //   logger.info("no current data for " + bucket.key);
        //   console.log(bucket);
        //   console.log();
      }

      if (_.isArray(dayAgo.latest.hits.hits) && dayAgo.latest.hits.hits.length > 0) {
        sDayAgo = dayAgo.latest.hits.hits[0]._source;
      } else {
        //                logger.info("no yesterday data for " + bucket.key);
        //              console.log();
      }

      if (_.isEmpty(sNow)) return;

      //todo: use same set of keys at CF.ES.queries.latest_Values
      if (sNow.supply_current) {


        set["metrics.supply"] = sNow.supply_current;
        if (sDayAgo.supply_current) {

          var supplyDayAgo = sDayAgo.supply_current// || sNow.supply_current;
          set["metrics.supplyChangePercents.day"] = 100.0 *
            (sNow.supply_current - supplyDayAgo) / sNow.supply_current;
          set["metrics.supplyChange.day"] = sNow.supply_current - supplyDayAgo;
        }

        // todo: add week changes/ month changes
        // if (sWeekAgo) {
        //
        // }
      }

      if (sNow.price_usd) set["metrics.price.usd"] = sNow.price_usd;
      if (sNow.price_btc) set["metrics.price.btc"] = sNow.price_btc;
      if (sNow.volume24_btc) {
        set["metrics.tradeVolume"] = sNow.volume24_btc;
        //set["metrics.tradeVolume.usd"] = sNow.volume24_usd;
        if (sDayAgo.volume24_btc) set["metrics.tradeVolumePrevious.day"] = sDayAgo.volume24_btc;
      }

      if (sNow.cap_usd && sDayAgo.cap_usd) {
        set["metrics.capChangePercents.day.usd"] = 100.0 *
          (sNow.cap_usd - sDayAgo.cap_usd) / sNow.cap_usd;
        set["metrics.capChange.day.usd"] = sNow.cap_usd - sDayAgo.cap_usd;
      }
      if (sNow.cap_btc && sDayAgo.cap_btc) {
        set["metrics.capChangePercents.day.btc"] = 100.0 *
          (sNow.cap_btc - sDayAgo.cap_btc) / sNow.cap_btc;
        set["metrics.capChange.day.btc"] = sNow.cap_btc - sDayAgo.cap_btc;
      }

      if (CurrentData.find(_searchSelector(bucket.key)).count() == 0) {
        notFounds.push(bucket.key);
      }

      if (!_.isEmpty(set)) {
        set.updatedAt = new Date();
        // console.log(set);
        CurrentData.update(_searchSelector(bucket.key), {$set: set});
      }

    });
    if (notFounds.length) {
      logger.info("not found any currentData for ");
      logger.info(notFounds.length);

    }
    /*console.log(buckets[0]);
     console.log(buckets[0].by_time.buckets[0]);
     console.log(buckets[0].by_time.buckets[1]);
     console.log(buckets[0].by_time.buckets[0].latest.hits.hits);
     console.log(buckets[0].by_time.buckets[1].latest.hits.hits);*/
  },
  averages_l15: function (result) {
    if (!result || !result.aggregations || !result.aggregations.by_system || !result.aggregations.by_system.buckets) {
      return;
    }
    var buckets = result.aggregations.by_system.buckets; //todo: resolve this crap using smth built into queries.

    _.each(buckets, function (bucket) {
      var findSel = _searchSelector(bucket.key),
        set = {};

      if (bucket.avg_cap_usd.value) set["metrics.cap.usd"] = bucket.avg_cap_usd.value;
      if (bucket.avg_cap_btc.value) set["metrics.cap.btc"] = bucket.avg_cap_btc.value;
      if (!_.isEmpty(set)) {
        CurrentData.update(_searchSelector(bucket.key), {$set: set});
      } else {
        // logger.info("no averages for " + bucket.key);
      }
    });
  }
};

function fetchLatest(params) {
  var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("latest_values", params));
  esParsers.latest_values(result)
}

function fetchAverage15m(params) {
  var result = CF.Utils.extractFromPromise(CF.ES.sendQuery("averages_last_15m", params));
  esParsers.averages_l15(result);

}
Meteor.startup(function () {
  Meteor.setTimeout(
    function () {
      fetchLatest();
      Meteor.setInterval(fetchLatest, 300000);
    }, 4000);


  Meteor.setTimeout(
    function () {
      fetchAverage15m();
      Meteor.setInterval(fetchAverage15m, 300000);
    }, 12000);

});

Meteor.methods({
  "print_currentData": function () {
    console.log(currentData);
  }
});
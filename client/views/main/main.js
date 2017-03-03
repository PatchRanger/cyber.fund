import {CurrentData, Extras} from '/imports/api/collections'
import Acounts from '/imports/api/collections/Acounts'
function _cap() {
  return Extras.findOne({
    _id: "total_cap"
  });
}

function _accounts(){return Acounts.find({refId: Meteor.userId()}).fetch()}

Template["main"].helpers({
  cap: function(){ return _cap();},
  capBtc: function() {
    var cap = _cap();
    return cap ? cap.btc : undefined;
  },
  capUsd: function() {
    var cap = _cap();
    return cap ? cap.usd : undefined;
  },
  capUsdYesterday: function() {
    var cap = _cap();
    return cap ? cap.usdDayAgo : undefined;
  },
  capBtcDailyChange: function () {
    var cap = _cap();
    return (cap && cap.btc) ? (cap.btc - cap.btcDayAgo)/cap.btc * 100 : undefined;
  },
  capUsdDailyChange: function () {
    var cap = _cap();
    return (cap && cap.usd) ? (cap.usd - cap.usdDayAgo)/cap.usd * 100 : undefined;
  },
  sumBtc: function(){
    var ret = 0;
    if (!Meteor.userId()) return ret;
    let accounts = _accounts();
    accounts.forEach(function (acc){
      ret += acc.vBtc || 0;
    });
    return ret;
  }
});

Template["main"].onCreated(function(){
  i = this;
  i.subscribe("investData");
  i.subscribe("currentDataRP", {selector: {
  }, sort:{"calculatable.RATING.sum": -1}, limit: 5} );

  i.subscribe("crowdsalesAndProjectsList");

});

Template["mainPageSystemsWidget"].helpers({
  systems: function(){
    return CurrentData.find({}, {sort:{"calculatable.RATING.sum": -1}, limit: 5});
  }
});

Template["mainPageCrowdasalesWidget"].helpers({
  activeCrowdsales: function(){
    return CurrentData.find({
      $and: [{crowdsales: {$exists: true}}, {
        "crowdsales.end_date": {
          $gt: new Date()
        }
      }, {
        "crowdsales.start_date": {
          $lt: new Date()
        }
      }]
    }, {sort: {"metrics.currently_raised": -1}}).fetch();
  }
});

Template['ratingTableRow'].helpers({
  tradeVolumeOk: function (tv) {
    return tv && (tv >= 0.2);
  },
  _ready: function(){
    return Template.instance().subscriptionsReady()
  },

})

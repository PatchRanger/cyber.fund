Template['systemLinksTabs'].rendered = function () {
  console.log($('ul.tabs'));
  console.log($('ul.tabs').tabs);
  var system = FlowRouter.getParam('name_');
  console.log(system);

  $('ul.tabs').tabs();

};

Template['systemLinksTabs'].helpers ({
  existLinksWith: function (links, tag) {
    if (!_.isArray(links)) return false;
    return !!_.find(links, function (link) {
      return (_.isArray(link.tags) && link.tags.indexOf(tag) > -1);
    });
  },
  linksWithTag: function (links, tag) {
    if (!_.isArray(links)) return [];
    return _.filter(links, function (link) {
      return _.isArray(link.tags) && (link.tags.indexOf(tag) > -1);
    });
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
  }
});

Template['systemLinksTabs'].events ({
  'click .bar': function (e, t) {

  }
});
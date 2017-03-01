Template['cgLink'].rendered = function () {
  
};

Template['cgLink'].helpers({
  /**
   * returns specifically fa-icon class
   */

  "iconUrl": function () {
    var link = this;
    //if (link.icon)
    //return "https://github.com/cyberFund/chaingear/blob/gh-pages/logos/" + link.icon;

    switch (link.type) {
      case "wiki":
        return "wikipedia-w";
      case "twitter":
        return "twitter";
      case "wallet":
        return "credit-card";
      case "reddit":
        return "reddit";
      case "github":
        return "github";
      case "blog":
        return "pencil-square-o";
      case "website":
        return "home";
      case "forum":
        return "comments-o";
      case "explorer":
        return "search";
      case "whitepaper":
        return "mortar-board";
      case "paper":
        return "graduation-cap";
      default:
        break;
    }
    switch (link.icon.toLowerCase()) {
      case "wiki.png":
        return "wikipedia-w";
      case "twitter.png":
        return "twitter";
      case "wallet.png":
        return "credit-card";
      case "reddit.png":
        return "reddit";
      case "github.png":
        return "github";
      case "blog.png":
        return "pencil-square-o";
      case "website.png":
        return "home";
      case "forum.png":
        return "comments-o";
      case "explorer.png":
        return "search";
      case "whitepaper.png":
        return "mortar-board";
      case "paper.png":
        return "graduation-cap";
      default:
        break;
    }
    if (link.type == "custom") {
      return ""
    }
    return "external-link";
  }
})
;

Template['cgLink'].events({});
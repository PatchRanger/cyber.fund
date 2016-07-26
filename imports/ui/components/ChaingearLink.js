import React, { PropTypes } from 'react'
import { If, Else } from '../components/Utils'

const ChaingearLink = props => {
	const { link } = props
	// returns specific fa-icon class
	function iconUrl(link) {
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

		switch ( get(link, 'icon', ' ').toLowerCase() ) {
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
	// TODO remove .cg-link?
	return 	<a
				href={link.url}
				target="_blank"
				style={{textDecoration: 'none'}}
				className="cg-link"
				{...props}
			>
				<If condition={iconUrl(link)}>
			    	<i className={`fa fa-${iconUrl(link)}`}></i>
			    </If>
				<Else condition={iconUrl(link)}>
    				<i className="fa fa-external-link-square"></i>
    			</Else>
				&nbsp;{link.name}
			</a>
}

ChaingearLink.propTypes = {
    link: PropTypes.object.isRequired
}

export default ChaingearLink

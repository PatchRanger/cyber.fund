import React from 'react'
import { Grid, Cell } from 'react-mdl'
import Hiring from '../components/Hiring'
import RatingTableContainer from '../containers/RatingTableContainer'
import Blaze from 'meteor/gadicc:blaze-react-component'

const RatingPage = props => {
      	return	<Grid id="RatingPage">
                	<Cell col={12}> <Hiring /> </Cell>
                	<RatingTableContainer />
					<Cell col={12}> <Blaze template="ratingTable" /> </Cell>
              	</Grid>
 }

export default RatingPage

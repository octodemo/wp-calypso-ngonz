import classnames from 'classnames';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import SegmentedControl from 'calypso/components/segmented-control';
import { intervals } from './constants';

import './intervals.scss';

const Intervals = ( props ) => {
	const {
		selected,
		pathTemplate,
		className,
		standalone,
		compact = true,
		intervalValues = intervals,
		onChange,
	} = props;
	const classes = classnames( 'stats-navigation__intervals', className, {
		'is-standalone': standalone,
	} );

	return (
		<SegmentedControl primary className={ classes } compact={ compact }>
			{ intervalValues.map( ( i ) => {
				const path = pathTemplate?.replace( /{{ interval }}/g, i.value );
				return (
					<SegmentedControl.Item
						key={ i.value }
						path={ path }
						selected={ i.value === selected }
						onClick={ () => onChange && onChange( i.value ) }
					>
						{ i.label }
					</SegmentedControl.Item>
				);
			} ) }
		</SegmentedControl>
	);
};

Intervals.propTypes = {
	className: PropTypes.string,
	pathTemplate: PropTypes.string,
	selected: PropTypes.string.isRequired,
	standalone: PropTypes.bool,
	intervalValues: PropTypes.array,
	onChange: PropTypes.func,
};

Intervals.defaultProps = {
	standalone: false,
};

export default localize( Intervals );

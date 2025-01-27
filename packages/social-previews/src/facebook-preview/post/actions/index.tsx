import { __ } from '@wordpress/i18n';
import FacebookPostIcon from '../icons';

import './styles.scss';

const FacebookPostActions: React.FC = () => (
	<ul className="facebook-preview__post-actions">
		{ [
			{
				icon: 'like',
				// translators: Facebook "Like" action
				label: __( 'Like', 'facebook-preview' ),
			},
			{
				icon: 'comment',
				// translators: Facebook "Comment" action
				label: __( 'Comment', 'facebook-preview' ),
			},
			{
				icon: 'share',
				// translators: Facebook "Share" action
				label: __( 'Share', 'facebook-preview' ),
			},
		].map( ( { icon, label } ) => (
			<li key={ icon }>
				<FacebookPostIcon name={ icon } />
				<span>{ label }</span>
			</li>
		) ) }
	</ul>
);

export default FacebookPostActions;

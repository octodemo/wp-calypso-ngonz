/**
 * @jest-environment jsdom
 */
import { redirectOnboardingUserAfterPublishingPost } from '../redirect-onboarding-user-after-publishing-post';

beforeAll( () => {} );

const mockUnSubscribe = jest.fn();
let mockSubscribeFunction = null;

jest.mock( '@wordpress/data', () => ( {
	subscribe: ( userFunction ) => {
		mockSubscribeFunction = userFunction;

		return mockUnSubscribe;
	},
	select: ( item ) => {
		if ( item === 'core/editor' ) {
			return {
				isCurrentPostPublished: () => true,
				getCurrentPostRevisionsCount: () => 1,
			};
		}
	},
} ) );

describe( 'redirectOnboardingUserAfterPublishingPost', () => {
	it( 'should NOT redirect the user to the launchpad if showLaunchpad query parameter is NOT present', () => {
		delete global.window;
		global.window = {
			location: {
				search: 'origin=https://calypso.localhost:3000',
				hostname: 'wordpress.com',
			},
		};

		redirectOnboardingUserAfterPublishingPost();
		expect( mockSubscribeFunction ).toBe( null );
		expect( global.window.location.href ).toBe( undefined );
	} );

	it( 'should redirect the user to the launchpad when a post is published and the showLaunchpad query parameter is present', () => {
		delete global.window;
		global.window = {
			location: {
				search: '?showLaunchpad=true&origin=https://calypso.localhost:3000',
				hostname: 'wordpress.com',
			},
		};

		redirectOnboardingUserAfterPublishingPost();
		expect( mockSubscribeFunction ).not.toBe( null );
		mockSubscribeFunction();

		expect( mockUnSubscribe ).toBeCalledTimes( 1 );
		expect( global.window.location.href ).toBe(
			'https://calypso.localhost:3000/setup/write/launchpad?siteSlug=wordpress.com&showLaunchpad=true'
		);
	} );
} );

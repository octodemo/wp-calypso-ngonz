/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { callApi } from '../../helpers';
import usePostUnfollowMutation from '../../mutations/use-post-unfollow-mutation';

// Mock the useIsLoggedIn function
jest.mock( '../../hooks', () => ( {
	useIsLoggedIn: jest.fn().mockReturnValue( { isLoggedIn: true } ),
} ) );

// Mock the entire Helpers module
jest.mock( '../../helpers', () => ( {
	callApi: jest.fn(),
} ) );

const client = new QueryClient();
const Parent = ( { children } ) => (
	<QueryClientProvider client={ client }>{ children }</QueryClientProvider>
);

describe( 'usePostUnfollowMutation()', () => {
	it( 'calls the right API', async () => {
		const Skeleton = () => {
			const { mutate } = usePostUnfollowMutation();
			useEffect( () => {
				mutate( {
					blog_id: 123,
					post_id: 456,
				} );
			}, [ mutate ] );

			return <p></p>;
		};

		( callApi as jest.Mock ).mockResolvedValue( {
			success: true,
		} );

		render(
			<Parent>
				<Skeleton />
			</Parent>
		);

		await waitFor( () =>
			expect( callApi ).toHaveBeenCalledWith( {
				apiVersion: '1.2',
				path: '/read/site/123/comment_email_subscriptions/delete?post_id=456',
				isLoggedIn: true,
				method: 'POST',
			} )
		);
	} );
} );

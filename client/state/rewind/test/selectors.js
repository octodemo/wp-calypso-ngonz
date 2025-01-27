import { BACKUP_RETENTION_UPDATE_REQUEST } from '../retention/constants';
import {
	getRewindStorageUsageLevel,
	getBackupCurrentSiteSize,
	getBackupRetentionDays,
	getBackupRetentionUpdateRequestStatus,
	getBackupStoppedFlag,
	isFetchingStagingSitesList,
	hasFetchedStagingSitesList,
	getBackupStagingSites,
} from '../selectors';
import { stagingSites } from '../staging/test/fixtures';
import { StorageUsageLevels } from '../storage/types';

describe( 'getRewindStorageUsageLevel()', () => {
	it.each( [
		{
			state: {
				rewind: {
					123: {},
				},
			},
			siteId: 123,
			expected: StorageUsageLevels.Normal,
		},
		{
			state: {
				rewind: {
					123: {
						storage: {
							usageLevel: StorageUsageLevels.Full,
						},
					},
				},
			},
			siteId: 123,
			expected: StorageUsageLevels.Full,
		},
	] )(
		'should return values from StorageUsageLevels if passed, StorageUsageLevels.Normal otherwise',
		( { state, siteId, expected } ) => {
			const output = getRewindStorageUsageLevel( state, siteId );
			expect( output ).toBe( expected );
		}
	);
} );

describe( 'getBackupCurrentSiteSize()', () => {
	it.each( [
		{
			state: {
				rewind: {
					123: {
						size: {},
					},
				},
			},
			siteId: 123,
			expected: undefined,
		},
		{
			state: {
				rewind: {
					123: {
						size: {
							lastBackupSize: 1024,
						},
					},
				},
			},
			siteId: 123,
			expected: 1024,
		},
	] )(
		'should return the lastBackupSize if passed, undefined otherwise',
		( { state, siteId, expected } ) => {
			const output = getBackupCurrentSiteSize( state, siteId );
			expect( output ).toBe( expected );
		}
	);
} );

describe( 'getBackupRetentionDays()', () => {
	it.each( [
		{
			state: {
				rewind: {
					123: {
						size: {},
					},
				},
			},
			siteId: 123,
			expected: undefined,
		},
		{
			state: {
				rewind: {
					123: {
						size: {
							retentionDays: 30,
						},
					},
				},
			},
			siteId: 123,
			expected: 30,
		},
	] )(
		'should return the retentionDays if passed, undefined otherwise',
		( { state, siteId, expected } ) => {
			const output = getBackupRetentionDays( state, siteId );
			expect( output ).toBe( expected );
		}
	);
} );
describe( 'getBackupRetentionUpdateRequestStatus()', () => {
	const TEST_SITE_ID = 123;

	test( 'should default to UNSUBMITTED when the site under test does not exist in the state at all.', () => {
		const state = {
			rewind: {},
		};
		expect( getBackupRetentionUpdateRequestStatus( state, TEST_SITE_ID ) ).toEqual(
			BACKUP_RETENTION_UPDATE_REQUEST.UNSUBMITTED
		);
	} );

	test( 'should default to UNSUBMITTED when no backup retention update request is being made yet.', () => {
		const state = {
			rewind: {
				[ TEST_SITE_ID ]: {},
			},
		};
		expect( getBackupRetentionUpdateRequestStatus( state, TEST_SITE_ID ) ).toEqual(
			BACKUP_RETENTION_UPDATE_REQUEST.UNSUBMITTED
		);
	} );

	test( 'should return PENDING status when the state indicates a backup update request was initiated.', () => {
		const state = {
			rewind: {
				[ TEST_SITE_ID ]: {
					updateBackupRetentionRequestStatus: BACKUP_RETENTION_UPDATE_REQUEST.PENDING,
				},
			},
		};
		expect( getBackupRetentionUpdateRequestStatus( state, TEST_SITE_ID ) ).toEqual(
			BACKUP_RETENTION_UPDATE_REQUEST.PENDING
		);
	} );
} );
describe( 'getBackupStoppedFlag()', () => {
	const TEST_SITE_ID = 123;

	test( 'should default to false when the state does not contain the flag.', () => {
		const state = {
			rewind: {
				[ TEST_SITE_ID ]: {},
			},
		};
		expect( getBackupStoppedFlag( state, TEST_SITE_ID ) ).toEqual( false );
	} );

	test( 'should return the value as is when the state contains the value for flag.', () => {
		const state = {
			rewind: {
				[ TEST_SITE_ID ]: {
					size: { backupsStopped: true },
				},
			},
		};
		expect( getBackupStoppedFlag( state, TEST_SITE_ID ) ).toEqual( true );
	} );
} );

describe( 'Backup staging sites selectors', () => {
	const TEST_SITE_ID = 123456;
	const fixtures = {
		emptyRewindState: {
			rewind: {},
		},
		fetchingStagingSites: {
			rewind: {
				[ TEST_SITE_ID ]: {
					staging: {
						isFetchingStagingSitesList: true,
						hasFetchedStagingSitesList: false,
						sites: [],
					},
				},
			},
		},
		stagingSitesLoaded: {
			rewind: {
				[ TEST_SITE_ID ]: {
					staging: {
						isFetchingStagingSitesList: false,
						hasFetchedStagingSitesList: true,
						sites: stagingSites,
					},
				},
			},
		},
	};

	describe( 'isFetchingStagingSitesList', () => {
		test( 'should return false if the rewind state is empty', () => {
			const stateIn = fixtures.emptyRewindState;
			expect( isFetchingStagingSitesList( stateIn, TEST_SITE_ID ) ).toBe( false );
		} );

		test( 'should return true if staging sites are being fetch', () => {
			const stateIn = fixtures.fetchingStagingSites;
			expect( isFetchingStagingSitesList( stateIn, TEST_SITE_ID ) ).toBe( true );
		} );

		test( 'should return false if staging sites has been loaded', () => {
			const stateIn = fixtures.stagingSitesLoaded;
			expect( isFetchingStagingSitesList( stateIn, TEST_SITE_ID ) ).toBe( false );
		} );
	} );

	describe( 'hasFetchedStagingSitesList', () => {
		test( 'should return false if the rewind state is empty', () => {
			const stateIn = fixtures.emptyRewindState;
			expect( hasFetchedStagingSitesList( stateIn, TEST_SITE_ID ) ).toBe( false );
		} );

		test( 'should return false if staging sites are being fetch', () => {
			const stateIn = fixtures.fetchingStagingSites;
			expect( hasFetchedStagingSitesList( stateIn, TEST_SITE_ID ) ).toBe( false );
		} );

		test( 'should return true if staging sites has been loaded', () => {
			const stateIn = fixtures.stagingSitesLoaded;
			expect( hasFetchedStagingSitesList( stateIn, TEST_SITE_ID ) ).toBe( true );
		} );
	} );

	describe( 'getBackupStagingSites', () => {
		test( 'should return empty array if the rewind state is empty', () => {
			const stateIn = fixtures.emptyRewindState;
			expect( getBackupStagingSites( stateIn, TEST_SITE_ID ) ).toStrictEqual( [] );
		} );

		test( 'should return the staging sites related to specified site ID', () => {
			const stateIn = fixtures.stagingSitesLoaded;
			expect( getBackupStagingSites( stateIn, TEST_SITE_ID ) ).toStrictEqual( stagingSites );
		} );
	} );
} );

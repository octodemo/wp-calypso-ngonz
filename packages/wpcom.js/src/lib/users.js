/**
 * Create a `Users` instance
 *
 * @param {WPCOM} wpcom - wpcom instance
 * @returns {Users|undefined}
 */
export default function Users( wpcom ) {
	if ( ! ( this instanceof Users ) ) {
		return new Users( wpcom );
	}

	this.wpcom = wpcom;
}

/**
 * A list of @mention suggestions for the current user
 *
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @returns {Function} request handler
 */
Users.prototype.suggest = function ( query, fn ) {
	return this.wpcom.req.get( '/users/suggest', query, fn );
};

module.exports = {
	get: function (tag) {
		var errors = {
			MISSING_INVALID_PARAMS: {
				status: 400,
				error: {
					code: -1,
					message: 'Missing/invalid parameters.',
					params: []
				}
			},
			INTERNAL_SERVER_ERROR: {
				status: 500,
				error: {
					code: -2,
					message: 'Internal server error.'
				}
			},
			INVALID_CREDENTIALS: {
				status: 403,
				error: {
					code: -3,
					message: 'Username or Password is incorrect.'
				}
			},
			UNAUTHORIZED: {
				status: 401,
				error: {
					code: -4,
					message: 'Unauthorized'
				}
			},			
			NOT_FOUND: {
				status: 404,
				error: {
					code: -5,
					message: 'Not Found'
				}
			},
			NO_AFFECTED_ROWS: {
				status: 400,
				error: {
					code: -6,
					message: 'No affected rows.'
				}
			},
			NO_USER_SESSION: {
				status: 401,
				error: {
					code: -7,
					message: 'There is no session for this user.'
				}
			},
			DUPLICATE_RECORD: {
				status: 409,
				error: {
					code: -8,
					message: 'Data already exists.'
				}
			},
		};
		return errors[tag];
	},
	raise: function (e, details) {
		var error = JSON.parse(JSON.stringify(this.get(e)));
		if(details) error.error.details = details;
		return error;
	}
};
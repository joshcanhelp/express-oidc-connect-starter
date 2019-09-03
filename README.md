# Express OIDC Connect Quickstart

Pared down and modified from [identity lab 01](https://docs-content-staging-pr-8113.herokuapp.com/docs/identity-labs/01-web-sign-in).

## Adding Authentication

1. [Download the starter seed project](https://github.com/joshcanhelp/express-oidc-connect-starter).

2. Create a new web app with callback (`/callback` route) and logout (app home route).

3. Install nodemon globally:

	```bash
	$ npm install -g nodemon
	```

4. Copy the `example.env` file to `.env` and populate:

	```bash
	$ cp example.env .env
	```

	```text
	ISSUER_BASE_URL=https://YOUR_DOMAIN
	CLIENT_ID=YOUR_CLIENT_ID
	COOKIE_SECRET=LONG_RANDOM_VALUE
	SESSION_NAME=YOUR_SESSION_NAME_HERE
	PORT=3000
	```

5. Install the packages:

	```bash
	$ npm install express-openid-connect cookie-session body-parser
	```

6. Require the packages:

	```js
	// app.js
	// ... after env configuration
	
	const bodyParser = require('body-parser');
	const session = require('cookie-session');
	const { auth, requiresAuth } = require('express-openid-connect');
	```

7. Add the following as the last `app.use` statement ([cookie-session options](https://github.com/expressjs/cookie-session#cookiesessionoptions) and [auth options](https://github.com/auth0/express-openid-connect/blob/master/API.md#openidclientauth-parameters)):

	```js
	// app.js
	
	// Required for the SDK but already included in the starter project 👇
	app.use(bodyParser.urlencoded({ 
	  extended: false 
	}));
	
	app.use(session({
	  name: process.env.SESSION_NAME,
	  secret: process.env.COOKIE_SECRET
	}));
	
	app.use(auth({
	  required: false
	}));
	```

8. Add a middleware for routes that need protection:

	```js
	// app.js
	
	// Just add requiresAuth() to expenses route in the starter project 👇
	app.get('/protected', requiresAuth(), (req, res) => {
		res.render('protected');
	});
	```

## Display User Information

1. Add user information to rendered views:

	```js
	// app.js
	
	// Already exists in the starter project 👇
	app.get('/', (req, res) => {
		res.render('home',  { user: req.openid && req.openid.user });
	});
	```

2. Add auth-specific content to views:

	```js
	// views/home.ejs
	
	// Modify what's in the starter project with what is below 👇
	<% if (user) { %>
		<p>Hello <%= user.name %>!</p>
	<% } else { %>
		<a href="/login">Login</a>
	<% } %>
```

## Logout

1. Add a logout link to the view:

	```js
	// views/home.ejs
	
	// Modify the code above👇
	<% if (user) { %>
		<a href="/logout">Logout</a>
		<p>Hello <%= user.name %>!</p>
		// ...
	```

2. Click logout, then login. SSO happens so no login UI is shown. 

3. Modify the auth options to log out of Auth when logging out of the application:

	```js
	// app.js
	
	app.use(auth({
	  required: false,
	  auth0Logout: true
	}));
	```

4. Restart the server, refresh the page, click logout, then login. Login UI should display now.


# Express OIDC Connect Quickstart

Pared down and modified from [identity lab 01](https://docs-content-staging-pr-8113.herokuapp.com/docs/identity-labs/01-web-sign-in).

## 1. Adding Authentication

1. Clone this repo:

	```bash
	$ git clone git@github.com:joshcanhelp/express-oidc-connect-starter.git
	```

2. Create a [new web app in Auth0](https://manage.auth0.com/#/applications) with an allowed callback URL (`/callback` route) and allowed logout URL (app home route).

3. Install existing packages and nodemon globally:

	```bash
	$ npm install
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

5. Install the new packages:

	```bash
	$ npm install express-openid-connect cookie-session
	```

6. Require the packages in the app:

	```js
	// app.js
	// ... after env configuration

	const session = require('cookie-session');
	const { auth, requiresAuth } = require('express-openid-connect');
	```

7. Add the following as the last `app.use` statement (for reference: [cookie-session options](https://github.com/expressjs/cookie-session#cookiesessionoptions) and [auth options](https://github.com/auth0/express-openid-connect/blob/master/API.md#openidclientauth-parameters)):

	```js
	// app.js
	// ... after any other app.use statements

	app.use(express.urlencoded({
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

8. Add a `requiresAuth` middleware for routes that need protection:

	```js
	// app.js

	app.get('/expenses', requiresAuth(), (req, res) => {
	  // ...
	});
	```

**👉 [See this compare for all code changes in this section](https://github.com/joshcanhelp/express-oidc-connect-starter/compare/01-adding-authentication)**

## 2. Display User Information

1. Add user information to rendered views:

	```js
	// app.js
	// ...

	app.get('/', (req, res) => {
		// Add the second parameter👇
		res.render('home', { user: req.openid && req.openid.user });
	});
	```

2. Add auth-specific content to views:

	```js
	// views/home.ejs
		// ...

		<% if (user) { %>
			<p>Hello <%= user.name %>!</p>
		<% } else { %>
			<a href="/login">Login</a>
		<% } %>

	</body>
	</html>
	```

**👉 [See this compare for all code changes in this section](https://github.com/joshcanhelp/express-oidc-connect-starter/compare/01-adding-authentication...02-display-user-information)**

## 3. Logout

1. Add a logout link to the view:

	```js
	// views/home.ejs

	<% if (user) { %>
		// Add the line below👇
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

**👉 [See this compare for all code changes in this section](https://github.com/joshcanhelp/express-oidc-connect-starter/compare/02-display-user-information...03-logout)**

## 4. Customize the user profile

1. Add a property `getUser` to the auth options set to an async function to return a new profile field:

	```js
	// app.js

	app.use(auth({
		// ...

		// Add the code below👇
		getUser: (tokenSet) => {
			tokenClaims = tokenSet.claims || {};
			return Object.assign(tokenClaims, { lastLogin: Date() });
		}
	// ...
	```

2. Output the new field on the homepage:

	```js
	// views/home.ejs

	<% if (user) { %>
		// ...

		// Add the line below👇
		<p>Login time: <%= user.lastLogin %></p>
	// ...
	```
**👉 [See this compare for all code changes in this section](https://github.com/joshcanhelp/express-oidc-connect-starter/compare/03-logout...04-get-user-profile)**

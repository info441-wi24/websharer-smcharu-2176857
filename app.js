import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import msIdExpress from 'microsoft-identity-express'

import apiv1Router from './routes/api/v1/apiv1.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appSettings = {
	appCredentials: {
    	clientId:  "1fed58c7-cc2f-4ad7-94fd-c5b9c3ac7c12",
    	tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    	clientSecret:  "087d5cc8-95e4-4128-9b27-94fcb3061815"
	},
	authRoutes: {
    	redirect: "/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
    	error: "/error", // the wrapper will redirect to this route in case of any error.
    	unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
	}
};

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up v45v;lkjgdsal;nwqt49asglkn",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

app.use('/api/v1', apiv1Router);

app.get('/signin',
	msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
	msid.signOut({postLogoutRedirect: '/'})
)

export default app;

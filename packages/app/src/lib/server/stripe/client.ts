import { env } from '$env/dynamic/private';
import Stripe from 'stripe';

if (!env.SECRET_STRIPE_KEY) {
	throw new Error('Missing stripe secret key');
}

export const stripe = new Stripe(env.SECRET_STRIPE_KEY, {
	apiVersion: '2023-10-16'
});

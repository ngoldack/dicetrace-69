import { insertUserSchema, user as userTable } from "$lib/db/schemas/user.schema";
import { fail, type Actions } from "@sveltejs/kit";
import { message, superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from "./$types";
import { db } from "$lib/db/client.server";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ parent}) => {
    const { user , session } = await parent();
    const form = await superValidate(user, insertUserSchema);

    return {
        user,
        session,
        form,
    }
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await superValidate(request, insertUserSchema)

        const session = await locals.getSession();
        if (!session?.user?.email) {
            return message(form, 'You must be logged in to edit your profile.', {
                status: 401,
            })
        }

        if (!form.valid) {
            return fail(400, { form });
        }

        const resp = await db.update(userTable).set({
            name: form.data.name,
            updatedAt: new Date(Date.now()),
        }).where(eq(userTable.email, session.user.email));
        if (resp.rowsAffected === 0) {
            return message(form, 'User not found.', {
                status: 404,
            })
        }
    }
};
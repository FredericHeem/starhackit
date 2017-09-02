import { createElement as h } from 'react';
import { observable, action } from 'mobx';
import user from './userComponent';
import AsyncOp from 'utils/asyncOp';

export default function (context) {
    const { rest } = context;
    const asyncOpCreate = AsyncOp(context);

    function Stores() {
        const userStore = observable({
            opGet: asyncOpCreate((id, data) => rest.get(`users/${id}`, data)),
            get: action(async function (id) {
                await this.opGet.fetch(id);
            }),
        })
        return {
            user: userStore
        }
    }

    function selectOne(userId) {
        context.history.push(`/users/${userId}`)
    }

    function Routes(stores) {
        return [
            {
                path: "/users",
                load: async () => {
                    console.log("load users")
                    try {
                    const usersCreate = await import('users');
                    console.log("usersCreate", usersCreate)
                    const users = usersCreate.default(context, { selectOne, getAll: (data) => rest.get(`users/`, data) });
                    console.log("users", users)
                    users.store.selectPage(1);
                    return users;

                    } catch(e){
                        console.error(e)
                    }
                }
            },
            {
                path: "/users/:userId",
                component: () => ({
                    title: "User",
                    component: h(user(context), { store: stores.user }),
                }),
                action: ({params}) => stores.user.get((params.userId))
            }
        ]

    }
    const stores = Stores();

    return {
        stores: () => stores,
        routes: () => Routes(stores)
    }
}

import { createElement as h } from 'react';
import { observable, action } from 'mobx';
import userView from './userView';
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
        context.history.push(`/admin/users/${userId}`)
    }

    function Routes(stores) {
        return [
            {
                path: "/users",
                load: async () => {
                    const usersCreate = await import('./users');
                    const users = usersCreate.default(context, { selectOne, getAll: (data) => rest.get(`users/`, data) });
                    users.store.selectPage(1);
                    return users;
                }
            },
            {
                path: "/users/:userId",
                component: () => ({
                    title: "User",
                    component: h(userView(context), { store: stores.user }),
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

import { createElement as h } from 'react';
import { observable, action } from 'mobx';
import user from './userComponent';
import AsyncOp from 'utils/asyncOp';
import usersCreate from './users';

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

    const users = usersCreate(context, { selectOne, getAll: (data) => rest.get(`users/`, data) });

    function Routes(stores) {
        return [
            {
                path: "/",
                component: () => ({
                    title: "Users",
                    component: users.component,
                }),
                action: () => users.store.selectPage(1)
            },
            {
                path: "/:userId",
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

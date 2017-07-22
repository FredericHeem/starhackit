import { createElement as h } from 'react';
import { observable, action } from 'mobx';
import userView from './userView';
import Users from './users';
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

    const users = Users(context, { selectOne, getAll: (data) => rest.get(`users/`, data) });

    function Routes(stores) {
        return [
            {
                path: "/users",
                component: () => ({
                    title: "Users",
                    component: h(users.view),
                }),
                action: () => users.store.selectPage(1)
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

import { createElement as h } from 'react';
import { observable, action } from 'mobx';
import { browserHistory } from 'react-router';
import userView from './userView';
import Users from './users';
import AsyncOp from 'utils/asyncOp';

export default function (context) {
    const { rest } = context;
    const asyncOpCreate = AsyncOp(context);
    let stores;

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
        browserHistory.push(`/admin/users/${userId}`)
    }

    const users = Users(context, { selectOne, getAll: (data) => rest.get(`users/`, data) });

    function Routes(stores) {
        return [
            {
                path: 'users',
                component: () => h(users.view),
                onEnter: () => users.store.selectPage(1)
            }, {
                path: 'users/:userId',
                component: () => h(userView(context), { store: stores.user }),
                onEnter: nextState => stores.user.get(nextState.params.userId)
            }
        ]

    }

    return {
        stores: () => stores,
        createStores: () => { stores = Stores(context) },
        routes: () => Routes(stores)
    }
}

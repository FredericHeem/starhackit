import React from 'react';
import { observable, action } from 'mobx';
import notificationMsg from 'components/notificationMsg';

export default context => {
    const NotificationMsg = notificationMsg(context);

    return function create(api) {
        const store = observable({
            loading: false,
            data: null,
            error: null,
 
            fetch: action(async function (input) {
                try {
                    store.loading = false;
                    store.error = null;
                    //console.log("fetch ");
                    const response = await api(input);
                    store.data = response;
                    //console.log("fetch response ", response);
                    return response;
                } catch (error) {
                    //console.error("fetch error ", error);
                    store.error = error;
                    const { response : {status} } = error;
                    //console.error("fetch status ", status);
                    if (![401, 422].includes(status)) {
                        context.notification.error(<NotificationMsg error={error} />);
                    }
                    throw error;
                } finally {
                    store.loading = false
                }
            })
        })
        return store;
    }
}
import Reflux from 'reflux';

import {
    getMyProfile,
    updateMyProfile,

    getMyRecipes,
    getMyFavouriteRecipes,

    getComments,

    addRecipeToFavourites,
    removeRecipeFromFavourites,

    getMyUserNotifications,
    dismissNotification,

    getMyFriends,
    getMyFriendsRecipes,
    addFriend,

    getMyStatusUpdates
} from 'resources/me';

let actions = Reflux.createActions( {
    getMyProfile: { asyncResult: true },
    getMyRecipes: { asyncResult: true },
    getComments: { asyncResult: true },
    getMyFavouriteRecipes: { asyncResult: true },

    updateMyProfile: { asyncResult: true },
    addRecipeToFavourites: { asyncResult: true },
    removeRecipeFromFavourites: { asyncResult: true },

    getMyUserNotifications: { asyncResult: true },
    dismissNotification: { asyncResult: true },

    getMyFriends: { asyncResult: true },
    getMyFriendsRecipes: { asyncResult: true },
    addFriend: { asyncResult: true },

    getMyStatusUpdates: { asyncResult: true }
} );

export default actions;

actions.getMyProfile.listenAndPromise( getMyProfile );
actions.getMyRecipes.listenAndPromise( getMyRecipes );
actions.getComments.listenAndPromise( getComments );
actions.getMyFavouriteRecipes.listenAndPromise( getMyFavouriteRecipes );

actions.updateMyProfile.listenAndPromise( updateMyProfile );
actions.addRecipeToFavourites.listenAndPromise( addRecipeToFavourites );
actions.removeRecipeFromFavourites.listenAndPromise( removeRecipeFromFavourites );

actions.dismissNotification.listenAndPromise( dismissNotification );
actions.getMyUserNotifications.listenAndPromise( getMyUserNotifications );

actions.getMyFriends.listenAndPromise( getMyFriends );
actions.getMyFriendsRecipes.listenAndPromise( getMyFriendsRecipes );
actions.addFriend.listenAndPromise( addFriend );

actions.getMyStatusUpdates.listenAndPromise( getMyStatusUpdates );
import React from 'react';
import Page from 'components/Page';
import DocTitle from 'components/docTitle';
import profileForm from '../components/profileForm';

export default context => {
  const ProfileForm = profileForm(context);
  function ProfileView(props) {
    return (
      <Page className="profile-page">
        <DocTitle title={context.tr.t('My Profile')} />
        <ProfileForm {...props} />
      </Page>
    );
  }
  return ProfileView;
};

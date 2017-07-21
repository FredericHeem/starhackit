import React from 'react';
import page from 'components/Page';
import profileForm from '../components/profileForm';

export default context => {
  const Page = page(context);
  const ProfileForm = profileForm(context);
  function ProfileView(props) {
    return (
      <Page className="profile-page text-center">
        <ProfileForm {...props} />
      </Page>
    );
  }
  return ProfileView;
};

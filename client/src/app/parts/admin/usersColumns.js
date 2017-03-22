
export default function({tr, formatter}){
  return [
    {
      property: 'id',
      header: {
        label: tr.t('Id')
      }
    }, {
      property: 'username',
      header: {
        label: tr.t("Username")
      }
    }, {
      property: 'firstName',
      header: {
        label: tr.t('First Name')
      }
    }, {
      property: 'createdAt',
      header: {
        label: tr.t('Created At')
      },
      cell: {
        formatters:[date => formatter.dateTime(date)]
      }
    }, {
      property: 'updatedAt',
      header: {
        label: tr.t("Updated At")
      },
      cell: {
        formatters:[date => formatter.dateTime(date)]
      }
    }
  ];
}
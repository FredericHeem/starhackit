import React, {createElement as h} from 'react';
import * as Table from 'reactabular-table';
import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import Paginator from 'react-pagify';
import segmentize from 'segmentize';
import spinner from 'components/spinner';
import alertAjax from 'components/alertAjax';
import Debug from 'debug';
import table from 'components/table';

const debug = new Debug("restTableComponent");

import 'react-pagify/style.css';

export default (context, store, {columns}) => {
  const {tr} = context;
  const AlertAjax = alertAjax(context);

  const Loading = observer((loading) => (loading === true ? h(spinner(context)) : null));

  const Error = observer(() => {
    const {error} = store;
    if (!error) return null;
    debug(error)
    return <AlertAjax error={error} className='rest-table-error-view' />
  })

  const Pagination = observer(() => {
    debug("Pagination:", store.count)
    const {count, pagination} = store;
    const pages = Math.ceil(count / pagination.perPage);
    if (pages <= 1) {
      return null;
    }
    return (
      <div className='controls'>
        <div className='pagination'>
          <Paginator.Context
            className="pagify-pagination"
            segments={segmentize({
              page: pagination.page,
              pages,
              beginPages: 3,
              endPages: 3,
              sidePages: 2
            })}
            onSelect={page => store.selectPage(page)}
          >
            <Paginator.Button page={pagination.page - 1}>{tr.t('Previous') }</Paginator.Button>

            <Paginator.Segment field="beginPages" />

            <Paginator.Ellipsis
              className="ellipsis"
              previousField="beginPages"
              nextField="previousPages"
            />

            <Paginator.Segment field="previousPages" />
            <Paginator.Segment field="centerPage" className="selected" />
            <Paginator.Segment field="nextPages" />

            <Paginator.Ellipsis
              className="ellipsis"
              previousField="nextPages"
              nextField="endPages"
            />

            <Paginator.Segment field="endPages" />

            <Paginator.Button page={pagination.page + 1}>{tr.t('Next') }</Paginator.Button>
          </Paginator.Context>

        </div>
      </div>
    );
  })
  const TableProvider = table(context)(Table.Provider);
  const TableCompoment = observer(({onRow}) => {
    const {error} = store;
    const data = toJS(store.data)
    if (error) return null;
    return (
      <div>
        <Pagination />
        <TableProvider
          columns={columns}
          style={{ overflowX: 'auto' }}
        >
          <Table.Header />
          <Table.Body onRow={onRow} rows={data} rowKey="id" />
        </TableProvider>
      </div>
    );
  })

  function RestTable(props) {
    debug('RestTable: ', props, store);
    return (
      <div>
        <Error />
        <Loading loading={store.loading} />
        <TableCompoment {...props} />
      </div>
    )
  }

  return observer(RestTable);
}
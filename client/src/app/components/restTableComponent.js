import React from 'react';
import * as Table from 'reactabular-table';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import Paginator from 'react-pagify';
import segmentize from 'segmentize';
import Spinner from 'components/spinner';
import alertAjax from 'components/alertAjax';
import Debug from 'debug';
const debug = new Debug("components:resttable");

import 'react-pagify/style.css';

export default (context, {getData, columns}) => {
  const {tr} = context;
  const AlertAjax = alertAjax(context);
  const store = mobx.observable({
    loading: false,
    count: 0,
    data: [],
    error: null,
    pagination: {
      page: 1,
      perPage: 100
    },
    selectPage: mobx.action(async function (page) {
      debug('onSelectPage ', page);
      if (page <= 0) {
        return;
      }
      this.loading = true;
      store.error = null;

      try {
        const result = await getData({
          offset: this.pagination.perPage * (page - 1),
          limit: this.pagination.perPage
        })
        console.log("rx DATA ", result.data.length)
        this.pagination.page = page;
        this.count = result.count;
        this.data = result.data;
        this.loading = false;
      } catch (error) {
        debug('onSelectPage error ', error);
        this.error = error;
        this.loading = false;
      }
    }),
  })

  store.selectPage(1);

  const Loading = observer(() => (store.loading ? <Spinner /> : null))

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
            onSelect={page => store.selectPage(page, getData)}
          >
            <Paginator.Button page={pagination.page - 1}>{tr.t('Previous') }</Paginator.Button>

            <Paginator.Segment field="beginPages" />

            <Paginator.Ellipsis
              className="ellipsis"
              previousField="beginPages" nextField="previousPages"
            />

            <Paginator.Segment field="previousPages" />
            <Paginator.Segment field="centerPage" className="selected" />
            <Paginator.Segment field="nextPages" />

            <Paginator.Ellipsis
              className="ellipsis"
              previousField="nextPages" nextField="endPages"
            />

            <Paginator.Segment field="endPages" />

            <Paginator.Button page={pagination.page + 1}>{tr.t('Next') }</Paginator.Button>
          </Paginator.Context>

        </div>
      </div>
    );
  })

  const TableView = observer(({onRow}) => {
    const {error} = store;
    const data = mobx.toJS(store.data)

    if (error) return null;
    return (
      <div>
        <Pagination />
        <Table.Provider
          className="table"
          columns={columns}
          style={{ overflowX: 'auto' }}
        >
          <Table.Header />
          <Table.Body onRow={onRow} rows={data} rowKey="id" />
        </Table.Provider>
      </div>
    );
  })

  function RestTable(props) {
    debug('RestTable: ', props)
    return (
      <div>
        <Error />
        <Loading />
        <TableView {...props} />
      </div>
    )
  }

  return observer(RestTable);
}
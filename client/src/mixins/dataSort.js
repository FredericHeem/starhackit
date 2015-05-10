"use strict";
var immutableDataSortMixin = {
  immutableDataSort: function(data, key, dir) {
    return data.sort(function(a, b) {
      var first = (dir === "asc") ? a.get(key) : b.get(key);
      var last = (dir === "asc") ? b.get(key) : a.get(key);

      if (typeof first === "string") {
        return first.localeCompare(last);
      }
      return first - last;
    });
  },
  dataSort: function(data, key, dir) {
    return data.sort(function(a, b) {
      var first = (dir === "asc") ? a[key] : b[key];
      var last = (dir === "asc") ? b[key] : a[key];

      if (typeof first === "string") {
        return first.localeCompare(last);
      }
      return first - last;
    });
  },
  setSort: function(key) {
    var dir = "asc";
    if (key === this.state.sortKey) {
      dir = (this.state.sortDir === "asc") ? "desc" : "asc";
    }
    this.setState({
      sortKey: key,
      sortDir: dir
    });
  },
  getSortLabel: function(title, key) {
    title += (this.state.sortKey === key) ? ((this.state.sortDir === "asc") ? " \u25B2" : " \u25BC") : "";
    return title;
  }
};

module.exports = immutableDataSortMixin;

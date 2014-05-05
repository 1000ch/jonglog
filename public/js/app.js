Jonglog.Router = Backbone.Router.extend({});
Jonglog.results = new Jonglog.Collection.Results();
Jonglog.submitFormView = new Jonglog.View.SubmitFormView({
  collection: Jonglog.results
});
Jonglog.resultListView = new Jonglog.View.ResultListView({
  collection: Jonglog.results
});
Jonglog.resultTotalView = new Jonglog.View.ResultTotalView({
  collection: Jonglog.results
});

$(function () {
  Jonglog.submitFormView.$el.find('#js-date').val(moment().format('YYYY-MM-DD'));
  $.when(
    Jonglog.results.fetch()
  ).done(function () {
    Backbone.history.start({
      pushState: false
    });
  });
});
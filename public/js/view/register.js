Jonglog.View.RegisterView = Backbone.View.extend({
  el: '#js-register',
  events: {
    'submit form': 'onSubmit'
  },
  initialize: function () {

    this.$date = this.$el.find('#js-date').val(moment().format('YYYY-MM-DD'));
    this.$round = this.$el.find('#js-round');
    this.$hokaccha = this.$el.find('#js-score-hokaccha');
    this.$1000ch = this.$el.find('#js-score-1000ch');
    this.$hiloki = this.$el.find('#js-score-hiloki');
    this.$tan_yuki = this.$el.find('#js-score-tan_yuki');

    this.listenTo(Jonglog.mediator, 'route:index', this.render);
    this.listenTo(Jonglog.mediator, 'route:result', this.hide);
    this.listenTo(this.collection, 'invalid', this.onError);
  },
  hide: function () {
    this.$el.hide();
  },
  render: function () {
    this.$el.show();
  },
  onSubmit: function (e) {
    e.preventDefault();
    var model = new Jonglog.Model.Result({
      date: this.$date.val(),
      round: this.$round.val(),
      hokaccha: {
        score: this.$hokaccha.val()
      },
      '1000ch': {
        score: this.$1000ch.val()
      },
      hiloki: {
        score: this.$hiloki.val()
      },
      tan_yuki: {
        score: this.$tan_yuki.val()
      }
    });
    this.collection.create(model, {
      validate: true
    });
    Jonglog.dateList.fetch();
  },
  onError: function (model, message) {
    alert(message);
  }
});

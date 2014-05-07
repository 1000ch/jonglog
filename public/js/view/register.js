Jonglog.View.RegisterView = Backbone.View.extend({
  el: '#js-register',
  model: new Jonglog.Model.Result(),
  events: {
    'click #js-submit': 'onClickSubmit'
  },
  initialize: function () {
    var self = this;

    this.listenTo(Jonglog.mediator, 'route:index', this.render);
    this.listenTo(Jonglog.mediator, 'route:result', this.hide);

    this.$date = this.$el.find('#js-date');
    this.$round = this.$el.find('#js-round');
    this.$hokaccha = this.$el.find('#js-score-hokaccha');
    this.$1000ch = this.$el.find('#js-score-1000ch');
    this.$hiloki = this.$el.find('#js-score-hiloki');
    this.$tan_yuki = this.$el.find('#js-score-tan_yuki');

    this.$date.val(this.model.get('date'));
    this.$round.val(this.model.get('round'));
    this.$hokaccha.val(this.model.get('hokaccha').score);
    this.$1000ch.val(this.model.get('1000ch').score);
    this.$hiloki.val(this.model.get('hiloki').score);
    this.$tan_yuki.val(this.model.get('tan_yuki').score);

    this.$hokaccha.on('change', function () {
      self.model.set({
        hokaccha: {
          score: this.value
        }
      });
    });
    this.$1000ch.on('change', function () {
      self.model.set({
        '1000ch': {
          score: this.value
        }
      });
    });
    this.$hiloki.on('change', function () {
      self.model.set({
        hiloki: {
          score: this.value
        }
      });
    });
    this.$tan_yuki.on('change', function () {
      self.model.set({
        tan_yuki: {
          score: this.value
        }
      });
    });
  },
  hide: function () {
    this.$el.hide();
  },
  render: function () {
    this.$el.show();
  },
  onClickSubmit: function (e) {
    e.preventDefault();
    this.collection.add(this.model);
  }
});
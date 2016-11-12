describe('Content View spec', function () {
  var view, model;

  beforeEach(function () {
    view = new FeedbackFormView({
      model: new Feedback(),
      feedback: 'TDD is awesome..'
    });
  });

  describe('when view is constructing', function () {

    it('should exist', function () {
      expect(view).toBeDefined();
    });

  });

  describe('when view is initialized', function () {

    describe('without model', function () {

      it('should throw exception', function () {
        expect(function () {
          new FeedbackFormView();
        }).toThrow(new Error('model is required'));
      });

    });

    describe('without default feedback', function () {

      it('should throw exception', function () {
        expect(function () {
          new FeedbackFormView({
            model: new Backbone.Model()
          });
        }).toThrow(new Error('feedback is required'));
      });

    });

  });


  describe('when view is rendered', function () {

    beforeEach(function () {
      view.render();
    });

    it('should email field be empty', function () {
      expect(view.$el.find('input#email')).toHaveValue('');
    });

    it('should website field be empty', function () {
      expect(view.$el.find('input#website')).toHaveValue('');
    });

    it('should feedback field with default feedback', function () {
      expect(view.$el.find('textarea#feedback')).toHaveValue('TDD is awesome..');
    });

  });

  describe('when view is changing', function () {

    beforeEach(function () {
      view.render();
    });

    describe('when form is submitted', function () {

      describe('no inputs are filled', function () {

        beforeEach(function () {
          view.$el.find('#email').val('').trigger('change');
          view.$el.find('#feedback').val('').trigger('change');
        });

        beforeEach(function () {
          view.$el.find('#submit').trigger('click');
        });

        it('email field should be invalidated', function () {
          expect(view.$el.find('.control-group.email')).toHaveClass('error');
        });

        it('feedback field should be invalidated', function () {
          expect(view.$el.find('.control-group.feedback')).toHaveClass('error');
        });

        it('website field should be valid', function () {
          expect(view.$el.find('.control-group.website')).not.toHaveClass('error');
        });

      });

      describe('only email field filled', function () {

        beforeEach(function () {
          view.$el.find('#email').val('a@a.com').trigger('change');
          view.$el.find('#feedback').val('').trigger('change');
        });

        beforeEach(function () {
          view.$el.find('#submit').trigger('click');
        });

        it('email field should be valid', function () {
          expect(view.$el.find('.control-group.email')).not.toHaveClass('error');
        });

        it('feedback field should be invalidated', function () {
          expect(view.$el.find('.control-group.feedback')).toHaveClass('error');
        });

        it('website field should be valid', function () {
          expect(view.$el.find('.control-group.website')).not.toHaveClass('error');
        });

      });

      describe('email and feedback filled', function () {

        beforeEach(function () {
          spyOn(view.model, 'save').andCallThrough();
        });

        beforeEach(function () {
          view.$el.find('#email').val('a@a.com').trigger('change');
          view.$el.find('#feedback').val('some feedback').trigger('change');
        });

        beforeEach(function () {
          view.$el.find('#submit').trigger('click');
        });

        it('should show no errors', function () {
          expect(view.$el.find('.error').length).toBe(0);
        });

        it('should save model', function () {
          expect(view.model.save).toHaveBeenCalled();
        });

      });

    });

  });

});

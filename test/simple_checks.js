describe("PubSub Tests", function() {
  var p = new PubSub();
  var no_op = function() {};
  var token_1 = p.bind('sanket', no_op);
  var token_2 = p.bind('!parab', no_op);
  var token_3 = p.bind('sanket&parab', no_op);
  var token_4 = p.bind('sanket|parab', no_op);
  var token_5 = p.bind('step=1&name=sanket', no_op);
  var token_6 = p.bind('step=2|name=parab', no_op);
  var token_7 = p.bind('step=1&name!=sanket', no_op);
  var token_8 = p.bind('step=2|name!=parab', no_op);
  it("Checking String topics", function() {
    expect(['token_1', 'token_2', 'token_4']).toEqual(p.trigger('sanket'));
    expect(['token_4']).toEqual(p.trigger('parab'));
    expect(['token_2']).toEqual(p.trigger('garbage'));
    expect(['token_2']).toEqual(p.trigger('sanket&parab'));
    expect(['token_1', 'token_3', 'token_4']).toEqual(p.trigger('sanket parab'));
  });
  it("Checking Object topics", function() {
    expect(['token_5', 'token_8']).toEqual(p.trigger({
      step: 1,
      name: "sanket"
    }));
    expect(['token_6', 'token_8']).toEqual(p.trigger({
      step: "2"
    }));
    expect(['token_7', 'token_8']).toEqual(p.trigger({
      step: 1,
      name: "garbage"
    }));
  });
});


Meteor.subscribe("items");

// counter starts at 0
Session.setDefault('counter', 0);

Template.hello.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.hello.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});

Template.add_items.events({
  'submit .new_item': function(event) {
    event.preventDefault();
    var text = event.target.item.value;
    Meteor.call("addItem", text);
    event.target.item.value = '';
  }
});

Template.item_list.helpers({
  items: function() {return Items.find({})},
});
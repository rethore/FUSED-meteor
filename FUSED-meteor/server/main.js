

Meteor.startup(function () {
    // code to run on server at startup
});

Meteor.publish("items", () => Items.find());
Meteor.publish("problems", () => Problems.find());
Meteor.publish("images", () => Images.find());

Images.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
  download: () => false,
});

Images.allow({
  insert: () => true,
  remove: () => true,
  update: () => true,
  download: () => true,
});

Problems.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
  download: () => false,
});

Problems.allow({
  insert: () => true,
  remove: () => true,
  update: () => true,
  download: () => true,
});

Meteor.methods({
  addItem: function(text){
    Items.insert({
      text: text,
      createdAt: new Date(),
    });
  },
  removeItems: function(reg){
    Items.remove({text: {$regex: reg}})
  },
  addResult: function(id, text){
    Items.update(id, {$set: {result: text}})
  },
  reserve: function(id, pid){
    var item = Items.findOne({_id:id});
    if (! item.hasOwnProperty('pid')) {
      Items.update(id, {$set: {pid: pid}});
      console.log(id, pid, item);
      return Items.findOne({_id:id})
    } else {
      console.log(id, pid, item, item.pid);
      return item
    }
  },
 });
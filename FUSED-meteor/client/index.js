
Meteor.subscribe("items");
Meteor.subscribe("inputs");
Meteor.subscribe("problems");
Meteor.subscribe("params");


Session.setDefault('problem_name', '');

Template.add_items.events({
  'submit .new_item': function(event) {
    event.preventDefault();
    var text = event.target.item.value;
    Meteor.call("addItem", text);
    event.target.item.value = '';
  }
});

Template.loaded_files.helpers({
  inputs: () => Inputs.find({}),
  problems: () => Problems.find({}),
});

Template.param_list.helpers({
  problems: () => Items.find({problem: {$exists:true}}),
  params: () => Items.findOne({'text': Session.get('problem_name')}).params,
})

Template.param_list.events({
  'click .clear': function(event) {
    Meteor.call('clearParams');
  },
  'submit .run': function(event) {
    Meteor.call('updateParams', event)
  }
});

Template.item_list.events({
  'click .clear': function(event) {
    Meteor.call('clearCommands');
  }
});


Template.loaded_files.events({
  'click .delete_input': function(event) {
    console.log('delete', this.original.name);
    Inputs.remove({_id: this._id});
  },
  'click .delete_problem': function(event) {
    console.log('delete', this.original.name);
    Problems.remove({_id: this._id});
  }
});

Template.load_problem.events({
   'change .myFileProblem': function(event) {
     FS.Utility.eachFile(event, function(file){
       var fileObj = new FS.File(file);
       Problems.insert(fileObj);
       console.log(fileObj);
       Session.set('problem_name', fileObj.original.name)
     })},
});

Template.load_input.events({
   'change .myFileInput': function(event) {
     FS.Utility.eachFile(event, function(file){
       var fileObj = new FS.File(file);
       fileObj.related_problem = Session.get('problem_name');
       Inputs.insert(fileObj);
     })},
});


Template.item_list.helpers({
  items: () => Items.find({}),
});


Template.problem_list.helpers({
  problems: () => Items.find({problem: {$exists: true}}),
  selected: function() {
    if (Session.equals('problem_name', this.text)) return 'selected'
  },
});

Template.problem_list.events({
  'click .problem': function(event, template){
      Session.set('problem_name', this.text);
  }
});

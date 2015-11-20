

Meteor.startup(function () {
    // code to run on server at startup
});

Meteor.publish("items", () => Items.find());
Meteor.publish("problems", () => Problems.find());
Meteor.publish("inputs", () => Inputs.find());
Meteor.publish("params", () => Params.find());

Inputs.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
  download: () => false,
});

Inputs.allow({
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

var fs = Npm.require('fs');

//Problems.on('uploaded', function(fileObj) {
//      console.log('entering on uploaded', fileObj._id, fileObj.name);
//      var data = YAML.safeLoad(fs.readFileSync(fileObj.url, 'utf8'));
//      console.log('show me the data', data);
//      //Items.insert({text:data, createdAt: new Date()});
//});

Problems.on('stored', Meteor.bindEnvironment(function(fileObj) {
      let url1 = fileObj.collection.primaryStore.path + '/' + fileObj.collection.primaryStore.name + '-' + fileObj._id + '-' + fileObj.original.name;
      let str = fs.readFileSync(url1, 'utf8');
      let data = YAML.safeLoad(str);
      if (Problems.findOne({_id:fileObj._id}) != null) {
        console.log('PROBLEMS--------', fileObj.original.name);
        Items.insert({text: fileObj.original.name, data: data, createdAt: new Date()});
      }
      if (Inputs.findOne({_id:fileObj._id}) != null) {
        console.log('INPUTS--------', fileObj.original.name);
        //Items.insert({text: fileObj.original.name, data: data, createdAt: new Date()});
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            paramObj = Params.findOne({key:key})
            if (paramObj != null) {
              Params.update(paramObj._id, {$set:{key:key, value:data[key]}});
            }
          }
        }
    };
}));

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
  dangling: function(dangling_params, problem) {
    dangling_params.forEach(function(el, ind, arr){
      Params.insert({key: el, problem: problem});
    });
  },
  clearParams: function() {
    Params.remove({key: {$regex: '.*'}})
  },
  clearCommands: function() {
    Items.remove({text: {$regex: '.*'}})
  },
 });
Items = new Mongo.Collection("items");

Problems = new FS.Collection("problems", {
  stores: [new FS.Store.GridFS("problems")]
});
Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});

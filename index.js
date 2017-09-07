var lib = {
  traverse: require('traverse'),
  xml: require('xml')
};

function prepareXmlObject(value,options) {
  if (typeof value != 'object') {
    var obj = {};
    obj[options.itemName||"item"] = value; 
    value = obj;
  }
  var dv = lib.traverse(value);
  return dv.map(function(v) {
    return setUpPostProcessing.bind(this)(v,options);
  });
}

function setUpPostProcessing(value,options) {
  this.after(transformXmlObject.bind(this,options));
}

function transformXmlObject(options,value) {
  var type = typeof value;

  if (type == 'object') {
    if (Array.isArray(value)) {
      var items = [{_attr:{type:'array'}}];
      items = items.concat(value.map(function(item) {
        var obj = {};
        obj[options.itemName||"item"] = item; 
        return obj;
      }));
      if (!this.parent) {
        this.update({items:items});
      }
      else {
        this.update(items);
      }
    }
    else {
      var elements = [];
      for (var key in value) {
        var element = {};
        element[key] = value[key];
        elements.push(element);
      }
      this.update(elements);
    }
  }
}

module.exports = function xml(value, options) {
  options = options || {};
  return lib.xml(prepareXmlObject(value,options), options);
};

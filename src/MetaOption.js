var MetaOption = function(name, processor) {
    if (typeof name === 'undefined') {
        throw new Error('Meta option name must be specified!');
    }
    this._name       = name;
    this._processor  = null;

    if (typeof processor !== 'undefined') {
        this.setProcessor(processor);
    }
}

MetaOption.prototype = {

    getName: function() {
        return this._name;
    },

    getProcessor: function() {
        return this._processor;
    },

    setProcessor: function(processor) {
        if (typeof processor === 'function') {
            processor = { process: processor }
        }
        if (typeof processor.process !== 'function') {
            throw new Error('Meta processor must have "process" function!');
        }
        this._processor = processor;
        return this;
    },

    process: function(object, meta) {
        this._processor.process.apply(this._processor, [object, meta, this.getName()].concat(Array.prototype.slice.call(arguments, 2)));
    }
}
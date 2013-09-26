var Option = function(name, processor) {
    if (typeof name === 'undefined') {
        throw new Error('Meta option name must be specified!');
    }
    this._name       = name;
    this._processors = [];

    if (typeof processor !== 'undefined') {
        this.setProcessor(processor);
    }
}

Option.prototype = {

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
        for (var i = 0, ii = this._processors.length; i < ii; ++i) {
            this._processors[i].process.apply(this._processors[i], [object, meta, this.getName()].concat(Array.prototype.slice.call(arguments, 2)));
        }
    }
}
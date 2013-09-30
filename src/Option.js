var Option = function(name, processor) {
    if (typeof name === 'undefined') {
        throw new Error('Meta option name must be specified!');
    }
    this._name       = name;
    this._processor  = {};

    if (typeof processor !== 'undefined') {
        this.setProcessor(processor);
    }
};

Option.DEFAULT = 'DEFAULT';

Option.prototype = {

    process: function(object, meta) {
        this._processor.process.apply(this._processor, [object, meta, this.getName()].concat(Array.prototype.slice.call(arguments, 2)));
    },

    getName: function() {
        return this._name;
    },

    getProcessor: function() {
        return this._processor;
    },

    hasProcessor: function() {
        return !!this._processor;
    },

    setProcessor: function(processor) {
        if (Object.prototype.toString.call(processor) === '[object Array]') {
            processor = new ChainProcessor(processor);
        }
        else if (typeof processor === 'string') {
            processor = Processors.get(processor);
        }
        else if (typeof processor === 'function') {
            processor = { process: processor }
        }
        else if (typeof processor.process !== 'function') {
            throw new Error('Meta processor must have "process" method!');
        }
        this._processor = processor;

        return this;
    }
};
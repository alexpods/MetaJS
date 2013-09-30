var ChainProcessor = function(processors) {
    this._processors = {};

    if (typeof processors !== 'undefined') {
        this.setProcessors(processors);
    }
};

ChainProcessor.prototype = {

    process: function() {
        for (var name in this._processors) {
            this._processors[name].process.apply(this._processors[name], Array.prototype.slice.call(arguments));
        }
    },

    getProcessor: function(name) {
        this.checkProcessor(name);
        return this._processors[name];
    },

    hasProcessor: function(name) {
        return name in this._processors;
    },

    setProcessor: function(name, processor) {
        if (typeof processor === 'undefined') {
            processor = Processors.get(name);
        }
        else if (typeof processor === 'function') {
            processor = { process: processor }
        }
        else if (typeof processor.process !== 'function') {
            throw new Error('Meta processor must have "process" function!');
        }
        this._processors[name] = processor;

        return this;
    },

    removeProcessor: function(name) {
        this.checkProcessor(name);
        var processor = this._processors[name];
        delete this._processors[name];
        return processor;
    },

    checkProcessor: function(name) {
        if (!this.hasProcessor(name)) {
            throw new Error('Chain meta processor "' + this.getName() + '" does not have processor "' + name + '"!');
        }
    },

    getProcessors: function() {
        return this._processors;
    },

    setProcessors: function(processors) {
        for (var name in processors) {
            this.setProcessor(name, processors[name]);
        }
        return this;
    }
};
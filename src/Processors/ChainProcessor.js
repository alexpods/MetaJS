var ChainProcessor = function(processors) {
    this._processors = {};

    if (typeof processors !== 'undefined') {
        this.setProcessors(processors);
    }
}

ChainProcessor.prototype = {

    process: function() {
        for (var name in this._processors) {
            this._processors[name].process.apply(this._processors[name], Array.prototype.slice.call(arguments));
        }
    },

    setProcessor: function(name, processor) {
        if (typeof processor === 'function') {
            processor = { process: processor }
        }
        if (typeof processor.process !== 'function') {
            throw new Error('Processor must have "process" method!');
        }
        this._processors[name] = processor;

        return this;
    },

    getProcessor: function(name) {
        if (!(name in this._processors)) {
            throw new Error('Processor "' + name + '" does not exists!');
        }
        return this._processors[name];
    },

    hasProcessor: function(name) {
        return name in this._processors;
    },

    setProcessors: function(processors) {
        for (var name in processors) {
            this.setProcessor(name, processors[name]);
        }
        return this;
    },

    getProcessors: function() {
        return this._processors;
    }
}
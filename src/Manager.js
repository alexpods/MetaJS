var Manager = function() {
    this._processors = {};
}

Manager.prototype = {

    getProcessor: function(name) {
        this.checkProcessor(name);
        return this._processors[name];
    },

    hasProcessor: function(name) {
        return name in this._processors;
    },

    setProcessor: function(name, baseProcessor, processor) {
        if (typeof processor === 'undefined') {
            processor     = baseProcessor;
            baseProcessor = null;
        }
        if (typeof baseProcessor === 'string') {
            baseProcessor = this.getProcessor(baseProcessor);
        }

        this._processors[name] = new Processor(baseProcessor, processor);
        return this;
    },

    removeProcessor: function(name) {
        this.checkProcessor(name);
        var processor = this._processors[name];
        delete this._processors[name];
        return processor;
    },

    getProcessors: function() {
        return this._processors;
    },

    setProcessors: function(processors) {
        for (var name in processors) {
            this.setProcessor(name, processors[name]);
        }
        return this;
    },

    checkProcessor: function(name) {
        if (!this.hasProcessor(name)) {
            throw new Error('Meta processor "' + name + '" does not exists!');
        }
    }

}
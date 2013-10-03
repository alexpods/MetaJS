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

    setProcessor: function(name, processor, params) {
        if (typeof processor === 'string') {
            processor = this.getProcessor(processor);
        }
        if (typeof processor === 'function') {
            processor = { process: processor }
        }
        if (typeof processor.process !== 'function') {
            throw new Error('Meta processor must have "process" method!');
        }
        var realProcess = processor.process;
        processor.process = function(object, meta) {
            return realProcess.apply(processor, [object, meta].concat(params || [], Array.prototype.slice.call(arguments, 2)));
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
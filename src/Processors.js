var Processors = {

    _hash: {},

    Interface: InterfaceProcessor,
    Chain:     ChainProcessor,

    get: function(name) {
        this.check(name);
        return this._hash[name];
    },

    has: function(name) {
        return name in this._hash;
    },

    set: function(name, processor) {
        if (Object.prototype.toString.call(processor) === '[object Array]') {
            processor = new ChainProcessor(processor);
        }
        else if (typeof processor === 'function') {
            processor = { process: processor }
        }
        else if (typeof processor.process !== 'function') {
            throw new Error('Meta processor must have "process" function!');
        }
        this._hash[name] = processor;
        return this;
    },

    remove: function(name) {
        this.check(name);
        var processor = this._hash[name];
        delete this._hash[name];
        return processor;
    },

    check: function(name) {
        if (!this.has(name)) {
            throw new Error('Processor container "' + this.getName() + '" does not have processor "' + name + '"!');
        }
    },

    gets: function() {
        return this._hash;
    },

    sets: function(processors) {
        for (var name in processors) {
            this.set(name, processors[name]);
        }
        return this;
    }
};
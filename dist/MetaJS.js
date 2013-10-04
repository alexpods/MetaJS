;(function(global, undefined) {


var Meta = function(manager) {
    this.manager = manager;
}

Meta.prototype = {
    processor: function(name, baseProcessor, processor) {
        if (typeof baseProcessor === 'undefined') {
            return this.manager.getProcessor(name);
        }

        this.manager.setProcessor(name, baseProcessor, processor);
    }
}
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

        if (typeof processor === 'function') {
            processor = { process: processor }
        }

        processor = new Processor(name, baseProcessor, processor);

        this._processors[processor.getName()] = processor;
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
var Processor = function(name, base, self) {
    if (typeof base === 'function') {
        base = { process: base }
    }

    if (typeof self === 'undefined') {
        self = base;
        base = null;
    }

    if (base) {
        for (var property in base) {
            this[property] = this.__copy(base[property]);
        }
    }

    for (var property in self) {
        this[property] = this.__copy(self[property]);
    }

    this._name = name;
}

Processor.prototype = {

    getName: function() {
        return this._name;
    },

    process: function() {
        throw new Error('Process method must be overwritten in subprocessors!');
    },

    __copy: function(object) {
        var copy, toString = Object.prototype.toString.apply(object);

        if (typeof object !== 'object') {
            copy = object;
        }
        else if ('[object Date]' === toString) {
            copy = new Date(object.getTime())
        }
        else if ('[object Array]' === toString) {
            copy = [];
            for (var i = 0, ii = object.length; i < ii; ++i) {
                copy[i] = this.__copy(object[i]);
            }
        }
        else if ('[object RegExp]' === toString) {
            copy = new RegExp(object.source);
        }
        else {
            copy = {}
            for (var property in object) {
                copy[property] = this.__copy(object[property]);
            }
        }

        return copy;
    }
}
;(function(global) {

    var manager = new Manager();
    var meta    = new Meta(manager);

    global.meta = meta;

})(global)
meta.processor('Meta.Chain',  {

    processors: {},

    process: function(object, _meta) {
        var processor, name;

        for (name in this.processors) {
            processor = this.processors[name];

            if (typeof processor === 'string') {
                processor = meta.processor(processor);
            }
            processor.process.apply(processor, [object, _meta].concat(Array.prototype.slice.call(arguments, 3)));
        }
    }
})
meta.processor('Meta.Interface', {

    interface: {},

    process: function(object) {
        for (var property in this.interface) {
            object[property] = this.__copy(this.interface[property]);
        }
    }
})
meta.processor('Meta.Options', {

    options: {},

    process: function(object, _meta) {
        var processor, option;

        for (option in _meta) {
            processor = (option in this.options)
                ? this.options[option]
                : (('DEFAULT' in this.options) ? this.options.DEFAULT : null);

            if (!processor) {
                continue;
            }

            if (typeof processor === 'string') {
                processor = meta.processor(processor);
            }

            processor.process.apply(processor, [object, _meta[option]].concat(Array.prototype.slice.call(arguments, 3), option));
        }
    }
})

})(this);
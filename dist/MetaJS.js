;(function(global, undefined) {


var Meta = function(manager) {
    this.manager = manager;
}

Meta.prototype = {
    processor: function(name, processor, params) {
        if (typeof processor === 'undefined') {
            return this.manager.getProcessor(processor);
        }

        this.manager.setProcessor(name, processor, params);
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
;(function(global) {

    var manager = new Manager();
    var meta    = new Meta(manager);

    global.meta = meta;

})(global)
meta.processor('Meta.Chain', function(object, meta, processors) {
    var processor, name;

    for (name in processors) {
        processor = processors[name];

        if (typeof processor === 'string') {
            processor = meta.processor(processor);
        }
        processor.process.apply(processor, [object, meta].concat(Array.prototype.slice.call(arguments, 3)));
    }
})
meta.processor('Meta.Interface', {

    process: function(object, meta, iface) {
        for (var property in iface) {
            object[property] = this.copy(iface[property]);
        }
    },

    copy: function(object) {
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
                copy[i] = this.copy(object[i]);
            }
        }
        else if ('[object RegExp]' === toString) {
            copy = new RegExp(object.source);
        }
        else {
            copy = {}
            for (var property in object) {
                copy[property] = this.copy(object[property]);
            }
        }

        return copy;
    }
})
meta.processor('Meta.Options', function(object, meta, options) {
    var processor, option;

    for (var option in meta) {
        processor = (option in options)
            ? options[option]
            : (('DEFAULT' in options) ? options.DEFAULT : null);

        if (!processor) {
            continue;
        }

        if (typeof processor === 'string') {
            processor = meta.processor(processor);
        }

        processor.process.apply(processor, [object, meta].concat(Array.prototype.slice.call(arguments, 3), option));
    }
})

})(this);
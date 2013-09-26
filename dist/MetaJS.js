;(function(global, undefined) {


var Meta = function(options) {
    this._options = {};

    if (typeof options !== 'undefined') {
        this.setOptions(options);
    }
}

Meta.prototype = {

    process: function(object, meta) {
        var metaOption, option;

        for (option in meta) {

            metaOption = this.hasOption(option)
                ? (this.getOption(option))
                : (this.hasOption('__DEFAULT__') ? this.getOption('__DEFAULT__') : null)

            if (metaOption) {
                metaOption.process.apply(metaOption, [object, meta[option]].concat(Array.prototype.slice.call(arguments,2)) );
            }
        }
    },

    getOption: function(name) {
        if (!(name in this._options)) {
            throw new Error('Meta option "' + name + '" does not exists!');
        }
        return this._options[name];
    },

    hasOption: function(name) {
        return name in this._options;
    },

    setOption: function(option) {
        if (!(option instanceof Option)) {
            throw new Error('Meta option must be instance of "Option" class!');
        }
        this._options[option.getName()] = option;
        return this;
    },

    getOptions: function() {
        return this._options;
    },

    setOptions: function(options) {

        if (Object.prototype.toString.apply(options) === '[object Array]') {
            for (var i = 0, ii = options.length; i < ii; ++i) {
                this.setOption(options[i]);
            }
        }
        else {
            for (var name in options) {
                this.setOptions(new Option(name, options[name]));
            }
        }

        return this;
    }
}
var ChainProcessor = function(processors) {
    this._processors = {};

    if (typeof processors === 'undefined') {
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
var InterfaceProcessor = function(iface) {
    if (typeof iface !== 'object') {
        throw new Error('Interface must be an object!');
    }
    this._interface = iface;
}

InterfaceProcessor.prototype = {

    process: function(object) {
        for (var property in this._interface) {
            object[property] = this.copy(this._interface[property]);
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

}

    Meta.Option = Option;

    Meta.Processor = {
        Interface: InterfaceProcessor,
        Chain:     ChainProcessor
    };

    global.Meta = Meta;

})(this);
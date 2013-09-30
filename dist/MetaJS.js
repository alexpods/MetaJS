;(function(global, undefined) {


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
        if (Object.prototype.toString.call(processors) === '[object Array]') {
            for (var i = 0, ii = processors.length; i < ii; ++i) {
                this.setProcessor(processors[i]);
            }
        }
        else {
            for (var name in processors) {
                this.setProcessor(name, processors[name]);
            }
        }
        return this;
    }
};
var InterfaceProcessor = function(iface) {
    if (typeof iface !== 'object') {
        throw new Error('Interface must be an object!');
    }
    this._interface = iface;
};

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
};
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
var Handler = function(props) {

    this._objectHandler  = null;
    this._options        = {};

    if ('options' in props) {
        this.setOptions(props.options);
    }
    if ('objectHandler' in props) {
        this.setObjectHandler(props.objectHandler);
    }
}

Handler.prototype = {

    process: function(object, meta) {
        var metaOption, option;

        if (this._objectHandler) {
            object = this._objectHandler(object);
        }

        for (option in meta) {

            metaOption = this.hasOption(option)
                ? (this.getOption(option))
                : (this.hasOption(Option.DEFAULT) ? this.getOption(Option.DEFAULT) : null)

            if (metaOption) {
                metaOption.process.apply(metaOption, [object, meta[option]].concat(Array.prototype.slice.call(arguments,2)) );
            }
        }
    },

    setObjectHandler: function(handler) {
        if (typeof handler !== 'function') {
            throw new Error('Object handler must be a function');
        }
        this._objectHandler = handler;
        return this;
    },

    getOption: function(name) {
        this.checkOption(name);

        return this._options[name];
    },

    hasOption: function(name) {
        return name in this._options;
    },

    setOption: function(option) {
        if (!(option instanceof MetaOption)) {
            throw new Error('Meta option must be instance of "Option" class!');
        }
        this._options[option.getName()] = option;
        return this;
    },

    removeOption: function(name) {
        this.checkOption(name);

        var option = this._options[name];
        delete this._options[name];

        return option;
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
                this.setOption(new Option(name, options[name]));
            }
        }
        return this;
    },

    checkOption: function(name) {
        if (!this.hasOption(name)) {
            throw new Error('Meta option "' + name + '" does not exists!');
        }
    }
}
var Type = function(name, metaHandlers) {
    if (typeof name === 'undefined') {
        throw new Error('Meta type must have a name!');
    }
    this._name  = name;
    this._metaHandlers = {};

    if (typeof metaHandler !== 'undefined') {
        this.setMetaHandlers(metaHandlers);
    }
};

Type.prototype = {

    META_HANDLER_NAME: 'MetaHandler{uid}',

    _uid: 0,

    process: function() {
        var name, handler;

        for (name in this._metaHandlers) {
            handler = this._metaHandlers[name];
            handler.process.apply(handler, Array.prototype.slice.call(arguments));
        }
    },

    getName: function() {
        return this._name;
    },

    getMetaHandler: function(name) {
        this.checkMetaHandler(name);
        return this._metaHandlers[name];
    },

    hasMetaHandler: function(name) {
        return name in this._metaHandlers;
    },

    setMetaHandler: function(name, metaHandler) {
        if (!(metaHandler instanceof Handler)) {
            metaHandler = new Handler(metaHandler);
        }

        if (!name) {
            name = this.generateName();
        }
        this._metaHandlers[name] = metaHandler;
        return this;
    },

    setMetaHandlers: function(metas) {
        if (Object.prototype.toString.call(metas)) {
            for (var i = 0, ii = metas.length; i < ii; ++i) {
                this.setMetaHandler(metas[i]);
            }
        }
        else {
            for (var name in metas) {
                this.setMetaHandler(name, metas[name]);
            }
        }
        return this;
    },

    getMetaHandlers: function() {
        return this._metaHandlers;
    },

    checkMetaHandler: function(name) {
        if (!this.hasMetaHandler(name)) {
            throw new Error('Meta handler "' + name + '" does not exists for meta type "' + this.getName() + '"!');
        }
    },

    generateName: function() {
        return this.META_HANDLER_NAME.replace('{uid}', ++this._uid);
    }
};
var Manager = {

    _types: {},

    getType: function(name) {
        this.checkType(name);
        return this._types[name];
    },

    hasType: function(name) {
        return name in this._types;
    },

    setType: function(name, metas) {
        var type = name instanceof Type
            ? name
            : new Type(name, metas);

        this._types[type.getName()] = type;
        return this;
    },

    removeType: function(name) {
        this.checkType(name);
        var type = this._types[name];
        delete this._types[name];
        return type;
    },

    getTypes: function() {
        return this._types;
    },

    setTypes: function(types) {
        if (Object.prototype.toString.call(types) === '[object Array]') {
            for (var i = 0, ii = types.length; i < ii; ++i) {
                this.setTypes(types[i]);
            }
        }
        else {
            for (var name in types) {
                this.setType(name, types[name]);
            }
        }
        return this;
    },

    checkType: function(name) {
        if (!this.hasType(name)) {
            throw new Error('Meta type "' + name + '" does not exists!');
        }
    }

};
global.Meta = {
    Manager:    Manager,
    Handler:    Handler,
    Type:       Type,
    Option:     Option,
    Processors: Processors
};

})(this);
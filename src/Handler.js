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
        if (!(option instanceof Option)) {
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
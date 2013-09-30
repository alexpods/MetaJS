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
var Manager = {

    _types: {},

    getType: function(name) {
        this.checkType(name);
        return this._types[name];
    },

    hasType: function(name) {
        return name in this._types;
    },

    setType: function(name, metaHandlers) {
        var type = name instanceof Type
            ? name
            : new Type(name, metaHandlers);

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
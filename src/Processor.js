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
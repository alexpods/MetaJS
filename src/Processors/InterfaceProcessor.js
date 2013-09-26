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
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
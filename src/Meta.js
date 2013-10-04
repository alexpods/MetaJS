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
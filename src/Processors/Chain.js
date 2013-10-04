meta.processor('Meta.Chain',  {

    processors: {},

    process: function(object, _meta) {
        var processor, name;

        for (name in this.processors) {
            processor = this.processors[name];

            if (typeof processor === 'string') {
                processor = meta.processor(processor);
            }
            processor.process.apply(processor, [object, _meta].concat(Array.prototype.slice.call(arguments, 3)));
        }
    }
})
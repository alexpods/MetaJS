meta.processor('Meta.Options', {

    options: {},

    process: function(object, _meta) {
        var processor, option;

        for (option in _meta) {
            processor = (option in this.options)
                ? this.options[option]
                : (('DEFAULT' in this.options) ? this.options.DEFAULT : null);

            if (!processor) {
                continue;
            }

            if (typeof processor === 'string') {
                processor = meta.processor(processor);
            }

            processor.process.apply(processor, [object, _meta[option]].concat(Array.prototype.slice.call(arguments, 3), option));
        }
    }
})
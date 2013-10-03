meta.processor('Meta.Options', function(object, _meta, options) {
    var processor, option;

    for (var option in _meta) {
        processor = (option in options)
            ? options[option]
            : (('DEFAULT' in options) ? options.DEFAULT : null);

        if (!processor) {
            continue;
        }

        if (typeof processor === 'string') {
            processor = meta.processor(processor);
        }

        processor.process.apply(processor, [object, _meta[option]].concat(Array.prototype.slice.call(arguments, 3), option));
    }
})
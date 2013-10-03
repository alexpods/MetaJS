meta.processor('Meta.Chain', function(object, meta, processors) {
    var processor, name;

    for (name in processors) {
        processor = processors[name];

        if (typeof processor === 'string') {
            processor = meta.processor(processor);
        }
        processor.process.apply(processor, [object, meta].concat(Array.prototype.slice.call(arguments, 3)));
    }
})
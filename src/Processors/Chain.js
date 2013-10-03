meta.processor('Meta.Chain', function(object, _meta, processors) {
    var processor, name;

    for (name in processors) {
        processor = processors[name];

        if (typeof processor === 'string') {
            processor = meta.processor(processor);
        }
        processor.process.apply(processor, [object, _meta].concat(Array.prototype.slice.call(arguments, 3)));
    }
})
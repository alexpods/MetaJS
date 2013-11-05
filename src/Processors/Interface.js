meta.processor('Meta.Interface', {

    interface: {},

    process: function(object) {
        for (var property in this.interface) {
            object[property] = this.__copy(this.interface[property]);
        }
    }
});
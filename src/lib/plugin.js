/**
 * Generate a jQuery plugin
 * @param pluginName [string] Plugin name
 * @param className [object] Class of the plugin
 * @param shortHand [bool] Generate a shorthand as $.pluginName
 *
 * @example
 * import plugin from 'plugin';
 *
 * class MyPlugin {
 *     constructor(element, options) {
 *         // ...
 *     }
 * }
 *
 * MyPlugin.DEFAULTS = {};
 *
 * plugin('myPlugin', MyPlugin');
 */
export default function plugin(pluginName, className, shortHand = false) {
    let dataName = `__${pluginName}`;
    let old = $.fn[pluginName];

    $.fn[pluginName] = function (option) {
        let originalArgument = arguments
        return this.each(function () {
            let $this = $(this);
            let data = typeof className['retrieveInstance'] == 'function' 
                ? className['retrieveInstance'](this, dataName) 
                : $this.data(dataName);

            if (!data) {
                let options = $.extend({}, className.DEFAULTS, $this.data(), typeof option === 'object' && option);
                $this.data(dataName, (data = new className(this, options)));
            }

            if (typeof option === 'string') {
                return data[option].apply(data, Array.prototype.slice.call(originalArgument, 1));
            }
        });
    };

    // - Short hand
    if (shortHand) {
        $[pluginName] = (options) => $({})[pluginName](options);
    }

    // - No conflict
    $.fn[pluginName].noConflict = () => $.fn[pluginName] = old;
}
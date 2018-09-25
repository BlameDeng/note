export default {
    install(Vue, options) {
        Vue.prototype.formatDate = function(val) {
            let obj;
            if (typeof val === 'object') { obj = val; } else { obj = new Date(val); }
            let year = obj.getFullYear();
            let month = obj.getMonth() + 1;
            let date = obj.getDate();
            return `${year}-${month}-${date}`;
        }
    }
}
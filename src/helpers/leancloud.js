import AV from 'leancloud-storage'
const APP_ID = 'o3L4L5R2LXsA7b2UNr3v0B8f-gzGzoHsz';
const APP_KEY = 'ikmYV11Wo5xmhCDEzMgHiNKK';
AV.init({ appId: APP_ID, appKey: APP_KEY });

const Notebooks = AV.Object.extend('Notebooks');
Notebooks.saveAll = function(obj) {
    if (typeof obj !== 'object') {
        return Promise.reject('saveAll方法必须传一个非空对象作为参数！');
    }
    let entries = Object.entries(obj);
    if (entries.length === 0) {
        return Promise.reject('saveAll方法必须传一个非空对象作为参数！');
    }
    const leancloud = new Notebooks();
    entries.forEach(array => {
        leancloud.set(array[0], array[1]);
    });
    return leancloud.save();
}
export default Notebooks
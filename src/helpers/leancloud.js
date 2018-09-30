import AV from 'leancloud-storage'
const APP_ID = 'o3L4L5R2LXsA7b2UNr3v0B8f-gzGzoHsz';
const APP_KEY = 'ikmYV11Wo5xmhCDEzMgHiNKK';
AV.init({ appId: APP_ID, appKey: APP_KEY });

const Notebooks = AV.Object.extend('Notebooks');

//新建一个对象
Notebooks.createUser = function(obj) {
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
};
//根据条件查找对象
Notebooks.queryUser = function(obj) {
    if (typeof obj !== 'object') {
        return Promise.reject('queryUser方法必须传一个非空对象作为参数！');
    }
    let entries = Object.entries(obj);
    if (entries.length === 0) {
        return Promise.reject('queryUser方法必须传一个非空对象作为参数！');
    }
    let query = new AV.Query('Notebooks');
    let array = entries[0];
    query.equalTo(array[0], array[1]);
    return query.find();
};
//更新对象
Notebooks.updateUser = function(obj, objectId) {
    if (typeof obj !== 'object') {
        return Promise.reject('updateUser方法必须传一个非空对象作为参数！');
    }
    let entries = Object.entries(obj);
    if (entries.length === 0) {
        return Promise.reject('提交参数为空，未做更改');
    }
    if (!objectId) {
        return Promise.reject('必须提供objectId');
    }
    let leancloud = AV.Object.createWithoutData('Notebooks', objectId);
    // 修改属性
    entries.forEach(array => {
        leancloud.set(array[0], array[1]);
    });
    // 保存到云端
    return leancloud.save();
}




export default Notebooks
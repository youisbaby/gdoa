module.exports = class extends think.Model {
    /**
     * 获取列表
     * @param {Number} adminId 
     * @returns 
     */
    async list(adminId) {
        //先从角色映射表里取出管理员对应的角色
        let authIds = await think.model('admin_map').where({
            admin_id: adminId
        }).getField('auth_id');
        //再从角色表里取出对应的菜单权限id
        let rulesIds = await this.model('admin_auth')
            .where({ id: ['IN', authIds] })
            .getField('rules');
        let rulesId = rulesIds.join(',')
        let data = [];
        if (rulesId == -1) {
            data = await this.model('menu')
                .order('order_num asc')
                .select();
        } else {
            //console.log(rulesId)
            data = await think.model('menu')
                .where({ id: ['IN', rulesId] })
                .order('order_num asc')
                .select();
            //console.log(data)
        }
        //console.log('-----------')
        
        //获取路由权限
        let perms = [];
        data.forEach(el => {
            if(el.is_sys === 0) {
                el.href = '/res/admin/' + el.href;
            }
            else if(el.is_sys === 1) {
                el.href = '/res/group/' + el.href;
            }
            else if(el.is_sys === 2) {
                el.href = '/res/member/' + el.href;
            }
            
            el.route && perms.push(el.route);
        });
        //console.log(perms)
        //根据 id取出某一个分类的子集
        const findById = (id) => {
            let child = [];
            data.forEach((value) => {
                //前台是否显示
                if (value.pid == id && value.ifshow < 1) {
                    
                    child.push(value);
                }
            });
            return child;
        };
        // 递归查询到数据并将数据存储到数组 
        const deeploop = function (id) {
            let dataArr = findById(id);
            if (dataArr.length <= 0) {
                return null;
            } else {
                dataArr.forEach((value) => {
                    if (deeploop(value.id) != null) {
                        value["children"] = deeploop(value.id);
                    }
                });
            }
            return dataArr;
        };
        let menus = deeploop(0);
        let desktops = [];
        data.forEach(el => {
            el.desktop > 0 && desktops.push(el);
        });
        return { perms, menus, desktops };
    }
    /**
     * 设置缓存
     * @param {Number} adminId 
     */
    async cacheData(adminId) {
        //设置路由缓存
        let routeData = await this.list(adminId);
        //console.log(routeData)
        await think.cache('perms_' + adminId, routeData.perms);
        //设置菜单缓存
        await think.cache('menus_' + adminId, routeData.menus);
        await think.cache('desktops_' + adminId, routeData.desktops);
        return routeData;
    }
    /**
     * 前台渲染递归
     * @param {array} tid 
     * @returns 
     */
    async tree() {
        let data = await this.model('menu').select()
        //根据 id取出某一个分类的子集
        //console.log(tid)
        const findById = (id) => {
            let child = [];
            data.forEach((value) => {
                if (value.pid == id) {
                    value.name = value.title;
                    value.field = 'id';
                    
                    value.spread = false;

                    child.push(value);
                }
            });
            return child;
        };
        // 递归查询到数据并将数据存储到数组 
        const deeploop = function (id) {
            let dataArr = findById(id);
            if (dataArr.length <= 0) {
                return null;
            } else {
                dataArr.forEach((value) => {
                    if (deeploop(value.id) != null) {
                        value["child"] = deeploop(value.id);
                        value["children"] = value['child'];
                    }
                });
            }
            return dataArr;
        };
        return deeploop(0)
    }
    
}
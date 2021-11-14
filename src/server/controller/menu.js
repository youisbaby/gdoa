const Base = require('./base.js');
/**
 * @class
 * @apiDefine menu 菜单管理
 */
module.exports = class extends Base {
    /**
    * @api {get} menu/list  获取管理界面菜单
    * @apiGroup menu
    *
    * @apiHeader {string} rttoken 必填
    *
    * @apiSuccess {number}  code   结果码
    * @apiSuccess {string} data   数据
    * @apiSuccess {string} message  提示
    *
    * @apiSuccessExample Success-Response:
    * {
    * "code": 200,
    * "message": "ok",
    * "data":{[
    * ]}
    * }
    */

    async listAction() {
        let menus = await this.cache('menus_' + this.adminId);
        //console.log(menus);
        return this.ok(menus)
    }
    /**
     * 
     * @api {get} menu/oplist 获取管理菜单列表
     * @apiName 管理菜单列表
     * @apiGroup menu
     * 
     * @apiHeader {string} rttoken 必填
    *
    * @apiSuccess {number}  code   结果码
    * @apiSuccess {string} data   数据
    * @apiSuccess {string} message  提示
     */
    async oplistAction() {
        let list = await this.model('menu').select()
        await this.adminViewLog('菜单列表');
        return this.ok({ list, count: list.length })
    }

    /**
     * 
     * @api {get} menu/one 获取单个菜单数据
     * @apiGroup menu
     * 
     * @apiHeader {string} rttoken 必填
     * 
     * @apiParam  {Number} id 菜单id 可为0 为0时添加数据前拉取
     * @apiSuccess (200) {type} name description
     * 
     */
    async oneAction() {
        let id = this.get('id') * 1;
        if (isNaN(id)) return this.err('id error');
        let data;
        if (id > 0) {
            data = await this.model('menu').where({ id }).find();
        } else {
            data = {};
        }

        let list = await this.tree([id]);
        let pname = '顶层目录';
        data.list = [
            {
                id: 0,
                name: pname,
                children: list,
                open: true
            }
        ]
        if (data.pid) {
            data.pname = await this.model('menu').where({ id: data.pid }).getField('title');
        } else {
            data.pname = pname;
        }
        if (id > 0) {
            await this.adminViewLog('编辑菜单');
        } else {
            await this.adminViewLog('添加菜单');
        }

        return this.ok(data)
    }
    /**
     *
     * @api {post} menu/edit 编辑菜单
     * @apiGroup menu
     *
     * @apiHeader {string} rttoken 必填
     *
     * @apiParam  {Number} id 菜单id
     * @apiParam  {Number} pid 菜单上级id
     * @apiParam  {String} title 菜单名称
     * @apiParam  {String} href 前端模版
     * @apiParam  {String} route 后端路由
     * @apiParam  {String} icon 菜单icon
     * @apiParam  {Number} type 类型 0 1 2 3
     * @apiParam  {Number} order_num 排序
     * @apiSuccess (200) {type} name description
     *
     */
    async editAction() {
        let post = this.post(),
            id = post.id * 1;
        if (isNaN(id) || id < 1) return this.err('id error')
        let has = await this.model('menu').where({ id }).find();
        if (think.isEmpty(has)) return this.err("编辑的菜单不存在");
        let save = {
            title: post.title,
            href: post.href,
            route: post.route,
            icon: post.icon,
            type: post.type,
            order_num: post.order_num,
            pid: post.pid
        }
        let rt = await this.model('menu').where({ id }).update(save)
        await this.model('menu').cacheData(this.adminId);
        await this.adminOpLog('编辑菜单');
        return this.ok(rt)
    }
    /**
     *
     * @api {post} menu/edit 添加菜单
     * @apiGroup menu
     *
     * @apiHeader {string} rttoken 必填
     *
     * @apiParam  {Number} pid 菜单上级id
     * @apiParam  {String} title 菜单名称
     * @apiParam  {String} href 前端模版
     * @apiParam  {String} route 后端路由
     * @apiParam  {String} icon 菜单icon
     * @apiParam  {Number} type 类型 0 1 2 3
     * @apiParam  {Number} order_num 排序
     * 
     * @apiSuccess (200) {type} name description
     *
     */
    async addAction() {
        let post = this.post();
        if (!post.title) return this.err('title error')
        let save = {
            title: post.title,
            href: post.href,
            route: post.route,
            icon: post.icon,
            type: post.type,
            order_num: post.order_num,
            pid: post.pid
        }
        let rt = await this.model('menu').add(save)
        await this.model('menu').cacheData(this.adminId);
        await this.adminOpLog('添加菜单');
        return this.ok(rt)
    }
    /**
     *
     * @api {post} menu/ifshow 菜单是否显示
     * @apiGroup menu
     *
     * @apiHeader {string} rttoken 必填
     *
     * @apiParam  {Number} id 菜单id
     * @apiParam  {Number} ifshow 显示状态0或1
     * @apiSuccess (200)  name description
     *
     */
    async ifshowAction() {
        let post = this.post(),
            id = post.id * 1;
        if (isNaN(id) || id < 1) return this.err('id error')
        let has = await this.model('menu').where({ id }).find()
        if (think.isEmpty(has)) return this.err("数据不存在")
        let rt = await this.model('menu')
            .where({ id })
            .update({
                ifshow: post.ifshow
            })
        await this.adminOpLog('设置菜单显示');
        return this.ok(rt)

    }
    /**
     *
     * @api {post} menu/del 删除菜单
     * @apiGroup menu
     *
     * @apiHeader {string} rttoken 必填
     *
     * @apiParam  {Number} id 菜单id
     * 
     * @apiSuccess (200) name description
     *
     */
    async delAction() {
        let post = this.post(),
            id = post.id * 1;
        if (isNaN(id) || id < 1) return this.err('id error')

        let has = await this.model('menu').where({ id }).find()
        if (think.isEmpty(has)) return this.err("数据不存在")

        let sun = await this.model('menu').where({ pid: id }).find()
        if (!think.isEmpty(sun)) return this.err("请先删除菜单下的子目录")

        let rt = await this.model('menu').where({ id }).delete();
        await this.adminOpLog('删除菜单');
        return this.ok(rt)
    }

};

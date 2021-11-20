module.exports = class extends think.Logic {
    listAction() {
        this.allowMethods = 'get';
    }
    updateAction() {
        this.allowMethods = 'post';
    }
    backupAction() {
        this.allowMethods = 'post';
    }
    backupFileAction() {
        this.allowMethods = 'get';
    }
    rebackAction() {
        this.allowMethods = 'post';
        this.rules = {
            file: {
                required : true,
                aliasName: '文件名'
            }
        }
    }
    delbackAction() {
        this.allowMethods = 'post';
        this.rules = {
            file: {
                required : true,
                aliasName: '文件名'
            }
        }
    }
    docAction() {
        this.allowMethods = 'get';
    }
    editTableAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required : true,
                aliasName: '表名'
            },
            field : {
                required : true,
                aliasName:'字段名'
            },
            value : {
                required : true,
                aliasName:'修改的内容'
            },
            old : {
                aliasName:'旧值'
            }
        }
    }
    delTableAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required : true,
                aliasName: '表名'
            }
        }
    }
    optimizeAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required : true,
                aliasName: '表名'
            }
        }
    }
    repairAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required : true,
                aliasName: '表名'
            }
        }
    }
    clearAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required : true,
                aliasName: '表名'
            }
        }
    }
    fieldListAction() {
        this.allowMethods = 'get';
        this.rules = {
            table: {
                required: true,
                aliasName: '表名'
            }
        }
    }
    fieldsAction() {
        this.allowMethods = 'get';
        this.rules = {
            table: {
                required: true,
                aliasName: '表名'
            }
        }
    }
    editDataAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required: true,
                aliasName: '表名'
            },
            field: {
                required: true,
                aliasName: '字段名'
            },

            value: {
                required: true,
                aliasName: '修改的内容'
            },
            old: {
                aliasName: '旧值'
            }
        }
    }
    delDataAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required: true,
                aliasName: '表名'
            },
            data: {
                aliasName: '字段名'
            }
        }
    }
    delFieldAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required: true,
                aliasName: '表名'
            },
            field: {
                required: true,
                aliasName: '字段名'
            }
        }
    }
    sortFieldAction() {
        this.allowMethods = 'post';
        this.rules = {
            table: {
                required: true,
                aliasName: '表名'
            },
            field: {
                required: true,
                aliasName: '字段名'
            },
            t: {
                required: true,
                aliasName: '排序方式'
            },
            sortField: {
                required: true,
                aliasName: '位置字段名'
            }
        }
    }
}
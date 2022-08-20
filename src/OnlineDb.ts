
class ServerInfo {
    host = '/api'
    options = {
        async responseHander(res: any) {
            if (res.status == 404) {
                return Promise.reject('接口不存在');
            } else if (res.status == 200) {
                const data = await res.json();
                if (data.status == 200) {
                    return data.content;
                } else {
                    return Promise.reject(data);
                }
            }
        }
    }
    constructor(options: {}) {
        this.options = Object.assign(this.options, options);
    }
    async request (type: string, requestPath: string, data: any) {
        if (type == 'post') {
            return fetch(this.host + '/xifun_sdk/' + requestPath, {
                method: type,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(async (res) => {
                return this.options.responseHander(res);
            })
        } else {
            var params: any[] = [];
            for(var i in data) {
                params.push(`${i}=${data[i]}`);
            }
            return fetch(this.host + '/xifun_sdk/' + requestPath + '?' + params.join('&'), {
                method: type,
            }).then((res) => {
                return this.options.responseHander(res);
            })
        }
    }
    async post(requestPath: string, data: {}) {
        return await this.request('post', requestPath, data);
    }
    async get(requestPath: string, params: {}) {
        return await this.request('get', requestPath, params);
    }
}
export default class OnlineDb extends ServerInfo {
    projectType
    constructor(projectType: string, options: {}) {
        super(options);
        this.projectType = projectType;
    }
    async getProjectList() {
        return await this.get('getProjectList', {
            projectType: this.projectType,
        });
    }
    async createProject(projectName: string, projectType: string, description: {}) {
        return await this.post('createProject', {
            projectName,
            projectType: projectType,
            description
        });
    }
    getProject(projectId: string) {
        return new OnlineSiteProject(projectId); 
    }
}
class OnlineSiteProject extends ServerInfo {
    projectId
    constructor(projectId: string) {
        super({});
        this.projectId = projectId;
    }
    async getItemList() {
        const result = await this.get('getItemList', {
            projectId: this.projectId,
        });
        return result;
    }
    async getItem(id: string) {
        const result = await this.get('getItem', {
            projectId: this.projectId, id
        });
        return result;
    }
    
    async setItem(id: string, data: {}) {
       // 带着userId, projectId, fileId, fileData, 去请求
        return await this.post('setItem', {
            projectId: this.projectId, id, data
        });
    }
    async delItem(id: string) {
        // 带着userId, projectId, fileId, fileData, 去请求
         return await this.get('delItem', {
             projectId: this.projectId, id
         });
     }
}
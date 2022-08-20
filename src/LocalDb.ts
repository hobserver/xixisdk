class LocalStorageHander {
    prefix = 'lirongping';
    getData(id: string, defaultData = {}) {
        const data = localStorage.getItem(this.prefix + '_' + id);
        if (data) {
            return JSON.parse(data);
        } else {
            return defaultData;
        }
    }
    setData(id: string, data: {}) {
        localStorage.setItem(this.prefix + '_' + id, JSON.stringify(data));
    }
}
export default class LocalDb extends LocalStorageHander {
    projectType: string
    constructor(projectType: string) {
        super();
        this.projectType = projectType;
    }
    async getProjectList(projectType: string) {
        const list = this.getData('projectList', []);
        if (projectType) {
            return list.filter((item: any) => {
                return item.type == projectType;
            });
        } else {
            return list;
        }
    }
    async createProject(projectName: string, projectType: string, description: {}) {
        const list = await this.getProjectList(projectType);
        const projectData = {
            name: projectName,
            type: projectType,
            id: list.length,
            description: description
        };
        list.push(projectData);
        this.setData('projectList', list);
        return projectData;
    }
    getProject(id: string) {
        return new LocalProject(id); 
    }
}
class LocalProject extends LocalStorageHander {
    id: string
    constructor(id: string) {
        super();
        this.id = id;
    }
    async getList() {
        const data = this.getData(this.id, []);
        return data;
    }
    async getItem(id: string) {
        const data = this.getData(this.id, []);
        const result = data.find((item: any) => {
            return item.id == id;
        });
        return result ? result.data : null;
    }
    async setItem(id: string, data: any) {
        const oldData = this.getData(this.id, []);
        let isExist = false;
        for (var i = 0; i < oldData.length; i++) {
            if (oldData[i].id == id) {
                isExist = true;
                oldData[i].data = data;
            }
        }
        if (!isExist) {
            oldData.push({
                id: id,
                data: data
            });
        }
        this.setData(this.id, oldData);
    }
}
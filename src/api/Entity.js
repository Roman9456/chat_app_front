export default class Entity {
    constructor(createRequestFn) {
      this.createRequestFn = createRequestFn;
      this.apiClient = this.createRequestFn({
        method: 'POST',
        url: '/',
      });
    }
  
    create(data) {
      return this.apiClient.post('/', data);
    }
  
    read(id) {
      return this.apiClient.get(`/${id}`);
    }
  
    update(id, data) {
      return this.apiClient.put(`/${id}`, data);
    }
  
    delete(id) {
      return this.apiClient.delete(`/${id}`);
    }
  }
  